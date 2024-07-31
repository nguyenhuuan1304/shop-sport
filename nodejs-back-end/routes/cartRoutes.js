import express from "express";
import { cartController } from "../controllers/index.js";
const router = express.Router();

router.get("/", cartController.getCartByUserId);
router.put("/update", cartController.updateCart);

export default router;
