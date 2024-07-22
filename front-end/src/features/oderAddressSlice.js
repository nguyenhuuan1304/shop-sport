import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";

export const fetchCreateOderAddress = createAsyncThunk(
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
      .addCase(fetchCreateOderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateOderAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.oderAddress = action.payload.result.data;
      })
      .addCase(fetchCreateOderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default OderAddressSlice.reducer;

// Export các actions nếu cần (optional)
export const {  } =  OderAddressSlice.actions;