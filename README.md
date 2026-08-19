# ⚡ HireLog — AI-Powered Job Application OS

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Cluster-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E44AD?style=for-the-badge&logo=googlegemini&logoColor=white)](https://deepmind.google/technologies/gemini/)

HireLog is a full-stack, AI-native job application tracking operating system built with a minimal, high-contrast design language. Designed for modern software engineers and job seekers, HireLog streamlines your entire job hunt — from application tracking and interview preparation to AI-driven resume ATS optimization.

---

## ✨ Features

- 🎯 **Kanban & List Application Boards**: Track application statuses seamlessly across *Saved*, *Applied*, *Interviewing*, *Offered*, and *Rejected* columns.
- ⚡ **Command Palette (`Cmd + K` / `Ctrl + K`)**: Global fast-action search to navigate pages, create new applications, or jump directly to job details instantly.
- 🤖 **AI Job Intelligence & ATS Matcher**: Analyze job descriptions against your resume, extract key missing keywords, evaluate match scores, and generate customized cover letter snippets powered by **Google Gemini**.
- 📝 **Resume Vault & Versioning**: Upload, store, and tailor multiple resume versions tailored to specific job domains.
- 💡 **AI Interview Prep Suite**: Automated generation of technical & behavioral interview questions tailored to specific job titles and tech stacks.
- ⏰ **Smart Reminders & Task Tracker**: Never miss an upcoming interview or follow-up deadline with structured priority reminders.
- 📊 **Analytics & Insights Pipeline**: Real-time metrics on response rates, interview conversion percentages, and application velocity.
- 📱 **Fully Responsive Layout**: Dedicated mobile navigation drawer, bottom action bar, and desktop sidebar navigation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS (Quantus Dark/Light Theme System)
- **Icons & UI**: Lucide React, Framer Motion
- **Charts**: Recharts
- **State & Context**: Custom React Context API (`JobsContext`, `AuthContext`, `ThemeContext`)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Security & Middleware**: Helmet, CORS, Express Rate Limit, Express Mongo Sanitize
- **Testing**: Jest & Supertest

---

## 📁 Project Structure

```
Job_Application_Tracker/
├── job-tracker-frontend/       # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # KanbanBoard, CommandPalette, Navigation, Modals
│   │   ├── context/           # AuthContext, JobsContext, ThemeContext
│   │   ├── pages/             # ApplicationsPage, AnalyticsPage, InterviewPrepPage...
│   │   ├── services/          # API services & Axios client
│   │   ├── types/             # TypeScript models & interfaces
│   │   └── utils/             # Helpers, constants, and theme utilities
│   └── package.json
└── job-tracker-backend/        # Express + Node.js REST API
    ├── src/
    │   ├── config/            # Database and Environment configurations
    │   ├── controllers/       # Application, Resume, Interview & Auth logic
    │   ├── middleware/        # JWT auth, error handlers, rate limiters
    │   ├── models/            # Mongoose schemas (User, Job, Resume, Reminder)
    │   ├── routes/            # Express REST endpoints
    │   ├── services/          # AI Service (Google Gemini integration)
    │   └── tests/             # Jest integration tests
    └── package.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection String

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Job_Application_Tracker.git
cd Job_Application_Tracker
```

---

### 2. Backend Setup
```bash
cd job-tracker-backend
npm install
```

Create a `.env` file inside `job-tracker-backend/`:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirelog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=dev
GEMINI_API_KEY=your_google_gemini_api_key_optional
```

Start the backend dev server:
```bash
npm run dev
```
> Server runs at `http://localhost:5001`

---

### 3. Frontend Setup
Open a new terminal tab and navigate to the frontend directory:
```bash
cd job-tracker-frontend
npm install
```

Create a `.env` file inside `job-tracker-frontend/` (optional for local API URL override):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

Start the frontend dev server:
```bash
npm run dev
```
> Application will be live at `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
```bash
cd job-tracker-backend
npm test
```

### Frontend Production Build Test
```bash
cd job-tracker-frontend
npm run build
```

---

## 🛡️ Security Features

- **JWT Authentication**: Secure stateless token validation.
- **Input Sanitization**: Protects against NoSQL injection attacks via `express-mongo-sanitize`.
- **Rate Limiting**: Defends against brute-force and DDoS attempts using `express-rate-limit`.
- **HTTP Headers**: Enforces security best practices via `helmet`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<p align="center">
  Made with ❤️ for software engineers navigating the job market.
</p>
