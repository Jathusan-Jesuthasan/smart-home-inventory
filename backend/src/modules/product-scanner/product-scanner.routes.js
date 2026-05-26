const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');

const productScannerController = require('./product-scanner.controller');
const { barcodeSchema } = require('./scanner.validation');
const SCANNER_CONSTANTS = require('./scanner.constants');
const SCANNER_MESSAGES = require('./scanner.messages');
const authenticateUser = require('../../middlewares/authenticate-user.middleware');
const validateRequest = require('../../middlewares/validate-request.middleware');
const BadRequestError = require('../../shared/errors/bad-request.error');

const router = Router();

// Ensure the temporary uploads directory exists
if (!fs.existsSync(SCANNER_CONSTANTS.TEMP_UPLOAD_DIR)) {
	fs.mkdirSync(SCANNER_CONSTANTS.TEMP_UPLOAD_DIR, { recursive: true });
}

// Multer storage & verification settings
const upload = multer({
	dest: SCANNER_CONSTANTS.TEMP_UPLOAD_DIR,
	limits: { fileSize: SCANNER_CONSTANTS.MAX_FILE_SIZE },
	fileFilter: (_req, file, cb) => {
		if (!SCANNER_CONSTANTS.SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
			return cb(new BadRequestError(SCANNER_MESSAGES.UNSUPPORTED_IMAGE_TYPE), false);
		}
		cb(null, true);
	}
});

// Custom error handling helper for Multer size limit errors
const handleUpload = (req, res, next) => {
	upload.single('image')(req, res, (err) => {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return next(new BadRequestError(SCANNER_MESSAGES.FILE_TOO_LARGE));
			}
			return next(err);
		}
		next();
	});
};

/**
 * @openapi
 * /scanner/barcode:
 *   post:
 *     summary: Scan product barcode
 *     description: Search for a product by barcode. Attempts an OpenFoodFacts lookup first.
 *     tags:
 *       - Product Scanner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Product details successfully fetched.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.post('/barcode', authenticateUser, validateRequest(barcodeSchema), productScannerController.scanBarcode);

/**
 * @openapi
 * /scanner/image:
 *   post:
 *     summary: Scan product image
 *     description: Uploads a product image temporarily, analyzes it via Gemini Vision AI, extracts structured details, and guarantees immediate deletion of the temporary file.
 *     tags:
 *       - Product Scanner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product details successfully extracted.
 *       400:
 *         description: File too large or unsupported file format.
 *       401:
 *         description: Unauthorized.
 */
router.post('/image', authenticateUser, handleUpload, productScannerController.scanImage);

module.exports = router;
