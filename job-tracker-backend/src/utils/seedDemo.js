import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { JobApplication } from '../models/JobApplication.js';

export const ensureDemoUser = async () => {
  try {
    const demoEmail = 'demo@hirelog.app';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      demoUser = await User.create({
        name: 'Demo Candidate',
        email: demoEmail,
        password: hashedPassword,
        role: 'user',
        subscriptionPlan: 'PRO',
        profile: {
          title: 'Senior Full Stack Engineer',
          skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'GraphQL', 'TailwindCSS'],
          targetRoles: ['Senior Frontend Engineer', 'Staff Software Engineer', 'Full Stack Developer'],
          experienceYears: 5,
          location: 'San Francisco, CA (Remote)',
          bio: 'Passionate product-focused software engineer tracking high-impact tech opportunities.'
        }
      });
      console.log('✅ Demo user created: demo@hirelog.app');
    }

    // Seed sample jobs for demo user if none exist
    const jobsCount = await JobApplication.countDocuments({ userId: demoUser._id });
    if (jobsCount === 0) {
      const sampleJobs = [
        {
          userId: demoUser._id,
          companyName: 'Stripe',
          role: 'Senior Frontend Engineer',
          status: 'Interview',
          location: 'Remote, US',
          employmentType: 'Full-time',
          source: 'LinkedIn',
          salary: 175000,
          salaryMax: 200000,
          currency: 'USD',
          recruiterName: 'Sarah Jenkins',
          recruiterEmail: 'sarah.j@stripe.com',
          appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          notes: 'Completed technical screen. System architecture round scheduled for Thursday.',
          priority: 'High',
          tags: ['Fintech', 'React', 'Design Systems']
        },
        {
          userId: demoUser._id,
          companyName: 'Linear',
          role: 'Full Stack Product Engineer',
          status: 'Offer',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          source: 'Referral',
          salary: 190000,
          salaryMax: 215000,
          currency: 'USD',
          recruiterName: 'Karri Saarinen',
          appliedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
          notes: 'Received competitive offer package. Reviewing equity terms.',
          priority: 'High',
          tags: ['SaaS', 'Product', 'TypeScript']
        },
        {
          userId: demoUser._id,
          companyName: 'Vercel',
          role: 'Staff Solutions Architect',
          status: 'Screening',
          location: 'Remote',
          employmentType: 'Full-time',
          source: 'Company Website',
          salary: 180000,
          salaryMax: 210000,
          currency: 'USD',
          appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          notes: 'Recruiter reached out on LinkedIn. Intro call booked.',
          priority: 'Medium',
          tags: ['Cloud', 'Next.js', 'Infrastructure']
        },
        {
          userId: demoUser._id,
          companyName: 'GitHub',
          role: 'Senior Software Engineer - Copilot',
          status: 'Applied',
          location: 'Remote',
          employmentType: 'Full-time',
          source: 'LinkedIn',
          salary: 165000,
          salaryMax: 190000,
          currency: 'USD',
          appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          notes: 'Applied with tailored resume highlighting AI tooling experience.',
          priority: 'High',
          tags: ['AI', 'Developer Tools']
        },
        {
          userId: demoUser._id,
          companyName: 'Datadog',
          role: 'Frontend Infrastructure Engineer',
          status: 'Rejected',
          location: 'New York, NY',
          employmentType: 'Full-time',
          source: 'Job Board',
          salary: 160000,
          salaryMax: 185000,
          currency: 'USD',
          appliedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          notes: 'Position closed internally. Keeping recruiter in network.',
          priority: 'Low',
          tags: ['Observability', 'Performance']
        }
      ];

      await JobApplication.insertMany(sampleJobs);
      console.log('✅ Demo applications seeded for demo@hirelog.app');
    }

    return demoUser;
  } catch (err) {
    console.warn('⚠️ Demo user check/seed skipped or failed:', err.message);
    return null;
  }
};

