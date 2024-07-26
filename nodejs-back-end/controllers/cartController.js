import { cartService } from "../services/index.js";

async function getCartByUserId(req, res) {
  try {
    const user_id = req.user.user_id;
    const cart = await cartService.getCartByUserId(user_id);
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getCartByUserId };
