import { getCartByUserId, updateCart } from "./cart.service.js";

async function getCartByUserIdController(req, res) {
  try {
    const user_id = req.user.user_id;
    const cart = await getCartByUserId(user_id);
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateCartController(req, res) {
  try {
    const cart = req.body;
    const user_id = req.user.user_id;
    const updated_cart = await updateCart(user_id, cart);
    if (!updated_cart)
      return res.status(404).json({ message: "Cannot update your cart!" });
    return res
      .status(200)
      .json({ message: "Updated successfully!", cart: updated_cart });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getCartByUserIdController, updateCartController };
