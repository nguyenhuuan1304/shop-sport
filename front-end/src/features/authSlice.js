import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService } from "../services/authService";
import { request } from "../redux/request";
import { jwtDecode } from "jwt-decode";

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

export const fetchUserDetail = createAsyncThunk(
  "auth/fetchUserDetail",
  async (_, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        const decodedToken = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }
        const response = await request.UserDetail(decodedToken.id);
        return response.data;
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue({ message: "Token expired or invalid" });
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
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

    builder.addCase(fetchUserDetail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUserDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.jwt = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
