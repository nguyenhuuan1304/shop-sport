import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService } from "../services/authService";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  jwt: null,
  errorMessages: "",
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.jwt = null;
      localStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.jwt = action.payload.jwt;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessages = action.payload.error?.message;
    });
  },
});

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginService(payload);
      const { jwt, user } = response.data;
      localStorage.setItem("jwt", jwt);
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
