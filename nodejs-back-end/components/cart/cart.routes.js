import express from "express";
import { CART_ROUTES } from "../../constants/api_routes.js";
import {
  getCartByUserIdController,
  updateCartController,
} from "./cart.controller.js";
const router = express.Router();

router.get(CART_ROUTES.GET, getCartByUserIdController);
router.put(CART_ROUTES.UPDATE, updateCartController);

export default router;
