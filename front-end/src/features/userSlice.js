import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../redux/request";

export const fetchUpdateUser = createAsyncThunk(
  "user/fetchUpdateUser",
  async ({data}, { rejectWithValue }) => {
    try {
      // console.log("fetchUpdateUser",data)
      const response = await request.updateUser({data});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateRelationUser = createAsyncThunk(
  "user/fetchUpdateUser",
  async ({userId, oderaddressId}, { rejectWithValue }) => {
    try {
      console.log("fetchupdateRelationUser ",userId, oderaddressId)
      const response = await request.fetchGetOderAddressUser({userId:userId, oderaddressId: oderaddressId});
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.result.data;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default userSlice.reducer;

// Export các actions nếu cần (optional)
export const {  } =  userSlice.actions;