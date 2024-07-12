import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";
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

  "products/fetchProductList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.List();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// lấy thông tin chi tiết sản phẩm
export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await request.ProductDetail(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      state.productList = action.payload;
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
        state.productList = action.payload;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

// Export các actions nếu cần (optional)
export const { setProductList, setLoading, setError } = productSlice.actions;

