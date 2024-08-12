import userModel from "./user.model.js";
import { addCart } from "../cart/cart.service.js";
import bcrypt from "bcryptjs";

async function getUsers() {
  try {
    const users = await userModel.find({ is_deleted: false });
    return users;
  } catch (error) {
    throw error;
  }
}
async function getUserById(user_id) {
  try {
    const user = await userModel.findById(user_id);
    return user;
  } catch (error) {
    throw error;
  }
}
async function addUser(user) {
  try {
    const new_user = new userModel(user);
    new_user.cart = await addCart();
    await new_user.save();
    return new_user;
  } catch (error) {
    throw error;
  }
}
async function deleteUser(user_id) {
  try {
    const user = await userModel.findById(user_id);
    if (user) user.is_deleted = true;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}
async function updateUser(user_id, user) {
  try {
    user.updated_at = Date.now();
    const copyUser = { ...user };
    delete copyUser.password;
    delete copyUser.role;
    delete copyUser.orders;
    delete copyUser.order_addresses;
    delete copyUser.is_deleted;
    delete copyUser.cart;
    delete copyUser.__v;

    const updated_user = await userModel.findByIdAndUpdate(user_id, copyUser, {
      new: true,
    });
    return updated_user;
  } catch (error) {
    throw error;
  }
}

export { getUsers, getUserById, addUser, deleteUser, updateUser };
