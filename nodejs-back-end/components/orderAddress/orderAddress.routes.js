import {
  getOrderAddressByUserIdController,
  addOrderAddressController,
  setDefaultOrderAddressController,
  deleteOrderAddressController,
  updateOrderAddressController,
} from "./orderAddress.controller.js";
import express from "express";
import { ORDER_ADDRESS_ROUTES } from "../../constants/api_routes.js";
const router = express.Router();

router.get(ORDER_ADDRESS_ROUTES.GET, getOrderAddressByUserIdController);
router.post(ORDER_ADDRESS_ROUTES.ADD, addOrderAddressController);
router.put(ORDER_ADDRESS_ROUTES.SET_DEFAULT, setDefaultOrderAddressController);
router.delete(ORDER_ADDRESS_ROUTES.DELETE, deleteOrderAddressController);
router.put(ORDER_ADDRESS_ROUTES.UPDATE, updateOrderAddressController);

export default router;
