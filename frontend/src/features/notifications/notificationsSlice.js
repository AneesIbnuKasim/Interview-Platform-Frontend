import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationService } from "@/services/notificationService";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

function notificationError(error) {
  return error?.message || "Notification request failed";
}

function upsertNotification(items, notification) {
  if (!notification) return items;

  const exists = items.some((item) => item.id === notification.id);
  if (exists) {
    return items.map((item) => {
      return item.id === notification.id ? notification : item;
    });
  }

  return [notification, ...items];
}

export const fetchNotifications = createAsyncThunk(
  "notifications/list",
  async (_, { rejectWithValue }) => {
    try {
      const data = await notificationService.listNotifications({ limit: 20 });
      return data.notifications ?? [];
    } catch (error) {
      return rejectWithValue(notificationError(error));
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const data = await notificationService.markAllRead();
      return data.notifications ?? [];
    } catch (error) {
      return rejectWithValue(notificationError(error));
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markOneRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const data = await notificationService.markOneRead(notificationId);
      return data.notification;
    } catch (error) {
      return rejectWithValue(notificationError(error));
    }
  },
);

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    receiveNotification(state, action) {
      state.items = upsertNotification(state.items, action.payload);
      state.error = null;
    },
    markRoomNotificationsRead(state, action) {
      const roomId = action.payload;

      state.items = state.items.map((notification) => {
        if (notification.roomId !== roomId) return notification;

        return {
          ...notification,
          read: true,
          readAt: notification.readAt || new Date().toISOString(),
        };
      });
    },
    clearNotifications(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = upsertNotification(state.items, action.payload);
      });
  },
});

export const {
  clearNotifications,
  markRoomNotificationsRead,
  receiveNotification,
} = slice.actions;
export default slice.reducer;
