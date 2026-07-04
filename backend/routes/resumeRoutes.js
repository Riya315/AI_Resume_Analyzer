const express = require("express");
const upload = require("../middleware/upload");
const readResume = require("../utils/readResume");
const analyzeResume = require("../utils/gemini");
const fs = require("fs");

const router = express.Router();

router.post("/analyze",
  // STEP 1 + STEP 2: Upload handling
  (req, res, next) => {
    console.log("========================================");
    console.log("STEP 1: /analyze route called");

    upload.single("resume")(req, res, (err) => {
      console.log("STEP 2: Multer callback");

      if (err) {
        console.log("❌ Upload error:", err.message);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      console.log("✅ STEP 3: File uploaded");
      console.log(req.file);

      next();
    });
  },

  // STEP 3: Main controller
  async (req, res) => {
    let filePath;

    try {
      console.log("========================================");
      console.log("STEP 4: Controller reached");

      filePath = req.file.path;
      const jobDescription = req.body.jobDescription || "";

      console.log("File Path:", filePath);
      console.log("Job Description Length:", jobDescription.length);

      // STEP 5: Read Resume
      console.log("STEP 5: Reading Resume...");
      const resumeText = await readResume(filePath);

      console.log("✅ Resume Read Successfully");
      console.log("Resume Length:", resumeText.length);

      // Delete file after reading
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("✅ Uploaded file deleted");
      }

      // STEP 6: AI CALL
      console.log("STEP 6: Calling AI...");

      const analysis = await analyzeResume(resumeText, jobDescription);

      console.log("✅ AI Finished");
      console.log(analysis);

      return res.status(200).json({
        success: true,
        analysis,
      });

    } catch (error) {
      console.error("❌ ERROR:", error.message);

      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;