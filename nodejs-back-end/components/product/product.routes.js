import express from "express";
import { getProducts, searchProduct, getProductById, updateProduct, deleteProduct, addProduct } from "../product/product.controller.js";
import upload from "../../middlewares/upload.js";
import { PRODUCT_ROUTES } from "../../constants/api_routes.js";

const router = express.Router();

router.get(PRODUCT_ROUTES.GET, getProducts);
router.get(PRODUCT_ROUTES.SEARCH, searchProduct);
router.get(PRODUCT_ROUTES.GET_BY_ID, getProductById);
router.put(PRODUCT_ROUTES.UPDATE, updateProduct);
router.delete(PRODUCT_ROUTES.DELETE, deleteProduct);
router.post(PRODUCT_ROUTES.ADD, upload.array("images"), addProduct);

export default router;
