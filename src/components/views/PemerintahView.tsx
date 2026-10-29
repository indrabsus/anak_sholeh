"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Shield, MapPin, Building2, Users, TrendingUp, Lock, CheckCircle2 } from "lucide-react";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function PemerintahView() {
  const [govData, setGovData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getGovernmentAggregate()
      .then(res => setGovData(res.data))
      .catch(err => console.error("Gov analytics error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Pemerintah Cimahi */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Dashboard Agregat Wilayah • Kota Cimahi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Monitoring Agregat Pendidikan Karakter Anak Sholeh
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mt-1 max-w-2xl">
              Fase 7: Pilot Project Terbatas Kota Cimahi. Memantau tren partisipasi lintas lembaga (Keluarga, Masjid, Sekolah, Pemerintah).
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-300 font-bold">
            <Lock className="w-4 h-4" />
            <span>Data Agregat Terlindungi (Privasi PII Anak Terjaga)</span>
          </div>
        </div>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">63</span>
              <p className="text-xs text-gray-500 font-medium">Sekolah Mitra</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MosqueIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">115</span>
              <p className="text-xs text-gray-500 font-medium">Masjid & Musholla</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">5,050</span>
              <p className="text-xs text-gray-500 font-medium">Siswa Terdaftar</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">88.1%</span>
              <p className="text-xs text-gray-500 font-medium">Rata-rata Partisipasi</p>
            </div>
          </div>
        </div>

      </div>

      {/* Regional Sebaran Wilayah Cimahi (Slide 7 Heatmap Table) */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-gray-900 text-lg">
              Sebaran Lembaga & Partisipasi per Kecamatan
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Evaluasi agregat wilayah untuk alokasi pendampingan keagamaan Kota Cimahi
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
            Tahun Anggaran 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-6">Kecamatan</th>
                <th className="py-3.5 px-6">Sekolah Terhubung</th>
                <th className="py-3.5 px-6">Masjid Binaan</th>
                <th className="py-3.5 px-6">Jumlah Siswa</th>
                <th className="py-3.5 px-6">Tingkat Partisipasi</th>
                <th className="py-3.5 px-6">Status Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {govData?.regionalDistribution?.map((reg: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/60 transition">
                  <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {reg.kecamatan}
                  </td>
                  <td className="py-4 px-6 font-semibold">{reg.schools} Sekolah</td>
                  <td className="py-4 px-6 font-semibold">{reg.mosques} Masjid</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{reg.students.toLocaleString("id-ID")} Siswa</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${reg.participationRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-600 text-xs">{reg.participationRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aktif Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Privacy & Security Architecture Compliance (Slide 13) */}
      <div className="rounded-3xl bg-emerald-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Kepatuhan Privasi & Keamanan Data Anak (Child Safety First)
            </h3>
            <p className="text-xs text-emerald-300">
              Sesuai Blueprint Teknis Slide 13 & Regulasi Perlindungan Data Pribadi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-emerald-300 mb-1">Kepatuhan Privasi</h4>
            <p className="text-gray-300 leading-relaxed">Pengumpulan data diminimalkan, mekanisme persetujuan wali disiapkan secara ketat.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-emerald-300 mb-1">Autentikasi & RBAC</h4>
            <p className="text-gray-300 leading-relaxed">Akses dibatasi ketat berdasarkan relasi sah pengguna dengan anak.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-emerald-300 mb-1">Validasi & Audit</h4>
            <p className="text-gray-300 leading-relaxed">Seluruh input divalidasi, setiap tindakan kritis terekam dalam tabel audit_logs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-emerald-300 mb-1">Isolasi Lembaga</h4>
            <p className="text-gray-300 leading-relaxed">Guru sekolah A tidak dapat mengakses data siswa dari sekolah B tanpa otorisasi.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
