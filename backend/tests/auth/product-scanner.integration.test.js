const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = require('../../src/app');
const {
	clearTestDatabase,
	connectTestDatabase,
	disconnectTestDatabase
} = require('../setup/test-database');
const geminiService = require('../../src/modules/product-scanner/gemini.service');

// Mock Gemini Vision service so our test suite remains isolated, deterministic and offline-capable
jest.mock('../../src/modules/product-scanner/gemini.service', () => ({
	extractProductInfo: jest.fn()
}));

describe('Product Scanner API', () => {
	let authToken;

	beforeAll(async () => {
		await connectTestDatabase();
	});

	beforeEach(async () => {
		const registerResponse = await request(app).post('/api/v1/auth/register').send({
			name: 'Scanner User',
			email: 'scanner@example.com',
			password: 'Password123'
		});
		authToken = registerResponse.body.data.token;
	});

	afterEach(async () => {
		await clearTestDatabase();
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await disconnectTestDatabase();
	});

	describe('POST /api/v1/scanner/barcode', () => {
		it('should reject requests without a barcode', async () => {
			const response = await request(app)
				.post('/api/v1/scanner/barcode')
				.set('Authorization', `Bearer ${authToken}`)
				.send({});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
		});

		it('should gracefully return 404 if a barcode is not found on OpenFoodFacts', async () => {
			const originalFetch = global.fetch;
			global.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve({ status: 0 })
				})
			);

			// Query with a garbage barcode
			const response = await request(app)
				.post('/api/v1/scanner/barcode')
				.set('Authorization', `Bearer ${authToken}`)
				.send({ barcode: '999999999999999999999999' });

			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);

			global.fetch = originalFetch;
		});

		it('should return normalized product details on successful OpenFoodFacts barcode lookup', async () => {
			// Mock global fetch for the duration of this test
			const originalFetch = global.fetch;
			global.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve({
						status: 1,
						product: {
							product_name_en: 'Organic Jasmine Rice',
							brands: 'Lotus Foods'
						}
					})
				})
			);

			const response = await request(app)
				.post('/api/v1/scanner/barcode')
				.set('Authorization', `Bearer ${authToken}`)
				.send({ barcode: '737628064502' });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.productName).toBe('Organic Jasmine Rice');
			expect(response.body.data.brand).toBe('Lotus Foods');
			expect(response.body.data.confidence).toBe(1.0);

			global.fetch = originalFetch; // restore
		});
	});

	describe('POST /api/v1/scanner/image', () => {
		it('should reject requests without an image', async () => {
			const response = await request(app)
				.post('/api/v1/scanner/image')
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
		});

		it('should reject unsupported MIME types', async () => {
			const response = await request(app)
				.post('/api/v1/scanner/image')
				.set('Authorization', `Bearer ${authToken}`)
				.attach('image', Buffer.from('fake txt file contents'), 'test.txt');

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toContain('Unsupported image type');
		});

		it('should successfully upload image, run Gemini extraction, and clean up the temp file', async () => {
			// Setup mock response
			const mockProduct = {
				productName: 'Toned Milk',
				brand: 'Daily Fresh',
				expiryDate: '2026-05-30',
				price: '48',
				quantitySuggestion: 1,
				confidence: 0.92
			};
			geminiService.extractProductInfo.mockResolvedValue(mockProduct);

			// We will watch the upload directory to make sure the temp file is deleted!
			const tempUploadDir = 'uploads/';
			const filesBefore = fs.existsSync(tempUploadDir) ? fs.readdirSync(tempUploadDir) : [];

			const response = await request(app)
				.post('/api/v1/scanner/image')
				.set('Authorization', `Bearer ${authToken}`)
				.attach('image', Buffer.from('mock jpeg binary stream data here'), 'product.jpg');

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.productName).toBe('Toned Milk');
			expect(response.body.data.brand).toBe('Daily Fresh');

			// Verify temp file cleanup!
			const filesAfter = fs.existsSync(tempUploadDir) ? fs.readdirSync(tempUploadDir) : [];
			expect(filesAfter.length).toBe(filesBefore.length); // guarantees immediate cleanup of uploaded image
		});
	});
});
