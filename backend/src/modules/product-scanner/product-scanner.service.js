const fs = require('fs');
const barcodeService = require('./barcode.service');
const ocrService = require('./ocr.service');
const NotFoundError = require('../../shared/errors/not-found.error');
const BadRequestError = require('../../shared/errors/bad-request.error');
const SCANNER_MESSAGES = require('./scanner.messages');

/**
 * Perform barcode scanning and search.
 * @param {string} barcode
 * @returns {Promise<object>} Normalized product info
 */
const scanBarcode = async (barcode) => {
	const product = await barcodeService.lookupBarcode(barcode);
	if (!product) {
		throw new NotFoundError(SCANNER_MESSAGES.PRODUCT_NOT_FOUND);
	}
	return product;
};

/**
 * Handle multipart image scan, process via Gemini, and guarantee temporary file cleanup.
 * @param {object} file Multer uploaded file details
 * @returns {Promise<object>} Mapped extracted product details
 */
const scanImage = async (file) => {
	if (!file) {
		throw new BadRequestError(SCANNER_MESSAGES.IMAGE_REQUIRED);
	}

	try {
		const extracted = await ocrService.extractProductFromImage(file.path, file.mimetype);
		if (!extracted) {
			throw new BadRequestError(SCANNER_MESSAGES.SCAN_FAILED);
		}
		return extracted;
	} finally {
		// GUARANTEED CLEANUP: Always remove temporary Multer files immediately
		if (file.path && fs.existsSync(file.path)) {
			fs.unlink(file.path, (err) => {
				if (err) {
					console.error(`Failed to clean up temp file ${file.path}:`, err.message);
				}
			});
		}
	}
};

module.exports = {
	scanBarcode,
	scanImage
};
