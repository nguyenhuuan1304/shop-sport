import express from "express";
import { authController } from "../controllers/index.js";
import { verifyToken } from "../middlewares/jwt.js";
import { AUTH_ROUTES } from "../constants/api_routes.js";
const router = express.Router();

router.post(AUTH_ROUTES.LOGIN, authController.login);
router.post(AUTH_ROUTES.REGISTER, authController.register);
router.post(
  AUTH_ROUTES.CHANGE_PASSWORD,
  verifyToken,
  authController.changePassword
);

export default router;
