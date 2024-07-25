import mongoose, { SchemaType } from "mongoose";
import Cart from "./cartModel.js";
import Order from "./orderModel.js";
import OrderAddress from "./order_addressModel.js";

const user_schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number_phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Cart,
    required: true,
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Order,
  },
  order_addresses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: OrderAddress,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});
export default mongoose.model("User", user_schema);
