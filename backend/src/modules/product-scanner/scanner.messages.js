const SCANNER_MESSAGES = {
	BARCODE_REQUIRED: 'Barcode is required',
	INVALID_BARCODE: 'Invalid barcode format',
	PRODUCT_NOT_FOUND: 'Product not found for the provided barcode',
	IMAGE_REQUIRED: 'Image file is required',
	UNSUPPORTED_IMAGE_TYPE: 'Unsupported image type. Supported formats are JPEG, PNG, and WEBP',
	FILE_TOO_LARGE: 'File size exceeds the 5MB limit',
	SCAN_SUCCESS: 'Product details successfully scanned and extracted',
	SCAN_FAILED: 'Failed to extract product details from scanned image',
	AI_EXTRACTION_FAILED: 'AI processing failed to extract valid structured details'
};

module.exports = SCANNER_MESSAGES;
