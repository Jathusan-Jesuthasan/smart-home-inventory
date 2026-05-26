const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../shared/errors/unauthorized.error');
const asyncHandler = require('../shared/utils/async-handler');
const authRepository = require('../modules/auth/auth.repository');
const { AUTH_TOKEN_TYPES } = require('../modules/auth/auth.constants');
const AUTH_MESSAGES = require('../modules/auth/auth.messages');

const getTokenFromHeader = (authorizationHeader = '') => {
	const [type, token] = authorizationHeader.split(' ');
	return type === AUTH_TOKEN_TYPES.BEARER ? token : null;
};

const authenticateUser = asyncHandler(async (req, _res, next) => {
	const token = getTokenFromHeader(req.headers.authorization);

	if (!token) {
		throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_REQUIRED);
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await authRepository.findAuthUserById(decoded.userId);

		if (!user) {
			throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
		}

		req.user = user;
		return next();
	} catch (error) {
		if (error.isOperational) {
			throw error;
		}

		throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID);
	}
});

module.exports = authenticateUser;
