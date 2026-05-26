const { Router } = require('express');

const inventoryController = require('./inventory.controller');
const { createItemSchema, updateQuantitySchema } = require('./inventory.validation');
const authenticateUser = require('../../middlewares/authenticate-user.middleware');
const validateRequest = require('../../middlewares/validate-request.middleware');

const router = Router();

router.get('/', authenticateUser, inventoryController.getItems);
router.post('/', authenticateUser, validateRequest(createItemSchema), inventoryController.addItem);
router.patch('/:id', authenticateUser, validateRequest(updateQuantitySchema), inventoryController.updateQuantity);
router.delete('/:id', authenticateUser, inventoryController.removeItem);

module.exports = router;
