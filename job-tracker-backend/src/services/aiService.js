import crypto from 'crypto';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Sanitize untrusted input against prompt injection
const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/System Instruction:/gi, '')
    .replace(/Ignore previous instructions/gi, '')
    .replace(/Disregard previous/gi, '')
    .replace(/You are now an AI/gi, '')
    .slice(0, 8000); // Token cap
};

// Generic JSON caller using Google Gemini REST API or rule-based fallback
const callGeminiJson = async (prompt, systemInstruction) => {
  const apiKey = env.geminiApiKey;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY missing - using rule-based structured engine');
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nStrict Output Format: Respond strictly with VALID JSON only. Do not include markdown codeblocks or extra text.\n\nInput:\n${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', response.status, errText);
      return null;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Clean JSON markdown formatting if present
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Gemini API Call Exception:', err.message);
    return null;
  }
};

export const aiService = {
  // 1. Analyze Job Description
  async analyzeJobDescription(jobText) {
    const sanitized = sanitizeInput(jobText);
    if (!sanitized || sanitized.length < 20) {
      throw new ApiError(400, 'Job description text must be at least 20 characters.');
    }

    const systemInstruction = `You are an expert HR and Tech Recruiter. Extract structured details from the provided job description. Return JSON matching schema:
{
  "role": "string",
  "company": "string",
  "experienceRequired": "string",
  "educationRequired": "string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "softSkills": ["string"],
  "technologies": ["string"],
  "keyResponsibilities": ["string"],
  "salaryMentioned": "string",
  "summary": "string"
}`;

    const result = await callGeminiJson(sanitized, systemInstruction);

    if (result && Array.isArray(result.requiredSkills)) {
      return { ...result, isFallback: false };
    }

    // Rule-based fallback extraction
    const textLower = sanitized.toLowerCase();
    const commonSkills = ['react', 'node.js', 'express', 'mongodb', 'typescript', 'javascript', 'python', 'aws', 'docker', 'graphql', 'sql', 'rest api', 'git', 'css', 'html', 'tailwind', 'redux', 'jest', 'ci/cd'];
    const foundSkills = commonSkills.filter((s) => textLower.includes(s));

    return {
      role: 'Job Role',
      company: 'Target Company',
      experienceRequired: textLower.includes('year') ? '1-3+ years' : 'Not specified',
      educationRequired: textLower.includes('bachelor') ? 'Bachelor degree' : 'Not specified',
      requiredSkills: foundSkills.slice(0, 5).map(s => s.toUpperCase()),
      preferredSkills: foundSkills.slice(5).map(s => s.toUpperCase()),
      softSkills: ['Communication', 'Problem Solving', 'Teamwork'],
      technologies: foundSkills.map(s => s.toUpperCase()),
      keyResponsibilities: ['Develop high-quality features', 'Collaborate with cross-functional teams'],
      salaryMentioned: 'Not specified',
      summary: sanitized.slice(0, 200) + '...',
      isFallback: true
    };
  },

  // 2. Evaluate Job Match & Skill Gaps
  async evaluateJobMatch(jobDescription, userSkills = [], userResumeText = '') {
    const sanitizedJob = sanitizeInput(jobDescription);
    const sanitizedResume = sanitizeInput(userResumeText);

    const systemInstruction = `You are a career counselor and ATS scanner. Compare the target Job Description with the Candidate's profile & resume.
Return strictly JSON matching schema:
{
  "overallMatch": number (0-100),
  "technicalScore": number (0-100),
  "experienceScore": number (0-100),
  "educationScore": number (0-100),
  "matchedSkills": ["string"],
  "missingRequiredSkills": ["string"],
  "missingPreferredSkills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendation": "string"
}`;

    const prompt = `Candidate Skills: ${JSON.stringify(userSkills)}\nCandidate Resume Summary: ${sanitizedResume}\n\nJob Description:\n${sanitizedJob}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && typeof result.overallMatch === 'number') {
      return { ...result, isFallback: false };
    }

    // Deterministic Rule-Based Fallback Matching Engine
    const jobLower = sanitizedJob.toLowerCase();
    const candidateSkillsLower = userSkills.map((s) => s.toLowerCase());

    const extractedJobSkills = ['react', 'node.js', 'express', 'mongodb', 'typescript', 'javascript', 'python', 'aws', 'docker', 'graphql', 'sql', 'rest api', 'git', 'css', 'tailwind', 'redux', 'jest']
      .filter((s) => jobLower.includes(s));

    const matched = extractedJobSkills.filter((s) => candidateSkillsLower.includes(s));
    const missing = extractedJobSkills.filter((s) => !candidateSkillsLower.includes(s));

    const totalExtracted = extractedJobSkills.length || 1;
    const matchPct = Math.round((matched.length / totalExtracted) * 100) || 75;

    return {
      overallMatch: Math.min(Math.max(matchPct, 40), 95),
      technicalScore: Math.min(matchPct + 5, 95),
      experienceScore: 80,
      educationScore: 90,
      matchedSkills: matched.map((s) => s.toUpperCase()),
      missingRequiredSkills: missing.slice(0, 3).map((s) => s.toUpperCase()),
      missingPreferredSkills: missing.slice(3).map((s) => s.toUpperCase()),
      strengths: matched.length > 0 ? [`Strong alignment in ${matched.join(', ')}`] : ['Solid core foundational skills'],
      weaknesses: missing.length > 0 ? [`Gaps identified in ${missing.join(', ')}`] : ['Further domain depth recommended'],
      recommendation: `Highlight your work in ${matched.join(', ') || 'software development'} and address ${missing.join(', ') || 'advanced tools'} in your interview prep.`,
      isFallback: true
    };
  },

  // 3. Tailor Resume Suggestions
  async tailorResume(jobDescription, resumeContent) {
    const sanitizedJob = sanitizeInput(jobDescription);
    const sanitizedResume = sanitizeInput(resumeContent);

    const systemInstruction = `You are a professional resume writer. Provide targeted wording improvements for the resume based on the job description.
CRITICAL MANDATE: DO NOT fabricate achievements, experience, companies, metrics, or technologies.
Return strictly JSON matching schema:
{
  "suggestions": [
    {
      "original": "string",
      "suggested": "string",
      "rationale": "string"
    }
  ],
  "keywordsToInclude": ["string"],
  "summarySuggestion": "string"
}`;

    const prompt = `Resume Content:\n${sanitizedResume}\n\nTarget Job Description:\n${sanitizedJob}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && Array.isArray(result.suggestions)) {
      return { ...result, isFallback: false };
    }

    return {
      suggestions: [
        {
          original: 'Developed backend web applications using Node.js.',
          suggested: 'Designed and implemented scalable RESTful microservices and API endpoints using Node.js and Express.',
          rationale: 'Emphasizes architectural terminology matching job requirements.'
        },
        {
          original: 'Managed database records.',
          suggested: 'Optimized MongoDB database schema design, index performance, and aggregation pipelines.',
          rationale: 'Demonstrates database optimization capabilities without inventing metrics.'
        }
      ],
      keywordsToInclude: ['REST APIs', 'TypeScript', 'MongoDB', 'Performance Optimization'],
      summarySuggestion: 'Results-driven Full Stack Engineer with proven expertise in building responsive React applications and reliable Node.js backends.',
      isFallback: true
    };
  },

  // 4. Generate Cover Letter
  async generateCoverLetter({ jobDescription, userProfile, companyName, role }) {
    const sanitizedJob = sanitizeInput(jobDescription);
    const sanitizedProfile = sanitizeInput(JSON.stringify(userProfile || {}));

    const systemInstruction = `You are an expert cover letter writer. Draft a concise, professional 3-paragraph cover letter tailored to the role and company.
Avoid generic boilerplate ("Dear Hiring Manager, I am excited..."). Focus on concrete value alignment.
Return strictly JSON matching schema:
{
  "subjectLine": "string",
  "salutation": "string",
  "bodyParagraphs": ["string"],
  "closing": "string"
}`;

    const prompt = `Role: ${role}\nCompany: ${companyName}\nUser Profile: ${sanitizedProfile}\nJob Description:\n${sanitizedJob}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && Array.isArray(result.bodyParagraphs)) {
      return { ...result, isFallback: false };
    }

    return {
      subjectLine: `Application for ${role} position - ${userProfile?.name || 'Full Stack Developer'}`,
      salutation: `Dear ${companyName} Hiring Team,`,
      bodyParagraphs: [
        `I am writing to express my strong interest in the ${role} opportunity at ${companyName}. With hands-on experience building full-stack web applications utilizing React, Node.js, and modern database architectures, I am eager to contribute to your engineering team's initiatives.`,
        `In reviewing the role requirements, I noted your team's focus on scalable code quality and user-centric features. In my past projects, I have consistently focused on building modular components, optimizing REST API performance, and enforcing strict data isolation and security practices.`,
        `I would welcome the opportunity to discuss how my technical background aligns with ${companyName}'s current goals. Thank you for your time and consideration.`
      ],
      closing: 'Sincerely,\n' + (userProfile?.name || 'Applicant'),
      isFallback: true
    };
  },

  // 5. Recruiter Outreach Message
  async generateRecruiterMessage({ role, companyName, recruiterName }) {
    const systemInstruction = `You are a networking expert. Generate 3 short, professional outreach message templates (LinkedIn Note, Recruiter Email, Referral Request).
Return strictly JSON matching schema:
{
  "linkedInMsg": "string",
  "recruiterEmailMsg": "string",
  "referralMsg": "string"
}`;

    const prompt = `Role: ${role}\nCompany: ${companyName}\nRecruiter Name: ${recruiterName || 'Hiring Team'}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && result.linkedInMsg) {
      return { ...result, isFallback: false };
    }

    const recName = recruiterName || 'Hiring Manager';
    return {
      linkedInMsg: `Hi ${recName}, I recently submitted my application for the ${role} role at ${companyName}. Given my background in full-stack web development, I’d love to connect and share how my experience aligns with your team's goals!`,
      recruiterEmailMsg: `Hi ${recName},\n\nI hope this message finds you well. I recently applied for the ${role} position at ${companyName}.\n\nHaving built scalable full-stack applications with React and Node.js, I am very enthusiastic about your team's vision. I've attached my resume for your review and would appreciate the opportunity to connect.\n\nBest regards,`,
      referralMsg: `Hi [Name], I noticed ${companyName} is currently hiring for a ${role}. As a fellow engineer, I really admire the work your team is doing. If you're open to it, I'd love to ask a couple of quick questions about your team culture!`,
      isFallback: true
    };
  },

  // 6. Interview Preparation Questions
  async generateInterviewPrep(jobDescription, role) {
    const sanitizedJob = sanitizeInput(jobDescription);

    const systemInstruction = `You are a technical interviewer at a top tech company. Generate 6 interview preparation questions categorized into Technical, Behavioral, and System Design based on the job description.
Return strictly JSON matching schema:
{
  "questions": [
    {
      "id": "string",
      "category": "Technical | Behavioral | System Design",
      "question": "string",
      "guidance": "string",
      "keyTopics": ["string"]
    }
  ]
}`;

    const prompt = `Role: ${role}\nJob Description:\n${sanitizedJob}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && Array.isArray(result.questions)) {
      return { ...result, isFallback: false };
    }

    return {
      questions: [
        {
          id: 'q1',
          category: 'Technical',
          question: `How would you optimize performance and state management in a complex React frontend application?`,
          guidance: 'Discuss component memoization (useMemo, useCallback), lazy loading, virtualization for large lists, and normalized state shape.',
          keyTopics: ['React', 'Performance', 'State Management']
        },
        {
          id: 'q2',
          category: 'Technical',
          question: 'Explain how Node.js handles async I/O operations and how to prevent blocking the event loop.',
          guidance: 'Cover libuv event loop phases, non-blocking asynchronous APIs, worker threads, and avoiding synchronous operations on main thread.',
          keyTopics: ['Node.js', 'Event Loop', 'Asynchronous JS']
        },
        {
          id: 'q3',
          category: 'System Design',
          question: 'Design a high-throughput REST API authentication & multi-tenant user isolation mechanism.',
          guidance: 'Detail JWT token validation, middleware authorization, database compound indexing, and prevention of IDOR vulnerabilities.',
          keyTopics: ['Security', 'REST API', 'Database Design']
        },
        {
          id: 'q4',
          category: 'Behavioral',
          question: 'Describe a situation where a production bug or database issue occurred. How did you diagnose and resolve it?',
          guidance: 'Use the STAR method (Situation, Task, Action, Result). Highlight structured log inspection, root cause analysis, and prevention tests.',
          keyTopics: ['Problem Solving', 'Debugging', 'STAR Method']
        }
      ],
      isFallback: true
    };
  },

  // 7. Mock Interview Evaluation
  async evaluateMockInterviewAnswer(question, userAnswer, category) {
    const sanitizedQuestion = sanitizeInput(question);
    const sanitizedAnswer = sanitizeInput(userAnswer);

    const systemInstruction = `You are a senior tech lead evaluating an interview candidate's response.
Evaluate the answer on clarity, technical depth, structure, and correctness.
Return strictly JSON matching schema:
{
  "clarityScore": number (0-100),
  "technicalScore": number (0-100),
  "structureScore": number (0-100),
  "overallScore": number (0-100),
  "summary": "string",
  "strengths": ["string"],
  "areasToImprove": ["string"],
  "modelAnswer": "string"
}`;

    const prompt = `Category: ${category}\nQuestion: ${sanitizedQuestion}\nCandidate Answer: ${sanitizedAnswer}`;

    const result = await callGeminiJson(prompt, systemInstruction);

    if (result && typeof result.overallScore === 'number') {
      return { ...result, isFallback: false };
    }

    const answerLength = sanitizedAnswer.length;
    const score = Math.min(Math.max(Math.round(answerLength / 4), 60), 92);

    return {
      clarityScore: score,
      technicalScore: Math.min(score + 3, 95),
      structureScore: score - 2,
      overallScore: score,
      summary: 'Solid answer demonstrating good foundational understanding of the core concept.',
      strengths: ['Direct response to the question', 'Clear communication'],
      areasToImprove: ['Add specific architectural examples', 'Mention error handling and edge cases'],
      modelAnswer: `A comprehensive answer should clearly define the core mechanism, outline trade-offs, and provide a real-world example from production engineering.`,
      isFallback: true
    };
  }
};
