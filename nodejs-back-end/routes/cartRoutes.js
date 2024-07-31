import express from "express";
import { CART_ROUTES } from "../constants/api_routes.js";
import { cartController } from "../controllers/index.js";
const router = express.Router();

router.get(CART_ROUTES.GET, cartController.getCartByUserId);
router.put(CART_ROUTES.UPDATE, cartController.updateCart);

export default router;
