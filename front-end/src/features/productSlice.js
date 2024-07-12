import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";

export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async ({sortParam, titleParam}, { rejectWithValue }) => {
    try {
      console.log("fetchProductList ", sortParam, titleParam);
      if (sortParam || titleParam) {
        console.log("fetchProductList có sortParam hoặc titleParam");
        return await request.ListSort({ sort: sortParam, title: titleParam });
      } else {
        console.log("fetchProductList không có sortParam hoặc titleParam");
        return await request.List();
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    productDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload.data;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.result.data;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

export const { setProductList, setLoading, setError } = productSlice.actions;
