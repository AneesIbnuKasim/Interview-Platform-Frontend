import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roomService } from "@/services/roomService";

const initialState = {
  id: null,
  title: "Untitled Interview",
  startedAt: null,
  connection: "disconnected",
  current: null,
  rooms: [],
  status: "idle",
  error: null,
};

function toTimestamp(value) {
  return value ? new Date(value).getTime() : Date.now();
}

function applyRoom(state, room) {
  state.current = room;
  state.id = room?.id ?? null;
  state.title = room?.title ?? "Untitled Interview";
  state.startedAt = room ? toTimestamp(room.startedAt || room.createdAt) : null;
}

function errorMessage(error) {
  return error?.message || "Room request failed";
}

export const fetchRooms = createAsyncThunk(
  "room/list",
  async (_, { rejectWithValue }) => {
    try {
      const data = await roomService.listRooms();
      return data.rooms ?? [];
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const createRoom = createAsyncThunk(
  "room/create",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const data = await roomService.createRoom(payload);
      return data.room;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const fetchRoom = createAsyncThunk(
  "room/fetch",
  async (roomId, { rejectWithValue }) => {
    try {
      const data = await roomService.fetchRoom(roomId);
      return data.room;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const joinRoom = createAsyncThunk(
  "room/join",
  async ({ roomId, displayName, role }, { rejectWithValue }) => {
    try {
      const data = await roomService.joinRoom(roomId, { displayName, role });
      return data.room;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const joinRoomByCode = createAsyncThunk(
  "room/joinByCode",
  async ({ roomCode, displayName, role }, { rejectWithValue }) => {
    try {
      const data = await roomService.joinRoomByCode(roomCode, {
        displayName,
        role,
      });
      return data.room;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const leaveRoomSession = createAsyncThunk(
  "room/leave",
  async (roomId, { rejectWithValue }) => {
    try {
      const data = await roomService.leaveRoom(roomId);
      return data.room;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const slice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action) {
      applyRoom(state, action.payload);
    },
    setConnection(state, action) {
      state.connection = action.payload;
    },
    leaveRoom(state) {
      applyRoom(state, null);
      state.connection = "disconnected";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createRoom.pending, (state) => {
        state.status = "loading";
        state.connection = "connecting";
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connection = "connected";
        applyRoom(state, action.payload);
        state.rooms = [
          action.payload,
          ...state.rooms.filter((room) => room.id !== action.payload.id),
        ];
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.status = "failed";
        state.connection = "disconnected";
        state.error = action.payload;
      })
      .addCase(fetchRoom.pending, (state) => {
        state.status = "loading";
        state.connection = "connecting";
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connection = "connected";
        applyRoom(state, action.payload);
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.status = "failed";
        state.connection = "disconnected";
        state.error = action.payload;
      })
      .addCase(joinRoom.pending, (state) => {
        state.status = "loading";
        state.connection = "connecting";
        state.error = null;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connection = "connected";
        applyRoom(state, action.payload);
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.status = "failed";
        state.connection = "disconnected";
        state.error = action.payload;
      })
      .addCase(joinRoomByCode.pending, (state) => {
        state.status = "loading";
        state.connection = "connecting";
        state.error = null;
      })
      .addCase(joinRoomByCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connection = "connected";
        applyRoom(state, action.payload);
      })
      .addCase(joinRoomByCode.rejected, (state, action) => {
        state.status = "failed";
        state.connection = "disconnected";
        state.error = action.payload;
      })
      .addCase(leaveRoomSession.fulfilled, (state) => {
        applyRoom(state, null);
        state.connection = "disconnected";
      });
  },
});

export const { setRoom, setConnection, leaveRoom } = slice.actions;
export default slice.reducer;
