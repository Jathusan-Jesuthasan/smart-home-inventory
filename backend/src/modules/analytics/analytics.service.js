const inventoryRepository = require('../inventory/inventory.repository');
const inventoryEventRepository = require('../inventory-events/inventory-event.repository');

const getDashboardSummary = async (userId) => {
	const items = await inventoryRepository.findItemsByUserId(userId);
	const recentActivity = await inventoryEventRepository.findEventsByUserId(userId, 10);

	const now = new Date();
	const lowStockCount = items.filter((item) => item.quantity <= item.lowStockThreshold).length;

	const expiringSoonCount = items.filter((item) => {
		if (!item.expiryDate) {
			return false;
		}
		const expiry = new Date(item.expiryDate);
		if (isNaN(expiry.getTime())) {
			return false;
		}
		const diffTime = expiry.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		// Expiring within the next 7 days (or already expired but not processed yet)
		return diffDays <= 7;
	}).length;

	return {
		totalItems: items.length,
		lowStockCount,
		expiringSoonCount,
		recentActivity
	};
};

module.exports = {
	getDashboardSummary
};
