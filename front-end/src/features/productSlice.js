import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";

//lấy all product, fillter theo sortParam và titleParam, pagination
export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async (
    { sortParam, titleParam, searchParam, currentPage, pageSize },
    { rejectWithValue }
  ) => {
    try {
      console.log("fetchProductList ", sortParam, titleParam);
      if (sortParam || titleParam) {
        console.log("fetchProductList có sortParam hoặc titleParam");
        return await request.ListSort({
          sort: sortParam,
          title: titleParam,
          currentPage,
          pageSize,
        });
      } else if (searchParam) {
        return await request.listProductSearch({
          keyWord: searchParam,
          currentPage,
          pageSize,
        });
      } else {
        console.log("fetchProductList không có sortParam hoặc titleParam");
        return await request.List(currentPage, pageSize);
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
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

//lấy các sản phẩm giảm giá
export const fetchSaleProductList = createAsyncThunk(
  "products/fetchSaleProductList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.ListSaleProduct();
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
    saleProductList: [],
    loading: false,
    error: null,
    pageSize: 6,
    totalProductItems: null,
  },
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload.data;
      // console.log("setProductList", action.payload.result.data);
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
        state.totalProductItems = action.payload.result.meta.pagination.total;
        state.pageSize = action.payload.result.meta.pagination.pageSize;
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
      })

    // .addCase(fetchSaleProductList.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchSaleProductList.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.saleProductList = action.payload;
    // })
    // .addCase(fetchSaleProductList.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
  },
});

export default productSlice.reducer;

// Export các actions nếu cần (optional)
export const { setProductList, setLoading, setError } = productSlice.actions;
