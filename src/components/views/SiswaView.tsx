"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Habit, Activity } from "@/lib/api";
import { 
  Sunrise, BookOpen, GraduationCap, Heart, CheckCircle2, Clock, 
  Award, Flame, Sparkles, Plus, AlertCircle, Calendar, MapPin, 
  ChevronRight, Check, X, ShieldCheck 
} from "lucide-react";

export default function SiswaView() {
  const { currentUser, refreshUserData } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [habitSummary, setHabitSummary] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal State for Logging Activity
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formTimeSlot, setFormTimeSlot] = useState("Subuh");
  const [formLocation, setFormLocation] = useState("masjid");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const studentId = currentUser?.student_id || 1;
      const [hData, sData, aData, achData] = await Promise.all([
        api.getHabits(),
        api.getHabitSummary(studentId),
        api.getActivities(studentId),
        api.getAchievements(studentId)
      ]);
      setHabits(hData);
      setHabitSummary(sData?.data);
      setActivities(aData);
      setAchievements(achData?.data);
    } catch (e) {
      console.error("Error loading student view data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openLogModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setFormNotes("");
    setSubmitFeedback(null);
    if (habit.code === "H01") {
      setFormTimeSlot("Subuh");
      setFormLocation("masjid");
    } else if (habit.code === "H02") {
      setFormTimeSlot("Maghrib");
      setFormLocation("masjid");
    } else if (habit.code === "H03") {
      setFormTimeSlot("Malam");
      setFormLocation("rumah");
    } else {
      setFormTimeSlot("Siang");
      setFormLocation("rumah");
    }
    setIsLogModalOpen(true);
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const studentId = currentUser?.student_id || 1;
      const res = await api.recordActivity({
        student_id: studentId,
        habit_id: selectedHabit.id,
        activity_date: formDate,
        time_slot: formTimeSlot,
        status: "sudah_dilakukan",
        location_type: formLocation,
        notes: formNotes
      });

      if (res.success) {
        setSubmitFeedback("Aktivitas berhasil dicatat! Menunggu verifikasi bila diperlukan.");
        setTimeout(() => {
          setIsLogModalOpen(false);
          loadData();
          refreshUserData();
        }, 1200);
      } else {
        setSubmitFeedback(res.message || "Gagal menyimpan aktivitas.");
      }
    } catch (err: any) {
      setSubmitFeedback("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case "Sunrise": return <Sunrise className="w-6 h-6 text-amber-500" />;
      case "BookOpen": return <BookOpen className="w-6 h-6 text-emerald-500" />;
      case "GraduationCap": return <GraduationCap className="w-6 h-6 text-blue-500" />;
      case "Heart": return <Heart className="w-6 h-6 text-rose-500" />;
      default: return <Sparkles className="w-6 h-6 text-purple-500" />;
    }
  };

  const getVerifBadge = (status: string) => {
    switch (status) {
      case "terverifikasi":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi DKM
          </span>
        );
      case "menunggu":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Menunggu DKM
          </span>
        );
      case "klarifikasi":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> Perlu Klarifikasi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-500" /> Mandiri (Tercatat)
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Student Gamification Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-6 sm:p-8 shadow-xl shadow-emerald-900/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Pembentukan Karakter Anak</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Assalamu'alaikum, {currentUser?.name || "Ahmad Rizky"}! 🌟
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-1 max-w-xl">
              Istiqomahkan 4 Kebiasaan Inti hari ini. Setiap kebaikan kecil yang kamu lakukan bernilai pahala dan membentuk karakter mulia.
            </p>
          </div>

          {/* Gamification Pills */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Flame className="w-5 h-5 fill-amber-300" />
                <span className="text-xl sm:text-2xl font-black">{achievements?.streak_days || 12}</span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium">Hari Beruntun</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-yellow-300 mb-0.5">
                <Award className="w-5 h-5" />
                <span className="text-xl sm:text-2xl font-black">{achievements?.points || 340}</span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium">Poin Kebaikan</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Core Habits Grid (Slide 5 Blueprint) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>4 Kebiasaan Inti Harian</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {habitSummary?.overallPercentage || 90}% Terpenuhi Pekan Ini
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Pondasi utama pembentukan karakter: Subuh, Mengaji, Tilawah & Aksi Sosial
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {habits.map((habit) => {
            const sumItem = habitSummary?.habits?.find((h: any) => h.id === habit.id);
            const pct = sumItem?.percentage || 85;

            return (
              <div
                key={habit.id}
                className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                      {getHabitIcon(habit.icon)}
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {habit.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition">
                    {habit.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {habit.category}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {habit.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                    <span className="text-gray-500">Progres Mingguan</span>
                    <span className="text-emerald-600 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openLogModal(habit)}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Catat di Buku Kendali
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Core Engine: Buku Kendali Anak (Slide 6 Blueprint) */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                Modul Buku Kendali Anak
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Router Data Lintas Lembaga
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Menghubungkan anak, keluarga, sekolah, dan masjid dalam satu catatan terpercaya.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Total: {activities.length} Catatan</span>
          </div>
        </div>

        {/* Activities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-6">Tanggal & Waktu</th>
                <th className="py-3.5 px-6">Kebiasaan</th>
                <th className="py-3.5 px-6">Lokasi</th>
                <th className="py-3.5 px-6">Catatan Aktivitas</th>
                <th className="py-3.5 px-6">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Belum ada riwayat aktivitas yang tercatat.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{act.activity_date}</div>
                      <div className="text-xs text-gray-400">{act.time_slot}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{act.habit_title}</div>
                      <div className="text-xs text-emerald-600 font-medium">+{act.habit_points || 15} Poin</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="capitalize font-medium text-gray-700">
                        {act.location_type} {act.mosque_name ? `(${act.mosque_name})` : ""}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="line-clamp-2 text-gray-600 font-normal">
                        {act.notes || "-"}
                      </p>
                      {act.verifier_notes && (
                        <p className="text-xs text-emerald-700 mt-1 italic bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                          Catatan DKM ({act.verifier_name || "Pembimbing"}): "{act.verifier_notes}"
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getVerifBadge(act.verification_status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Gamification & Achievements Section */}
      <div className="bg-gradient-to-tr from-amber-500/10 via-white to-emerald-500/10 rounded-3xl p-6 border border-amber-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Lencana & Prestasi Karakter
            </h3>
            <p className="text-xs text-gray-500">
              Apresiasi positif untuk memotivasi keistiqomahan anak
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {achievements?.unlocked?.map((badge: any) => (
            <div key={badge.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600 font-bold">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{badge.description}</p>
                <span className="text-[10px] font-bold text-amber-600">+{badge.points_awarded} Poin Diberikan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Pencatatan Aktivitas */}
      {isLogModalOpen && selectedHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  {getHabitIcon(selectedHabit.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Catat: {selectedHabit.title}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedHabit.category}</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="mt-5 space-y-4">
              
              {submitFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  submitFeedback.includes("berhasil") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {submitFeedback}
                </div>
              )}

              {/* Tanggal */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Waktu / Slot */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Waktu Pelaksanaan</label>
                <select
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Subuh">Subuh</option>
                  <option value="Pagi">Pagi / Dhuha</option>
                  <option value="Siang">Siang / Dzuhur</option>
                  <option value="Sore">Sore / Ashar</option>
                  <option value="Maghrib">Maghrib</option>
                  <option value="Malam">Isya / Ba'da Isya</option>
                </select>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lokasi Pelaksanaan</label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="masjid">Masjid Agung Kota Cimahi (Perlu Verifikasi DKM)</option>
                  <option value="rumah">Rumah Sendiri (Mandiri)</option>
                  <option value="sekolah">Sekolah (SDN Mandiri 1 Cimahi)</option>
                </select>
              </div>

              {/* Catatan / Refleksi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Pengalaman / Ayat yang Dibaca</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Sholat Subuh di shaf depan, atau membaca Surah Al-Waqi'ah bersama Ustadz..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan ke Buku Kendali"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
