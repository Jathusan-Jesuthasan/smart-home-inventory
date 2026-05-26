process.env.JWT_SECRET = 'unit-test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4';

jest.mock('../../src/modules/auth/auth.repository');
jest.mock('../../src/shared/utils/hash-password');
jest.mock('../../src/shared/utils/compare-password');
jest.mock('../../src/shared/utils/generate-jwt-token');

const authRepository = require('../../src/modules/auth/auth.repository');
const authService = require('../../src/modules/auth/auth.service');
const comparePassword = require('../../src/shared/utils/compare-password');
const generateJwtToken = require('../../src/shared/utils/generate-jwt-token');
const hashPassword = require('../../src/shared/utils/hash-password');
const BadRequestError = require('../../src/shared/errors/bad-request.error');
const UnauthorizedError = require('../../src/shared/errors/unauthorized.error');

describe('authService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		generateJwtToken.mockReturnValue('signed-token');
	});

	describe('register', () => {
		it('creates a user with a hashed password and returns auth payload', async () => {
			authRepository.findAuthUserByEmail.mockResolvedValue(null);
			hashPassword.mockResolvedValue('hashed-password');
			authRepository.createAuthUser.mockResolvedValue({
				_id: 'user-id',
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'user'
			});

			const result = await authService.register({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123'
			});

			expect(hashPassword).toHaveBeenCalledWith('Password123');
			expect(authRepository.createAuthUser).toHaveBeenCalledWith({
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashed-password'
			});
			expect(result.token).toBe('signed-token');
			expect(result.user.password).toBeUndefined();
		});

		it('throws when email already exists', async () => {
			authRepository.findAuthUserByEmail.mockResolvedValue({ _id: 'existing-user-id' });

			await expect(
				authService.register({
					name: 'Test User',
					email: 'test@example.com',
					password: 'Password123'
				})
			).rejects.toBeInstanceOf(BadRequestError);
		});
	});

	describe('login', () => {
		it('returns auth payload for valid credentials', async () => {
			authRepository.findAuthUserByEmailWithPassword.mockResolvedValue({
				_id: 'user-id',
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'user'
			});
			comparePassword.mockResolvedValue(true);

			const result = await authService.login({
				email: 'test@example.com',
				password: 'Password123'
			});

			expect(comparePassword).toHaveBeenCalledWith('Password123', 'hashed-password');
			expect(result.token).toBe('signed-token');
			expect(result.user.password).toBeUndefined();
		});

		it('throws for invalid credentials', async () => {
			authRepository.findAuthUserByEmailWithPassword.mockResolvedValue(null);

			await expect(
				authService.login({
					email: 'test@example.com',
					password: 'Password123'
				})
			).rejects.toBeInstanceOf(UnauthorizedError);
		});
	});
});
