import express from "express";
import {
  getUserByIdController,
  updateUserController,
} from "./user.controller.js";
import { USER_ROUTES } from "../../constants/api_routes.js";
const router = express.Router();

router.get(USER_ROUTES.PROFILE, getUserByIdController);
router.put(USER_ROUTES.UPDATE, updateUserController);

export default router;
