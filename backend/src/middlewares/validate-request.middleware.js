const BadRequestError = require('../shared/errors/bad-request.error');

const validateRequest = (schema) => (req, _res, next) => {
	const validationErrors = [];

	for (const location of ['body', 'params', 'query']) {
		if (!schema[location]) {
			continue;
		}

		const { value, errors } = schema[location](req[location] || {});

		if (errors.length) {
			validationErrors.push(...errors);
		}

		req[location] = value;
	}

	if (validationErrors.length) {
		return next(new BadRequestError('Validation failed', validationErrors));
	}

	return next();
};

module.exports = validateRequest;
