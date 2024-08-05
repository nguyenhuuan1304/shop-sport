import mongoose from "mongoose";

const size_list = new mongoose.Schema({
  size_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const product_schema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  images: {
    type: [String],
  },
  description: {
    type: String,
  },
  size_list: [size_list],
  sale_price: {
    type: Number,
  },
  is_hot: { type: Boolean, default: false, required: true },
  is_sale: { type: Boolean, default: false, required: true },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Create text index for text search
product_schema.index({
  name: "text",
  description: "text",
  category: "text",
  brand: "text",
});

const productModel = mongoose.model("Product", product_schema);
export default productModel;
