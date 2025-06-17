const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "Email field cannot be empty"],
      // Don't make it unique unless one email = one transaction
    },
    refId: {
      type: String,
      required: [true, "RefId cannot be empty"],
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      default: "pending", // Optional but useful for tracking
      enum: ["pending", "successful", "failed"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
