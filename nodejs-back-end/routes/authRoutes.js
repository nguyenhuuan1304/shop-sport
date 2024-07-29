import express from "express";
import { authController } from "../controllers/index.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/change-password", verifyToken, authController.changePassword);

export default router;
