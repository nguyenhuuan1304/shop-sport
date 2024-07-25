import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import cartReducer from "../redux/slices/cartSlice";
import oderAddressSlice from "../redux/slices/oderAddressSlice";
import productSlice from "../redux/slices/productSlice";
import searchSlice from "../redux/slices/searchSlice";
import userSlice from "../redux/slices/userSlice";

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
