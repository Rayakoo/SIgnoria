"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./navbar";
import Footer from "./footer";import Sidebar from "./sidebar";
import { getProfile } from "@/services/userservice";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user directly using getProfile (token is handled by axios)
    async function fetchUser() {
      try {
        const fetchedUser = await getProfile();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }

    fetchUser();
  }, []);

  // Halaman tanpa Navbar & Footer (auth)
  const hideNavAndFooter = ["/login", "/register"];

  // 🔥 Deteksi halaman not-found
  const isNotFound = pathname === "/_not-found" || pathname === "/404";

  // Cek apakah ini halaman kelas
  const isKelas = pathname.startsWith("/belajar");
  const isKamus = pathname.startsWith("/kamus");
  const isPeringkat = pathname.startsWith("/peringkat");
  

  // Layout untuk halaman auth
  if (hideNavAndFooter.includes(pathname)) {
    return <main>{children}</main>;
  }

  // Layout untuk not-found (tanpa navbar/footer/sidebar)
  if (isNotFound) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Layout untuk halaman kelas, kamus, peringkat (dengan sidebar)
if (isKelas || isKamus || isPeringkat) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Konten Utama */}
      <div className="flex w-full px-12 pt-6 gap-4">  
        {/* px-6 = padding horizontal, pt-6 = padding atas, gap-6 = jarak sidebar & children */}

        {/* Sidebar */}
        <div className="flex-[1]">
          <Sidebar />
        </div>

        {/* Children */}
        <main className="flex-[4]">
          {children}
        </main>
      </div>

    </div>
  );
}



  // Layout Landing Page (default)
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
