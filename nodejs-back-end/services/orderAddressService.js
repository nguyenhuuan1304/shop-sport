import { orderAddressModel } from "../models/index.js";
import { userService } from "./index.js";

async function addOrderAddress(user_id, order_address) {
  try {
    const user = await userService.getUserById(user_id);
    if (user) {
      const new_order_address = new orderAddressModel(order_address);
      await new_order_address.save();
      user.order_addresses.push(new_order_address._id);
      await user.save();
      return new_order_address;
    } else throw new Error("User not found");
  } catch (error) {
    throw error;
  }
}

async function deleteOrderAddress(user_id, order_address_id) {
  try {
    const user = await userService.getUserById(user_id);
    if (!user) throw new Error("User not found");

    user.order_addresses.filter((item) => item.toString() !== order_address_id);
    await user.save();

    const order_address = await orderAddressModel.findById(order_address_id);
    if (order_address) order_address.is_deleted = true;
    await order_address.save();
    return order_address;
  } catch (error) {
    throw error;
  }
}

async function updateOrderAddress(order_address_id, order_address) {
  try {
    const update_order_address = await orderAddressModel.findByIdAndUpdate(
      order_address_id,
      order_address
    );
    return update_order_address;
  } catch (error) {
    throw error;
  }
}
async function getOrderAddressByUserId(user_id) {
  try {
    const user = await userService.getUserById(user_id);
    if (!user) throw new Error("User not found");
    if (user) {
      const order_addresses = user.order_addresses;

      const order_address_promises = order_addresses.map(async (item) => {
        return await orderAddressModel.findById(item);
      });
      const result = await Promise.all(order_address_promises);

      //return order_address with is_deleted == false
      return result.filter((item) => {
        return !item?.is_deleted;
      });
    }
  } catch (error) {
    throw error;
  }
}

export {
  getOrderAddressByUserId,
  addOrderAddress,
  deleteOrderAddress,
  updateOrderAddress,
};
