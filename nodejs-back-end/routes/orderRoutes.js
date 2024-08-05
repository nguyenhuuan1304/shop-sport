import express from "express";
import { ORDER_ROUTES } from "../constants/api_routes.js";
import { orderController } from "../controllers/index.js";
const router = express.Router();

router.get(ORDER_ROUTES.GET_BY_USER_ID, orderController.getOrdersByUserId);
router.post(ORDER_ROUTES.ADD, orderController.createOrder);

export default router;
