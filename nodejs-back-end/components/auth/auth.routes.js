import express from "express";
import {
  loginController,
  registerController,
  changePasswordController,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";
import { AUTH_ROUTES } from "../../constants/api_routes.js";
const router = express.Router();

router.post(AUTH_ROUTES.LOGIN, loginController);
router.post(AUTH_ROUTES.REGISTER, registerController);
router.post(AUTH_ROUTES.CHANGE_PASSWORD, verifyToken, changePasswordController);

export default router;
