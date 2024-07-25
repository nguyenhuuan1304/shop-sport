import express from "express";
import {
  getProductsController,
  getProductsByIdController,
  updateProductController,
  deleteProductController,
  addProductController,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/products", getProductsController);
router.get("/products/:id", getProductsByIdController);
router.put("/products/:id", updateProductController);
router.delete("/products/:id", deleteProductController);
router.post("/products", upload.array("images"), addProductController);

export default router;
