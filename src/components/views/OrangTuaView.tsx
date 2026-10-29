"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Activity } from "@/lib/api";
import { 
  Heart, MessageCircle, Send, Sparkles, Award, AlertCircle, 
  CheckCircle2, Clock, Calendar, Shield, Users, BookOpen, ChevronRight,
  TrendingUp, Check, MessageSquare
} from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function OrangTuaView() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "buku_kendali" | "laporan" | "pesan">("dashboard");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pedagogyData, setPedagogyData] = useState<any>(null);
  const [habitSummary, setHabitSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chat Guru / DKM simulation
  const [chatMessages, setChatMessages] = useState([
    { sender: "Ust. Rahmat (Guru PAI)", time: "09:15", text: "Alhamdulillah, Ahmad hari ini ikut Subuh berjamaah di masjid. Bacaan surat pendeknya semakin tartil. 🤲" },
    { sender: "Bunda Siti", time: "09:20", text: "Terima kasih ustadz. Kami akan terus mendampingi dan mengingatkan sholat di rumah. 🙏" }
  ]);
  const [chatInput, setChatInput] = useState("");

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
      const studentId = 1; // Ahmad Rizky
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

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      sender: "Bunda Siti (Orang Tua)",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput
    }]);
    setChatInput("");
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Matching Image 3 Mockup */}
      <div className="rounded-3xl bg-white border border-gray-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#2D9CDB] to-[#7ED957] p-1 shadow-md">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-2xl text-[#2D9CDB]">
                S
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-semibold">Assalamu'alaikum</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                Bunda Siti
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#2D9CDB] border border-blue-200">
                  Orang Tua dari: Ahmad Rizki
                </span>
                <span className="text-xs text-gray-400 font-medium">Kelas 4A • SDN Mandiri 1</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setWaMessage("Ananda Ahmad sayang, Ayah & Ibu sangat bangga melihat semangatmu sholat Subuh dan mengaji pekan ini. Tetap rendah hati dan istiqomah ya, Nak. ❤️");
                setIsWaModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Apresiasi via WA</span>
            </button>
          </div>

        </div>

        {/* 4 Quick Action Cards (Image 3 Colors) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
          
          <div 
            onClick={() => setActiveTab("dashboard")}
            className={`p-4 rounded-2xl cursor-pointer transition flex items-center gap-3 ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-900 hover:bg-blue-100/70"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "dashboard" ? "bg-white/20" : "bg-white"}`}>
              <CheckCircle2 className="w-5 h-5 text-[#2D9CDB]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Aktivitas Harian</h4>
              <p className={`text-[10px] ${activeTab === "dashboard" ? "text-blue-100" : "text-blue-700"}`}>Riwayat lengkap</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab("buku_kendali")}
            className={`p-4 rounded-2xl cursor-pointer transition flex items-center gap-3 ${activeTab === "buku_kendali" ? "bg-[#0E7A49] text-white shadow-md" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100/70"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "buku_kendali" ? "bg-white/20" : "bg-white"}`}>
              <BookOpen className="w-5 h-5 text-[#0E7A49]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Buku Kendali</h4>
              <p className={`text-[10px] ${activeTab === "buku_kendali" ? "text-emerald-100" : "text-emerald-700"}`}>Pantau 4 kebiasaan</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab("laporan")}
            className={`p-4 rounded-2xl cursor-pointer transition flex items-center gap-3 ${activeTab === "laporan" ? "bg-amber-500 text-white shadow-md" : "bg-amber-50 text-amber-900 hover:bg-amber-100/70"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "laporan" ? "bg-white/20" : "bg-white"}`}>
              <TrendingUp className="w-5 h-5 text-[#F4B63F]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Laporan Anak</h4>
              <p className={`text-[10px] ${activeTab === "laporan" ? "text-amber-100" : "text-amber-700"}`}>Grafik & capaian</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab("pesan")}
            className={`p-4 rounded-2xl cursor-pointer transition flex items-center gap-3 ${activeTab === "pesan" ? "bg-purple-600 text-white shadow-md" : "bg-purple-50 text-purple-900 hover:bg-purple-100/70"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "pesan" ? "bg-white/20" : "bg-white"}`}>
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Pesan Guru/DKM</h4>
              <p className={`text-[10px] ${activeTab === "pesan" ? "text-purple-100" : "text-purple-700"}`}>Diskusi pembinaan</p>
            </div>
          </div>

        </div>
      </div>

      {/* Perkembangan Minggu Ini (4 Rings matching Image 3) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Perkembangan Minggu Ini</h3>
            <p className="text-xs text-gray-500">Persentase capaian 4 kebiasaan inti ananda Ahmad Rizki</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2D9CDB] border border-blue-200">
            Pekan Berjalan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-14 h-14 rounded-full border-4 border-[#0E7A49] flex items-center justify-center mx-auto mb-2 text-[#0E7A49] font-black text-base">
              80%
            </div>
            <h5 className="font-bold text-xs text-gray-900">Subuh Berjamaah</h5>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="w-14 h-14 rounded-full border-4 border-[#F4B63F] flex items-center justify-center mx-auto mb-2 text-amber-700 font-black text-base">
              70%
            </div>
            <h5 className="font-bold text-xs text-gray-900">Mengaji Maghrib</h5>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="w-14 h-14 rounded-full border-4 border-[#2D9CDB] flex items-center justify-center mx-auto mb-2 text-blue-700 font-black text-base">
              60%
            </div>
            <h5 className="font-bold text-xs text-gray-900">Tilawah & Belajar</h5>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
            <div className="w-14 h-14 rounded-full border-4 border-rose-500 flex items-center justify-center mx-auto mb-2 text-rose-700 font-black text-base">
              90%
            </div>
            <h5 className="font-bold text-xs text-gray-900">Aksi Kebaikan</h5>
          </div>
        </div>
      </div>

      {/* VIEW: DASHBOARD & AKTIVITAS TERBARU (Image 3 Mockup 1) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          
          {/* Pedagogical Advice Box */}
          <div className="bg-emerald-50/80 rounded-3xl p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#0E7A49]" />
              <h3 className="font-bold text-emerald-950 text-base">Logika Pembinaan Karakter</h3>
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed">
              {pedagogyData?.insights?.[0]?.message || "MasyaAllah! Konsistensi ananda Ahmad sangat baik pekan ini. Berikan pelukan hangat dan pujian tulus atas usaha dan kedisiplinannya."}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-200 inline-flex">
              <span>Prinsip: Menemani, bukan menghakimi.</span>
            </div>
          </div>

          {/* Aktivitas Terbaru List */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <h3 className="font-bold text-gray-900 text-base mb-3">Aktivitas Terbaru Ananda</h3>
            
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E7A49] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-gray-900">Sholat Subuh Berjamaah di masjid</h5>
                    <span className="text-[11px] text-gray-400">Hari ini, 05:12 • Masjid Agung Cimahi</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ✓ Terverifikasi DKM
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-gray-900">Mengaji 1 Halaman Al-Qur'an</h5>
                    <span className="text-[11px] text-gray-400">Hari ini, 17:45 • Surah Ar-Rahman</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                  ✓ Terverifikasi DKM
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-gray-900">Membantu Ibu di Rumah</h5>
                    <span className="text-[11px] text-gray-400">Hari ini, 19:30 • Merapikan ruang belajar</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold">
                  Mandiri
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: BUKU KENDALI (Image 3 Mockup 2) */}
      {activeTab === "buku_kendali" && (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Buku Kendali Anak (Status Terverifikasi)</h3>
            <p className="text-xs text-gray-500">Pantau catatan kebiasaan dan catatan guru/DKM pembimbing</p>
          </div>

          <div className="divide-y divide-gray-100">
            {activities.map((act) => (
              <div key={act.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{act.habit_title}</span>
                    <span className="text-xs text-gray-400">• {act.activity_date} ({act.time_slot})</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{act.notes || "Catatan harian anak tercatat."}</p>
                  {act.verifier_notes && (
                    <p className="text-xs text-[#0E7A49] mt-1 italic bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      Ulasan Pembimbing: "{act.verifier_notes}"
                    </p>
                  )}
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                  act.verification_status === "terverifikasi" ? "bg-emerald-100 text-emerald-800" : act.verification_status === "menunggu" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                }`}>
                  {act.verification_status === "terverifikasi" ? "✓ Terverifikasi DKM" : act.verification_status === "menunggu" ? "⏳ Menunggu DKM" : "Mandiri"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: LAPORAN PERKEMBANGAN (Image 3 Mockup 3) */}
      {activeTab === "laporan" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Laporan Perkembangan Karakter</h3>
            <p className="text-xs text-gray-500">Tren keistiqomahan anak dalam 4 kebiasaan inti</p>
          </div>

          {/* Simple Clean Bar Chart Representation */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-bold text-gray-700 block mb-4">Tren Mingguan Aktivitas Tercatat</span>
            <div className="flex items-end justify-between h-40 gap-2">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "80%" }} />
                <span className="text-[10px] text-gray-500">Sen</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "90%" }} />
                <span className="text-[10px] text-gray-500">Sel</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "70%" }} />
                <span className="text-[10px] text-gray-500">Rab</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "85%" }} />
                <span className="text-[10px] text-gray-500">Kam</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "95%" }} />
                <span className="text-[10px] text-gray-500">Jum</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "90%" }} />
                <span className="text-[10px] text-gray-500">Sab</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#0E7A49] rounded-t-lg" style={{ height: "100%" }} />
                <span className="text-[10px] text-gray-500">Ahad</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-amber-900 text-sm mb-1">Rekomendasi Pembinaan:</h4>
            <p className="text-xs text-amber-800">
              "Lanjutkan kebiasaan baik dan berikan apresiasi sederhana seperti pujian tulus saat ananda bersiap sholat tanpa disuruh."
            </p>
          </div>
        </div>
      )}

      {/* VIEW: KOMUNIKASI GURU/DKM (Image 3 Mockup 4) */}
      {activeTab === "pesan" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                R
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Ust. Rahmat (Guru PAI)</h4>
                <span className="text-[11px] text-emerald-600 font-medium">● Online • SDN Mandiri 1</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender.includes("Bunda") ? "items-end" : "items-start"}`}>
                <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                  msg.sender.includes("Bunda") ? "bg-[#0E7A49] text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs"
                }`}>
                  <span className="font-bold block text-[10px] mb-1 opacity-80">{msg.sender}</span>
                  <p>{msg.text}</p>
                  <span className="text-[9px] block text-right mt-1 opacity-70">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tulis pesan untuk guru/pembimbing..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* WhatsApp Modal */}
      {isWaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Kirim Notifikasi Kasih Sayang (WhatsApp)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Integrasi gateway Fonnte ke nomor ananda: 081234567801
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
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
