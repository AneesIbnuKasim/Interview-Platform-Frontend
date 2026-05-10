import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
  id: string | null;
  title: string;
  startedAt: number | null;
  connection: "connecting" | "connected" | "disconnected";
}

const initialState: RoomState = {
  id: null,
  title: "Untitled Interview",
  startedAt: null,
  connection: "disconnected",
};

const slice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<{ id: string; title: string }>) {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.startedAt = Date.now();
    },
    setConnection(state, action: PayloadAction<RoomState["connection"]>) {
      state.connection = action.payload;
    },
    leaveRoom(state) {
      state.id = null; state.startedAt = null; state.connection = "disconnected";
    },
  },
});

export const { setRoom, setConnection, leaveRoom } = slice.actions;
export default slice.reducer;
