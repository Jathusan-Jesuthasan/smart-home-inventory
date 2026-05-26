const AppError = require('./app-error');

class BadRequestError extends AppError {
	constructor(message = 'Bad request', details = null) {
		super(message, 400, details);
	}
}

module.exports = BadRequestError;
