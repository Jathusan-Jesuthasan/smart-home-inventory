const authService = require('./auth.service');
const AUTH_MESSAGES = require('./auth.messages');
const asyncHandler = require('../../shared/utils/async-handler');
const formatApiResponse = require('../../shared/utils/format-api-response');

const register = asyncHandler(async (req, res) => {
	const data = await authService.register(req.body);

	res.status(201).json(
		formatApiResponse({
			message: AUTH_MESSAGES.REGISTER_SUCCESS,
			data
		})
	);
});

const login = asyncHandler(async (req, res) => {
	const data = await authService.login(req.body);

	res.status(200).json(
		formatApiResponse({
			message: AUTH_MESSAGES.LOGIN_SUCCESS,
			data
		})
	);
});

const getMe = asyncHandler(async (req, res) => {
	const user = await authService.getCurrentUser(req.user._id);

	res.status(200).json(
		formatApiResponse({
			message: AUTH_MESSAGES.ME_SUCCESS,
			data: { user }
		})
	);
});

module.exports = {
	register,
	login,
	getMe
};
