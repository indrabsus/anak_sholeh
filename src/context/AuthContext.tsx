"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, DemoUser } from "@/lib/api";

interface AuthContextType {
  currentUser: DemoUser | null;
  demoUsers: DemoUser[];
  isLoading: boolean;
  switchUser: (userId: number) => Promise<void>;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);
        if (users.length > 0) {
          // default to Ahmad Rizky (Siswa) or saved in localStorage
          const savedId = typeof window !== "undefined" ? localStorage.getItem("anak_sholeh_active_user_id") : null;
          const found = users.find(u => String(u.id) === savedId) || users[0];
          setCurrentUser(found);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const switchUser = async (userId: number) => {
    const selected = demoUsers.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      if (typeof window !== "undefined") {
        localStorage.setItem("anak_sholeh_active_user_id", String(userId));
      }
      try {
        await api.quickSwitch(userId);
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
        isLoading,
        switchUser,
        isRoleModalOpen,
        setIsRoleModalOpen,
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
