import { io } from "socket.io-client";
import { getAccessToken } from "@/lib/authStorage";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5001/api";
  }
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");

if (import.meta.env.DEV) {
  console.log(`[Socket] Using socket URL: ${SOCKET_URL}`);
}

export const socketEvents = {
  ROOM_JOIN: "room:join",
  ROOM_JOIN_REQUESTED: "room:join-requested",
  ROOM_LEAVE: "room:leave",
  ROOM_STATE: "room:state",
  PARTICIPANTS_STATE: "participants:state",

  EDITOR_REQUEST_STATE: "editor:request-state",
  EDITOR_STATE: "editor:state",
  EDITOR_CHANGE: "editor:change",
  EDITOR_CHANGED: "editor:changed",
  EDITOR_LANGUAGE_CHANGE: "editor:language-change",
  EDITOR_LANGUAGE_CHANGED: "editor:language-changed",
  EDITOR_SAVE: "editor:save",
  EDITOR_SAVED: "editor:saved",
  EDITOR_SYNC_ERROR: "editor:sync-error",

  CHAT_HISTORY_REQUEST: "chat:history-request",
  CHAT_HISTORY: "chat:history",
  CHAT_MESSAGE_SEND: "chat:message-send",
  CHAT_MESSAGE_CREATED: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_READ: "chat:read",
  CHAT_ERROR: "chat:error",

  PARTICIPANT_MEDIA_CHANGED: "participant:media-changed",
  MEDIA_MIC_TOGGLE: "media:mic-toggle",
  MEDIA_CAMERA_TOGGLE: "media:camera-toggle",
  MEDIA_SPEAKING: "media:speaking",
  MEDIA_SCREEN_SHARE_START: "media:screen-share-start",
  MEDIA_SCREEN_SHARE_STOP: "media:screen-share-stop",
  MEDIA_SCREEN_SHARE_CHANGED: "media:screen-share-changed",

  SIGNAL_OFFER: "signal:offer",
  SIGNAL_ANSWER: "signal:answer",
  SIGNAL_ICE_CANDIDATE: "signal:ice-candidate",

  NOTIFICATION_NEW: "notification:new",
};

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
}

export function connectSocket() {
  const token = getAccessToken();
  if (!token) return null;

  const activeSocket = getSocket();
  activeSocket.auth = { token };

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}
