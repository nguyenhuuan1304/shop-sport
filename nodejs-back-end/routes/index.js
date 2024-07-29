import express from "express";
import productRoutes from "../routes/productRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import orderAddressRoutes from "../routes/orderAddressRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";
import { verifyToken } from "../middlewares/jwt.js";
// import orderRoutes from "../routes/orderRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", verifyToken, userRoutes);
router.use("/auth", authRoutes);
router.use("/order-address", verifyToken, orderAddressRoutes);
router.use("/order", verifyToken, orderRoutes);
router.use("/cart", verifyToken, cartRoutes);

export default router;
