import express from "express";
import { productController } from "../controllers/index.js";
import upload from "../middlewares/upload.js";
import { PRODUCT_ROUTES } from "../constants/api_routes.js";
const router = express.Router();

router.get(PRODUCT_ROUTES.GET, productController.getProducts);
router.get(PRODUCT_ROUTES.GET_BY_ID, productController.getProductById);
router.get("/search", productController.searchProduct);
router.put(PRODUCT_ROUTES.UPDATE, productController.updateProduct);
router.delete(PRODUCT_ROUTES.DELETE, productController.deleteProduct);
router.post(
  PRODUCT_ROUTES.ADD,
  upload.array("images"),
  productController.addProduct
);

export default router;
