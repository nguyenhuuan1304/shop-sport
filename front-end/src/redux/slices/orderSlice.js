import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";
const initialState = {
  orders: [],
  session_detail: null,
  loading: false,
  paymentUrl: null,
  prevPaymentUrl: null,
  error: null,
};

export const createCheckoutSession = createAsyncThunk(
  "order/createCheckoutSession",
  async (order, { rejectWithValue }) => {
    try {
      const response = await request.CreateCheckoutSession(order);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkoutSession = createAsyncThunk(
  "order/checkoutSession",
  async (session_id, { rejectWithValue }) => {
    try {
      const response = await request.CheckoutSession(session_id);
      console.log("checkout session ", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.GetOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await request.CreateOrder(order);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (order_id, { rejectWithValue }) => {
    try {
      const response = await request.DeleteOrder(order_id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = action.payload.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload?.url;
        state.prevPaymentUrl = action.payload?.prev_url;
        state.error = action.payload?.message;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session_detail = action.payload;
      })
      .addCase(checkoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;

// Export các actions nếu cần (optional)
export const {} = orderSlice.actions;
