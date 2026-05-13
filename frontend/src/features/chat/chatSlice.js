import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  unread: 0,
  typing: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
      state.status = "ready";
      state.error = null;
    },
    receiveMessage(state, action) {
      const message = action.payload?.message ?? action.payload;
      if (!message) return;

      const exists = state.messages.some((item) => item.id === message.id);
      if (!exists) {
        state.messages.push(message);
      }
      state.status = "ready";
      state.error = null;
    },
    sendMessage(state, action) {
      const message = action.payload;
      const exists = state.messages.some((item) => item.id === message.id);
      if (!exists) {
        state.messages.push(message);
      }
    },
    markRead(state) {
      state.unread = 0;
    },
    incUnread(state) {
      state.unread += 1;
    },
    setTyping(state, action) {
      state.typing = action.payload;
    },
    setChatStatus(state, action) {
      state.status = action.payload;
    },
    setChatError(state, action) {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const {
  incUnread,
  markRead,
  receiveMessage,
  sendMessage,
  setChatError,
  setChatStatus,
  setMessages,
  setTyping,
} = slice.actions;
export default slice.reducer;
