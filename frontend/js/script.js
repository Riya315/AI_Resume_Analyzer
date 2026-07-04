/* =============================================================
   AI RESUME ANALYZER — Frontend Script
   Sections rendered:
     1. Resume Summary
     2. Technical Skills
     3. Soft Skills
     4. Missing Skills
     5. Improvement Suggestions
   ============================================================= */

const API_URL = "http://localhost:5001/api/resume/analyze";

/* ── DOM REFERENCES ─────────────────────────────────────── */
// Upload section
const analyzeForm = document.getElementById("analyzeForm");
const resumeFileInput = document.getElementById("resumeFile");
const dropZone = document.getElementById("dropZone");
const dropDefault = document.getElementById("dropDefault");
const dropSelected = document.getElementById("dropSelected");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const fileSizeDisplay = document.getElementById("fileSizeDisplay");
const fileIconPreview = document.getElementById("fileIconPreview");
const btnRemoveFile = document.getElementById("btnRemoveFile");
const fileValidationError = document.getElementById("fileValidationError");
const fileValidationMessage = document.getElementById("fileValidationMessage");
const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeBtnText = document.getElementById("analyzeBtnText");

// Panels
const uploadSection = document.getElementById("uploadSection");
const loadingSection = document.getElementById("loadingSection");
const errorSection = document.getElementById("errorSection");
const resultsSection = document.getElementById("resultsSection");

// Loading
const loadingTitle = document.getElementById("loadingTitle");
const loadingSubtitle = document.getElementById("loadingSubtitle");
const progressFill = document.getElementById("progressFill");
const loadingStepLabel = document.getElementById("loadingStepLabel");

// Error
const errorMessage = document.getElementById("errorMessage");
const errorTypeBadge = document.getElementById("errorTypeBadge");
const retryBtn = document.getElementById("retryBtn");

// Results – header
const resultsFilename = document.getElementById("resultsFilename");
const copyAnalysisBtn = document.getElementById("copyAnalysisBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const newAnalysisBtn = document.getElementById("newAnalysisBtn");

// Score banner
const scoreResumeVal = document.getElementById("scoreResumeVal");
const scoreResumeFill = document.getElementById("scoreResumeFill");
const scoreAtsVal = document.getElementById("scoreAtsVal");
const scoreAtsFill = document.getElementById("scoreAtsFill");
const scoreVerdict = document.getElementById("scoreVerdict");

// Analysis section content
const summaryText = document.getElementById("summaryText");
const techSkillsCloud = document.getElementById("techSkillsCloud");
const softSkillsCloud = document.getElementById("softSkillsCloud");
const missingSkillsList = document.getElementById("missingSkillsList");
const suggestionsList = document.getElementById("suggestionsList");

// History
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Theme
const themeToggleBtn = document.getElementById("themeToggleBtn");

/* ── STATE ──────────────────────────────────────────────── */
let currentFile = null;
let currentAnalysis = null;
let currentFileName = "";
let historyData = [];
let progressTimer = null;

/* =============================================================
   1. THEME — Dark / Light Mode
   ============================================================= */
function initTheme() {
    const saved = localStorage.getItem("ra_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ra_theme", next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector("i");
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// themeToggleBtn.addEventListener("click", toggleTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
}

/* =============================================================
   2. FILE SELECTION — Drag & Drop + Click
   ============================================================= */
["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
});

["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, () => dropZone.classList.add("drag-over"));
});

["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, () => dropZone.classList.remove("drag-over"));
});

dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) processFileSelection(file);
});

resumeFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) processFileSelection(file);
});

btnRemoveFile.addEventListener("click", (e) => {
    e.stopPropagation();
    clearFileSelection();
});

function processFileSelection(file) {
    hideValidationError();

    // Validate size — max 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        showValidationError("File is too large. Maximum allowed size is 5 MB.");
        return;
    }

    // Validate extension
    const ext = file.name.split(".").pop().toLowerCase();
    const allowed = ["pdf", "doc", "docx"];
    if (!allowed.includes(ext)) {
        showValidationError(`"${file.name}" is not supported. Please upload a PDF, DOC, or DOCX file.`);
        return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = formatBytes(file.size);

    // Set icon colour by type
    if (ext === "pdf") {
        fileIconPreview.className = "fa-solid fa-file-pdf file-icon-preview";
        fileIconPreview.style.color = "#ef4444";
    } else {
        fileIconPreview.className = "fa-solid fa-file-word file-icon-preview";
        fileIconPreview.style.color = "#2b579a";
    }

    dropDefault.style.display = "none";
    dropSelected.style.display = "flex";
}

function clearFileSelection() {
    currentFile = null;
    resumeFileInput.value = "";
    dropDefault.style.display = "flex";
    dropSelected.style.display = "none";
    hideValidationError();
}

function showValidationError(msg) {
    fileValidationMessage.textContent = msg;
    fileValidationError.style.display = "flex";
}

function hideValidationError() {
    fileValidationError.style.display = "none";
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + units[i];
}

/* =============================================================
   3. LOADING PROGRESS SIMULATOR
   ============================================================= */
const LOADING_STEPS = [
    { title: "Uploading resume...", sub: "Sending your file to the server.", fill: 20, label: "Step 1 of 3" },
    { title: "Extracting document text...", sub: "Parsing text and structure from your file.", fill: 55, label: "Step 2 of 3" },
    { title: "Analyzing with Gemini AI...", sub: "AI is reviewing your resume sections.", fill: 80, label: "Step 3 of 3" },
    { title: "Building your report...", sub: "Structuring skills, gaps, and suggestions.", fill: 95, label: "Almost done..." },
];

function startLoadingProgress() {
    let step = 0;
    applyLoadingStep(LOADING_STEPS[0]);
    progressTimer = setInterval(() => {
        step++;
        if (step < LOADING_STEPS.length) {
            applyLoadingStep(LOADING_STEPS[step]);
        }
    }, 4000);
}

function applyLoadingStep(s) {
    loadingTitle.textContent = s.title;
    loadingSubtitle.textContent = s.sub;
    progressFill.style.width = s.fill + "%";
    progressFill.setAttribute("aria-valuenow", s.fill);
    loadingStepLabel.textContent = s.label;
}

function stopLoadingProgress() {
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    progressFill.style.width = "100%";
}

/* =============================================================
   4. PANEL VISIBILITY HELPERS
   ============================================================= */
function showPanel(name) {

    console.log("showPanel called:", name);

    uploadSection.style.display = "none";
    loadingSection.style.display = "none";
    errorSection.style.display = "none";
    resultsSection.style.display = "none";

    if (name === "upload")
        uploadSection.style.display = "block";

    if (name === "loading")
        loadingSection.style.display = "block";

    if (name === "error")
        errorSection.style.display = "block";

    if (name === "results")
        resultsSection.style.display = "block";

    console.log("Results display =", resultsSection.style.display);
}

/* =============================================================
   5. FORM SUBMIT — API CALL
   ============================================================= */
analyzeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideValidationError();

    // Guard: no file selected
    if (!currentFile) {
        showValidationError("Please select a resume file before analyzing.");
        return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("resume", currentFile);

    currentFileName = currentFile.name;

    // Switch to loading panel
    // Switch to loading panel
    showPanel("loading");
    startLoadingProgress();
    // Show placeholders and results panel immediately
    showInitialResultsPlaceholders();
    // showPanel("results");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        stopLoadingProgress();

        // Handle HTTP-level errors
        if (!response.ok || !data.success) {
            const errorType = classifyError(response.status, data.message);
            showErrorPanel(data.message || "An unknown error occurred.", errorType);
            return;
        }

        // SUCCESS — render analysis
        console.log("✅ API Success");

        currentAnalysis = data.analysis;

        console.log("Before render");
        renderAnalysis(data.analysis, currentFileName);
        console.log("After render");

        saveToHistory({
            id: Date.now().toString(),
            fileName: currentFileName,
            date: new Date().toLocaleString(),
            analysis: data.analysis
        });

        console.log("Showing results");
        showPanel("results");

        console.log("Display:", resultsSection.style.display);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (networkError) {
        stopLoadingProgress();
        // Network / CORS / server-unreachable
        showErrorPanel("Could not connect to the server. Make sure the backend is running at http://localhost:5001.", "Network Error");
    }
});

function classifyError(status, message) {
    if (!message) return "Server Error";
    const m = message.toLowerCase();
    if (m.includes("format") || m.includes("type") || m.includes("supported")) return "Invalid File Format";
    if (m.includes("empty") || m.includes("no file") || m.includes("corrupted")) return "Invalid File";
    if (m.includes("size") || m.includes("large")) return "File Too Large";
    if (m.includes("gemini") || m.includes("ai") || m.includes("json")) return "AI API Error";
    if (status >= 500) return "Server Error";
    return "Request Error";
}

function showErrorPanel(message, type) {
    errorMessage.textContent = message;
    errorTypeBadge.textContent = type;
    showPanel("error");
}

retryBtn.addEventListener("click", () => {
    showPanel("upload");
    clearFileSelection();
});

/* =============================================================
   6. RENDER AI ANALYSIS — 5 Required Sections
   ============================================================= */
function renderAnalysis(analysis, fileName) {
    // Header
    resultsFilename.textContent = fileName;

    // --- Scores ---
   const rs = Math.min(10, Math.max(0, Number(analysis.resumeScore) || 0));
const as = Math.min(10, Math.max(0, Number(analysis.atsScore) || 0));

animateScore(scoreResumeVal, scoreResumeFill, rs, 10);
animateScore(scoreAtsVal, scoreAtsFill, as, 10);

    // Verdict text
    const avg = Math.round((rs + as) / 2);
    if (avg >= 8) {
        scoreVerdict.textContent = "🟢 Strong Resume";
        scoreVerdict.style.color = "var(--success)";
    } else if (avg >= 6) {
        scoreVerdict.textContent = "🟡 Good with Improvements";
        scoreVerdict.style.color = "var(--warning)";
    } else {
        scoreVerdict.textContent = "🔴 Needs Significant Work";
        scoreVerdict.style.color = "var(--danger)";
    }

    // --- Section 1: Resume Summary ---
    summaryText.textContent = analysis.summary || "No summary generated.";

    // --- Section 2: Technical Skills ---
    renderSkillCloud(techSkillsCloud, analysis.technicalSkills || [], false);

    // --- Section 3: Soft Skills ---
    renderSkillCloud(softSkillsCloud, analysis.softSkills || [], true);

    // --- Section 4: Missing Skills ---
    missingSkillsList.innerHTML = "";
    const missing = analysis.missingSkills || [];
    if (missing.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No critical skill gaps identified — good coverage!";
        li.style.borderLeftColor = "var(--success)";
        li.style.background = "var(--success-light)";
        li.style.color = "var(--success)";
        missingSkillsList.appendChild(li);
    } else {
        missing.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            missingSkillsList.appendChild(li);
        });
    }

    // --- Section 5: Improvement Suggestions ---
    suggestionsList.innerHTML = "";
    const suggestions = analysis.improvementSuggestions || [];
    if (suggestions.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No specific improvement suggestions. Resume meets baseline quality standards.";
        suggestionsList.appendChild(li);
    } else {
        suggestions.forEach(suggestion => {
            const li = document.createElement("li");
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
    }
}

function renderSkillCloud(container, skills, isSoft) {
    container.innerHTML = "";
    container.className = isSoft ? "skills-cloud soft" : "skills-cloud";
    if (skills.length === 0) {
        container.innerHTML = `<span style="color:var(--text-3);font-size:0.88rem;font-style:italic;">None identified</span>`;
        return;
    }
    skills.forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.textContent = skill;
        container.appendChild(tag);
    });
}

function showInitialResultsPlaceholders() {
    // Reset scores
    scoreResumeVal.textContent = '–';
    scoreAtsVal.textContent = '–';
    scoreVerdict.textContent = 'Calculating...';
    // Placeholders for sections
    summaryText.innerHTML = `<div class="placeholder line"></div>`;
    techSkillsCloud.innerHTML = `<div class="placeholder tag"></div>`.repeat(5);
    softSkillsCloud.innerHTML = `<div class="placeholder tag"></div>`.repeat(5);
    missingSkillsList.innerHTML = `<li class="placeholder line"></li>`.repeat(3);
    suggestionsList.innerHTML = `<li class="placeholder line"></li>`.repeat(3);
}

function animateScore(valueEl, fillEl, target, max = 100) {

    let current = 0;
    const step = target / 40;

    const timer = setInterval(() => {

        current = Math.min(current + step, target);

        // Show score out of 10
        valueEl.textContent = current.toFixed(1);

        // Convert to percentage for progress bar
        const percentage = (current / max) * 100;

        fillEl.style.width = percentage + "%";

        if (current >= target) {
            valueEl.textContent = target.toFixed(1);
            clearInterval(timer);
        }

    }, 20);
}

/* =============================================================
   7. QUICK ACTIONS — Copy & PDF
   ============================================================= */
copyAnalysisBtn.addEventListener("click", () => {
    if (!currentAnalysis) return;
    const a = currentAnalysis;

    const text = [
        `AI RESUME ANALYSIS — ${currentFileName}`,
        "=".repeat(50),
        `Resume Score: ${a.resumeScore}/10    ATS Score: ${a.atsScore}/10`,
        "",
        "RESUME SUMMARY",
        a.summary,
        "",
        "TECHNICAL SKILLS",
        (a.technicalSkills || []).join(", ") || "None",
        "",
        "SOFT SKILLS",
        (a.softSkills || []).join(", ") || "None",
        "",
        "MISSING SKILLS",
        ...(a.missingSkills || []).map(s => `  • ${s}`),
        "",
        "IMPROVEMENT SUGGESTIONS",
        ...(a.improvementSuggestions || []).map((s, i) => `  ${i + 1}. ${s}`),
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
        const orig = copyAnalysisBtn.innerHTML;
        copyAnalysisBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        copyAnalysisBtn.style.background = "var(--success)";
        copyAnalysisBtn.style.color = "white";
        copyAnalysisBtn.style.borderColor = "transparent";
        setTimeout(() => {
            copyAnalysisBtn.innerHTML = orig;
            copyAnalysisBtn.style.cssText = "";
        }, 2500);
    }).catch(() => alert("Failed to copy to clipboard."));
});

downloadPdfBtn.addEventListener("click", () => {
    if (!currentAnalysis) return;
    const element = document.getElementById("pdfReportContent");
    const baseName = currentFileName.replace(/\.[^/.]+$/, "");
    html2pdf().set({
        margin: [0.5, 0.5],
        filename: `${baseName}_AI_Analysis.pdf`,
        image: { type: "jpeg", quality: 0.97 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    }).from(element).save();
});

newAnalysisBtn.addEventListener("click", () => {
    clearFileSelection();
    showPanel("upload");
});

/* =============================================================
   8. HISTORY — LocalStorage
   ============================================================= */
function loadHistory() {
    try {
        const raw = localStorage.getItem("ra_history");
        historyData = raw ? JSON.parse(raw) : [];
    } catch { historyData = []; }
    renderHistoryList();
}

function saveToHistory(item) {
    historyData.unshift(item);
    if (historyData.length > 8) historyData.pop();
    localStorage.setItem("ra_history", JSON.stringify(historyData));
    renderHistoryList();
}

function renderHistoryList() {

    if (!historyList) return;

    historyList.innerHTML = "";
    if (historyData.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fa-solid fa-folder-open"></i>
                <p>No analyses yet</p>
            </div>`;
        return;
    }
    historyData.forEach(item => {
        const score = item.analysis?.resumeScore ?? "–";
        const name = item.fileName.length > 22 ? item.fileName.substring(0, 19) + "…" : item.fileName;
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <div class="hi-top">
                <span class="hi-name" title="${item.fileName}">${name}</span>
                <span class="hi-score">${score}</span>
            </div>
            <div class="hi-date">${(item.date || "").split(",")[0]}</div>`;
        div.addEventListener("click", () => {
            currentAnalysis = item.analysis;
            currentFileName = item.fileName;
            renderAnalysis(item.analysis, item.fileName);
            showPanel("results");
            document.querySelectorAll(".history-item").forEach(h => h.classList.remove("active"));
            div.classList.add("active");
        });
        historyList.appendChild(div);
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
        if (!confirm("Clear all analysis history?")) return;
        historyData = [];
        localStorage.removeItem("ra_history");
        renderHistoryList();
    });
}

/* =============================================================
   9. INIT
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadHistory();
    showPanel("upload");
});