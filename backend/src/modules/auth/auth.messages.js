const AUTH_MESSAGES = {
	REGISTER_SUCCESS: 'User registered successfully',
	LOGIN_SUCCESS: 'User logged in successfully',
	ME_SUCCESS: 'Authenticated user fetched successfully',
	EMAIL_REQUIRED: 'Email is required',
	EMAIL_INVALID: 'Email must be a valid email address',
	NAME_REQUIRED: 'Name is required',
	PASSWORD_REQUIRED: 'Password is required',
	PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
	EMAIL_ALREADY_EXISTS: 'A user with this email already exists',
	INVALID_CREDENTIALS: 'Invalid email or password',
	TOKEN_REQUIRED: 'Authentication token is required',
	TOKEN_INVALID: 'Authentication token is invalid or expired',
	USER_NOT_FOUND: 'Authenticated user no longer exists'
};

module.exports = AUTH_MESSAGES;
