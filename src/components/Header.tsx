"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Users, Server, Bell, Shield, Sparkles } from "lucide-react";
import { AnakSholehLogo } from "@/components/icons/AnakSholehLogo";

export default function Header() {
  const { currentUser, setIsRoleModalOpen } = useAuth();
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(res => setServerOk(res.success))
      .catch(() => setServerOk(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo Official Identity */}
          <AnakSholehLogo className="w-11 h-11 sm:w-13 sm:h-13" size="md" />

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Server Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/60 border border-emerald-200 text-xs text-gray-700 font-medium">
              <Server className="w-3.5 h-3.5 text-[#0E7A49]" />
              <span>Backend Express:</span>
              <span className="flex items-center gap-1.5 font-bold text-[#0E7A49]">
                <span className={`w-2 h-2 rounded-full ${serverOk ? 'bg-[#7ED957] animate-pulse' : serverOk === false ? 'bg-red-500' : 'bg-[#F4B63F]'}`} />
                {serverOk ? '103.158.96.244:5000' : 'Offline'}
              </span>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold transition border border-gray-300/70 shadow-xs"
              title="Ganti Peran Pengguna (RBAC Simulation)"
            >
              <Users className="w-4 h-4 text-[#0E7A49]" />
              <div className="text-left hidden xs:block">
                <span className="block text-[10px] text-gray-400 font-normal leading-tight">Peran Aktif</span>
                <span className="font-bold text-gray-800">{currentUser?.role_label || "Pilih Peran"}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-[#0E7A49] text-white font-bold ml-1">
                Ganti
              </span>
            </button>

            {/* Active User Avatar */}
            {currentUser && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#0E7A49] to-[#7ED957] p-0.5 text-white flex items-center justify-center font-bold shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-bold text-gray-800 leading-tight">{currentUser.name}</p>
                  <p className="text-gray-400">{currentUser.email}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
