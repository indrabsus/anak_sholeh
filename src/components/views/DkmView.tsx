"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Activity } from "@/lib/api";
import { 
  CheckCircle2, Clock, AlertCircle, XCircle, 
  Send, Users, BookOpen, Sunrise, Check, Sparkles,
  Calendar, DollarSign, HeartHandshake, FileText, ChevronRight
} from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function DkmView() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"beranda" | "verifikasi" | "kegiatan" | "keuangan">("beranda");
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [verifStatus, setVerifStatus] = useState<"terverifikasi" | "klarifikasi" | "ditolak">("terverifikasi");
  const [verifNote, setVerifNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, [currentUser]);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const q = await api.getVerificationQueue(1);
      setQueue(q);
    } catch (e) {
      console.error("Error loading verification queue:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openVerifyModal = (item: any, defaultStatus: "terverifikasi" | "klarifikasi" = "terverifikasi") => {
    setActiveModalItem(item);
    setVerifStatus(defaultStatus);
    setVerifNote(defaultStatus === "terverifikasi" ? "Alhamdulillah hadir sholat berjamaah tepat waktu dan tertib." : "");
    setFeedback(null);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.verifyActivity({
        activity_id: activeModalItem.id,
        status: verifStatus,
        notes: verifNote
      });

      if (res.success) {
        setFeedback(`Aktivitas berhasil diubah menjadi: ${verifStatus}`);
        setTimeout(() => {
          setActiveModalItem(null);
          loadQueue();
        }, 1000);
      }
    } catch (err: any) {
      setFeedback("Gagal verifikasi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Matching Image 1 Mockup */}
      <div className="rounded-3xl bg-white border border-gray-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#0E7A49] to-[#F4B63F] p-1 shadow-md">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-2xl text-[#0E7A49]">
                H
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-semibold">Assalamu'alaikum</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                Ust. Hendra
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0E7A49] border border-emerald-200">
                  Ketua DKM Masjid Al-Furqon / Masjid Agung Cimahi
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("verifikasi")}
              className="px-4 py-2.5 rounded-2xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{queue.length} Antrean Verifikasi</span>
            </button>
          </div>

        </div>

        {/* Motivational Banner: "Masjid Al-Furqon: Masjid Ramah Anak Menuju Generasi Sholeh" */}
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7ED957] uppercase tracking-wider block">Pusat Peradaban & Tarbiyah</span>
            <h2 className="text-base sm:text-lg font-extrabold mt-0.5">
              Masjid Al-Furqon • Menuju Generasi Sholeh 🕌
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              "Masjid yang hidup melahirkan generasi sholeh dan masyarakat yang lebih baik."
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm">
            <span>Masjid Ramah Anak</span>
          </div>
        </div>

        {/* 6 Quick Action Menu Buttons from Image 1 Mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-gray-100">
          
          <div 
            onClick={() => setActiveTab("kegiatan")}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/70 transition cursor-pointer text-center"
          >
            <Calendar className="w-5 h-5 text-[#0E7A49] mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Kegiatan Masjid</h5>
            <span className="text-[10px] text-emerald-700">Jadwal & Agenda</span>
          </div>

          <div 
            onClick={() => setActiveTab("verifikasi")}
            className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/70 transition cursor-pointer text-center"
          >
            <Clock className="w-5 h-5 text-[#2D9CDB] mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Jadwal Shalat</h5>
            <span className="text-[10px] text-blue-700">Waktu & Adzan</span>
          </div>

          <div 
            onClick={() => setActiveTab("verifikasi")}
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100/70 transition cursor-pointer text-center"
          >
            <Users className="w-5 h-5 text-[#F4B63F] mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Jamaah & Komunitas</h5>
            <span className="text-[10px] text-amber-700">Data & Partisipasi</span>
          </div>

          <div 
            onClick={() => setActiveTab("verifikasi")}
            className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 hover:bg-purple-100/70 transition cursor-pointer text-center"
          >
            <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Pembinaan Santri</h5>
            <span className="text-[10px] text-purple-700">Tracking Anak</span>
          </div>

          <div 
            onClick={() => setActiveTab("keuangan")}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 hover:bg-rose-100/70 transition cursor-pointer text-center"
          >
            <DollarSign className="w-5 h-5 text-rose-600 mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Keuangan Masjid</h5>
            <span className="text-[10px] text-rose-700">Rp 25.750.000</span>
          </div>

          <div 
            onClick={() => setActiveTab("keuangan")}
            className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 hover:bg-teal-100/70 transition cursor-pointer text-center"
          >
            <HeartHandshake className="w-5 h-5 text-teal-600 mx-auto mb-1.5" />
            <h5 className="font-bold text-xs text-gray-900">Donasi & Wakaf</h5>
            <span className="text-[10px] text-teal-700">Program Khusus</span>
          </div>

        </div>
      </div>

      {/* Statistik Jamaah Minggu Ini (4 Badges from Image 1) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Statistik Jamaah Minggu Ini</h3>
            <p className="text-xs text-gray-500">Rekap kehadiran ibadah berjamaah di lingkungan masjid</p>
          </div>
          <span className="text-xs text-[#0E7A49] font-bold">Terupdate Hari Ini</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-2xl sm:text-3xl font-black text-[#0E7A49] block">542</span>
            <h5 className="font-bold text-xs text-gray-900 mt-1">Subuh Berjamaah</h5>
            <span className="text-[10px] text-emerald-700">Jamaah & Santri</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block">721</span>
            <h5 className="font-bold text-xs text-gray-900 mt-1">Maghrib Berjamaah</h5>
            <span className="text-[10px] text-amber-700">Jamaah & Santri</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 block">416</span>
            <h5 className="font-bold text-xs text-gray-900 mt-1">Kajian Masjid</h5>
            <span className="text-[10px] text-blue-700">Keluarga & Guru</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-2xl sm:text-3xl font-black text-purple-700 block">128</span>
            <h5 className="font-bold text-xs text-gray-900 mt-1">Santri TPQ</h5>
            <span className="text-[10px] text-purple-700">Anak-Anak Sholeh</span>
          </div>
        </div>
      </div>

      {/* VIEW: BERANDA & AGENDA HARI INI */}
      {activeTab === "beranda" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Agenda Hari Ini (Matching Image 1) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Agenda Masjid Hari Ini</h3>
              <span className="text-xs text-gray-400 font-medium">Jadwal Aktif</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-gray-900">Sholat Subuh Berjamaah</h5>
                  <span className="text-[11px] text-gray-400">05:00 • Masjid Al-Furqon</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ✓ Selesai
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-gray-900">Kajian Orang Tua & Guru</h5>
                  <span className="text-[11px] text-gray-400">08:00 • Ruang Utama (Ust. Ahmad)</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
                  Terjadwal
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-gray-900">TPQ Anak-Anak</h5>
                  <span className="text-[11px] text-gray-400">15:30 • Kelas TPQ Masjid</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ✓ Berlangsung
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-gray-900">Kajian Remaja Masjid</h5>
                  <span className="text-[11px] text-gray-400">19:30 • Masjid Al-Furqon</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                  Nanti Malam
                </span>
              </div>
            </div>
          </div>

          {/* Quick Verification Queue Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-base">Antrean Verifikasi Santri</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {queue.length} Tertunda
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Santri yang telah mencatat kehadiran sholat Subuh & Maghrib di masjid ini menunggu verifikasi pembimbing.
              </p>

              {queue.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 mb-2.5 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">{item.student_name}</h5>
                    <span className="text-[10px] text-gray-500">{item.habit_title} • {item.activity_date}</span>
                  </div>
                  <button
                    onClick={() => openVerifyModal(item, "terverifikasi")}
                    className="px-3 py-1.5 rounded-xl bg-[#0E7A49] text-white text-xs font-bold shadow-xs hover:bg-[#0B5E38]"
                  >
                    Verifikasi
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("verifikasi")}
              className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 text-center transition"
            >
              Buka Semua Antrean ({queue.length})
            </button>
          </div>

        </div>
      )}

      {/* VIEW: ANTREAN VERIFIKASI LENGKAP */}
      {activeTab === "verifikasi" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Antrean Verifikasi Kehadiran Anak</h3>
              <p className="text-xs text-gray-500">Periksa dan berikan catatan pembinaan yang membangun karakter anak</p>
            </div>
            <button
              onClick={loadQueue}
              className="text-xs font-bold text-[#0E7A49] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100"
            >
              Segarkan
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#0E7A49] mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 text-base">Semua Kehadiran Santri Telah Diverifikasi!</h4>
              <p className="text-xs text-gray-400 mt-1">Tidak ada catatan ibadah yang tertunda saat ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {queue.map((item) => (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{item.student_name}</h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.habit_code}: {item.habit_title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block mt-0.5">Tanggal: {item.activity_date} ({item.time_slot}) • {item.class_name || "Kelas 4A"}</span>
                    <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2 rounded-xl">
                      "{item.notes || 'Hadir sholat berjamaah di masjid.'}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openVerifyModal(item, "klarifikasi")}
                      className="px-3 py-1.5 rounded-xl border border-blue-200 text-blue-700 bg-blue-50 text-xs font-bold hover:bg-blue-100"
                    >
                      Butuh Klarifikasi
                    </button>
                    <button
                      onClick={() => openVerifyModal(item, "terverifikasi")}
                      className="px-4 py-1.5 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white text-xs font-bold shadow-xs"
                    >
                      Verifikasi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: KEUANGAN & DONASI (Mockup 3 & 4 from Image 1) */}
      {activeTab === "keuangan" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Saldo Kas Masjid</span>
              <h3 className="text-2xl font-black text-[#0E7A49] mt-1">Rp 25.750.000</h3>
              <p className="text-xs text-emerald-700 mt-1">Transparan & Terkelola Baik</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Pemasukan Bulan Ini</span>
              <h3 className="text-2xl font-black text-[#2D9CDB] mt-1">Rp 18.500.000</h3>
              <p className="text-xs text-blue-700 mt-1">Infaq, Kotak Amal & Donasi Online</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Pengeluaran Bulan Ini</span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">Rp 7.320.000</h3>
              <p className="text-xs text-rose-700 mt-1">Operasional, Guru TPQ & Kebersihan</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <h4 className="font-bold text-gray-900 text-base mb-3">Program Donasi & Wakaf Aktif</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm text-gray-900">Pembangunan Ruang Kelas TPQ</h5>
                  <p className="text-xs text-gray-500 mt-0.5">Target: Rp 25.000.000 • Terkumpul: 45%</p>
                  <div className="w-48 bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#0E7A49] h-full w-[45%]" />
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#0E7A49] text-white text-xs font-bold self-start sm:self-auto">
                  Donasi Online
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm text-gray-900">Gerakan Sedekah Jum'at Berkah</h5>
                  <p className="text-xs text-gray-500 mt-0.5">Target: Rp 10.000.000 • Terkumpul: 100%</p>
                  <div className="w-48 bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#7ED957] h-full w-[100%]" />
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold self-start sm:self-auto">
                  Tercapai ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Verifikasi: {activeModalItem.student_name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {activeModalItem.habit_title} - {activeModalItem.activity_date}
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              {feedback && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  {feedback}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Keputusan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifStatus("terverifikasi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      verifStatus === "terverifikasi" ? "bg-[#0E7A49] text-white border-[#0E7A49]" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    ✓ Terverifikasi (Hadir)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifStatus("klarifikasi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      verifStatus === "klarifikasi" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    💬 Perlu Klarifikasi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Pembinaan DKM</label>
                <textarea
                  rows={3}
                  value={verifNote}
                  onChange={(e) => setVerifNote(e.target.value)}
                  placeholder="Beri motivasi atau evaluasi..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Verifikasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
