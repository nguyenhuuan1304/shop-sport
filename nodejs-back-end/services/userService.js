import User from "../models/userModel.js";
import { addCart } from "./cartService.js";

async function getUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw error;
  }
}
async function getUsersById(user_id) {
  try {
    const user = await User.findById(user_id);
    return user;
  } catch (error) {
    throw error;
  }
}
async function addUser(user) {
  try {
    const new_user = new User(user);
    new_user.cart = await addCart();
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
    const updated_user = await User.findByIdAndUpdate(user_id, user);
    return updated_user;
  } catch (error) {
    throw error;
  }
}

export { getUsers, getUsersById, addUser, deleteUser, updateUser };
