import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) { state.status = "loading"; state.error = null; },
    loginSuccess(state, action: PayloadAction<User>) {
      state.status = "authenticated";
      state.user = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    logout(state) { state.user = null; state.status = "idle"; },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = slice.actions;
export default slice.reducer;
