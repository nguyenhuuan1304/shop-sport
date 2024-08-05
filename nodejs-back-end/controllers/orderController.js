import { orderService } from "../services/index.js";

async function getOrdersByUserId(req, res) {
  try {
    const user_id = req.user.user_id;
    const orders = await orderService.getOrdersByUserId(user_id);
    return res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function createOrder(req, res) {
  try {
    const user_id = req.user.user_id;
    console.log(req.body);
    const order = req.body;
    const result = await orderService.createOrder(user_id, order);
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getOrdersByUserId, createOrder };
