const inventoryRepository = require('./inventory.repository');
const inventoryEventRepository = require('../inventory-events/inventory-event.repository');
const NotFoundError = require('../../shared/errors/not-found.error');

const getItems = async (userId) => {
	return inventoryRepository.findItemsByUserId(userId);
};

const addItem = async (userId, itemData) => {
	const item = await inventoryRepository.createItem({
		...itemData,
		userId
	});

	// Log activity
	const brandStr = item.brand ? ` of ${item.brand}` : '';
	await inventoryEventRepository.createEvent({
		userId,
		label: `${item.name} added`,
		detail: `${item.quantity} ${item.unit}${brandStr} saved to inventory`
	});

	return item;
};

const updateQuantity = async (itemId, userId, quantity) => {
	const item = await inventoryRepository.findItemByIdAndUserId(itemId, userId);

	if (!item) {
		throw new NotFoundError('Inventory item not found');
	}

	const updatedItem = await inventoryRepository.updateItem(itemId, userId, {
		quantity,
		lastUpdatedAt: new Date().toISOString()
	});

	// Log activity
	await inventoryEventRepository.createEvent({
		userId,
		label: `${item.name} updated`,
		detail: `Quantity changed to ${quantity} ${item.unit}`
	});

	return updatedItem;
};

const removeItem = async (itemId, userId) => {
	const item = await inventoryRepository.findItemByIdAndUserId(itemId, userId);

	if (!item) {
		throw new NotFoundError('Inventory item not found');
	}

	await inventoryRepository.deleteItem(itemId, userId);

	// Log activity
	await inventoryEventRepository.createEvent({
		userId,
		label: `${item.name} removed`,
		detail: 'Removed from inventory'
	});
};

module.exports = {
	getItems,
	addItem,
	updateQuantity,
	removeItem
};
