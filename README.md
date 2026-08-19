# HireLog

A full-stack job application tracking system to manage job searches, track application statuses, store resume versions, and leverage AI for job description matching and interview preparation.

## Features

- **Application Tracking**: Manage applications through customizable Kanban and List views across stages (Saved, Applied, Interviewing, Offered, Rejected).
- **AI Job Intelligence**: Extract key skills from job postings, calculate ATS match scores against your resume, and generate cover letter drafts.
- **Resume Management**: Store domain-specific resume versions and link them to applications.
- **Interview Preparation**: Practice generated technical and behavioral interview questions matched to specific role titles.
- **Reminders & Tasks**: Set target deadlines for interviews and follow-ups with priority indicators.
- **Analytics & Metrics**: Monitor application velocity, conversion rates, and response trends.
- **Fast Navigation**: Access pages and quick actions via `Cmd + K` / `Ctrl + K` command palette.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS
- **State & UI**: React Context, Framer Motion, Lucide Icons, Recharts

### Backend
- **Runtime & API**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, Rate Limiting, Mongo Sanitize
- **Testing**: Jest, Supertest

## Directory Structure

```
Job_Application_Tracker/
├── job-tracker-frontend/       # React + Vite + TypeScript Client
│   ├── src/
│   │   ├── components/        # Kanban board, navigation, modals
│   │   ├── context/           # Auth, Jobs, and Theme context providers
│   │   ├── pages/             # Dashboard, Applications, Prep, Analytics
│   │   └── services/          # API integration layer
│   └── package.json
└── job-tracker-backend/        # Express REST API Server
    ├── src/
    │   ├── controllers/       # Route logic (Jobs, Resumes, Auth, Reminders)
    │   ├── models/            # Mongoose schemas
    │   ├── routes/            # API endpoints
    │   ├── services/          # AI processing service (Gemini API)
    │   └── tests/             # Jest tests
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB connection string (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Job_Application_Tracker.git
   cd Job_Application_Tracker
   ```

2. **Configure and start backend**
   ```bash
   cd job-tracker-backend
   npm install
   ```

   Create a `.env` file in `job-tracker-backend/`:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Start dev server:
   ```bash
   npm run dev
   ```

3. **Configure and start frontend**
   ```bash
   cd ../job-tracker-frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173` in your browser.

## Testing

Run backend tests:
```bash
cd job-tracker-backend
npm test
```

Build frontend for production:
```bash
cd job-tracker-frontend
npm run build
```

## License

[MIT](LICENSE)
