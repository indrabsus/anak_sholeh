"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { X, CheckCircle, Shield, Award, School, Building2, User, Heart } from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function RoleSwitcherModal() {
  const { isRoleModalOpen, setIsRoleModalOpen, demoUsers, currentUser, switchUser } = useAuth();

  if (!isRoleModalOpen) return null;

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "siswa": return <Award className="w-5 h-5 text-emerald-600" />;
      case "orang_tua": return <Heart className="w-5 h-5 text-blue-600" />;
      case "dkm": return <MosqueIcon className="w-5 h-5 text-amber-600" />;
      case "guru_agama": return <School className="w-5 h-5 text-purple-600" />;
      case "admin_sekolah": return <Building2 className="w-5 h-5 text-indigo-600" />;
      case "pemerintah": return <Shield className="w-5 h-5 text-rose-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleAuthorityDescription = (roleName: string) => {
    switch (roleName) {
      case "siswa": return "Pencatatan Mandiri 4 Kebiasaan Inti, Buku Kendali Pribadi, Gamifikasi & Prestasi";
      case "orang_tua": return "Monitoring Perkembangan Anak, Catatan Pembinaan Penuh Kasih, Dialog Ramah";
      case "dkm": return "Verifikasi Kehadiran Subuh & Maghrib di Masjid Agung Cimahi, Binaan Masjid";
      case "guru_agama": return "Monitoring Siswa Kelas, Bimbingan Akhlak & Catatan Evaluasi";
      case "admin_sekolah": return "Rekap Aktivitas Sekolah, Laporan Kelas, Integrasi Sekolah & Masjid";
      case "pemerintah": return "Dashboard Agregat Wilayah Kota Cimahi, Statistik Partisipasi (Privasi Anak Terlindungi)";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Pilih Peran Pengguna (RBAC Simulation)
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Uji pengalaman pengguna untuk masing-masing ekosistem pendamping anak.
            </p>
          </div>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="grid gap-3 mt-6">
          {demoUsers.map((user) => {
            const isSelected = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsRoleModalOpen(false);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`p-3 rounded-2xl flex-shrink-0 ${isSelected ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                  {getRoleIcon(user.role_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                      {user.name}
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                      {user.role_label}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {getRoleAuthorityDescription(user.role_name)}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                    <span>{user.email}</span>
                    {user.school_name && <span>• {user.school_name}</span>}
                    {user.mosque_name && <span>• {user.mosque_name}</span>}
                  </div>
                </div>

                <div className="flex items-center self-center pl-2">
                  {isSelected ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Hak akses otomatis menyesuaikan matriks RBAC sistem
          </span>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
