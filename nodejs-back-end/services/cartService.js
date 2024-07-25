import Cart from "../models/cartModel.js";

async function addCart() {
  try {
    const new_cart = new Cart();
    await new_cart.save();
    return new_cart;
  } catch (error) {
    throw error;
  }
}
async function clearCart(cart_id) {
  try {
    const cart = await Cart.findById(user_id);
    if (cart) {
      cart?.total_of_product = 0;
      cart?.total_of_price= 0;
      cart?.items = []
    }
    await cart.save();
    return cart;
  } catch (error) {
    throw error;
  }
}
async function updateCart(cart_id, cart) {
  try {
    const updated_cart = await Cart.findByIdAndUpdate(cart_id, cart);
    return updated_cart;
  } catch (error) {
    throw error;
  }
}

export { addCart, clearCart, updateCart };
