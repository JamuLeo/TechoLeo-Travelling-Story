const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
	mobile: {
		type: String,
		required: true,
	},
	operator: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	tx_ref: {
		type: String,
		default: null,  // Optional field
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
