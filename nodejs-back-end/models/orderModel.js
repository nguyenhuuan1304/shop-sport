import mongoose from "mongoose";
import Cart from "./cartModel.js";

const order_schema = mongoose.Schema({
  total_of_price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Cart,
    required: true,
  },
});
export default mongoose.model("Order", order_schema);
