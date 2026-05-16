import { roomsApi, screenshotsApi } from "@/lib/api";

export const roomService = {
  listRooms() {
    return roomsApi.list();
  },
  createRoom(payload) {
    return roomsApi.create(payload);
  },
  fetchRoom(roomId) {
    return roomsApi.get(roomId);
  },
  joinRoom(roomId, payload) {
    return roomsApi.join(roomId, payload);
  },
  joinRoomByCode(roomCode, payload) {
    return roomsApi.joinByCode(roomCode, payload);
  },
  leaveRoom(roomId) {
    return roomsApi.leave(roomId);
  },
  updateRoomStatus(roomId, status) {
    return roomsApi.updateStatus(roomId, status);
  },
  admitParticipant(roomId, participantId) {
    return roomsApi.admitParticipant(roomId, participantId);
  },
  denyParticipant(roomId, participantId) {
    return roomsApi.denyParticipant(roomId, participantId);
  },
  listScreenshots(roomId) {
    return screenshotsApi.list(roomId);
  },
  uploadScreenshot(roomId, file, payload) {
    return screenshotsApi.upload(roomId, file, payload);
  },
};
