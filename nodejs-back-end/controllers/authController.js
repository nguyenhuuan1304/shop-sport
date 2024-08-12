import { verifyToken, generateToken } from "../middlewares/jwt.js";
import { userModel } from "../models/index.js";
import bcrypt from "bcryptjs";
import { userService } from "../services/index.js";
import { authService } from "../services/index.js";

async function login(req, res) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function register(req, res) {
  try {
    const newUser = await authService.register(req.body);
    return res
      .status(200)
      .json({ message: "Register successfully", user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const message = await authService.changePassword(
      req.user.user_id,
      req.body.currentPassword,
      req.body.newPassword,
      req.body.confirmNewPassword
    );
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export { login, register, changePassword };
