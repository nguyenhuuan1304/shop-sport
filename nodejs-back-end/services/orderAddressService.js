import { orderAddressModel } from "../models/index.js";
import { userService } from "./index.js";

async function addOrderAddress(user_id, order_address) {
  try {
    const user = await userService.getUserById(user_id);
    if (user) {
      const new_order_address = new orderAddressModel(order_address);
      //set is_default = true for the first order address
      if (user.order_addresses.length == 0) {
        new_order_address.is_default = true;
      }
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

async function setDefaultOrderAddress(user_id, order_address_id) {
  try {
    // get order_address list by user id
    const order_addresses = await getOrderAddressByUserId(user_id);
    //check order_address_id
    const order_address = await orderAddressModel.findById(order_address_id);
    if (!order_address) throw new Error("Order Address not found!");
    const updates = order_addresses.map(async (address) => {
      if (address?._id.toString() === order_address_id) {
        if (address.is_default === false) {
          address.is_default = true;
        }
      } else {
        address.is_default = false;
      }
      return await address.save();
    });
    await Promise.all(updates);
    return order_address_id;
  } catch (error) {
    throw error;
  }
}

export {
  getOrderAddressByUserId,
  addOrderAddress,
  deleteOrderAddress,
  updateOrderAddress,
  setDefaultOrderAddress,
};
