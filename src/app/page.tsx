"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SiswaView from "@/components/views/SiswaView";
import OrangTuaView from "@/components/views/OrangTuaView";
import DkmView from "@/components/views/DkmView";
import SekolahView from "@/components/views/SekolahView";
import PemerintahView from "@/components/views/PemerintahView";
import { Award, Heart, School, Shield, Sparkles } from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function Home() {
  const { currentUser, switchUser, demoUsers, isLoading } = useAuth();
  const [activeTabOverride, setActiveTabOverride] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Memuat Ekosistem Anak Sholeh...</p>
      </div>
    );
  }

  // Active view: either override by tab or determined by currentUser role
  const activeRole = activeTabOverride || currentUser?.role_name || "siswa";

  return (
    <div className="space-y-6">
      
      {/* Quick Role Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200/80 shadow-sm flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => {
            setActiveTabOverride("siswa");
            const user = demoUsers.find(u => u.role_name === "siswa");
            if (user) switchUser(user.id);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            activeRole === "siswa"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Siswa / Murid</span>
        </button>

        <button
          onClick={() => {
            setActiveTabOverride("orang_tua");
            const user = demoUsers.find(u => u.role_name === "orang_tua");
            if (user) switchUser(user.id);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            activeRole === "orang_tua"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Orang Tua</span>
        </button>

        <button
          onClick={() => {
            setActiveTabOverride("dkm");
            const user = demoUsers.find(u => u.role_name === "dkm");
            if (user) switchUser(user.id);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            activeRole === "dkm"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <MosqueIcon className="w-4 h-4" />
          <span>DKM / Masjid</span>
        </button>

        <button
          onClick={() => {
            setActiveTabOverride("admin_sekolah");
            const user = demoUsers.find(u => u.role_name === "admin_sekolah" || u.role_name === "guru_agama");
            if (user) switchUser(user.id);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            activeRole === "admin_sekolah" || activeRole === "guru_agama"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <School className="w-4 h-4" />
          <span>Sekolah & Guru</span>
        </button>

        <button
          onClick={() => {
            setActiveTabOverride("pemerintah");
            const user = demoUsers.find(u => u.role_name === "pemerintah");
            if (user) switchUser(user.id);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            activeRole === "pemerintah"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Pemerintah (Cimahi)</span>
        </button>

      </div>

      {/* View Component Based on Active Role */}
      {activeRole === "siswa" && <SiswaView />}
      {activeRole === "orang_tua" && <OrangTuaView />}
      {activeRole === "dkm" && <DkmView />}
      {(activeRole === "admin_sekolah" || activeRole === "guru_agama") && <SekolahView />}
      {activeRole === "pemerintah" && <PemerintahView />}

    </div>
  );
}
