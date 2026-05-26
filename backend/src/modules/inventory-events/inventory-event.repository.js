const InventoryEvent = require('./inventory-event.model');

const createEvent = async (eventData) => {
	return InventoryEvent.create(eventData);
};

const findEventsByUserId = async (userId, limit = 10) => {
	return InventoryEvent.find({ userId })
		.sort({ createdAt: -1 })
		.limit(limit)
		.lean();
};

module.exports = {
	createEvent,
	findEventsByUserId
};
