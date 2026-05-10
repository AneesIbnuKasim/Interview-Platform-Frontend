import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) { state.status = "loading"; state.error = null; },
    loginSuccess(state, action) {
      state.status = "authenticated";
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.status = "error";
      state.error = action.payload;
    },
    logout(state) { state.user = null; state.status = "idle"; },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = slice.actions;
export default slice.reducer;
