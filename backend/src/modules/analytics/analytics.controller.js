const analyticsService = require('./analytics.service');
const asyncHandler = require('../../shared/utils/async-handler');
const formatApiResponse = require('../../shared/utils/format-api-response');

const getDashboardSummary = asyncHandler(async (req, res) => {
	const summary = await analyticsService.getDashboardSummary(req.user._id);

	res.status(200).json(
		formatApiResponse({
			message: 'Dashboard analytics retrieved successfully',
			data: summary
		})
	);
});

module.exports = {
	getDashboardSummary
};
