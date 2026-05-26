const SCANNER_CONSTANTS = require('./scanner.constants');

/**
 * Perform a lightweight product lookup via the OpenFoodFacts API.
 * @param {string} barcode
 * @returns {Promise<object|null>} The mapped product info or null if not found.
 */
const lookupBarcode = async (barcode) => {
	try {
		const response = await fetch(`${SCANNER_CONSTANTS.OPEN_FOOD_FACTS_API_URL}/${barcode}.json`, {
			headers: { 'User-Agent': 'SmartHomeInventory - NodeBackend - Version 1.0' }
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		if (data.status !== 1 || !data.product) {
			return null;
		}

		const prod = data.product;

		// Map and normalize to our standard interface to decouple external API formats
		return {
			productName: prod.product_name_en || prod.product_name || 'Unknown Product',
			brand: prod.brands ? prod.brands.split(',')[0].trim() : '',
			expiryDate: '',
			price: '',
			quantitySuggestion: 1,
			confidence: 1.0
		};
	} catch (error) {
		console.error('Barcode service lookup failed:', error.message);
		return null;
	}
};

module.exports = {
	lookupBarcode
};
