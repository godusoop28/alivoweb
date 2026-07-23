"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginRequest } from "@/lib/api/auth";
import { getToken, setToken as persistToken } from "@/lib/api/client";
import { AuthUser } from "@/lib/api/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe(token)
      .then(({ user }) => setUser(user))
      .catch(() => persistToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    persistToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
