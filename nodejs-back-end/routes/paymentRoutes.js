import express from "express";
import { paymentController } from "../controllers/index.js";
const router = express.Router();

router.get("/checkout-session", paymentController.checkoutSession);
router.post(
  "/create-checkout-session",
  paymentController.createCheckoutSession
);
router.post("/webhook", paymentController.webhook);
export default router;
