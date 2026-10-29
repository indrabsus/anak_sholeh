"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Users, Server, Bell, Shield, Sparkles, BookOpen } from "lucide-react";

export default function Header() {
  const { currentUser, setIsRoleModalOpen } = useAuth();
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(res => setServerOk(res.success))
      .catch(() => setServerOk(false));
  }, []);

  const getRoleBadgeColor = (role: string = "") => {
    switch (role) {
      case "siswa": return "bg-emerald-500/10 text-emerald-600 border-emerald-300";
      case "orang_tua": return "bg-blue-500/10 text-blue-600 border-blue-300";
      case "dkm": return "bg-amber-500/10 text-amber-600 border-amber-300";
      case "guru_agama": return "bg-purple-500/10 text-purple-600 border-purple-300";
      case "admin_sekolah": return "bg-indigo-500/10 text-indigo-600 border-indigo-300";
      case "pemerintah": return "bg-rose-500/10 text-rose-600 border-rose-300";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                  ANAK <span className="text-emerald-600">SHOLEH</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  v1.0 Cimahi
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block font-medium">
                Belajar • Berakhlak • Bertumbuh
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Server Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600 font-medium">
              <Server className="w-3.5 h-3.5 text-gray-400" />
              <span>Express API:</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className={`w-2 h-2 rounded-full ${serverOk ? 'bg-emerald-500 animate-pulse' : serverOk === false ? 'bg-red-500' : 'bg-amber-400'}`} />
                {serverOk ? '103.158.96.244:5000' : 'Offline Mode'}
              </span>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-gray-800 text-xs sm:text-sm font-semibold transition border border-gray-300/70 shadow-sm"
              title="Ganti Peran Pengguna (RBAC Simulation)"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <div className="text-left hidden xs:block">
                <span className="block text-[10px] text-gray-400 font-normal leading-tight">Peran Aktif</span>
                <span className="font-bold text-gray-800">{currentUser?.role_label || "Pilih Peran"}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-600 text-white font-medium ml-1">
                Ganti
              </span>
            </button>

            {/* Active User Avatar */}
            {currentUser && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 text-white flex items-center justify-center font-bold shadow-sm">
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
