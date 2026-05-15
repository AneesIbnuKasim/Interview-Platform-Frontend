import { usersApi } from "@/lib/api";

export const userService = {
  updateProfile(payload) {
    return usersApi.updateMe(payload);
  },
};
