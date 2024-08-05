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
    type: Boolean,
    default: false,
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
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
export default mongoose.model("Order", order_schema);
