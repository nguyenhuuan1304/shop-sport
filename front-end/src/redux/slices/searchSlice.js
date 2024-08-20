import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";


//get 5 product for search to keyword
// export const fetchFiveProduct = createAsyncThunk(
//   "products/fetchFiveProduct",
//   async({keyWord},{rejectWithValue}) =>{
//     try {
//     //   console.log("keyword 2", keyWord)
//       return await request.searchFiveProduct(keyWord);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchFiveProduct = createAsyncThunk(
  "products/fetchFiveProduct",
  async({keyWord, currentPage},{rejectWithValue}) =>{
    try {
      console.log("keyword 2", keyWord, currentPage)
      return await request.searchFiveProduct(keyWord , currentPage);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "Search",
  initialState: {
    productListSearch:[],
    loading: false,
    error: null,
    pageSize: 6,
    totalProductItems: null,
  },
  reducers: {
    setActiveResetProductList(state, action) {
      state.productListSearch = []
      state.totalProductItems = null
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchFiveProduct.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiveProduct.fulfilled, (state, action)=> {
        state.loading = false;
        state.productListSearch = [...state.productListSearch, ...action.payload.data];
        console.log(action.payload)
        state.totalProductItems = action.payload?.meta?.pagination?.total;
        state.pageSize = action.payload.meta?.pagination?.pageSize;
      })
      .addCase(fetchFiveProduct.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;

// Export các actions nếu cần (optional)
export const { setActiveResetProductList } = searchSlice.actions;
