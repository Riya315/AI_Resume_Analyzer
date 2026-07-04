const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeResume(resumeText, jobDescription = "") {
  resumeText = resumeText.substring(0, 8000);

  const prompt = `
You are an expert ATS resume analyzer.

Analyze this resume and return ONLY valid JSON.

${jobDescription ? `Job Description:\n${jobDescription}` : "No Job Description provided."}

Resume:
${resumeText}

Return JSON like:
{
  "resumeScore": 0,
  "atsScore": 0,
  "summary": "",
  "technicalSkills": [],
  "softSkills": [],
  "missingSkills": [],
  "improvementSuggestions": [],
  "jobDescriptionComparison": null
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You are a professional ATS resume analyzer. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let text = completion.choices[0].message.content.trim();

    // remove markdown if any
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (err) {
    console.error("AI Error:", err.message);
    throw new Error(err.message);
  }
}

module.exports = analyzeResume;