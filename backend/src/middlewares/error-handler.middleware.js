const formatApiResponse = require('../shared/utils/format-api-response');

const errorHandler = (error, _req, res, _next) => {
	const isDuplicateKeyError = error.code === 11000;
	const statusCode = isDuplicateKeyError ? 400 : error.statusCode || 500;
	const isProduction = process.env.NODE_ENV === 'production';
	const message = isDuplicateKeyError ? 'Duplicate resource value' : error.message || 'Internal server error';

	const response = formatApiResponse({
		success: false,
		message,
		data: null,
		error: {
			details: error.details || null,
			stack: isProduction ? undefined : error.stack
		}
	});

	res.status(statusCode).json(response);
};

module.exports = errorHandler;
