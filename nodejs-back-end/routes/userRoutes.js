import express from "express";
import { userController } from "../controllers/index.js";

const router = express.Router();

router.get("/profile", userController.getUserById);
router.put("/update", userController.updateUser);

export default router;
