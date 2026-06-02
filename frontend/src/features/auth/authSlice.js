import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api";
import { userService } from "@/services/userService";
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

export const updateCurrentUser = createAsyncThunk(
  "auth/updateCurrentUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await userService.updateProfile(payload);
      if (data?.user) setAuthSession({ user: data.user });
      return data?.user;
    } catch (error) {
      return rejectWithValue(authError(error));
    }
  },
);

export const updateCurrentUserAvatar = createAsyncThunk(
  "auth/updateCurrentUserAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const data = await userService.updateAvatar(file);
      if (data?.user) setAuthSession({ user: data.user });
      return data?.user;
    } catch (error) {
      return rejectWithValue(authError(error));
    }
  },
);

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
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
        state.initialized = true;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.status = "authenticated";
        state.error = action.payload;
      })
      .addCase(updateCurrentUserAvatar.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCurrentUserAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
        state.initialized = true;
      })
      .addCase(updateCurrentUserAvatar.rejected, (state, action) => {
        state.status = "authenticated";
        state.error = action.payload;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
