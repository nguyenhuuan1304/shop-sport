import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import cartReducer from "../redux/slices/cartSlice";
import orderAddressSlice from "../redux/slices/orderAddressSlice";
import productSlice from "../redux/slices/productSlice";
import searchSlice from "../redux/slices/searchSlice";
import userSlice from "../redux/slices/userSlice";
import orderSlice from "../redux/slices/orderSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    cart: cartReducer,
    Search: searchSlice,
    user: userSlice,
    orderAddress: orderAddressSlice,
    order: orderSlice,
  },
});
