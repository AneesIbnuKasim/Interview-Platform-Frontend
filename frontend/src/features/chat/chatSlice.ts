import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  ts: number;
}

interface State {
  messages: ChatMessage[];
  unread: number;
  typing: string[];
}

const initialState: State = {
  messages: [
    { id: "m1", authorId: "u2", authorName: "Aisha Patel", text: "Hi! Ready when you are.", ts: Date.now() - 1000 * 60 * 4 },
    { id: "m2", authorId: "u1", authorName: "You", text: "Great, let's start with a warm-up.", ts: Date.now() - 1000 * 60 * 3 },
  ],
  unread: 0,
  typing: [],
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage(state, action: PayloadAction<ChatMessage>) { state.messages.push(action.payload); },
    markRead(state) { state.unread = 0; },
    incUnread(state) { state.unread += 1; },
    setTyping(state, action: PayloadAction<string[]>) { state.typing = action.payload; },
  },
});

export const { sendMessage, markRead, incUnread, setTyping } = slice.actions;
export default slice.reducer;
