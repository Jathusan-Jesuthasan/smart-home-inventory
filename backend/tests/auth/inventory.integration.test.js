const request = require('supertest');

const app = require('../../src/app');
const {
	clearTestDatabase,
	connectTestDatabase,
	disconnectTestDatabase
} = require('../setup/test-database');

describe('Inventory & Analytics API', () => {
	let authToken;
	let user;

	beforeAll(async () => {
		await connectTestDatabase();
	});

	beforeEach(async () => {
		// Register a user to obtain an authentication token
		const registerResponse = await request(app).post('/api/v1/auth/register').send({
			name: 'Inventory Owner',
			email: 'owner@example.com',
			password: 'Password123'
		});
		authToken = registerResponse.body.data.token;
		user = registerResponse.body.data.user;
	});

	afterEach(async () => {
		await clearTestDatabase();
	});

	afterAll(async () => {
		await disconnectTestDatabase();
	});

	describe('Inventory CRUD Endpoints', () => {
		it('should add a new inventory item and log activity', async () => {
			const response = await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Toned Milk',
					brand: 'Daily Fresh',
					category: 'Dairy',
					quantity: 2,
					unit: 'packets',
					expiryDate: '2026-05-27',
					lowStockThreshold: 2
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.name).toBe('Toned Milk');
			expect(response.body.data.quantity).toBe(2);
		});

		it('should list user inventory items', async () => {
			// Add an item first
			await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Basmati Rice',
					category: 'Grains',
					quantity: 5,
					unit: 'bags'
				});

			const response = await request(app)
				.get('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBe(1);
			expect(response.body.data[0].name).toBe('Basmati Rice');
		});

		it('should update item quantity and log activity', async () => {
			const addResponse = await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Eggs',
					category: 'Dairy',
					quantity: 8,
					unit: 'pcs'
				});

			const itemId = addResponse.body.data.id;

			const updateResponse = await request(app)
				.patch(`/api/v1/inventory/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({ quantity: 12 });

			expect(updateResponse.status).toBe(200);
			expect(updateResponse.body.success).toBe(true);
			expect(updateResponse.body.data.quantity).toBe(12);
		});

		it('should delete an item and log activity', async () => {
			const addResponse = await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Detergent',
					category: 'Household',
					quantity: 1,
					unit: 'bottle'
				});

			const itemId = addResponse.body.data.id;

			const deleteResponse = await request(app)
				.delete(`/api/v1/inventory/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`);

			expect(deleteResponse.status).toBe(200);
			expect(deleteResponse.body.success).toBe(true);

			const listResponse = await request(app)
				.get('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`);

			expect(listResponse.body.data.length).toBe(0);
		});
	});

	describe('Dashboard Summary Endpoint', () => {
		it('should return aggregated dashboard statistics and activity list', async () => {
			// 1. Add low stock item (quantity <= lowStockThreshold)
			await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Toned Milk',
					category: 'Dairy',
					quantity: 1,
					lowStockThreshold: 2
				});

			// 2. Add expiring soon item (expiry in next 7 days)
			const expiryDate = new Date();
			expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from now
			const expiryStr = expiryDate.toISOString().split('T')[0];

			await request(app)
				.post('/api/v1/inventory')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Eggs',
					category: 'Dairy',
					quantity: 12,
					expiryDate: expiryStr
				});

			const response = await request(app)
				.get('/api/v1/dashboard')
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.totalItems).toBe(2);
			expect(response.body.data.lowStockCount).toBe(1);
			expect(response.body.data.expiringSoonCount).toBe(1);
			expect(response.body.data.recentActivity.length).toBe(2);
		});
	});
});
