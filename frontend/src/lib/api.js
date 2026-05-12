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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
    return apiRequest("/api/auth/register", {
      method: "POST",
      auth: false,
      body: data,
    });
  },
  login(data) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      auth: false,
      body: data,
    });
  },
  logout(refreshToken) {
    return apiRequest("/api/auth/logout", {
      method: "POST",
      auth: false,
      body: { refreshToken },
    });
  },
  me() {
    return apiRequest("/api/auth/me");
  },
};
