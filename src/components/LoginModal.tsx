"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, Eye, EyeOff, LogIn, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { AnakSholehLogo } from "@/components/icons/AnakSholehLogo";

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, demoUsers, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Alhamdulillah, berhasil masuk ke akun!");
      setTimeout(() => {
        setIsLoginModalOpen(false);
        setSuccessMsg(null);
      }, 1000);
    } else {
      setErrorMsg(res.message || "Email atau password salah.");
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password123");
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <AnakSholehLogo className="w-9 h-9" size="sm" />
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Title */}
        <div className="mt-4">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Masuk ke Akun
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Gunakan email terdaftar untuk mengakses hak akses peran Anda
          </p>
        </div>

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Pengguna</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@anaksholeh.id"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
          </button>
        </form>

        {/* Quick Fill Demo Roles Section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B63F]" />
            Klik Cepat Kredensial 6 Role (Demo)
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill("siswa@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              🎓 Siswa
              <span className="block text-[10px] text-gray-400 font-normal">siswa@anaksholeh.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("orangtua@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              👨‍👩‍👧 Orang Tua
              <span className="block text-[10px] text-gray-400 font-normal">orangtua@anaksholeh.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("dkm@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-amber-50 hover:border-amber-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              🕌 DKM Masjid
              <span className="block text-[10px] text-gray-400 font-normal">dkm@anaksholeh.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("guru@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-purple-50 hover:border-purple-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              📖 Guru PAI
              <span className="block text-[10px] text-gray-400 font-normal">guru@anaksholeh.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("sekolah@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              🏫 Admin Sekolah
              <span className="block text-[10px] text-gray-400 font-normal">sekolah@anaksholeh.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("pemerintah@anaksholeh.id")}
              className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 hover:border-rose-300 border border-gray-200 text-left transition font-semibold text-gray-800"
            >
              🏛️ Pemerintah
              <span className="block text-[10px] text-gray-400 font-normal">pemerintah@anaksholeh.id</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Semua akun demo menggunakan password bawaan: <code className="bg-gray-100 px-1 py-0.5 rounded font-bold text-gray-700">password123</code>
          </p>
        </div>

      </div>
    </div>
  );
}
