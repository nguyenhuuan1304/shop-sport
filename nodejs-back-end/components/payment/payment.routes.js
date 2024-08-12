import express from "express";
import {
  checkoutSession,
  createCheckoutSession,
  webhook,
} from "./payment.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";
const router = express.Router();

router.get("/checkout-session", verifyToken, checkoutSession);
router.post("/create-checkout-session", verifyToken, createCheckoutSession);
router.post("/webhook", webhook);
export default router;
