import express from "express";
import { userController } from "../controllers/index.js";

const router = express.Router();

router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

export default router;
