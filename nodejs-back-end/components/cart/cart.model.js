import mongoose, { Schema } from "mongoose";
import Product from "../../models/productModel.js";
export const items = Schema({
  size: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const cart_schema = Schema({
  total_of_product: {
    type: Number,
    default: 0,
    required: true,
  },
  total_of_price: {
    type: Number,
    default: 0,
    required: true,
  },
  items: {
    type: [items],
    default: [],
    required: true,
  },
});

export default mongoose.model("Cart", cart_schema);
