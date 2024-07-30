import { orderAddressController } from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.get("/", orderAddressController.getOrderAddressByUserId);
router.post("/", orderAddressController.addOrderAddress);
router.put("/set-default/:id", orderAddressController.setDefaultOrderAddress);
router.delete("/:id", orderAddressController.deleteOrderAddress);
router.put("/:id", orderAddressController.updateOrderAddress);

export default router;
