"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Habit, Activity } from "@/lib/api";
import { 
  Sunrise, BookOpen, GraduationCap, Heart, CheckCircle2, Clock, 
  Award, Flame, Sparkles, Plus, AlertCircle, Calendar, MapPin, 
  ChevronRight, Check, X, ShieldCheck, Video, FileText, Compass,
  Trophy, Users, Play, Target, Star, Bell
} from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function SiswaView() {
  const { currentUser, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<"beranda" | "buku_kendali" | "materi" | "misi" | "prestasi">("beranda");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [habitSummary, setHabitSummary] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Misi Harian Checklist State
  const [dailyMissions, setDailyMissions] = useState([
    { id: 1, title: "Sholat Subuh Berjamaah di masjid", habitCode: "H01", completed: true, points: 20 },
    { id: 2, title: "Membaca Al-Qur'an 1 halaman ba'da Maghrib", habitCode: "H02", completed: true, points: 20 },
    { id: 3, title: "Membantu Orang Tua merapikan kamar", habitCode: "H04", completed: false, points: 15 },
    { id: 4, title: "Belajar & Mengulang Pelajaran Sekolah 30 menit", habitCode: "H03", completed: false, points: 15 }
  ]);

  // Form Modal State for Logging Activity
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formTimeSlot, setFormTimeSlot] = useState("Subuh");
  const [formLocation, setFormLocation] = useState("masjid");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Materi Filter Tab State
  const [materiCategory, setMateriCategory] = useState<"video" | "artikel" | "doa" | "kisah">("video");

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
        setSubmitFeedback("Aktivitas berhasil dicatat di Buku Kendali! Data tersinkron ke server.");
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

  const toggleMission = (id: number) => {
    setDailyMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case "Sunrise": return <Sunrise className="w-5 h-5 text-[#0E7A49]" />;
      case "BookOpen": return <BookOpen className="w-5 h-5 text-[#F4B63F]" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5 text-[#2D9CDB]" />;
      case "Heart": return <Heart className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Student App Navigation Bar (Image 2) */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-gray-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("beranda")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === "beranda" ? "bg-[#0E7A49] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Compass className="w-4 h-4" /> Beranda
          </button>
          <button
            onClick={() => setActiveTab("buku_kendali")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === "buku_kendali" ? "bg-[#0E7A49] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Buku Kendali
          </button>
          <button
            onClick={() => setActiveTab("misi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === "misi" ? "bg-[#0E7A49] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Target className="w-4 h-4" /> Tantangan & Misi
          </button>
          <button
            onClick={() => setActiveTab("materi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === "materi" ? "bg-[#0E7A49] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Video className="w-4 h-4" /> Materi Islami
          </button>
          <button
            onClick={() => setActiveTab("prestasi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === "prestasi" ? "bg-[#0E7A49] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Trophy className="w-4 h-4" /> Point & Apresiasi
          </button>
        </div>
      </div>

      {/* Main Student Header Card (As shown on Image 2 Mockup) */}
      <div className="rounded-3xl bg-white border border-gray-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#0E7A49] to-[#7ED957] p-1 shadow-md">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-2xl text-[#0E7A49]">
                {currentUser?.name ? currentUser.name.charAt(0) : "A"}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-semibold">Assalamu'alaikum</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {currentUser?.name || "Ahmad Rizki"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0E7A49] border border-emerald-200">
                  Level: Pejuang Sholeh
                </span>
                <span className="text-xs text-gray-400 font-medium">SDN Mandiri 1 Cimahi</span>
              </div>
            </div>
          </div>

          {/* Points & Streaks */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F4B63F] fill-[#F4B63F]" />
              <div>
                <span className="text-base sm:text-lg font-black text-amber-900 leading-none block">
                  {achievements?.points || 250} Point
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Koin Kebaikan</span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#0E7A49] fill-[#0E7A49]" />
              <div>
                <span className="text-base sm:text-lg font-black text-[#0E7A49] leading-none block">
                  {achievements?.streak_days || 12} Hari
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Istiqomah</span>
              </div>
            </div>
          </div>

        </div>

        {/* Motivational Banner from Image 2: "Yuk Konsisten Jadi Anak Sholeh Setiap Hari!" */}
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#0E7A49] to-[#0A5633] text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#7ED957] uppercase tracking-wider block">Ajakan Kebaikan Hari Ini</span>
            <h2 className="text-base sm:text-lg font-extrabold mt-0.5">
              Yuk Konsisten Jadi Anak Sholeh Setiap Hari! 🕌
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-md">
              "Satu kebiasaan baik hari ini, insyaAllah membentuk masa depan yang gemilang."
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/15 px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
            <span>Misi Aktif</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* VIEW: BERANDA */}
      {activeTab === "beranda" && (
        <div className="space-y-6">
          
          {/* 4 Kebiasaan Inti Action Cards (Image 2 Colors) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-gray-900 text-base">4 Kebiasaan Inti Harian</h3>
              <span className="text-xs text-gray-400 font-medium">Sentuh untuk mencatat</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Subuh Berjamaah */}
              <div 
                onClick={() => habits[0] && openLogModal(habits[0])}
                className="bg-white rounded-2xl p-4 border border-emerald-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Sunrise className="w-5 h-5 text-[#0E7A49]" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Subuh Berjamaah</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Disiplin dan ibadah di masjid</p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0E7A49]">H01</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">+20 Pt</span>
                </div>
              </div>

              {/* Maghrib Mengaji */}
              <div 
                onClick={() => habits[1] && openLogModal(habits[1])}
                className="bg-white rounded-2xl p-4 border border-amber-200/80 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5 text-[#F4B63F]" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Maghrib Mengaji</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Membaca & belajar Al-Qur'an</p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-700">H02</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">+20 Pt</span>
                </div>
              </div>

              {/* Tilawah & Belajar */}
              <div 
                onClick={() => habits[2] && openLogModal(habits[2])}
                className="bg-white rounded-2xl p-4 border border-blue-200/80 hover:border-blue-500 shadow-xs hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <GraduationCap className="w-5 h-5 text-[#2D9CDB]" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Tilawah & Belajar</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Seimbangkan ilmu & ibadah</p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-700">H03</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">+15 Pt</span>
                </div>
              </div>

              {/* Kebaikan & Kepedulian */}
              <div 
                onClick={() => habits[3] && openLogModal(habits[3])}
                className="bg-white rounded-2xl p-4 border border-rose-200/80 hover:border-rose-500 shadow-xs hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Kebaikan & Peduli</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Empati, sedekah, aksi sosial</p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-700">H04</span>
                  <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">+15 Pt</span>
                </div>
              </div>

            </div>
          </div>

          {/* Progres Minggu Ini (4 Circular Progress Badges matching Image 2) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Progres Minggu Ini</h3>
                <p className="text-xs text-gray-500">Pencapaian target mingguan 4 kebiasaan inti</p>
              </div>
              <button 
                onClick={() => setActiveTab("buku_kendali")}
                className="text-xs font-bold text-[#0E7A49] hover:underline flex items-center gap-1"
              >
                Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="w-14 h-14 rounded-full border-4 border-[#0E7A49] flex items-center justify-center mx-auto mb-2 text-[#0E7A49] font-black text-base">
                  80%
                </div>
                <h5 className="font-bold text-xs text-gray-900">Subuh Berjamaah</h5>
                <span className="text-[10px] text-gray-500">6 dari 7 Hari</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="w-14 h-14 rounded-full border-4 border-[#F4B63F] flex items-center justify-center mx-auto mb-2 text-amber-700 font-black text-base">
                  70%
                </div>
                <h5 className="font-bold text-xs text-gray-900">Mengaji Maghrib</h5>
                <span className="text-[10px] text-gray-500">5 dari 7 Hari</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="w-14 h-14 rounded-full border-4 border-[#2D9CDB] flex items-center justify-center mx-auto mb-2 text-blue-700 font-black text-base">
                  60%
                </div>
                <h5 className="font-bold text-xs text-gray-900">Tilawah & Belajar</h5>
                <span className="text-[10px] text-gray-500">4 dari 7 Hari</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                <div className="w-14 h-14 rounded-full border-4 border-rose-500 flex items-center justify-center mx-auto mb-2 text-rose-700 font-black text-base">
                  90%
                </div>
                <h5 className="font-bold text-xs text-gray-900">Aksi Kebaikan</h5>
                <span className="text-[10px] text-gray-500">6 dari 7 Hari</span>
              </div>

            </div>
          </div>

          {/* Misi Hari Ini (Matching Image 2 Mockup 1) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Misi Hari Ini</h3>
                <p className="text-xs text-gray-500">Checklist kegiatan ibadah dan kebaikan harianmu</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {dailyMissions.filter(m => m.completed).length} / {dailyMissions.length} Selesai
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyMissions.map((misi) => (
                <div
                  key={misi.id}
                  onClick={() => toggleMission(misi.id)}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    misi.completed ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      misi.completed ? "bg-[#0E7A49] text-white" : "border-2 border-gray-300 bg-white"
                    }`}>
                      {misi.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold ${misi.completed ? "text-gray-900 line-through opacity-75" : "text-gray-800"}`}>
                      {misi.title}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#0E7A49] px-2 py-0.5 rounded-md bg-white border border-emerald-200">
                    +{misi.points} Poin
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: BUKU KENDALI */}
      {activeTab === "buku_kendali" && (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900">
                Buku Kendali Anak (Catatan Lengkap)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Pencatatan 4 kebiasaan inti harian terintegrasi dengan verifikasi DKM Masjid
              </p>
            </div>

            <div className="flex items-center gap-2">
              {habits[0] && (
                <button
                  onClick={() => openLogModal(habits[0])}
                  className="px-4 py-2 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Catat Aktivitas
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-5">Waktu</th>
                  <th className="py-3 px-5">Kebiasaan</th>
                  <th className="py-3 px-5">Lokasi</th>
                  <th className="py-3 px-5">Catatan Pembinaan</th>
                  <th className="py-3 px-5">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-5 font-bold text-gray-900 whitespace-nowrap">
                      {act.activity_date}
                      <span className="block text-xs font-normal text-gray-400">{act.time_slot}</span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-gray-900 whitespace-nowrap">
                      {act.habit_title}
                    </td>
                    <td className="py-3.5 px-5 capitalize whitespace-nowrap">
                      {act.location_type} {act.mosque_name ? `(${act.mosque_name})` : ""}
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 max-w-xs">
                      {act.notes || "-"}
                      {act.verifier_notes && (
                        <p className="text-xs text-emerald-800 italic mt-0.5 bg-emerald-50 p-1 rounded">
                          Catatan DKM: "{act.verifier_notes}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {getVerifBadge(act.verification_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: TANTANGAN & MISI (Mockup 5 from Image 2) */}
      {activeTab === "misi" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <h3 className="font-bold text-gray-900 text-base mb-1">Tantangan & Misi Karakter</h3>
            <p className="text-xs text-gray-500 mb-4">Selesaikan tantangan beruntun untuk membuka lencana baru</p>

            <div className="grid gap-3">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0E7A49] flex items-center justify-center font-bold">
                    <Sunrise className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">7 Hari Subuh Berjamaah</h4>
                    <p className="text-xs text-gray-500">Sholat Subuh di masjid tanpa terputus selama 7 hari berturut-turut.</p>
                    <div className="w-32 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#0E7A49] h-full w-[85%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#0E7A49] text-white">
                  +100 Point
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Tilawah 1 Juz Al-Qur'an</h4>
                    <p className="text-xs text-gray-500">Selesaikan membaca 1 juz Al-Qur'an dan setorkan bacaan ke guru/DKM.</p>
                    <div className="w-32 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#F4B63F] h-full w-[60%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F4B63F] text-amber-950">
                  +300 Point
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Berbagi Kebaikan Ramah</h4>
                    <p className="text-xs text-gray-500">Catat 5 aksi kebaikan sosial (membantu orang tua, sedekah, memungut sampah).</p>
                    <div className="w-32 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#2D9CDB] h-full w-[100%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#2D9CDB] text-white">
                  Selesai ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MATERI ISLAMI (Mockup 4 from Image 2) */}
      {activeTab === "materi" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Materi & Kisah Islami</h3>
              <p className="text-xs text-gray-500">Pelajari adab, bacaan Al-Qur'an, dan kisah keteladanan Nabi</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setMateriCategory("video")}
                className={`px-3 py-1 rounded-lg transition ${materiCategory === "video" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
              >
                Video
              </button>
              <button
                onClick={() => setMateriCategory("artikel")}
                className={`px-3 py-1 rounded-lg transition ${materiCategory === "artikel" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
              >
                Artikel
              </button>
              <button
                onClick={() => setMateriCategory("doa")}
                className={`px-3 py-1 rounded-lg transition ${materiCategory === "doa" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
              >
                Doa
              </button>
              <button
                onClick={() => setMateriCategory("kisah")}
                className={`px-3 py-1 rounded-lg transition ${materiCategory === "kisah" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
              >
                Kisah
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-emerald-700 text-white flex items-center justify-center p-4 text-center font-bold text-sm">
                Keutamaan Sholat Subuh Berjamaah
              </div>
              <div className="p-3.5">
                <span className="text-[10px] font-bold text-[#0E7A49] uppercase">Fiqih Ibadah</span>
                <h4 className="font-bold text-sm text-gray-900 mt-0.5">Pahala Berjalan Menuju Masjid</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">Langkah kaki menuju masjid di waktu fajar bernilai derajat tinggi dan penghapus dosa.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-amber-700 text-white flex items-center justify-center p-4 text-center font-bold text-sm">
                Ayo Mengaji Al-Qur'an Ba'da Maghrib
              </div>
              <div className="p-3.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Tajwid & Tahsin</span>
                <h4 className="font-bold text-sm text-gray-900 mt-0.5">Makharijul Huruf Dasar</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">Panduan praktis pengucapan huruf hijaiyah yang benar untuk anak-anak santri.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-blue-700 text-white flex items-center justify-center p-4 text-center font-bold text-sm">
                Kisah Anak Sholeh di Zaman Rasulullah
              </div>
              <div className="p-3.5">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Sirah Nabawiyah</span>
                <h4 className="font-bold text-sm text-gray-900 mt-0.5">Keteladanan Sahabat Cilik</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">Kisah keberanian dan kejujuran Abdullah bin Abbas dalam menuntut ilmu.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: POINT & PRESTASI (Mockup 6 from Image 2) */}
      {activeTab === "prestasi" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-tr from-amber-50 to-emerald-50 border border-amber-200">
            <div>
              <span className="text-xs font-bold text-amber-700">Peringkat & Pencapaian</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">Tingkat Karakter: Pejuang Sholeh</h3>
              <p className="text-xs text-gray-600 mt-1">Kumpulkan 50 poin lagi untuk mencapai tingkat "Ksatria Istiqomah".</p>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-3xl font-black text-[#0E7A49]">250 / 300</span>
              <span className="block text-[11px] text-gray-500 font-medium">Poin Terkumpul</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-base mb-3">Lencana Prestasi (Badges)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-white text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0E7A49] flex items-center justify-center mx-auto mb-2 font-black text-lg">
                  🌱
                </div>
                <h5 className="font-bold text-xs text-gray-900">Pemula Hijau</h5>
                <span className="text-[10px] text-emerald-700 font-semibold">Tercapai</span>
              </div>

              <div className="p-4 rounded-2xl border border-amber-200 bg-white text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-[#F4B63F] flex items-center justify-center mx-auto mb-2 font-black text-lg">
                  ⭐
                </div>
                <h5 className="font-bold text-xs text-gray-900">Pejuang Sholeh</h5>
                <span className="text-[10px] text-amber-700 font-semibold">Aktif</span>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 text-center opacity-60">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mx-auto mb-2 font-black text-lg">
                  🛡️
                </div>
                <h5 className="font-bold text-xs text-gray-600">Ksatria Bumi</h5>
                <span className="text-[10px] text-gray-400">Terkunci</span>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 text-center opacity-60">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mx-auto mb-2 font-black text-lg">
                  👑
                </div>
                <h5 className="font-bold text-xs text-gray-600">Pahlawan Akhlak</h5>
                <span className="text-[10px] text-gray-400">Terkunci</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Waktu Pelaksanaan</label>
                <select
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                >
                  <option value="Subuh">Subuh</option>
                  <option value="Pagi">Pagi / Dhuha</option>
                  <option value="Siang">Siang / Dzuhur</option>
                  <option value="Sore">Sore / Ashar</option>
                  <option value="Maghrib">Maghrib</option>
                  <option value="Malam">Isya / Ba'da Isya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lokasi Pelaksanaan</label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                >
                  <option value="masjid">Masjid Al-Furqon / Masjid Agung Cimahi (Verifikasi DKM)</option>
                  <option value="rumah">Rumah Sendiri (Mandiri)</option>
                  <option value="sekolah">Sekolah (SDN Mandiri 1 Cimahi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Pengalaman / Kebaikan</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ceritakan kebaikanmu hari ini..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A49]"
                />
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-[#0E7A49] hover:bg-[#0B5E38] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
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
