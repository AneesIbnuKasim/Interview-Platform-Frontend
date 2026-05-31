import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession,
} from "@/lib/authStorage";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Debug log for all environments (we can remove this once fixed)
  console.log("[API Configuration] Mode:", import.meta.env.MODE);
  console.log("[API Configuration] VITE_API_URL from env:", envUrl);
  console.log("[API Configuration] Available VITE keys:", 
    Object.keys(import.meta.env).filter(key => key.startsWith("VITE_"))
  );

  if (envUrl && envUrl.trim() !== "") {
    return envUrl;
  }

  // Fallback for development
  if (import.meta.env.DEV) {
    return "http://localhost:5001/api";
  }

  // In production, if VITE_API_URL is missing, we might want to log a warning
  // or use a relative path if the API is served from the same domain.
  console.warn("VITE_API_URL is not defined in production environment!");
  return "/api"; // Try relative path as a last resort
};

const API_BASE_URL = getApiBaseUrl();

if (import.meta.env.DEV) {
  console.log(`[API] Using base URL: ${API_BASE_URL}`);
}

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
  admitParticipant(roomId, participantId) {
    return apiRequest(
      `/rooms/${encodeURIComponent(roomId)}/participants/${encodeURIComponent(participantId)}/admit`,
      {
        method: "PATCH",
      },
    );
  },
  denyParticipant(roomId, participantId) {
    return apiRequest(
      `/rooms/${encodeURIComponent(roomId)}/participants/${encodeURIComponent(participantId)}/deny`,
      {
        method: "PATCH",
      },
    );
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
  runPlayground(data) {
    return apiRequest("/editor/run", {
      method: "POST",
      body: data,
    });
  },
  listPlaygroundFiles() {
    return apiRequest("/editor/playground-files");
  },
  createPlaygroundFile(data) {
    return apiRequest("/editor/playground-files", {
      method: "POST",
      body: data,
    });
  },
  updatePlaygroundFile(fileId, data) {
    return apiRequest(
      `/editor/playground-files/${encodeURIComponent(fileId)}`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },
  openPlaygroundFile(fileId) {
    return apiRequest(
      `/editor/playground-files/${encodeURIComponent(fileId)}/open`,
      {
        method: "PATCH",
      },
    );
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

export const teamInvitesApi = {
  list(params = {}) {
    const query = new URLSearchParams();

    if (params.limit) {
      query.set("limit", String(params.limit));
    }

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/team/invitations${suffix}`);
  },
  send(data) {
    return apiRequest("/team/invitations", {
      method: "POST",
      body: data,
    });
  },
  resend(invitationId) {
    return apiRequest(
      `/team/invitations/${encodeURIComponent(invitationId)}/resend`,
      {
        method: "POST",
      },
    );
  },
};
