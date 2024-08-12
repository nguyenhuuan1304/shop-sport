import express from "express";
import productRoutes from "../components/product/product.routes.js";
// import authRoutes from "../routes/authRoutes.js";
import authRoutes from "../components/auth/auth.routes.js";
// import userRoutes from "../routes/userRoutes.js";
import userRoutes from "../components/user/user.routes.js";
// import orderAddressRoutes from "../routes/orderAddressRoutes.js";
import orderAddressRoutes from "../components/orderAddress/orderAddress.routes.js";
// import orderRoutes from "../routes/orderRoutes.js";
import orderRoutes from "../components/order/order.routes.js";
// import cartRoutes from "../routes/cartRoutes.js";
import cartRoutes from "../components/cart/cart.routes.js";
// import paymentRoutes from "../routes/paymentRoutes.js";
import paymentRoutes from "../components/payment/payment.routes.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", verifyToken, userRoutes);
router.use("/auth", authRoutes);
router.use("/order-address", verifyToken, orderAddressRoutes);
router.use("/order", verifyToken, orderRoutes);
router.use("/cart", verifyToken, cartRoutes);
router.use("/payment", paymentRoutes);

export default router;
