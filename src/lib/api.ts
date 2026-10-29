const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://103.158.96.244:5000/api";

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  role_name: string;
  role_label: string;
  student_id?: number;
  parent_id?: number;
  points?: number;
  streak_days?: number;
  school_name?: string;
  mosque_name?: string;
}

export interface Habit {
  id: number;
  code: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  points: number;
  target_per_week: number;
  requires_verification: number;
  completed_this_week?: number;
  percentage?: number;
}

export interface Activity {
  id: number;
  student_id: number;
  habit_id: number;
  activity_date: string;
  time_slot: string;
  status: "sudah_dilakukan" | "belum_dilakukan" | "dibatalkan";
  verification_status: "tidak_perlu" | "menunggu" | "terverifikasi" | "klarifikasi";
  location_type: "masjid" | "rumah" | "sekolah";
  mosque_id?: number;
  notes?: string;
  habit_code?: string;
  habit_title?: string;
  habit_icon?: string;
  habit_points?: number;
  student_name?: string;
  mosque_name?: string;
  verifier_notes?: string;
  verifier_name?: string;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    return res.json();
  },

  async getDemoUsers(): Promise<DemoUser[]> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`, { cache: "no-store" });
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.warn("Failed fetching demo users, returning default personas:", e);
      return [
        { id: 1, name: "Ahmad Rizky Pratama", email: "siswa@anaksholeh.id", phone: "081234567801", role_name: "siswa", role_label: "Siswa / Murid", student_id: 1, points: 340, streak_days: 12 },
        { id: 2, name: "Bapak Hendra Pratama", email: "orangtua@anaksholeh.id", phone: "081234567802", role_name: "orang_tua", role_label: "Orang Tua / Wali", parent_id: 1 },
        { id: 3, name: "Ustadz Fauzan Al-Hafidz", email: "dkm@anaksholeh.id", phone: "081234567803", role_name: "dkm", role_label: "DKM / Guru Mengaji", mosque_name: "Masjid Agung Cimahi" },
        { id: 4, name: "Ibu Aisyah Rahmawati, S.Pd.I", email: "guru@anaksholeh.id", phone: "081234567804", role_name: "guru_agama", role_label: "Guru Agama", school_name: "SDN Mandiri 1 Cimahi" },
        { id: 5, name: "Admin SDN Mandiri 1", email: "sekolah@anaksholeh.id", phone: "081234567805", role_name: "admin_sekolah", role_label: "Admin Sekolah", school_name: "SDN Mandiri 1 Cimahi" },
        { id: 6, name: "Bappeda & Disdik Cimahi", email: "pemerintah@anaksholeh.id", phone: "081234567806", role_name: "pemerintah", role_label: "Pemerintah (Disdik/Pemkot)" }
      ];
    }
  },

  async quickSwitch(userId: number) {
    const res = await fetch(`${API_BASE}/auth/quick-switch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getHabits(): Promise<Habit[]> {
    try {
      const res = await fetch(`${API_BASE}/habits`, { cache: "no-store" });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
        { id: 1, code: "H01", title: "Subuh Berjamaah", category: "Kedisiplinan & Ibadah", description: "Melaksanakan sholat Subuh berjamaah di masjid untuk membentuk kedisiplinan dan keberkahan pagi.", icon: "Sunrise", points: 20, target_per_week: 7, requires_verification: 1 },
        { id: 2, code: "H02", title: "Maghrib Mengaji", category: "Mempelajari Al-Quran", description: "Membaca dan menyimak Al-Quran ba'da Maghrib di masjid atau musholla.", icon: "BookOpen", points: 20, target_per_week: 7, requires_verification: 1 },
        { id: 3, code: "H03", title: "Tilawah & Belajar", category: "Keseimbangan Ilmu & Ibadah", description: "Membaca Al-Quran mandiri dan mengulang pelajaran sekolah di rumah.", icon: "GraduationCap", points: 15, target_per_week: 7, requires_verification: 0 },
        { id: 4, code: "H04", title: "Kebaikan & Kepedulian", category: "Empati & Aksi Sosial", description: "Membantu orang tua, sedekah, membuang sampah pada tempatnya, atau menolong sesama.", icon: "Heart", points: 15, target_per_week: 7, requires_verification: 0 }
      ];
    }
  },

  async getHabitSummary(studentId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/habits/summary?student_id=${studentId}`, { cache: "no-store" });
      return res.json();
    } catch {
      return {
        success: true,
        data: {
          overallPercentage: 88,
          totalDone: 14,
          totalTarget: 16,
          habits: [
            { id: 1, code: "H01", title: "Subuh Berjamaah", percentage: 86, completed_this_week: 6, target_per_week: 7 },
            { id: 2, code: "H02", title: "Maghrib Mengaji", percentage: 100, completed_this_week: 7, target_per_week: 7 },
            { id: 3, code: "H03", title: "Tilawah & Belajar", percentage: 86, completed_this_week: 6, target_per_week: 7 },
            { id: 4, code: "H04", title: "Kebaikan & Kepedulian", percentage: 71, completed_this_week: 5, target_per_week: 7 }
          ]
        }
      };
    }
  },

  async getActivities(studentId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/activities?student_id=${studentId}`, { credentials: "omit", cache: "no-store" });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async recordActivity(payload: {
    student_id?: number;
    habit_id: number;
    activity_date: string;
    time_slot: string;
    status: string;
    location_type: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getVerificationQueue(mosqueId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/verifications/queue?mosque_id=${mosqueId}`, { cache: "no-store" });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async verifyActivity(payload: { activity_id: number; status: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/verifications/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getPedagogyEvaluation(studentId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/pedagogy/evaluate?student_id=${studentId}`, { cache: "no-store" });
      return res.json();
    } catch {
      return {
        success: true,
        data: {
          insights: [
            {
              type: "appreciation",
              title: "Apresiasi & Penguatan Karakter",
              message: "MasyaAllah! Konsistensi ananda sangat baik pekan ini. Berikan pelukan hangat atas ketekunannya.",
              pedagogical_rule: "IF perkembangan membaik THEN berikan apresiasi"
            }
          ]
        }
      };
    }
  },

  async getGovernmentAggregate() {
    try {
      const res = await fetch(`${API_BASE}/analytics/government`, { cache: "no-store" });
      return res.json();
    } catch {
      return {
        success: true,
        data: {
          city: "Kota Cimahi",
          overview: { totalSchools: 3, totalMosques: 3, totalStudentsEnrolled: 120, totalVerifiedActivities: 450 },
          regionalDistribution: [
            { kecamatan: "Cimahi Utara", schools: 18, mosques: 32, students: 1420, participationRate: 88.4 },
            { kecamatan: "Cimahi Tengah", schools: 24, mosques: 45, students: 1950, participationRate: 91.2 },
            { kecamatan: "Cimahi Selatan", schools: 21, mosques: 38, students: 1680, participationRate: 84.7 }
          ]
        }
      };
    }
  },

  async getSchoolAnalytics(schoolId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/analytics/school?school_id=${schoolId}`, { cache: "no-store" });
      return res.json();
    } catch {
      return {
        success: true,
        data: {
          school: { name: "SDN Mandiri 1 Cimahi" },
          classes: [],
          habitRecap: []
        }
      };
    }
  },

  async getAchievements(studentId: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/achievements?student_id=${studentId}`, { cache: "no-store" });
      return res.json();
    } catch {
      return {
        success: true,
        data: { points: 340, streak_days: 12, unlocked: [], available: [] }
      };
    }
  },

  async getNotifications() {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { cache: "no-store" });
      return res.json();
    } catch {
      return { success: true, data: [] };
    }
  },

  async sendWhatsAppNotification(payload: { phone: string; message: string; title?: string }) {
    const res = await fetch(`${API_BASE}/notifications/whatsapp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
