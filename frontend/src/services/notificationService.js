import { notificationsApi } from "@/lib/api";

export const notificationService = {
  listNotifications(params) {
    return notificationsApi.list(params);
  },
  markAllRead() {
    return notificationsApi.markAllRead();
  },
  markOneRead(notificationId) {
    return notificationsApi.markOneRead(notificationId);
  },
};
