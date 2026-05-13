import { io } from "socket.io-client";
import { getAccessToken } from "@/lib/authStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");

export const socketEvents = {
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",

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
