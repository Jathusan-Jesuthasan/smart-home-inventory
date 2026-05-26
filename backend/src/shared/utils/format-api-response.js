const formatApiResponse = ({ success = true, message = '', data = null, error = null }) => ({
	success,
	message,
	data,
	error
});

module.exports = formatApiResponse;
