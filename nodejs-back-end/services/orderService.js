import { orderModel } from "../models/index.js";
import { userService } from "./index.js";
import { cartService } from "./index.js";

async function getOrdersByUserId(user_id) {
  try {
    const user = await userService.getUserById(user_id);
    if (!user) throw new Error("User not found");
    if (user) {
      const orders = user.orders;

      const orders_promises = orders.map(async (item) => {
        return await orderModel.findById(item);
      });
      const result = await Promise.all(orders_promises);

      //return orders with is_deleted == false
      return result.filter((item) => {
        return !item?.is_deleted;
      });
    }
  } catch (error) {
    throw error;
  }
}
async function createOrder(user_id, order) {
  try {
    const user = await userService.getUserById(user_id);
    if (user) {
      const new_order = new orderModel(order);
      await new_order.save();
      user.orders.push(new_order._id);
      await user.save();
      await cartService.clearCart(user.cart);
      return new_order;
    } else throw new Error("User not found");
  } catch (error) {
    throw error;
  }
}

export { getOrdersByUserId, createOrder };
