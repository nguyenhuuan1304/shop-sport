import express from "express";
import { userController } from "../controllers/index.js";
import { USER_ROUTES } from "../constants/api_routes.js";
const router = express.Router();

router.get(USER_ROUTES.PROFILE, userController.getUserById);
router.put(USER_ROUTES.UPDATE, userController.updateUser);

export default router;
