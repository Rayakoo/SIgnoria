// src/app/kelas/bermain/page.js
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Lock } from "lucide-react";

// Lazy load kedua komponen Playground yang berbeda
const DynamicAlphabetPlayground = dynamic(
  () => import("@/components/camera/sandbox/AlphabetCam"), // Ensure this matches the file structure
  { ssr: false, loading: () => <CameraLoader message="Memuat model Huruf..." /> }
);
const DynamicNumberPlayground = dynamic(
  () => import("@/components/camera/sandbox/NumberCam"), // Ensure this file exists for number detection
  { ssr: false, loading: () => <CameraLoader message="Memuat model Angka..." /> }
);

function CameraLoader({ message }: { message: string }) {
  return (
    <div className="min-h-[480px] w-full grid place-items-center bg-gray-100 rounded-xl border">
      <Lock size={48} className="text-gray-400 animate-spin" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

// Definisikan mode
const PlaygroundMode = {
  ALPHABET: "ALPHABET",
  NUMBER: "NUMBER",
};

export default function BermainPage() {
  const [mode, setMode] = useState(PlaygroundMode.ALPHABET); // Default mode

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-poppins transition-all duration-300">
      <h1 className="text-3xl font-bold text-[#022F40] mb-4 text-center md:text-left">
        Playground Bahasa Isyarat
      </h1>

      <p className="text-gray-600 mb-8 text-center md:text-left">
        Latih gerakan isyarat Anda secara <em>real-time</em>. Pilih mode di bawah untuk mencoba deteksi.
      </p>

      {/* Tombol Pemilihan Mode */}
      <div className="mb-8 flex justify-center md:justify-start gap-4">
        <button
          onClick={() => setMode(PlaygroundMode.ALPHABET)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === PlaygroundMode.ALPHABET
              ? "bg-[#022F40] text-white"
              : "bg-[#ADF5FF] text-[#022F40] hover:bg-[#022F40] hover:text-white"
          }`}
        >
          Huruf (A-Z)
        </button>
        <button
          onClick={() => setMode(PlaygroundMode.NUMBER)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === PlaygroundMode.NUMBER
              ? "bg-[#022F40] text-white"
              : "bg-[#ADF5FF] text-[#022F40] hover:bg-[#022F40] hover:text-white"
          }`}
        >
          Angka (0-9)
        </button>
      </div>

      {/* Kontainer Utama Playground */}
      <div className="flex justify-center w-full">
        {mode === PlaygroundMode.ALPHABET && <DynamicAlphabetPlayground />}
        {mode === PlaygroundMode.NUMBER && <DynamicNumberPlayground />}
      </div>
    </div>
  );
}