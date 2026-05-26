const BadRequestError = require('../../shared/errors/bad-request.error');
const UnauthorizedError = require('../../shared/errors/unauthorized.error');
const comparePassword = require('../../shared/utils/compare-password');
const generateJwtToken = require('../../shared/utils/generate-jwt-token');
const hashPassword = require('../../shared/utils/hash-password');
const authRepository = require('./auth.repository');
const AUTH_MESSAGES = require('./auth.messages');

const sanitizeUser = (user) => {
	const sanitized = user.toObject ? user.toObject() : { ...user };
	delete sanitized.password;
	return sanitized;
};

const buildAuthPayload = (user) => ({
	user: sanitizeUser(user),
	token: generateJwtToken({ userId: user._id.toString(), role: user.role })
});

const register = async ({ name, email, password }) => {
	const existingUser = await authRepository.findAuthUserByEmail(email);

	if (existingUser) {
		throw new BadRequestError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, [
			{ field: 'email', message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS }
		]);
	}

	const hashedPassword = await hashPassword(password);
	const user = await authRepository.createAuthUser({
		name,
		email,
		password: hashedPassword
	});

	return buildAuthPayload(user);
};

const login = async ({ email, password }) => {
	const user = await authRepository.findAuthUserByEmailWithPassword(email);

	if (!user) {
		throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
	}

	const passwordMatches = await comparePassword(password, user.password);

	if (!passwordMatches) {
		throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
	}

	return buildAuthPayload(user);
};

const getCurrentUser = async (userId) => {
	const user = await authRepository.findAuthUserById(userId);

	if (!user) {
		throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
	}

	return sanitizeUser(user);
};

module.exports = {
	register,
	login,
	getCurrentUser,
	sanitizeUser
};
