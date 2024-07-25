import express from "express";
import productRoutes from "../routes/productRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
