import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import cartReducer from "../features/cartSlice";
import oderAddressSlice from "../features/oderAddressSlice";
import productSlice from "../features/productSlice";
import searchSlice from "../features/searchSlice";
import userSlice from "../features/userSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    cart: cartReducer,
    Search: searchSlice,
    user: userSlice,
    oderAddress: oderAddressSlice
  },
});
