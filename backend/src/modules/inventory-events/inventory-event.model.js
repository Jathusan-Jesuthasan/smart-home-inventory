const mongoose = require('mongoose');

const inventoryEventSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
		label: {
			type: String,
			required: true,
			trim: true
		},
		detail: {
			type: String,
			required: true,
			trim: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

inventoryEventSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		return ret;
	}
});

module.exports = mongoose.model('InventoryEvent', inventoryEventSchema);
