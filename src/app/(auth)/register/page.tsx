"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { signin, signup } from "@/services/authservice";
import RegisterLayout from "@/components/auth/registerlayout";


interface RegisterForm {
  email: string;
  password: string;
  username: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleRegister = async ({
    email,
    username,
    password,
    setError,
    setLoading,
  }: RegisterForm & {
    setError: (msg: string | null) => void;
    setLoading: (v: boolean) => void;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Call signup API
      await signup({ email, username, password });

      // Automatically log in the user after successful registration
      const data = await signin({ email, password });

      // Set token in cookies
      Cookies.set("token", data.token, {
        expires: 7,
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      if (data.user?.username) {
        Cookies.set("username", data.user.username);
      }

      // Show success message and redirect
      setSuccess(true);
      setTimeout(() => {
        router.push("/rekomendasi-akun");
      }, 1200);
    } catch (err) {
      setError((err as Error).message || "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  // Use a local any-typed alias so we can pass the onRegister prop until the RegisterLayout props are typed
  const Layout: any = RegisterLayout;

  return (
    <>
      <Layout onRegister={handleRegister} />
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-lg mb-2 text-center">Registrasi Berhasil!</div>
            
          </div>
        </div>
      )}
    </>
  );
}
