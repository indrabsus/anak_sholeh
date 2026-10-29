"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Activity } from "@/lib/api";
import { 
  Heart, MessageCircle, Send, Sparkles, Award, AlertCircle, 
  CheckCircle2, Clock, Calendar, Shield, Users, BookOpen, ChevronRight 
} from "lucide-react";

export default function OrangTuaView() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pedagogyData, setPedagogyData] = useState<any>(null);
  const [habitSummary, setHabitSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // WhatsApp simulation modal
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [waSending, setWaSending] = useState(false);
  const [waAlert, setWaAlert] = useState<string | null>(null);

  useEffect(() => {
    loadParentData();
  }, [currentUser]);

  const loadParentData = async () => {
    setIsLoading(true);
    try {
      const studentId = 1; // Ahmad Rizky Pratama
      const [aData, pData, sData] = await Promise.all([
        api.getActivities(studentId),
        api.getPedagogyEvaluation(studentId),
        api.getHabitSummary(studentId)
      ]);
      setActivities(aData);
      setPedagogyData(pData?.data);
      setHabitSummary(sData?.data);
    } catch (e) {
      console.error("Error loading parent data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaSending(true);
    setWaAlert(null);

    try {
      const res = await api.sendWhatsAppNotification({
        phone: "081234567801",
        message: waMessage,
        title: "Pesan Kasih Sayang Orang Tua"
      });
      if (res.success) {
        setWaAlert("Pesan terkirim via antrean Fonnte WhatsApp Gateway!");
        setTimeout(() => {
          setIsWaModalOpen(false);
          setWaAlert(null);
        }, 1200);
      }
    } catch (err: any) {
      setWaAlert("Gagal mengirim: " + err.message);
    } finally {
      setWaSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner for Parents */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white p-6 sm:p-8 shadow-xl shadow-blue-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>Modul Pendampingan Keluarga</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dashboard Pendampingan: Ananda Ahmad Rizky
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-1 max-w-xl">
              "Teknologi bukan pengganti peran orang tua dan guru. Teknologi adalah sarana memperkuat pendampingan dan menumbuhkan karakter mulia."
            </p>
          </div>

          <button
            onClick={() => {
              setWaMessage("Ananda Ahmad sayang, Ayah & Ibu sangat bangga melihat semangatmu sholat Subuh dan mengaji pekan ini. Tetap rendah hati dan istiqomah ya, Nak. ❤️");
              setIsWaModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm shadow-md transition"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Kirim Apresiasi WhatsApp
          </button>
        </div>
      </div>

      {/* Pedagogical Algorithm Engine (Slide 9) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-gray-900">
                Logika Pembinaan Karakter (Pedagogical Engine)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Saran pendekatan edukatif berbasis data aktivitas untuk memicu dialog, bukan penghakiman.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Algoritma Pedagogi
          </span>
        </div>

        {/* Pedagogical Insights Card */}
        <div className="mt-6 grid gap-4">
          {pedagogyData?.insights?.map((insight: any, idx: number) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${
                insight.type === "appreciation"
                  ? "bg-emerald-50/70 border-emerald-200"
                  : insight.type === "guidance"
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-blue-50/70 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  {insight.type === "appreciation" ? (
                    <Award className="w-6 h-6 text-emerald-600" />
                  ) : insight.type === "guidance" ? (
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  ) : (
                    <Heart className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{insight.title}</h3>
                    <code className="text-[11px] bg-white px-2 py-0.5 rounded-md font-mono text-gray-600 border border-gray-200">
                      {insight.pedagogical_rule}
                    </code>
                  </div>

                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {insight.message}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-900 bg-white/80 px-3 py-1 rounded-lg border border-gray-200 shadow-2xs">
                      Saran Tindakan: {insight.action_suggested}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fundamental Principle Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center gap-3 text-xs sm:text-sm text-gray-600">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p>
            <strong>Prinsip Inti:</strong> Tidak adanya catatan BUKAN bukti anak tidak melakukan aktivitas. Sistem dirancang untuk menjadi jembatan komunikasi dan pengingat kasih sayang.
          </p>
        </div>

      </div>

      {/* Child Habit Completion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Habit breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-1">
            Capaian 4 Kebiasaan Inti Pekan Ini
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Monitoring mingguan ananda Ahmad Rizky
          </p>

          <div className="space-y-4">
            {habitSummary?.habits?.map((h: any) => (
              <div key={h.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-800">{h.title}</span>
                  <span className="text-emerald-600">{h.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${h.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Sinergi Masjid & Pembimbing
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Aktivitas anak diverifikasi langsung oleh DKM Masjid binaan
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 mb-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                Masjid Agung Kota Cimahi
              </div>
              <p className="text-xs text-amber-700">
                Ustadz Fauzan Al-Hafidz secara aktif membimbing tilawah Subuh dan menyimak bacaan Maghrib anak-anak sekitar masjid.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Terakhir disinkronkan dari server</span>
            <span className="font-semibold text-gray-700">Baru Saja</span>
          </div>
        </div>

      </div>

      {/* Riwayat Buku Kendali Anak */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">
            Catatan Aktivitas Harian Ananda (Buku Kendali)
          </h3>
          <p className="text-xs text-gray-500">
            Daftar kebaikan yang telah dicatat dan diverifikasi
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {activities.map((act) => (
            <div key={act.id} className="p-5 hover:bg-gray-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{act.habit_title}</span>
                  <span className="text-xs text-gray-400">• {act.activity_date} ({act.time_slot})</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{act.notes || "Aktivitas dicatat secara mandiri."}</p>
                {act.verifier_notes && (
                  <p className="text-xs text-emerald-700 mt-1 italic">
                    Ulasan Pembimbing: "{act.verifier_notes}"
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  act.verification_status === "terverifikasi"
                    ? "bg-emerald-100 text-emerald-800"
                    : act.verification_status === "menunggu"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {act.verification_status === "terverifikasi" ? "✓ Terverifikasi DKM" : act.verification_status === "menunggu" ? "⏳ Menunggu DKM" : "Mandiri"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Modal */}
      {isWaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Kirim Notifikasi Kasih Sayang (WhatsApp)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Integrasi gateway Fonnte ke nomor anak/wali: 081234567801
            </p>

            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              {waAlert && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  {waAlert}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pesan untuk Anak</label>
                <textarea
                  rows={4}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={waSending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {waSending ? "Mengirim via Fonnte..." : "Kirim Pesan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
