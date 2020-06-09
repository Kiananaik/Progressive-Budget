const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name of transaction"
    },
    value: {
      type: Number,
      required: "Amount?"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;