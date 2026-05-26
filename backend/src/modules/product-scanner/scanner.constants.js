const SCANNER_CONSTANTS = {
	SUPPORTED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
	MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB limit
	OPEN_FOOD_FACTS_API_URL: 'https://world.openfoodfacts.org/api/v2/product',
	TEMP_UPLOAD_DIR: 'uploads/'
};

module.exports = SCANNER_CONSTANTS;
