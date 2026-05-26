const inventoryService = require('./inventory.service');
const asyncHandler = require('../../shared/utils/async-handler');
const formatApiResponse = require('../../shared/utils/format-api-response');

const getItems = asyncHandler(async (req, res) => {
	const items = await inventoryService.getItems(req.user._id);

	res.status(200).json(
		formatApiResponse({
			message: 'Inventory retrieved successfully',
			data: items
		})
	);
});

const addItem = asyncHandler(async (req, res) => {
	const item = await inventoryService.addItem(req.user._id, req.body);

	res.status(201).json(
		formatApiResponse({
			message: 'Item added to inventory successfully',
			data: item
		})
	);
});

const updateQuantity = asyncHandler(async (req, res) => {
	const item = await inventoryService.updateQuantity(req.params.id, req.user._id, req.body.quantity);

	res.status(200).json(
		formatApiResponse({
			message: 'Item quantity updated successfully',
			data: item
		})
	);
});

const removeItem = asyncHandler(async (req, res) => {
	await inventoryService.removeItem(req.params.id, req.user._id);

	res.status(200).json(
		formatApiResponse({
			message: 'Item removed from inventory successfully',
			data: null
		})
	);
});

module.exports = {
	getItems,
	addItem,
	updateQuantity,
	removeItem
};
