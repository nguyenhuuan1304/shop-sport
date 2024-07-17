import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import cartReducer from "../features/cartSlice";
import productSlice from "../features/productSlice";
import searchSlice from "../features/searchSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    cart: cartReducer,
    Search: searchSlice,
  },
});
