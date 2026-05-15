import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession,
} from "@/lib/authStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(payload, fallback) {
  if (payload?.error?.details?.length) {
    return payload.error.details.map((item) => item.message).join(", ");
  }

  return payload?.error?.message || payload?.message || fallback;
}

async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const payload = await parseResponse(response);

  if (!response.ok || !payload?.success) {
    clearAuthSession();
    return null;
  }

  setAuthSession(payload.data);
  return payload.data.accessToken;
}

export async function apiRequest(path, options = {}) {
  const { auth = true, retry = true, headers, body, ...fetchOptions } = options;
  const token = auth ? getAccessToken() : null;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined && !isFormData ? JSON.stringify(body) : body,
  });
  const payload = await parseResponse(response);

  if (response.status === 401 && auth && retry) {
    const newAccessToken = await refreshSession();
    if (newAccessToken) {
      return apiRequest(path, { ...options, retry: false });
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, "Request failed"));
  }

  return payload?.data ?? payload;
}

export const authApi = {
  register(data) {
    return apiRequest("/auth/register", {
      method: "POST",
      auth: false,
      body: data,
    });
  },
  login(data) {
    return apiRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: data,
    });
  },
  logout(refreshToken) {
    return apiRequest("/auth/logout", {
      method: "POST",
      auth: false,
      body: { refreshToken },
    });
  },
  me() {
    return apiRequest("/auth/me");
  },
};

export const usersApi = {
  me() {
    return apiRequest("/users/me");
  },
  updateMe(data) {
    return apiRequest("/users/me", {
      method: "PATCH",
      body: data,
    });
  },
};

export const roomsApi = {
  list() {
    return apiRequest("/rooms");
  },
  create(data = {}) {
    return apiRequest("/rooms", {
      method: "POST",
      body: data,
    });
  },
  get(roomId) {
    return apiRequest(`/rooms/${encodeURIComponent(roomId)}`);
  },
  join(roomId, data = {}) {
    return apiRequest(`/rooms/${encodeURIComponent(roomId)}/join`, {
      method: "POST",
      body: data,
    });
  },
  joinByCode(roomCode, data = {}) {
    return apiRequest("/rooms/join", {
      method: "POST",
      body: { roomCode, ...data },
    });
  },
  leave(roomId) {
    return apiRequest(`/rooms/${encodeURIComponent(roomId)}/leave`, {
      method: "POST",
    });
  },
  updateStatus(roomId, status) {
    return apiRequest(`/rooms/${encodeURIComponent(roomId)}/status`, {
      method: "PATCH",
      body: { status },
    });
  },
};

export const screenshotsApi = {
  list(roomId) {
    return apiRequest(`/rooms/${encodeURIComponent(roomId)}/screenshots`);
  },
  upload(roomId, file, data = {}) {
    const formData = new FormData();
    formData.append("screenshot", file);

    if (data.title) {
      formData.append("title", data.title);
    }

    return apiRequest(`/rooms/${encodeURIComponent(roomId)}/screenshots`, {
      method: "POST",
      body: formData,
    });
  },
};

export const editorApi = {
  run(roomId, data) {
    return apiRequest(`/editor/${encodeURIComponent(roomId)}/run`, {
      method: "POST",
      body: data,
    });
  },
};

export const notificationsApi = {
  list(params = {}) {
    const query = new URLSearchParams();

    if (params.limit) {
      query.set("limit", String(params.limit));
    }

    if (params.unreadOnly) {
      query.set("unreadOnly", "true");
    }

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/notifications${suffix}`);
  },
  markAllRead() {
    return apiRequest("/notifications/read", {
      method: "PATCH",
    });
  },
  markOneRead(notificationId) {
    return apiRequest(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: "PATCH",
      },
    );
  },
};
