const request = require('supertest');

const app = require('../../src/app');
const {
	clearTestDatabase,
	connectTestDatabase,
	disconnectTestDatabase
} = require('../setup/test-database');

describe('Auth API', () => {
	beforeAll(async () => {
		await connectTestDatabase();
	});

	afterEach(async () => {
		await clearTestDatabase();
	});

	afterAll(async () => {
		await disconnectTestDatabase();
	});

	describe('POST /api/v1/auth/register', () => {
		it('registers a user and does not return password', async () => {
			const response = await request(app).post('/api/v1/auth/register').send({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data.token).toBeDefined();
			expect(response.body.data.user.email).toBe('test@example.com');
			expect(response.body.data.user.password).toBeUndefined();
		});

		it('rejects duplicate email registration', async () => {
			const payload = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			};

			await request(app).post('/api/v1/auth/register').send(payload);
			const response = await request(app).post('/api/v1/auth/register').send(payload);

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.error.details[0].field).toBe('email');
		});

		it('validates email and password', async () => {
			const response = await request(app).post('/api/v1/auth/register').send({
				name: '',
				email: 'not-an-email',
				password: 'short'
			});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.error.details).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ field: 'name' }),
					expect.objectContaining({ field: 'email' }),
					expect.objectContaining({ field: 'password' })
				])
			);
		});
	});

	describe('POST /api/v1/auth/login', () => {
		it('logs in a registered user', async () => {
			await request(app).post('/api/v1/auth/register').send({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			});

			const response = await request(app).post('/api/v1/auth/login').send({
				email: 'test@example.com',
				password: 'Password123'
			});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.token).toBeDefined();
			expect(response.body.data.user.password).toBeUndefined();
		});

		it('rejects wrong password', async () => {
			await request(app).post('/api/v1/auth/register').send({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			});

			const response = await request(app).post('/api/v1/auth/login').send({
				email: 'test@example.com',
				password: 'WrongPassword123'
			});

			expect(response.status).toBe(401);
			expect(response.body.success).toBe(false);
		});
	});

	describe('GET /api/v1/auth/me', () => {
		it('returns current authenticated user', async () => {
			const registerResponse = await request(app).post('/api/v1/auth/register').send({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			});

			const response = await request(app)
				.get('/api/v1/auth/me')
				.set('Authorization', `Bearer ${registerResponse.body.data.token}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.user.email).toBe('test@example.com');
			expect(response.body.data.user.password).toBeUndefined();
		});

		it('rejects requests without token', async () => {
			const response = await request(app).get('/api/v1/auth/me');

			expect(response.status).toBe(401);
			expect(response.body.success).toBe(false);
		});
	});
});
