import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  title: "Untitled Interview",
  startedAt: null,
  connection: "disconnected",
};

const slice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action) {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.startedAt = Date.now();
    },
    setConnection(state, action) {
      state.connection = action.payload;
    },
    leaveRoom(state) {
      state.id = null; state.startedAt = null; state.connection = "disconnected";
    },
  },
});

export const { setRoom, setConnection, leaveRoom } = slice.actions;
export default slice.reducer;
