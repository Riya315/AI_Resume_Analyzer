# 🤖 AI Resume Analyzer

An AI-powered Resume Analyzer that evaluates resumes against a job description, calculates ATS compatibility, identifies missing skills, and provides personalized improvement suggestions using Google's Gemini AI.

## 🚀 Live Demo
https://github.com/Riya315/AI_Resume_Analyzer

## 📌 Features

- 📄 Upload Resume (PDF)
- 🤖 AI-powered Resume Analysis using Gemini AI
- 📊 ATS Score Calculation
- 🎯 Job Description Matching
- 💡 Personalized Resume Improvement Suggestions
- 🛠 Missing Skills Detection
- 📈 Skill Match Percentage
- 🔒 Secure Backend API
- 💾 Resume Analysis History (MySQL)
- 📱 Responsive UI

# 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Multer
- PDF Parser

### AI
- Google Gemini API

### Database
- MySQL

### Deployment
- Vercel (Frontend)
- Render (Backend)

# 📂 Project Structure

AI_Resume_Analyzer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md

# 🔄 Workflow


User Uploads Resume
          │
          ▼
Resume Text Extraction
          │
          ▼
User Enters Job Description
          │
          ▼
Gemini AI Analysis
          │
          ▼
ATS Score Generation
          │
          ▼
Missing Skills Detection
          │
          ▼
Improvement Suggestions
          │
          ▼
Results Stored in MySQL


# 📊 Features in Detail

### Resume Parsing

- Extracts text from uploaded PDF resumes.

### ATS Score

Calculates resume compatibility with the provided Job Description.

### AI Suggestions

Provides intelligent recommendations to improve resume quality.

### Skill Matching

Compares resume skills with required job skills.

### Missing Keywords

Highlights important keywords absent from the resume.

# 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/analyze | Analyze Resume |
| POST | /api/upload | Upload Resume |




