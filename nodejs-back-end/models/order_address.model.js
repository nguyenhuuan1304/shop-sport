import mongoose from "mongoose";

const order_address_schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  is_default: {
    type: Boolean,
    default: false,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});
export default OrderAddress = mongoose.model("OrderAddress", user_schema);
