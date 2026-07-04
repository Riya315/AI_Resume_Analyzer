const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("dotenv").config();

console.log("PORT =", process.env.PORT);
console.log("GROQ_API_KEY exists =", !!process.env.GROQ_API_KEY);
console.log("GROQ_API_KEY prefix =", process.env.GROQ_API_KEY?.substring(0, 8));

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// ========================
// CORS FIX (STEP 1)
// ========================
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Debug (optional but helpful)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// Routes
app.use("/api/resume", resumeRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend Running 🚀");
});

// Server start
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});