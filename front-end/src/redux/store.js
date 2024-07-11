import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import cartReducer from "../features/cartSlice";
import productSlice from "../features/productSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    product: productSlice,
    cart: cartReducer,
  },
});
