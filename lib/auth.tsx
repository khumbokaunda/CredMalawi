"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DemoAccount, Role } from "./types";
import { demoAccounts } from "./seed";

const STORAGE_KEY = "credmalawi:auth:v1";

export function homePathForRole(role: Role): string {
  switch (role) {
    case "institution":
      return "/institution/dashboard";
    case "student":
      return "/student/credentials";
    case "admin":
      return "/admin/overview";
  }
}

interface AuthContextValue {
  user: DemoAccount | null;
  ready: boolean;
  /** Email/password login. Any password is accepted in the demo. */
  login: (email: string) => DemoAccount | null;
  /** One-click role login for live presenting. */
  quickLogin: (role: Role) => DemoAccount;
  switchRole: (role: Role) => DemoAccount;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function accountForRole(role: Role): DemoAccount {
  return demoAccounts.find((a) => a.role === role)!;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoAccount | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as DemoAccount);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((u: DemoAccount | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(
    (email: string) => {
      const found = demoAccounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (found) persist(found);
      return found ?? null;
    },
    [persist]
  );

  const quickLogin = useCallback(
    (role: Role) => {
      const acc = accountForRole(role);
      persist(acc);
      return acc;
    },
    [persist]
  );

  const switchRole = useCallback(
    (role: Role) => {
      const acc = accountForRole(role);
      persist(acc);
      return acc;
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, login, quickLogin, switchRole, logout }),
    [user, ready, login, quickLogin, switchRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
