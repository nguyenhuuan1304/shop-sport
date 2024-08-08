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

async function deleteOrder(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_id = req.params.id;
    const result = await orderService.deleteOrder(user_id, order_id);
    if (result) {
      return res.status(200).json({ message: "delete successfull!" });
    } else return res.status(404).json({ message: "not found order id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const order_id = req.params.id;
    const orderStatus = req.body.order_status;
    console.log(orderStatus);
    const result = await orderService.updateOrderStatus(order_id, orderStatus);
    if (result) {
      return res.status(200).json({ message: "update status successfull!" });
    } else return res.status(404).json({ message: "not found order id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getOrdersByUserId, createOrder, deleteOrder, updateOrderStatus };
