import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import roomReducer from "@/features/room/roomSlice";
import editorReducer from "@/features/editor/editorSlice";
import participantsReducer from "@/features/participants/participantsSlice";
import chatReducer from "@/features/chat/chatSlice";
import uiReducer from "@/features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    editor: editorReducer,
    participants: participantsReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});
