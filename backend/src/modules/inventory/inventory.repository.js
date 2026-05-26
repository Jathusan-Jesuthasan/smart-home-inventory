const InventoryItem = require('./inventory.model');

const createItem = async (itemData) => {
	return InventoryItem.create(itemData);
};

const findItemsByUserId = async (userId) => {
	return InventoryItem.find({ userId }).sort({ updatedAt: -1 });
};

const findItemByIdAndUserId = async (itemId, userId) => {
	return InventoryItem.findOne({ _id: itemId, userId });
};

const updateItem = async (itemId, userId, updateData) => {
	return InventoryItem.findOneAndUpdate(
		{ _id: itemId, userId },
		{ $set: updateData },
		{ returnDocument: 'after' }
	);
};

const deleteItem = async (itemId, userId) => {
	return InventoryItem.findOneAndDelete({ _id: itemId, userId });
};

module.exports = {
	createItem,
	findItemsByUserId,
	findItemByIdAndUserId,
	updateItem,
	deleteItem
};
