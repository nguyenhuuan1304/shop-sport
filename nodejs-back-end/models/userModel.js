import mongoose, { SchemaType } from "mongoose";
import Cart from "./cartModel";
import Order from "./order.model";
import OrderAddress from "./order_address.model";

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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
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
export default User = mongoose.model("User", user_schema);
