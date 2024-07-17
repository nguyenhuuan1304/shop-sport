import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";


//get 5 product for search to keyword
export const fetchFiveProduct = createAsyncThunk(
  "products/fetchFiveProduct",
  async({keyWord},{rejectWithValue}) =>{
    try {
    //   console.log("keyword 2", keyWord)
      return await request.searchFiveProduct(keyWord);
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
    productListSearch: (state, action) => {
      state.productListSearch = action.payload.data;
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
      
      .addCase(fetchFiveProduct.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiveProduct.fulfilled, (state, action)=> {
        state.loading = false;
        state.productListSearch = action.payload.result.data;
        // console.log("find 5 product ", action.payload.result.data)
      })
      .addCase(fetchFiveProduct.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;

// Export các actions nếu cần (optional)
export const {  } = searchSlice.actions;
