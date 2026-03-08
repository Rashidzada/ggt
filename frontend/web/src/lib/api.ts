import axios from "axios";

import type { AuthResponse, PaginatedResponse, User } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8010/api";
const SESSION_KEY = "gogreentech.session";

export interface StoredSession {
  access: string;
  refresh: string;
  user: User;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getStoredSession(): StoredSession | null {
  const rawValue = window.localStorage.getItem(SESSION_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function persistSession(session: StoredSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

api.interceptors.request.use((config) => {
  const session = getStoredSession();
  if (session?.access) {
    config.headers.Authorization = `Bearer ${session.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    if (!originalRequest || originalRequest._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const session = getStoredSession();
    if (!session?.refresh || originalRequest.url?.includes("/auth/refresh/")) {
      clearStoredSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post<{ access: string; refresh?: string }>(
        `${API_BASE_URL}/auth/refresh/`,
        { refresh: session.refresh },
      );
      const nextSession: StoredSession = {
        ...session,
        access: refreshResponse.data.access,
        refresh: refreshResponse.data.refresh ?? session.refresh,
      };
      persistSession(nextSession);
      originalRequest.headers.Authorization = `Bearer ${nextSession.access}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearStoredSession();
      return Promise.reject(refreshError);
    }
  },
);

export function extractResults<T>(payload: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.results;
}

export function saveAuthResponse(payload: AuthResponse) {
  persistSession({
    access: payload.access,
    refresh: payload.refresh,
    user: payload.user,
  });
}

export function buildGlobalWhatsAppUrl(message: string) {
  return `https://wa.me/923470983567?text=${encodeURIComponent(message)}`;
}

export function extractApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;

    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;

      if (typeof record.detail === "string" && record.detail.trim()) {
        return record.detail;
      }

      if (Array.isArray(record.non_field_errors) && typeof record.non_field_errors[0] === "string") {
        return record.non_field_errors[0];
      }

      for (const value of Object.values(record)) {
        if (typeof value === "string" && value.trim()) {
          return value;
        }
        if (Array.isArray(value) && typeof value[0] === "string") {
          return value[0];
        }
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
