const CATEGORIES = ['Dairy', 'Grains', 'Produce', 'Snacks', 'Beverages', 'Household'];

const validateCreateItemBody = (body) => {
	const errors = [];
	const value = {
		name: typeof body.name === 'string' ? body.name.trim() : '',
		brand: typeof body.brand === 'string' ? body.brand.trim() : undefined,
		category: typeof body.category === 'string' ? body.category.trim() : '',
		quantity: typeof body.quantity === 'number' ? body.quantity : 0,
		unit: typeof body.unit === 'string' ? body.unit.trim() : 'pcs',
		expiryDate: typeof body.expiryDate === 'string' ? body.expiryDate.trim() : undefined,
		imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
		lowStockThreshold: typeof body.lowStockThreshold === 'number' ? body.lowStockThreshold : 1
	};

	if (!value.name) {
		errors.push({ field: 'name', message: 'Product name is required' });
	}

	if (!value.category) {
		errors.push({ field: 'category', message: 'Category is required' });
	} else if (!CATEGORIES.includes(value.category)) {
		errors.push({ field: 'category', message: `Invalid category. Must be one of: ${CATEGORIES.join(', ')}` });
	}

	if (value.quantity < 0) {
		errors.push({ field: 'quantity', message: 'Quantity cannot be negative' });
	}

	if (value.lowStockThreshold < 0) {
		errors.push({ field: 'lowStockThreshold', message: 'Low stock threshold cannot be negative' });
	}

	return { value, errors };
};

const validateUpdateQuantityBody = (body) => {
	const errors = [];
	const value = {
		quantity: typeof body.quantity === 'number' ? body.quantity : undefined
	};

	if (value.quantity === undefined) {
		errors.push({ field: 'quantity', message: 'Quantity is required' });
	} else if (value.quantity < 0) {
		errors.push({ field: 'quantity', message: 'Quantity cannot be negative' });
	}

	return { value, errors };
};

module.exports = {
	createItemSchema: {
		body: validateCreateItemBody
	},
	updateQuantitySchema: {
		body: validateUpdateQuantityBody
	}
};
