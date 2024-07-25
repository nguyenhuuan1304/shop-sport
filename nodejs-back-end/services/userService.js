import User from "../models/userModel.js";
import { cartService } from "./index.js";

async function getUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw error;
  }
}
async function getUserById(user_id) {
  try {
    const user = await User.findById(user_id).populate("cart");
    return user;
  } catch (error) {
    throw error;
  }
}
async function addUser(user) {
  try {
    const new_user = new User(user);
    new_user.cart = await cartService.addCart();
    await new_user.save();
    return new_user;
  } catch (error) {
    throw error;
  }
}
async function deleteUser(user_id) {
  try {
    const user = await User.findById(user_id);
    if (user) user.is_deleted = true;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}
async function updateUser(user_id, user) {
  try {
    copyUser = { ...user };
    delete copyUser.password;
    delete copyUser.role;
    delete copyUser.orders;
    delete copyUser.order_addresses;
    delete copyUser.is_deleted;
    delete copyUser.cart;
    delete copyUser.__v;

    const updated_user = await User.findByIdAndUpdate(user_id, copyUser);
    return updated_user;
  } catch (error) {
    throw error;
  }
}

export { getUsers, getUserById, addUser, deleteUser, updateUser };