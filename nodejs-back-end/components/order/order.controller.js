import {
  getOrdersByUserId,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} from "./order.service.js";

async function getOrdersByUserIdController(req, res) {
  try {
    const user_id = req.user.user_id;
    const orders = await getOrdersByUserId(user_id);
    return res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function createOrderController(req, res) {
  try {
    const user_id = req.user.user_id;
    console.log(req.body);
    const order = req.body;
    const result = await createOrder(user_id, order);
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteOrderController(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_id = req.params.id;
    const result = await deleteOrder(user_id, order_id);
    if (result) {
      return res.status(200).json({ message: "delete successfull!" });
    } else return res.status(404).json({ message: "not found order id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateOrderStatusController(req, res) {
  try {
    const order_id = req.params.id;
    const orderStatus = req.body.order_status;
    console.log(orderStatus);
    const result = await updateOrderStatus(order_id, orderStatus);
    if (result) {
      return res.status(200).json({ message: "update status successfull!" });
    } else return res.status(404).json({ message: "not found order id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export {
  getOrdersByUserIdController,
  createOrderController,
  deleteOrderController,
  updateOrderStatusController,
};
