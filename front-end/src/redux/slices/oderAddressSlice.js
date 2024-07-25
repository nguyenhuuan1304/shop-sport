import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";

export const fetchCreateOrderAddress = createAsyncThunk(
  "oderAddress/fetchCreateOderAddress",
  async ({data}, { rejectWithValue }) => {
    try {
      console.log("fetchUpdateUser",data)
      const response = await request.createOderAddress({data:data});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const OderAddressSlice = createSlice({
  name: "oderAddress",
  initialState: {
    oderAddress: null,
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
        console.log("action.payload.result.data", action.payload)
        state.oderAddress = action.payload;
      })
      .addCase(fetchCreateOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default OderAddressSlice.reducer;

// Export các actions nếu cần (optional)
export const {  } =  OderAddressSlice.actions;