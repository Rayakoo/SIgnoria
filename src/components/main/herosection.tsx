"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[var(--background)] font-poppins">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="w-full md:w-[520px] h-[520px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/assets/home/hero_section (4).png"
                alt="Sign language learning"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 max-w-[522px]">
              <h1
                className="text-[32px] md:text-[56px] leading-tight text-[var(--primary)] mb-9"
                style={{ lineHeight: "1.2" }}
              >
                Cara seru dan efektif belajar bahasa isyarat!
              </h1>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full px-6 py-3 bg-[var(--primary)] text-[var(--secondary)] rounded-xl font-bold hover:bg-[#033d54] transition-colors"
                >
                  MULAI
                </button>
                <button className="w-full px-6 py-3 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  AKU SUDAH PUNYA AKUN
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1 - Dark Background */}
      <section className="bg-[var(--primary)] py-20 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 max-w-[522px]">
              <h2
                className="text-[32px] md:text-[56px] leading-tight text-[var(--secondary)] mb-9"
                style={{ lineHeight: "1.2" }}
              >
                Pembelajaran
                <br className="hidden md:block" /> yang seru
              </h2>
              <p className="text-[#F7FEFF] text-lg md:text-2xl leading-relaxed">
                Belajar bahasa isyarat mudah dan menyenangkan! Dengan latihan
                singkat memadukan metode pembelajar interaktif dengan teknologi
                pengenalan gerakan.
              </p>
            </div>
            <div className="w-full md:w-[520px] h-[350px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/assets/home/hero_section (3).png"
                alt="Interactive learning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Light Background */}
      <section className="bg-[var(--background)] py-20 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="w-full md:w-[360px] h-[342px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/assets/home/hero_section (2).png"
                alt="Personalized learning"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 max-w-[522px]">
              <h2
                className="text-[32px] md:text-[56px] leading-tight text-[var(--primary)] mb-9"
                style={{ lineHeight: "1.2" }}
              >
                Disesuaikan kemampuan mu
              </h2>
              <p className="text-[#181818] text-lg md:text-2xl leading-relaxed">
                Signoria merancang latihan singkat yang efektif, praktis, dan
                relevan untuk kebutuhan komunikasi sehari-hari.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 - Dark Background Centered */}
      <section className="bg-[#022F40] py-20 px-8 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-[56px] leading-tight text-[#ADF5FF] mb-9"
            style={{ lineHeight: "1.2" }}
          >
            Kapan pun, di mana pun
          </h2>
          <p className="text-[#F7FEFF] text-2xl leading-relaxed mb-8 max-w-[522px] mx-auto">
            Belajar bahasa isyarat dengan Signoria fleksibel tanpa batas. Akses
            materi sesuai target dan gaya belajarmu sendiri.
          </p>
          <div className="w-full max-w-[600px] mx-auto h-[490px] rounded-lg overflow-hidden mb-8">
            <img
              src="/assets/home/hero_section (1).png"
              alt="Learn anywhere"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="px-6 py-3 bg-[#ADF5FF] text-[#181818] rounded-xl font-bold hover:bg-[#9de5f5] transition-colors">
            MULAI SEKARANG
          </button>
        </div>
      </section>
    </div>
  );
}