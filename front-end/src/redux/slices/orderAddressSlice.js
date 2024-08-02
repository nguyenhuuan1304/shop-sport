import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";

export const fetchCreateOrderAddress = createAsyncThunk(
  "orderAddress/fetchCreateOrderAddress",
  async (order_address, { rejectWithValue }) => {
    try {
      const response = await request.createOrderAddress(order_address);
      console.log("fetch create ", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderAddress = createAsyncThunk(
  "orderAddress/fetchOrderAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.fetchOrderAddress();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const OrderAddressSlice = createSlice({
  name: "orderAddress",
  initialState: {
    order_addresses: [],
    orderAddress: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateOrderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateOrderAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.orderAddress = action.payload;
        console.log(action.payload);
        state.order_addresses = [...state.order_addresses, state.orderAddress];
      })
      .addCase(fetchCreateOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.order_addresses = action.payload;
      })
      .addCase(fetchOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default OrderAddressSlice.reducer;

// Export các actions nếu cần (optional)
export const {} = OrderAddressSlice.actions;
