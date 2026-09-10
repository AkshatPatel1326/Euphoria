// ─────────────────────────────────────────────────────────────
// useAuth — JWT-based backend authentication hook
// Replaces the previous Convex Auth hook.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { apiPost, apiGet } from "@/lib/api";
import {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  type AuthUser,
} from "@/lib/auth-store";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

interface MeResponse {
  status: string;
  data: {
    user: AuthUser;
  };
}

export function useAuth() {
  const [user, setUserState] = useState<AuthUser | null>(getUser());
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // On mount, hydrate user from stored token via GET /api/auth/me
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // If we already have a cached user, use it immediately
    const cached = getUser();
    if (cached) {
      setUserState(cached);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch user profile from backend
    apiGet<MeResponse>("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setUserState(res.data.user);
      })
      .catch(() => {
        // Token invalid or expired — clear auth state
        clearToken();
        clearUser();
        setUserState(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<AuthResponse>("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    setUserState(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await apiPost<AuthResponse>("/auth/register", input);
    setToken(res.data.token);
    setUser(res.data.user);
    setUserState(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearUser();
    setUserState(null);
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user,
    login,
    register,
    logout,
  };
}
