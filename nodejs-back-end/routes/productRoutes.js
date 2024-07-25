import express from "express";
import { productController } from "../controllers/index.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/", upload.array("images"), productController.addProduct);

export default router;
