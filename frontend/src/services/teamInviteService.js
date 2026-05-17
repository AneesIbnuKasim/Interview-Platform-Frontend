import { teamInvitesApi } from "@/lib/api";

export const teamInviteService = {
  listInvitations(params) {
    return teamInvitesApi.list(params);
  },
  sendInvitation(payload) {
    return teamInvitesApi.send(payload);
  },
  resendInvitation(invitationId) {
    return teamInvitesApi.resend(invitationId);
  },
};
