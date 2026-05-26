const { Router } = require('express');

const inventoryController = require('./inventory.controller');
const { createItemSchema, updateQuantitySchema } = require('./inventory.validation');
const authenticateUser = require('../../middlewares/authenticate-user.middleware');
const validateRequest = require('../../middlewares/validate-request.middleware');

const router = Router();

/**
 * @openapi
 * /inventory:
 *   get:
 *     summary: List Inventory Items
 *     description: Retrieve all inventory items belonging to the currently authenticated user.
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of inventory items.
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
 *                   example: Inventory retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: milk-1
 *                       name:
 *                         type: string
 *                         example: Toned Milk
 *                       brand:
 *                         type: string
 *                         example: Daily Fresh
 *                       category:
 *                         type: string
 *                         example: Dairy
 *                       quantity:
 *                         type: number
 *                         example: 2
 *                       unit:
 *                         type: string
 *                         example: packets
 *                       expiryDate:
 *                         type: string
 *                         example: "2026-05-27"
 *                       lowStockThreshold:
 *                         type: number
 *                         example: 2
 *                       lastUpdatedAt:
 *                         type: string
 *                         example: "2026-05-26T19:00:00.000Z"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/', authenticateUser, inventoryController.getItems);

/**
 * @openapi
 * /inventory:
 *   post:
 *     summary: Add Inventory Item
 *     description: Create and add a new item to the user's inventory list. Logs an event activity.
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - quantity
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toned Milk
 *               brand:
 *                 type: string
 *                 example: Daily Fresh
 *               category:
 *                 type: string
 *                 enum: [Dairy, Grains, Produce, Snacks, Beverages, Household]
 *                 example: Dairy
 *               quantity:
 *                 type: number
 *                 example: 2
 *               unit:
 *                 type: string
 *                 example: packets
 *               expiryDate:
 *                 type: string
 *                 example: "2026-05-27"
 *               imageUrl:
 *                 type: string
 *                 example: "http://example.com/milk.jpg"
 *               lowStockThreshold:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authenticateUser, validateRequest(createItemSchema), inventoryController.addItem);

/**
 * @openapi
 * /inventory/{id}:
 *   patch:
 *     summary: Update Quantity
 *     description: Update the quantity of a specific inventory item. Logs an event activity.
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Item quantity updated successfully.
 *       400:
 *         description: Validation failed or negative quantity.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Inventory item not found.
 */
router.patch('/:id', authenticateUser, validateRequest(updateQuantitySchema), inventoryController.updateQuantity);

/**
 * @openapi
 * /inventory/{id}:
 *   delete:
 *     summary: Delete Inventory Item
 *     description: Remove a specific item from the user's inventory list. Logs an event activity.
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     responses:
 *       200:
 *         description: Item removed from inventory successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Inventory item not found.
 */
router.delete('/:id', authenticateUser, inventoryController.removeItem);

module.exports = router;
