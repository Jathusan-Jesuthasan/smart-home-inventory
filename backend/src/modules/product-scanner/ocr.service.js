const geminiService = require('./gemini.service');

/**
 * Interface coordinating image parsing. Delegates multimodal vision analysis to the Gemini service.
 * @param {string} filePath Temporary local image path
 * @param {string} mimeType File MIME type
 * @returns {Promise<object|null>} Mapped product object
 */
const extractProductFromImage = async (filePath, mimeType) => {
	// Delegates directly to our high-performance Gemini Vision OCR and extraction pipeline
	return geminiService.extractProductInfo(filePath, mimeType);
};

module.exports = {
	extractProductFromImage
};
