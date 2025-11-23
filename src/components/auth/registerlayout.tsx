"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/services/authservice";

export default function RegisterLayout() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /[A-Z]/.test(password) && /\d/.test(password) && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true); // Set loading immediately

    const { email, username, password, confirmPassword } = form;

    if (!email || !username || !password || !confirmPassword) {
      setError("Semua field harus diisi.");
      setLoading(false); // Reset loading
      return;
    }
    if (!validateEmail(email)) {
      setError("Email tidak valid.");
      setLoading(false); // Reset loading
      return;
    }
    if (!validatePassword(password)) {
      setError("Password minimal 6 karakter, mengandung huruf besar dan angka.");
      setLoading(false); // Reset loading
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      setLoading(false); // Reset loading
      return;
    }

    setError(null);

    try {
      await signup({ email, username, password });
      router.push("/rekomendasi-akun");
    } catch (err) {
      setError((err as Error).message || "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFDFD]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#022F40]">Daftar Akun</h1>
          <p className="text-sm text-gray-500">Mulai perjalanan belajar Anda</p>
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
              Username
            </label>
            <input
              type="text"
              name="username"
              className="text-[#022F40] w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF] transition"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#022F40] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="text-[#022F40] w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF] transition pr-10"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#022F40] font-semibold"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#022F40] mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="text-[#022F40] w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF] transition pr-10"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#022F40] font-semibold"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#022F40]">
            <input
              type="checkbox"
              className="accent-[#ADF5FF]"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            Saya setuju dengan{" "}
            <a href="#" className="text-[#022F40] hover:underline">
              Syarat & Ketentuan
            </a>
          </label>
          {error && <div className="text-xs text-red-500">{error}</div>}
          <button
            type="submit"
            className={`w-full rounded-md py-2 font-semibold mt-2 transition shadow-md ${
              agree && !loading
                ? "bg-[#ADF5FF] text-[#022F40] hover:bg-[#8EDAE6] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!agree || loading}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-6 text-center">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#022F40] hover:underline">
            Masuk di sini
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
