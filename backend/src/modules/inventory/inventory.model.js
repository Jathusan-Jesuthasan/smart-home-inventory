const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		brand: {
			type: String,
			trim: true
		},
		category: {
			type: String,
			required: true,
			enum: ['Dairy', 'Grains', 'Produce', 'Snacks', 'Beverages', 'Household']
		},
		quantity: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		},
		unit: {
			type: String,
			required: true,
			trim: true,
			default: 'pcs'
		},
		expiryDate: {
			type: String,
			trim: true
		},
		imageUrl: {
			type: String,
			trim: true
		},
		lowStockThreshold: {
			type: Number,
			required: true,
			default: 1,
			min: 0
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

// Map _id to id in JSON response to match frontend types
inventoryItemSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		return ret;
	}
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
