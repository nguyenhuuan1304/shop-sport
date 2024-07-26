import express from "express";
import { cartController } from "../controllers/index.js";
const router = express.Router();

router.get("/", cartController.getCartByUserId);

export default router;
