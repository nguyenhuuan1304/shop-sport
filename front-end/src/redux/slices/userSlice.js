import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";

export const fetchUserDetail = createAsyncThunk(
  "user/fetchUserDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.UserDetail();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  "user/fetchUpdateUser",
  async ({ data }, { rejectWithValue }) => {
    try {
      // console.log("fetchUpdateUser",data)
      const response = await request.updateUser({ data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateRelationUser = createAsyncThunk(
  "user/fetchUpdateRelationUser",
  async ({ userId, orderAddressId }, { rejectWithValue }) => {
    try {
      console.log("fetchupdateRelationUser ", userId, orderAddressId);
      const response = await request.updateRelationUser({
        userId: userId,
        oderAddressId: orderAddressId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log("redux", action.payload);
        state.success = true;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        console.log("update user", action.payload.data);
        state.success = true;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default userSlice.reducer;

// Export các actions nếu cần (optional)
export const {} = userSlice.actions;
