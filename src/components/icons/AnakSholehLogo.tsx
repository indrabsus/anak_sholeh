import React from "react";

export function AnakSholehLogo({
  className = "w-10 h-10",
  showText = true,
  size = "md"
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Official Emblem Logo Badge */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Outer Shield / Arch (Masjid Dome Shape) */}
          <path
            d="M50 4C30 4 14 18 14 38V74C14 84 22 92 32 92H68C78 92 86 84 86 74V38C86 18 70 4 50 4Z"
            fill="url(#emeraldGradient)"
            stroke="#7ED957"
            strokeWidth="3.5"
          />

          {/* Golden Crescent & Star */}
          <path
            d="M50 14C46 14 42 16.5 40 20C41.5 20.5 43.5 21 45.5 21C53 21 59 15 59 7.5C59 6.2 58.7 5 58.2 4C65.5 6.5 70.5 13.5 70.5 21.5C70.5 31.2 62.7 39 53 39C46 39 39.8 35 37 29C36.8 29.8 36.7 30.6 36.7 31.5C36.7 40.5 44 47.8 53 47.8C62 47.8 69.3 40.5 69.3 31.5C69.3 24.2 64.5 18 57.8 15.8C55.5 14.6 52.8 14 50 14Z"
            fill="#F4B63F"
          />
          {/* Small Star */}
          <polygon
            points="68,17 70,22 75,22 71,25 73,30 68,27 64,30 65,25 62,22 67,22"
            fill="#F4B63F"
          />

          {/* Children Silhouettes (Anak Laki-laki & Perempuan) */}
          {/* Boy (Left with Peci) */}
          <rect x="25" y="44" width="22" height="7" rx="3.5" fill="#FFFFFF" />
          <circle cx="36" cy="55" r="11" fill="#FFFFFF" />
          {/* Girl (Right with Jilbab) */}
          <path d="M52 46C52 38 60 38 68 38C76 38 82 44 82 54C82 65 74 71 67 71C60 71 52 64 52 46Z" fill="#FFFFFF" />
          <circle cx="66" cy="56" r="8.5" fill="#F8FAFC" />

          {/* Open Book (Buku Ilmu) at bottom */}
          <path
            d="M50 78L26 69V81L50 89L74 81V69L50 78Z"
            fill="#FFFFFF"
            stroke="#7ED957"
            strokeWidth="2"
          />
          {/* Green Leaf (Daun Pertumbuhan) */}
          <path
            d="M50 70C50 63 58 58 64 58C64 65 57 70 50 70Z"
            fill="#7ED957"
          />

          <defs>
            <linearGradient id="emeraldGradient" x1="14" y1="4" x2="86" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0E7A49" />
              <stop offset="0.6" stopColor="#0B5E38" />
              <stop offset="1" stopColor="#073D24" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight text-gray-900 ${size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-lg" : "text-xl sm:text-2xl"}`}>
              ANAK <span className="text-[#0E7A49]">SHOLEH</span>
            </span>
            {/* Small leaf icon */}
            <span className="inline-block w-2.5 h-2.5 rounded-tr-full rounded-bl-full bg-[#7ED957] rotate-45 transform origin-center" />
          </div>
          <span className={`text-[#0E7A49] font-bold tracking-wider ${size === "lg" ? "text-xs sm:text-sm mt-1" : "text-[10px] sm:text-xs mt-0.5"}`}>
            Belajar • Berakhlak • Bertumbuh
          </span>
        </div>
      )}
    </div>
  );
}
