const { Router } = require('express');

const analyticsController = require('./analytics.controller');
const authenticateUser = require('../../middlewares/authenticate-user.middleware');

const router = Router();

router.get('/', authenticateUser, analyticsController.getDashboardSummary);

module.exports = router;
