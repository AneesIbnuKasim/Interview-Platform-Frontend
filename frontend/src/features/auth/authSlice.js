import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setAuthSession,
} from "@/lib/authStorage";

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  status: storedUser || getAccessToken() ? "authenticated" : "idle",
  error: null,
  initialized: !getAccessToken(),
};

function authError(error) {
  return error?.message || "Something went wrong";
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      setAuthSession(data);
      return data.user;
    } catch (error) {
      return rejectWithValue(authError(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      setAuthSession(data);
      return data.user;
    } catch (error) {
      return rejectWithValue(authError(error));
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    if (!getAccessToken()) return null;

    try {
      const data = await authApi.me();
      if (data?.user) setAuthSession({ user: data.user });
      return data?.user ?? null;
    } catch (error) {
      clearAuthSession();
      return rejectWithValue(authError(error));
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const refreshToken = getRefreshToken();

  try {
    await authApi.logout(refreshToken);
  } finally {
    clearAuthSession();
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearAuthSession();
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = state.user ? "authenticated" : "checking";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = action.payload ? "authenticated" : "idle";
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.status = "idle";
        state.error = action.payload;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
