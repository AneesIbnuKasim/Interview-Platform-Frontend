import axios from "axios";
import { API_CONFIG, AUTH_CONFIG } from "../config/app.js";
import { toast } from "react-toastify";
import qs from "qs";

// LocalStorage helpers
export const getAuthToken = () => localStorage.getItem(AUTH_CONFIG.tokenKey);

export const getAdminToken = () =>
  localStorage.getItem(AUTH_CONFIG.adminTokenKey);

export const getUser = () => {
  const userData = localStorage.getItem(AUTH_CONFIG.userKey);
  return userData ? JSON.parse(userData) : null;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
  }
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.adminTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  }
};

export const setResetToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.resetTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.resetTokenKey);
  }
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData));
  } else {
    localStorage.removeItem(AUTH_CONFIG.userKey);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  localStorage.removeItem(AUTH_CONFIG.userKey);
};

// Axios client with interceptors
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
    paramsSerializer: {
      serialize: (params) =>
        qs.stringify(params, {
          arrayFormat: "comma",
          skipNulls: true,
        }),
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken() || getAdminToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error.response?.status === 401) {
      //   clearTokens();
      //   toast.error("Session expired. Please login again.");
        
      //   return Promise.reject(error);
      // }
      console.log('err', error)

      if (error.response?.status === 403) {
        if (error.response?.data?.banned) {
          clearTokens();
          toast.error("Your account has been banned. Please contact support.");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        toast.error("Access denied. Insufficient permissions.");
        return Promise.reject(error);
      }
      if (error.response?.status === 429) {
    const msg = error.response.data
    toast.error(msg)   // or setError(msg)
  }
      if (error?.response?.status === 401) {
    const msg = error?.response?.data?.message
    clearTokens()
    window.location.href = "/login"
    toast.error(msg)
    return Promise.reject(error);
  }

      //backend actual response
      const backendError = error.response?.data?.error;

      //normalize BE response to preserve all error details
      const normalizedError = {
        message: backendError?.message || "Request failed",
        code: backendError?.code || error.code,
        statusCode: backendError?.statusCode || error.response?.status || error.status,
        raw: error,
      };
      console.log('sts code', normalizedError.statusCode);
      
      

      if (normalizedError.statusCode !== 401 && normalizedError.statusCode !== 403 && normalizedError.statusCode !== 429) {
        toast.error("Server error. Please try again later.");
      }
      return Promise.reject(normalizedError);
    }
  );
  return client;
};

export const apiClient = createApiClient();

// API request wrapper
export const makeRequest = async (config) => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default makeRequest;
