const fs = require('fs');
const genAI = require('../../config/gemini.config');

/**
 * Encodes a local file to a generative-ai compatible part.
 * @param {string} path
 * @param {string} mimeType
 * @returns {object}
 */
const fileToGenerativePart = (path, mimeType) => {
	return {
		inlineData: {
			data: Buffer.from(fs.readFileSync(path)).toString('base64'),
			mimeType
		}
	};
};

/**
 * Invoke Gemini 1.5 Flash Vision to extract structured product information.
 * @param {string} filePath Temporary local image path
 * @param {string} mimeType File MIME type
 * @returns {Promise<object|null>} Mapped product object or null if extraction fails
 */
const extractProductInfo = async (filePath, mimeType) => {
	if (!process.env.GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY is missing from environment configuration');
	}

	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const imagePart = fileToGenerativePart(filePath, mimeType);

		const prompt = `
			You are an automated scanner. Analyze this product image carefully.
			Extract the key product information and return ONLY a valid, raw JSON object.
			Do not include any conversational text, markdown formatting, or markdown code blocks (e.g. do not write \`\`\`json ... \`\`\`).
			
			The JSON object must match this schema:
			{
			  "productName": "precise name of the product",
			  "brand": "brand name or empty string if not visible",
			  "expiryDate": "expiry date in YYYY-MM-DD format if visible, otherwise empty string",
			  "price": "price value as string if visible, otherwise empty string",
			  "quantitySuggestion": 1,
			  "confidence": 0.85
			}
		`;

		const result = await model.generateContent([prompt, imagePart]);
		const response = await result.response;
		const text = response.text();

		// Defensive parser: clean any markdown backticks wrapper if the model ignored instructions
		let cleanedText = text.trim();
		if (cleanedText.startsWith('```')) {
			cleanedText = cleanedText.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
		}

		const parsed = JSON.parse(cleanedText);

		// Guarantee default structure and fallback fields
		return {
			productName: typeof parsed.productName === 'string' && parsed.productName ? parsed.productName : 'AI Extracted Product',
			brand: typeof parsed.brand === 'string' ? parsed.brand : '',
			expiryDate: typeof parsed.expiryDate === 'string' ? parsed.expiryDate : '',
			price: typeof parsed.price === 'string' ? parsed.price : '',
			quantitySuggestion: typeof parsed.quantitySuggestion === 'number' ? parsed.quantitySuggestion : 1,
			confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8
		};
	} catch (error) {
		console.error('Gemini vision extraction failed:', error.message);
		return null;
	}
};

module.exports = {
	extractProductInfo
};
