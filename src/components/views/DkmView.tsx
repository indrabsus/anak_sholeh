"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Activity } from "@/lib/api";
import { 
  CheckCircle2, Clock, AlertCircle, XCircle, 
  Send, Users, BookOpen, Sunrise, Check, Sparkles 
} from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function DkmView() {
  const { currentUser } = useAuth();
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner for DKM */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white p-6 sm:p-8 shadow-xl shadow-amber-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <MosqueIcon className="w-3.5 h-3.5 text-amber-200" />
              <span>Modul Verifikator & Pembimbing Masjid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Portal DKM: {currentUser?.mosque_name || "Masjid Agung Kota Cimahi"}
            </h1>
            <p className="text-amber-100 text-sm sm:text-base mt-1 max-w-xl">
              Verifikasi kehadiran Subuh Berjamaah & Maghrib Mengaji untuk anak-anak santri binaan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
            <span className="text-2xl sm:text-3xl font-black text-amber-200">{queue.length}</span>
            <p className="text-xs text-amber-100 font-medium mt-0.5">Menunggu Verifikasi</p>
          </div>
        </div>
      </div>

      {/* Verification Queue (Slide 7 & 8) */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-black text-gray-900">
                Antrean Verifikasi Kehadiran Anak
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Hanya menampilkan santri yang mencatat ibadah di lingkungan Masjid Agung Cimahi
            </p>
          </div>

          <button
            onClick={loadQueue}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition"
          >
            Segarkan Antrean
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Alhamdulillah, Semua Antrean Bersih!</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Tidak ada aktivitas santri yang tertunda. Seluruh kehadiran hari ini telah diverifikasi.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {queue.map((item) => (
              <div key={item.id} className="p-6 hover:bg-amber-50/20 transition flex flex-col md:flex-row md:items-center justify-between gap-5">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center font-black text-amber-800 flex-shrink-0 text-base shadow-inner">
                    {item.student_name ? item.student_name.charAt(0) : "S"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-base">{item.student_name}</h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        NISN: {item.nisn || "0012938475"}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.class_name || "Kelas 4A"} • {item.school_name || "SDN Mandiri 1"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-800">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {item.habit_code}: {item.habit_title}
                      </span>
                      <span className="text-gray-400">• Tanggal: {item.activity_date} ({item.time_slot})</span>
                    </div>

                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-w-xl">
                      <strong>Catatan Santri:</strong> "{item.notes || 'Hadir sholat berjamaah di masjid.'}"
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                  <button
                    onClick={() => openVerifyModal(item, "klarifikasi")}
                    className="px-3.5 py-2 rounded-xl border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4" /> Butuh Klarifikasi
                  </button>

                  <button
                    onClick={() => openVerifyModal(item, "terverifikasi")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Verifikasi Kehadiran
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Verification Action Modal */}
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

              {/* Status Decision */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Keputusan Verifikasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifStatus("terverifikasi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      verifStatus === "terverifikasi"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    ✓ Terverifikasi (Hadir)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifStatus("klarifikasi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      verifStatus === "klarifikasi"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    💬 Perlu Klarifikasi
                  </button>
                </div>
              </div>

              {/* Pembimbing Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Catatan Pembinaan DKM (Akan terbaca oleh Orang Tua & Anak)
                </label>
                <textarea
                  rows={3}
                  value={verifNote}
                  onChange={(e) => setVerifNote(e.target.value)}
                  placeholder="Contoh: Bacaan makharijul huruf sudah tepat, tingkatkan muraja'ah..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Actions */}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
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
