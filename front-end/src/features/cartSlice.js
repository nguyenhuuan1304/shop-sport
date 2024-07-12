import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await request.Cart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.cart?.products;
        state.total = action.payload.cart?.total;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

// Export các actions nếu cần (optional)
export const {} = cartSlice.actions;
