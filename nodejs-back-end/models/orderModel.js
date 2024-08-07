import mongoose from "mongoose";
import Cart from "./cartModel.js";

const order_schema = mongoose.Schema({
  total_of_price: {
    type: Number,
    required: true,
  },
  number_phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "shipping", "paid", "canceled"],
    required: true,
  },
  cart: {
    type: {},
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  order_address: {
    type: String,
  },
  notes: {
    type: String,
    default: "",
  },
  payment_url: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expires_at: {
    type: Date,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});
export default mongoose.model("Order", order_schema);
