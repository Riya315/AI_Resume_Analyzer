# ResuMagic - AI Resume Analyzer & ATS Optimizer

ResuMagic is a feature-rich, high-performance web application designed to help job applicants analyze their resumes using Google Gemini AI, align them with specific Job Descriptions, identify skill gaps, and optimize for Applicant Tracking Systems (ATS).

---

## 🌟 Features

- **Multi-Format Extraction:** Seamlessly parses text from PDF, DOC, and DOCX resumes.
- **Detailed Evaluation Metric:** Generates dynamic **Resume Quality** and **ATS Compatibility** scores (0–100).
- **Core AI Sections:** Extracted Professional Summary, Technical Skills matrix, Soft Skills matrix, Missing Competencies, and actionable Improvement Suggestions.
- **Job Description Comparison (Bonus):** Paste an optional Job Description to perform ATS keyword parsing, fit verdicts, and tailored recommendations.
- **Download PDF Report (Bonus):** Exports a professionally structured multipage PDF report of the analysis.
- **Copy to Clipboard (Bonus):** Copies a clean markdown summary of the analysis report to the clipboard.
- **Analysis History Sidebar (Bonus):** Keeps tracks of up to 8 of your recent analyses in LocalStorage to browse or reload instantly.
- **Sleek Light/Dark Mode (Bonus):** Modern CSS-variables driven theme toggle with glassmorphism dashboard elements.
- **Robust Validations:** Performs file existence, extension limits (PDF/DOCX), maximum size constraints (5MB), scanned PDF alerts, and corrupt file boundaries.

---

## 📁 Project Structure

```text
resume-analyzer/
│
├── backend/
│   ├── config/                # Configuration files
│   ├── middleware/
│   │   └── upload.js          # Multer storage, size limits and extension validator
│   ├── routes/
│   │   └── resumeRoutes.js    # POST /api/resume/analyze router (validates & processes files)
│   ├── uploads/               # Temporary uploads directory (files cleaned up immediately after parsing)
│   ├── utils/
│   │   ├── gemini.js          # Gemini SDK connector, custom prompt and schema parser
│   │   └── readResume.js      # Extraction utilities using pdf-parse & mammoth
│   ├── .env                   # Configuration variables (PORT, GEMINI_API_KEY)
│   ├── package.json           # Backend dependency configuration
│   └── server.js              # Express app initialization entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css          # Modern glassmorphic theme styling & CSS variables
│   ├── js/
│   │   └── script.js          # App interactive controls, timers, LocalStorage & PDF rendering
│   └── index.html             # Application markup
│
└── README.md                  # Installation & instruction documentation
```

---

## ⚙️ Prerequisites

- **Node.js:** Ensure that Node.js (version 16 or above) is installed.
- **Gemini API Key:** A valid Google AI Studio Gemini API key is required.

---

## 🚀 Installation & Setup

### 1. Configure Environment Variables
Inside the `backend/` directory, locate or create a `.env` file and insert the following values:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: A pre-configured API key is currently saved inside the `backend/.env` file for this assignment evaluation.)*

### 2. Install Backend Dependencies
Navigate to the `backend/` directory in your terminal and install all required modules:

```bash
cd backend
npm install
```

---

## 🏃 Running the Application

### 1. Start the Backend Server
Run the Express backend in development mode (which restarts on file change using nodemon):

```bash
npm run dev
```

The terminal will display:
`Server is running on http://localhost:5000`

### 2. Open the Frontend Application
Simply double-click the `index.html` file located in the `frontend/` directory, or open it directly in any modern web browser.

You can also use any local static file server extension (like Live Server in VS Code) or run:
```bash
# Example using npx to serve the frontend on a local port
npx serve ../frontend
```

---

## 🧪 Verification & Testing Scenarios

We recommend testing the application with the following scenarios:
1. **Valid Resume Upload:** Upload a standard PDF/DOCX resume to verify scores and lists populate.
2. **With Job Description:** Paste a relevant Job Description, analyze, and view the tailored "Job Match" tab.
3. **Invalid File Type:** Attempt to upload a `.txt` or `.png` file. The interface will block upload immediately and warn the user.
4. **Legacy Word File:** Attempt to upload a `.doc` file. The API returns a clear, helpful error message asking you to convert it to `.docx` or `.pdf`.
5. **Large File:** Attempt to upload a file larger than 5MB to test the Multer size limit error handler.
6. **Report Export:** Toggle dark mode, export a PDF report, and verify it outputs correctly.
