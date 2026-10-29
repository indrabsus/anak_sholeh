"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { School, Users, BarChart3, BookOpen, CheckCircle, Award } from "lucide-react";

export default function SekolahView() {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getSchoolAnalytics(1)
      .then(res => setData(res.data))
      .catch(err => console.error("School analytics error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <School className="w-3.5 h-3.5 text-indigo-200" />
              <span>Modul Integrasi Sekolah & Karakter Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser?.school_name || "SDN Mandiri 1 Kota Cimahi"}
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base mt-1 max-w-xl">
              Memantau pembiasaan karakter dan ibadah harian peserta didik secara komprehensif tanpa membebani administrasi guru.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
            <span className="text-2xl sm:text-3xl font-black text-indigo-200">94.2%</span>
            <p className="text-xs text-indigo-100 font-medium mt-0.5">Partisipasi Aktif</p>
          </div>
        </div>
      </div>

      {/* Class Recap Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 tracking-tight">
          Rekap Kelas Binaan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Tingkat 4
              </span>
              <span className="text-xs text-emerald-600 font-bold">96% Aktif</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Kelas 4A Umar bin Khattab</h3>
            <p className="text-xs text-gray-500 mt-1">Wali Kelas: Ibu Aisyah Rahmawati, S.Pd.I</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span>Siswa Terdaftar: 28 Anak</span>
              <span className="text-emerald-600 font-semibold">12 Verifikasi Hari Ini</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Tingkat 5
              </span>
              <span className="text-xs text-emerald-600 font-bold">91% Aktif</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Kelas 5B Ali bin Abi Thalib</h3>
            <p className="text-xs text-gray-500 mt-1">Wali Kelas: Ustadz M. Ridwan, S.Pd</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span>Siswa Terdaftar: 30 Anak</span>
              <span className="text-emerald-600 font-semibold">9 Verifikasi Hari Ini</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Tingkat 6
              </span>
              <span className="text-xs text-emerald-600 font-bold">89% Aktif</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Kelas 6A Abu Bakar Ash-Shiddiq</h3>
            <p className="text-xs text-gray-500 mt-1">Wali Kelas: Ibu Siti Fatimah, M.Pd</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span>Siswa Terdaftar: 27 Anak</span>
              <span className="text-emerald-600 font-semibold">15 Verifikasi Hari Ini</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
