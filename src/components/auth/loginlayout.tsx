"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type LoginAuthLayoutProps = {
  onLogin?: (params: {
    email: string;
    password: string;
    rememberMe: boolean;
    setError: (msg: string | null) => void;
    setLoading: (v: boolean) => void;
  }) => void;
  googleButton?: React.ReactNode;
  googleError?: string | null;
};

export default function LoginAuthLayout({
  onLogin,
  googleButton,
  googleError,
}: LoginAuthLayoutProps) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (onLogin) {
      await onLogin({
        email: form.email,
        password: form.password,
        rememberMe,
        setError,
        setLoading,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFDFD]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#022F40]">Selamat Datang!</h1>
          <p className="text-sm text-gray-500">Masuk ke akun Signoria Anda</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-[#022F40] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="text-[#022F40] w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF] transition"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#022F40] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="text-[#022F40] w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF] transition"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-[#022F40]">
              <input
                type="checkbox"
                className="accent-[#ADF5FF]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ingat saya
            </label>
            <a href="#" className="text-xs text-[#022F40] hover:underline">
              Lupa password?
            </a>
          </div>
          {error && <div className="text-xs text-red-500">{error}</div>}
          <button
            type="submit"
            className={`w-full bg-[#ADF5FF] text-[#022F40] rounded-md py-2 font-semibold mt-2 hover:bg-[#8EDAE6] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk →"}
          </button>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {/* Google Button */}
          {googleButton ? (
            <div className="w-full">{googleButton}</div>
          ) : (
            <button
              type="button"
              className="w-full border border-gray-200 shadow-sm rounded-md py-2 font-semibold flex items-center justify-center gap-2 text-[#022F40] bg-white hover:bg-gray-50 transition"
            >
              <span className="flex items-center justify-center w-5 h-5">
                <span className="text-[22px] font-bold text-[#EA4335]">G</span>
              </span>
              <span className="flex-1 text-center">Masuk dengan Google</span>
            </button>
          )}
          {googleError && <div className="text-xs text-red-500 mt-2">{googleError}</div>}
        </form>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-6 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#022F40] hover:underline">
            Daftar di sini
          </Link>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full bg-[#ADF5FF] text-[#022F40] rounded-md py-2 font-semibold hover:bg-[#8EDAE6] transition"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
}
