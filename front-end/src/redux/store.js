import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import productSlice from "../features/productSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    product: productSlice,
  },
});
