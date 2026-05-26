const { PASSWORD_MIN_LENGTH } = require('./auth.constants');
const AUTH_MESSAGES = require('./auth.messages');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const validateRegisterBody = (body) => {
	const errors = [];
	const value = {
		name: String(body.name || '').trim(),
		email: normalizeEmail(body.email),
		password: body.password
	};

	if (!value.name) {
		errors.push({ field: 'name', message: AUTH_MESSAGES.NAME_REQUIRED });
	}

	if (!value.email) {
		errors.push({ field: 'email', message: AUTH_MESSAGES.EMAIL_REQUIRED });
	} else if (!emailRegex.test(value.email)) {
		errors.push({ field: 'email', message: AUTH_MESSAGES.EMAIL_INVALID });
	}

	if (!value.password) {
		errors.push({ field: 'password', message: AUTH_MESSAGES.PASSWORD_REQUIRED });
	} else if (String(value.password).length < PASSWORD_MIN_LENGTH) {
		errors.push({ field: 'password', message: AUTH_MESSAGES.PASSWORD_TOO_SHORT });
	}

	return { value, errors };
};

const validateLoginBody = (body) => {
	const errors = [];
	const value = {
		email: normalizeEmail(body.email),
		password: body.password
	};

	if (!value.email) {
		errors.push({ field: 'email', message: AUTH_MESSAGES.EMAIL_REQUIRED });
	} else if (!emailRegex.test(value.email)) {
		errors.push({ field: 'email', message: AUTH_MESSAGES.EMAIL_INVALID });
	}

	if (!value.password) {
		errors.push({ field: 'password', message: AUTH_MESSAGES.PASSWORD_REQUIRED });
	}

	return { value, errors };
};

module.exports = {
	registerSchema: {
		body: validateRegisterBody
	},
	loginSchema: {
		body: validateLoginBody
	}
};
