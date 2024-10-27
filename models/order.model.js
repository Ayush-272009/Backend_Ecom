const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "payment",
      required: true,
    },
  },
  { timestamps: true }
);

// Corrected line: define and export the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
