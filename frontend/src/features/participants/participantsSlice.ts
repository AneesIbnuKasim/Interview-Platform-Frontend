import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Participant {
  id: string;
  name: string;
  role: "interviewer" | "candidate";
  speaking?: boolean;
  muted?: boolean;
  cameraOn?: boolean;
  quality?: "good" | "ok" | "poor";
  color?: string;
}

interface State { list: Participant[]; }

const initialState: State = {
  list: [
    { id: "u1", name: "You", role: "interviewer", muted: false, cameraOn: true, quality: "good", color: "#7c3aed" },
    { id: "u2", name: "Aisha Patel", role: "candidate", speaking: true, muted: false, cameraOn: true, quality: "good", color: "#06b6d4" },
    { id: "u3", name: "Marco Diaz", role: "interviewer", muted: true, cameraOn: false, quality: "ok", color: "#ec4899" },
  ],
};

const slice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    addParticipant(state, action: PayloadAction<Participant>) { state.list.push(action.payload); },
    removeParticipant(state, action: PayloadAction<string>) { state.list = state.list.filter(p => p.id !== action.payload); },
    toggleMute(state, action: PayloadAction<string>) {
      const p = state.list.find(p => p.id === action.payload); if (p) p.muted = !p.muted;
    },
    toggleCamera(state, action: PayloadAction<string>) {
      const p = state.list.find(p => p.id === action.payload); if (p) p.cameraOn = !p.cameraOn;
    },
  },
});

export const { addParticipant, removeParticipant, toggleMute, toggleCamera } = slice.actions;
export default slice.reducer;
