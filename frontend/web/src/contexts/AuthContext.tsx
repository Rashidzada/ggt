import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";
import { api, clearStoredSession, getStoredSession, saveAuthResponse } from "../lib/api";
import type { AuthResponse, User } from "../types/api";
import type { LoginPayload, ProfilePayload, RegisterPayload } from "./auth-context";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const session = getStoredSession();
      if (!session?.access) {
        setIsLoading(false);
        return;
      }

      setUser(session.user);

      try {
        const { data } = await api.get<User>("/auth/me/");
        const nextSession = { ...session, user: data };
        saveAuthResponse({
          access: nextSession.access,
          refresh: nextSession.refresh,
          user: data,
        });
        setUser(data);
      } catch {
        clearStoredSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/login/", payload);
    saveAuthResponse(data);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/register/", payload);
    saveAuthResponse(data);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const session = getStoredSession();
    if (session?.refresh) {
      try {
        await api.post("/auth/logout/", { refresh: session.refresh });
      } catch {
        // Token revocation failures should not block local logout.
      }
    }
    clearStoredSession();
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!getStoredSession()) {
      return null;
    }
    const session = getStoredSession();
    const { data } = await api.get<User>("/auth/me/");
    if (session) {
      saveAuthResponse({
        access: session.access,
        refresh: session.refresh,
        user: data,
      });
    }
    setUser(data);
    return data;
  };

  const updateProfile = async (payload: ProfilePayload) => {
    const session = getStoredSession();
    const { data } = await api.patch<User>("/auth/me/", payload);
    if (session) {
      saveAuthResponse({
        access: session.access,
        refresh: session.refresh,
        user: data,
      });
    }
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
