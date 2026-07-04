const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const readResume = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();

    // Handle legacy .doc explicitly
    if (extension === ".doc") {
        throw new Error("Legacy Word format (.doc) is not supported. Please save your file as .docx or .pdf and upload again.");
    }

    // PDF
    if (extension === ".pdf") {
        try {
            const buffer = fs.readFileSync(filePath);
            const data = await pdf(buffer);
            
            if (!data || !data.text || !data.text.trim()) {
                throw new Error("The PDF file appears to be empty, scanned (images only), or corrupted.");
            }
            
            return data.text;
        } catch (error) {
            if (error.message.includes("empty, scanned")) {
                throw error;
            }
            throw new Error("Failed to parse PDF file. The file may be corrupted.");
        }
    }

    // DOCX
    if (extension === ".docx") {
        try {
            const data = await mammoth.extractRawText({
                path: filePath
            });
            
            if (!data || !data.value || !data.value.trim()) {
                throw new Error("The DOCX file appears to be empty or corrupted.");
            }
            
            return data.value;
        } catch (error) {
            if (error.message.includes("empty or corrupted")) {
                throw error;
            }
            throw new Error("Failed to parse DOCX file. The file may be corrupted.");
        }
    }

    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
};

module.exports = readResume;