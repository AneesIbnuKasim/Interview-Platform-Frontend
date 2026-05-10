import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarCollapsed: boolean;
  chatOpen: boolean;
  participantsOpen: boolean;
  fullscreenEditor: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  chatOpen: true,
  participantsOpen: true,
  fullscreenEditor: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(s) { s.sidebarCollapsed = !s.sidebarCollapsed; },
    setChatOpen(s, a: PayloadAction<boolean>) { s.chatOpen = a.payload; },
    setParticipantsOpen(s, a: PayloadAction<boolean>) { s.participantsOpen = a.payload; },
    toggleFullscreenEditor(s) { s.fullscreenEditor = !s.fullscreenEditor; },
  },
});

export const { toggleSidebar, setChatOpen, setParticipantsOpen, toggleFullscreenEditor } = slice.actions;
export default slice.reducer;
