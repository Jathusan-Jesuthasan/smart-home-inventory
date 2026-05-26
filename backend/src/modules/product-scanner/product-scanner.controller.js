const productScannerService = require('./product-scanner.service');
const asyncHandler = require('../../shared/utils/async-handler');
const formatApiResponse = require('../../shared/utils/format-api-response');
const SCANNER_MESSAGES = require('./scanner.messages');

const scanBarcode = asyncHandler(async (req, res) => {
	const data = await productScannerService.scanBarcode(req.body.barcode);

	res.status(200).json(
		formatApiResponse({
			message: SCANNER_MESSAGES.SCAN_SUCCESS,
			data
		})
	);
});

const scanImage = asyncHandler(async (req, res) => {
	const data = await productScannerService.scanImage(req.file);

	res.status(200).json(
		formatApiResponse({
			message: SCANNER_MESSAGES.SCAN_SUCCESS,
			data
		})
	);
});

module.exports = {
	scanBarcode,
	scanImage
};
