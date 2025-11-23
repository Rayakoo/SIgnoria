"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


import Cookies from "js-cookie";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { signin, signInWithGoogle } from "@/services/authservice";
import LoginAuthLayout from "@/components/auth/loginlayout";


const GOOGLE_CLIENT_ID =
  "397171539019-uf6svnf3ahvc3krmbg053q2bkt7ihn1k.apps.googleusercontent.com";

export default function LoginPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Manual Login Handler
  const handleLogin = async ({
    email,
    password,
    rememberMe,
    setError,
    setLoading,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
    setError: (msg: string | null) => void;
    setLoading: (v: boolean) => void;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signin({ email, password });

      // Set token in cookies
      Cookies.set("token", data.token, {
        expires: rememberMe ? 7 : undefined,
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      if (data.user?.username) {
        Cookies.set("username", data.user.username);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login Handler
  const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Token Google tidak ditemukan");

      const data = await signInWithGoogle(id_token);

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Google login error:", err);
      setError(errorMsg || "Gagal login dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginAuthLayout
        onLogin={handleLogin}
        googleButton={
          <div className="flex flex-col items-center mt-4 w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Gagal login dengan Google")}
              width="300"
              useOneTap={false}
            />
          </div>
        }
        googleError={error}
      />

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-lg mb-2 text-center">
              Login Berhasil!
            </div>
            <div className="text-gray-600 text-center mb-2">
              Anda akan diarahkan ke halaman utama...
            </div>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
