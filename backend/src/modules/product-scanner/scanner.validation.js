const SCANNER_MESSAGES = require('./scanner.messages');

const validateBarcodeBody = (body) => {
	const errors = [];
	const value = {
		barcode: typeof body.barcode === 'string' ? body.barcode.trim() : ''
	};

	if (!value.barcode) {
		errors.push({ field: 'barcode', message: SCANNER_MESSAGES.BARCODE_REQUIRED });
	} else if (value.barcode.length < 3) {
		errors.push({ field: 'barcode', message: SCANNER_MESSAGES.INVALID_BARCODE });
	}

	return { value, errors };
};

module.exports = {
	barcodeSchema: {
		body: validateBarcodeBody
	}
};
