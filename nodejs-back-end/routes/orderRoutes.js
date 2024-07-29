import express from "express";
import { orderController } from "../controllers/index.js";
const router = express.Router();

router.get("/", orderController.getOrdersByUserId);

export default router;
