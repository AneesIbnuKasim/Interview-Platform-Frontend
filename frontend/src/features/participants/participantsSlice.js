import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: "u1",
      name: "You",
      role: "interviewer",
      muted: false,
      cameraOn: true,
      quality: "good",
      color: "#7c3aed",
    },
    {
      id: "u2",
      name: "Aisha Patel",
      role: "candidate",
      speaking: true,
      muted: false,
      cameraOn: true,
      quality: "good",
      color: "#06b6d4",
    },
    {
      id: "u3",
      name: "Marco Diaz",
      role: "interviewer",
      muted: true,
      cameraOn: false,
      quality: "ok",
      color: "#ec4899",
    },
  ],
};

const slice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    setParticipants(state, action) {
      state.list = action.payload;
    },
    addParticipant(state, action) {
      state.list.push(action.payload);
    },
    removeParticipant(state, action) {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    toggleMute(state, action) {
      const p = state.list.find((p) => p.id === action.payload);
      if (p) p.muted = !p.muted;
    },
    toggleCamera(state, action) {
      const p = state.list.find((p) => p.id === action.payload);
      if (p) p.cameraOn = !p.cameraOn;
    },
    updateParticipantMedia(state, action) {
      const participant = action.payload;
      const p = state.list.find((item) => item.id === participant.userId);
      if (!p) return;

      p.muted = participant.media?.micOn === false;
      p.cameraOn = participant.media?.cameraOn !== false;
      p.speaking = Boolean(participant.media?.speaking);
      p.screenSharing = Boolean(participant.media?.screenSharing);
    },
  },
});

export const {
  setParticipants,
  addParticipant,
  removeParticipant,
  toggleMute,
  toggleCamera,
  updateParticipantMedia,
} = slice.actions;
export default slice.reducer;
