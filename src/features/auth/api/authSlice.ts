import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../../../stores/store";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("jwt") || null, 
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const  inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
      const data = await response.json();
      Cookies.set("jwt", data.token, { expires: inOneHour, path: "/" });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      // Skip if we already have user data
      if (auth.user) return auth.user;
      
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_AUTH}/profile`, {
        headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("jwt");
      window.location.href = "/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
