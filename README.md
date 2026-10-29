# 🌟 Anak Sholeh: Platform Digital Pendidikan, Ibadah & Pembentukan Karakter Anak

> **"Belajar • Berakhlak • Bertumbuh"**  
> Implementasi Pilot Project Kota Cimahi — Menghubungkan Anak, Keluarga, Masjid, Sekolah, dan Pemerintah.

---

## 📖 Ringkasan Proyek

**Anak Sholeh** adalah platform digital komprehensif yang dirancang untuk mendampingi pembentukan karakter generasi muda Islam berlandaskan keteladanan dan dialog kasih sayang, bukan penghakiman.

Segala aktivitas pembiasaan baik berpusat pada modul **Buku Kendali Anak (Core Router Engine)** dan mencakup **4 Kebiasaan Inti Harian**:
1. **H01 - Subuh Berjamaah:** Kedisiplinan & ibadah awal hari di masjid binaan.
2. **H02 - Maghrib Mengaji:** Pembelajaran dan tilawah Al-Qur'an terstruktur ba'da Maghrib.
3. **H03 - Tilawah & Belajar:** Keseimbangan ilmu duniawi dan ukhrawi di lingkungan keluarga.
4. **H04 - Kebaikan & Kepedulian:** Empati sosial, membantu orang tua, dan sedekah.

---

## 🏛️ Arsitektur & Tech Stack

```
+-------------------------------------------------------------------------+
| Layer 1: Client (Frontend)                                              |
| Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS         |
+------------------------------------+------------------------------------+
                                     | RESTful API (Port 5000)
                                     v
+-------------------------------------------------------------------------+
| Layer 2 & 3: Application Server (Backend)                               |
| Server: 103.158.96.244                                                  |
| Project: anak_sholeh_backend (Express.js + Systemd Daemon)              |
| Logic: RBAC Matrix, Router Buku Kendali, Algoritma Pedagogi             |
+------------------------------------+------------------------------------+
                                     | MySQL Connection (Port 3306)
                                     v
+-------------------------------------------------------------------------+
| Layer 4: Primary Database                                               |
| MySQL Database: anak_sholeh                                             |
| Tables: users, roles, schools, mosques, classes, students, parents,     |
|         student_guardians, student_mentors, habits, activities,         |
|         activity_verifications, habit_progress, achievements,           |
|         audit_logs, notifications                                       |
+-------------------------------------------------------------------------+
```

---

## 👥 Matriks Hak Akses (RBAC) & Persona Pengguna

Sistem dilengkapi switcher peran interaktif untuk simulasi 6 persona:

| Peran | Persona Contoh | Wewenang Utama |
| :--- | :--- | :--- |
| **Siswa / Murid** | Ahmad Rizky Pratama | Pencatatan aktivitas mandiri di Buku Kendali, melihat progres mingguan, lencana & poin gamifikasi. |
| **Orang Tua / Wali** | Bapak Hendra Pratama | Monitoring perkembangan anak, saran pembinaan ramah, kirim apresiasi via WhatsApp (Fonnte Gateway). |
| **DKM / Guru Mengaji** | Ustadz Fauzan Al-Hafidz | Verifikasi kehadiran Subuh & Maghrib di masjid binaan (Masjid Agung Cimahi). |
| **Guru Agama** | Ibu Aisyah Rahmawati, S.Pd.I | Monitoring siswa di kelas binaan sekolah, catatan evaluasi akhlak. |
| **Admin Sekolah** | SDN Mandiri 1 Cimahi | Rekap keaktifan kelas dan laporan agregat sekolah. |
| **Pemerintah** | Bappeda & Disdik Cimahi | Dashboard agregat wilayah Kota Cimahi (Sebaran Lembaga & Tren Wilayah dengan privasi anak terlindungi). |

---

## 💡 Logika Pembinaan Karakter (Pedagogical Algorithm)

> *"Tidak adanya catatan BUKAN bukti anak tidak melakukan aktivitas. Sistem dirancang untuk memicu dialog, bukan penghakiman."*

- **IF** konsistensi aktivitas menurun **THEN** sarankan pendampingan (bukan label buruk).
- **IF** aktivitas belum dicatat **THEN** kirim pengingat ramah.
- **IF** perkembangan membaik **THEN** berikan apresiasi tulus.

---

## 🚀 Panduan Menjalankan Frontend (Next.js)

### 1. Kloning Repositori
```bash
git clone https://github.com/indrabsus/anak_sholeh.git
cd anak_sholeh
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://103.158.96.244:5000/api
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## ⚙️ Backend Express.js Server (103.158.96.244)

Backend Express telah terpasang dan berjalan secara aktif (daemon) di server produksi `103.158.96.244`:

- **Direktori:** `/www/wwwroot/anak_sholeh_backend`
- **Port:** `5000` (Terbuka di Firewall UFW)
- **Service Name:** `anak_sholeh_backend.service` (Systemd)
- **Database:** MySQL `anak_sholeh`
- **User DB:** `anak_sholeh`
- **Status Cek:**
```bash
curl http://103.158.96.244:5000/api/health
```

---

## 🔒 Privasi & Keamanan Data Anak
1. **Minimasi Data (Data Minimization):** Data sensitif personal anak (PII) tidak diekspos ke pihak luar atau dashboard publik pemerintah.
2. **Isolasi Multi-Lembaga:** Guru sekolah A tidak dapat mengakses data siswa dari sekolah B.
3. **Audit Trail:** Seluruh aksi kritis tercatat dalam tabel `audit_logs`.

---

*Dikembangkan dengan penuh dedikasi untuk generasi penerus bangsa yang sholeh, cerdas, dan berkarakter mulia.*
