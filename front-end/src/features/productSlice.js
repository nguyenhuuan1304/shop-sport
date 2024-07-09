import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { request } from '../redux/request';

// Tạo async thunks để thực hiện các tác vụ không đồng bộ
export const fetchProductList = createAsyncThunk(
    'products/fetchProductList',
    async ({ entity, page, itemsPerPage }, { rejectWithValue }) => {
      try {
        const response = await request.List(entity, { page, itemsPerPage });
        return response.data; // Trả về dữ liệu response chính từ API
      } catch (error) {
        return rejectWithValue(error.message); // Xử lý lỗi và trả về message lỗi
      }
    }
  );

  const productSlice = createSlice({
    name: 'products',
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
          }
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
    },
});

export default productSlice.reducer;
    
// Export các actions nếu cần (optional)
export const { setProductList, setLoading, setError } = productSlice.actions;