const { Router } = require('express');

const { healthCheck } = require('./health.controller');

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health Check Status
 *     description: Returns the health status of the application API, database connection status, and basic system uptime metrics.
 *     tags:
 *       - Diagnostics
 *     responses:
 *       200:
 *         description: Application is healthy.
 */
router.get('/', healthCheck);

module.exports = router;
