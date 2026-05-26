const { Router } = require('express');

const analyticsController = require('./analytics.controller');
const authenticateUser = require('../../middlewares/authenticate-user.middleware');

const router = Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get Dashboard Analytics
 *     description: Retrieve aggregated inventory statistics (total items, low stock counts, expiring items) and the most recent logged activity events.
 *     tags:
 *       - Analytics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and recent activity history.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard analytics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: number
 *                       example: 4
 *                     lowStockCount:
 *                       type: number
 *                       example: 2
 *                     expiringSoonCount:
 *                       type: number
 *                       example: 1
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "a1"
 *                           label:
 *                             type: string
 *                             example: "Milk added"
 *                           detail:
 *                             type: string
 *                             example: "2 packets saved from scanner"
 *                           createdAt:
 *                             type: string
 *                             example: "2026-05-26T19:00:00.000Z"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/', authenticateUser, analyticsController.getDashboardSummary);

module.exports = router;
