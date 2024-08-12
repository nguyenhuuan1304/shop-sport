import express from "express";
import { ORDER_ROUTES } from "../../constants/api_routes.js";
import {
  getOrdersByUserIdController,
  createOrderController,
  deleteOrderController,
  updateOrderStatusController,
} from "./order.controller.js";
const router = express.Router();

router.get(ORDER_ROUTES.GET_BY_USER_ID, getOrdersByUserIdController);
router.post(ORDER_ROUTES.ADD, createOrderController);
router.delete(ORDER_ROUTES.DELETE, deleteOrderController);
router.put(ORDER_ROUTES.UPDATE_ORDER_STATUS, updateOrderStatusController);

export default router;
