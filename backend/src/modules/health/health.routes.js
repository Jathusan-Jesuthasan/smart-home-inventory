const { Router } = require('express');

const { healthCheck } = require('./health.controller');

const router = Router();

router.get('/', healthCheck);

module.exports = router;
