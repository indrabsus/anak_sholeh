"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, DemoUser } from "@/lib/api";

interface AuthContextType {
  currentUser: DemoUser | null;
  demoUsers: DemoUser[];
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (userId: number) => Promise<void>;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);

        if (typeof window !== "undefined") {
          const savedToken = localStorage.getItem("anak_sholeh_token");
          const savedId = localStorage.getItem("anak_sholeh_active_user_id");
          if (savedToken) setToken(savedToken);

          if (users.length > 0) {
            const found = users.find(u => String(u.id) === savedId) || users[0];
            setCurrentUser(found);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setCurrentUser(res.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("anak_sholeh_token", res.token);
          localStorage.setItem("anak_sholeh_active_user_id", String(res.user.id));
        }
        return { success: true };
      }
      return { success: false, message: res.message || "Email atau password salah." };
    } catch (err: any) {
      return { success: false, message: err.message || "Gagal menghubungi server." };
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("anak_sholeh_token");
    }
    if (demoUsers.length > 0) {
      setCurrentUser(demoUsers[0]);
    }
  };

  const switchUser = async (userId: number) => {
    const selected = demoUsers.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      if (typeof window !== "undefined") {
        localStorage.setItem("anak_sholeh_active_user_id", String(userId));
      }
      try {
        const res = await api.quickSwitch(userId);
        if (res.token) {
          setToken(res.token);
          if (typeof window !== "undefined") {
            localStorage.setItem("anak_sholeh_token", res.token);
          }
        }
      } catch (e) {
        // silent fallback
      }
    }
  };

  const refreshUserData = async () => {
    const users = await api.getDemoUsers();
    setDemoUsers(users);
    if (currentUser) {
      const refreshed = users.find(u => u.id === currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        demoUsers,
        token,
        isLoading,
        login,
        logout,
        switchUser,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
