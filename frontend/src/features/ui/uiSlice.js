import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarCollapsed: false,
  chatOpen: true,
  participantsOpen: true,
  fullscreenEditor: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(s) {
      s.sidebarCollapsed = !s.sidebarCollapsed;
    },
    setChatOpen(s, a) {
      s.chatOpen = a.payload;
    },
    setParticipantsOpen(s, a) {
      s.participantsOpen = a.payload;
    },
    toggleFullscreenEditor(s) {
      s.fullscreenEditor = !s.fullscreenEditor;
    },
  },
});

export const {
  toggleSidebar,
  setChatOpen,
  setParticipantsOpen,
  toggleFullscreenEditor,
} = slice.actions;
export default slice.reducer;
