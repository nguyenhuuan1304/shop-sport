import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";

//lấy all product, fillter theo sortParam và titleParam, pagination
// export const fetchProductList = createAsyncThunk(
//   "products/fetchProductList",
//   async (
//     { sortParam, titleParam, searchParam, currentPage, pageSize },
//     { rejectWithValue }
//   ) => {
//     try {
//       // console.log("fetchProductList ", currentPage, pageSize);
//       if (sortParam || titleParam) {
//         // console.log("fetchProductList có sortParam hoặc titleParam");
//         return await request.ListSort({
//           sort: sortParam,
//           title: titleParam,
//           currentPage,
//           pageSize,
//         });
//       } else if (searchParam) {
//         return await request.listProductSearch({
//           keyWord: searchParam,
//           currentPage,
//           pageSize,
//         });
//       } else {
//         // console.log("fetchProductList không có sortParam hoặc titleParam");
//         return await request.List(currentPage, pageSize);
//       }
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchProductListWithSortOrTitle = createAsyncThunk(
  "products/fetchProductListWithSortOrTitle",
  async (
    { sortParam, titleParam, currentPage, pageSize },
    { rejectWithValue }
  ) => {
    try {
      console.log("current page ", currentPage)
      return await request.ListSort({
        sort: sortParam,
        title: titleParam,
        currentPage,
        pageSize,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductListWithSearch = createAsyncThunk(
  "products/fetchProductListWithSearch",
  async ({ searchParam, currentPage, pageSize }, { rejectWithValue }) => {
    try {
      return await request.listProductSearch({
        keyWord: searchParam,
        currentPage,
        pageSize,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      return await request.List(currentPage, pageSize);
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
    newProductList: [],
    saleProductList: [],
    hotProductList: [],
    highPriceProductList: [],
    expensiveProductList: [],
    productListWithSearchbyPage: [],
    productListByPage: [],
    combinedProductList: [],
    productDetails: null,
    loading: false,
    error: null,
    pageSize: 3,
    totalProductItems: null,
    activeFilter: {
      title: null,
      sort: null,
    },
  },
  reducers: {
    setActiveFilter(state, action) {
      const { title, sort } = action.payload;
      state.activeFilter = { title: title, sort: sort };
      state.newProductList = [];
      state.saleProductList = [];
      state.hotProductList = [];
      state.highPriceProductList = [];
      state.expensiveProductList = [];
      state.productListWithSortOrTitleByPage = [];
      state.combinedProductList = [];
      state.totalProductItems = 0; 
      console.log("active ", state.activeFilter, state.combinedProductList);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductListWithSortOrTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductListWithSortOrTitle.fulfilled, (state, action) => {
        const title = state.activeFilter.title;

        switch (title) {
          case "New":
          case "Mới Nhất":
            state.newProductList = [
              ...state.newProductList,
              ...action.payload.data,
            ];
            console.log("Mới Nhất ", state.newProductList);
            state.combinedProductList = [...state.newProductList];
            break;
          case "Sale":
            state.saleProductList = [
              ...state.saleProductList,
              ...action.payload.data,
            ];
            console.log("Sale ", state.saleProductList);
            state.combinedProductList = [...state.saleProductList];
            break;
          case "Hot":
            state.hotProductList = [
              ...state.hotProductList,
              ...action.payload.data,
            ];
            console.log("Hot ", state.hotProductList);
            state.combinedProductList = [...state.hotProductList];
            break;
          case "Giá Thấp":
            state.highPriceProductList = [
              ...state.highPriceProductList,
              ...action.payload.data,
            ];
            console.log("Giá Thấp ", state.highPriceProductList);
            state.combinedProductList = [...state.highPriceProductList];
            break;
          case "Giá cao":
            state.expensiveProductList = [
              ...state.expensiveProductList,
              ...action.payload.data,
            ];
            console.log("Giá cao ", state.expensiveProductList);
            state.combinedProductList = [...state.expensiveProductList];
            break;
        }
        console.log("state.combinedProductList , ", state.combinedProductList);
        state.totalProductItems = action.payload.meta?.pagination?.total;
        state.pageSize = action.payload.meta.pagination.pageSize;
        console.log("payload ",state.totalProductItems)
      })
      .addCase(fetchProductListWithSortOrTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductListWithSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductListWithSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.productListWithSearchbyPage = [
          ...state.productListWithSearchbyPage,
          ...action.payload.data,
        ];
        console.log(
          "state.productListWithSearchbyPage , ",
          state.productListWithSearchbyPage
        );
        state.combinedProductList = [...state.productListWithSearchbyPage];
        console.log("state.combinedProductList , ", state.combinedProductList);
        state.totalProductItems = action.payload.meta?.pagination?.total;
        state.pageSize = action.payload.meta.pagination.pageSize;
      })
      .addCase(fetchProductListWithSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productListByPage = [
          ...state.productListByPage,
          ...action.payload.data,
        ];
        console.log("state.productListByPage , ", state.productListByPage);
        state.combinedProductList = [...state.productListByPage];
        console.log("state.combinedProductList , ", state.combinedProductList);
        state.totalProductItems = action.payload.meta?.pagination?.total;
        state.pageSize = action.payload.meta.pagination.pageSize;
        // console.log(action.payload)
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
export const { setProductList, setLoading, setError, setActiveFilter } =
  productSlice.actions;
