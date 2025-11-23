"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getProfile } from "@/services/userservice";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Belajar", href: "/belajar" },
  { name: "Kamus", href: "/kamus" },
  { name: "Peringkat", href: "/peringkat" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
    fetchUser();
  }, []);

  const protectedLinks = ["/quiz-maker", "/history", "/study-groups"];

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (!user && protectedLinks.includes(href)) {
      e.preventDefault();
      setShowLoginPopup(true);
    }
  };

  return (
    <nav
      className={`w-full shadow-sm ${
        user ? "bg-[#022F40]" : "bg-white"
      } transition-colors`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-20 px-4 md:px-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={user ? "assets/logo/logo_putih.svg" : "assets/logo/logo.svg"}
            alt="Signoria Logo"
            width={32}
            height={32}
          />
          <span
            className={`font-bold text-xl tracking-tight ${
              user ? "text-white" : "text-[#022F40]"
            }`}
          >
            SIgnoria
          </span>
        </Link>
        {/* Hamburger Mobile */}
        {user && (
          <button
            className="md:hidden text-2xl text-white focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="material-icons">menu</span>
          </button>
        )}
        {/* Menu Desktop */}
        {user && (
          <div className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleProtectedNav(e, link.href)}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#ADF5FF]"
                      : "text-white hover:text-[#ADF5FF]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
        {/* Profile / Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="text-sm font-semibold text-white">
           
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-[#022F40] hover:bg-[#8EDAE6] text-white font-semibold px-4 py-2 rounded-lg transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {user && mobileOpen && (
        <div className="md:hidden bg-[#022F40] shadow-lg px-4 pb-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => {
                handleProtectedNav(e, link.href);
                setMobileOpen(false);
              }}
              className={`text-base font-medium py-2 px-2 rounded transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-[#ADF5FF] bg-[#022F40]"
                  : "text-white hover:text-[#ADF5FF]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
      {/* Popup login */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-bold text-lg mb-2 text-center">
              Login Diperlukan
            </div>
            <div className="text-gray-600 text-center mb-4">
              Untuk mengakses fitur ini, Anda harus login terlebih dahulu.
            </div>
            <button
              className="w-full bg-[#2563eb] text-white rounded-md py-2 font-semibold hover:bg-[#174bbd] transition"
              onClick={() => {
                setShowLoginPopup(false);
                window.location.href = "/login";
              }}
            >
              Login Sekarang
            </button>
            <button
              className="w-full mt-2 bg-gray-200 text-gray-600 rounded-md py-2 font-semibold hover:bg-gray-300 transition"
              onClick={() => setShowLoginPopup(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}