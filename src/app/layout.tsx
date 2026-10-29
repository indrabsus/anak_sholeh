import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import RoleSwitcherModal from "@/components/RoleSwitcherModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anak Sholeh - Platform Pendidikan & Karakter Anak",
  description: "Belajar • Berakhlak • Bertumbuh. Platform Digital Pendidikan, Ibadah, dan Pembentukan Karakter Anak.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <Header />
          <RoleSwitcherModal />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200/80 bg-white py-6 text-center text-xs text-gray-500">
            <p className="font-semibold text-gray-700">ANAK SHOLEH © 2026 • Belajar • Berakhlak • Bertumbuh</p>
            <p className="mt-1 text-gray-400">Implementasi Pilot Project Kota Cimahi • Terintegrasi Express.js & MySQL Server 103.158.96.244</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
