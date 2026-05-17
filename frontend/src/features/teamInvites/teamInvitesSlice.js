import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teamInviteService } from "@/services/teamInviteService";

const initialState = {
  items: [],
  status: "idle",
  sending: false,
  resendingId: null,
  error: null,
  lastSent: null,
};

function inviteError(error) {
  return error?.message || "Team invite request failed";
}

function upsertInvite(items, invitation) {
  if (!invitation) return items;

  const exists = items.some((item) => item.id === invitation.id);
  if (!exists) return [invitation, ...items];

  return items.map((item) => {
    return item.id === invitation.id ? invitation : item;
  });
}

export const fetchTeamInvites = createAsyncThunk(
  "teamInvites/list",
  async (_, { rejectWithValue }) => {
    try {
      const data = await teamInviteService.listInvitations({ limit: 20 });
      return data.invitations ?? [];
    } catch (error) {
      return rejectWithValue(inviteError(error));
    }
  },
);

export const sendTeamInvite = createAsyncThunk(
  "teamInvites/send",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await teamInviteService.sendInvitation(payload);
      return data.invitation;
    } catch (error) {
      return rejectWithValue(inviteError(error));
    }
  },
);

export const resendTeamInvite = createAsyncThunk(
  "teamInvites/resend",
  async (invitationId, { rejectWithValue }) => {
    try {
      const data = await teamInviteService.resendInvitation(invitationId);
      return data.invitation;
    } catch (error) {
      return rejectWithValue(inviteError(error));
    }
  },
);

const slice = createSlice({
  name: "teamInvites",
  initialState,
  reducers: {
    clearTeamInviteFeedback(state) {
      state.error = null;
      state.lastSent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamInvites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeamInvites.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(fetchTeamInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendTeamInvite.pending, (state) => {
        state.sending = true;
        state.error = null;
        state.lastSent = null;
      })
      .addCase(sendTeamInvite.fulfilled, (state, action) => {
        state.sending = false;
        state.status = "ready";
        state.lastSent = action.payload;
        state.items = upsertInvite(state.items, action.payload);
      })
      .addCase(sendTeamInvite.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(resendTeamInvite.pending, (state, action) => {
        state.resendingId = action.meta.arg;
        state.error = null;
        state.lastSent = null;
      })
      .addCase(resendTeamInvite.fulfilled, (state, action) => {
        state.resendingId = null;
        state.lastSent = action.payload;
        state.items = upsertInvite(state.items, action.payload);
      })
      .addCase(resendTeamInvite.rejected, (state, action) => {
        state.resendingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearTeamInviteFeedback } = slice.actions;
export default slice.reducer;
