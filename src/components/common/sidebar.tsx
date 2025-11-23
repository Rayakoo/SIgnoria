"use client";

import { getProfile } from "@/services/userservice";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
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

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white shadow-md p-6 rounded-xl">
      {/* Profile Section */}
      {user ? (
        <div className="flex flex-col items-center gap-3 border-b pb-6">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-4xl" />
          )}
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-[#ADF5FF] text-[#022F40] px-2 py-1 rounded">
              {user.level || "Lv.1"}
            </span>
            <span className="text-sm text-gray-500">⭐ {user.stars || 0}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 border-b pb-4">
          <FaUserCircle className="text-gray-400 text-4xl" />
          <p className="text-sm text-gray-500">Anda belum login</p>
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition">
              Login
            </button>
          </Link>
        </div>
      )}

      {/* Rank Section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[#022F40]">Lihat Peringkat mu!</h3>
        <p className="text-sm text-gray-600">
          Tinggal {user?.remainingLessons || 3} pelajaran lagi untuk mulai
          berkompetisi. Semangat, kamu pasti bisa!
        </p>
      </div>

      {/* Daily Missions */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Misi Harian</h3>
        <ul className="text-sm text-gray-600">
          <li>Dapatkan 3 Bintang</li>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-[#022F40] h-2 rounded-full"
              style={{ width: `${(user?.dailyStars || 0) / 3 * 100}%` }}
            ></div>
          </div>
          <li>Selesaikan 3 Sublevel</li>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(user?.dailySublevels || 0) / 3 * 100}%` }}
            ></div>
          </div>
          <li>Belajar 5 Kosakata Baru</li>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(user?.dailyWords || 0) / 5 * 100}%` }}
            ></div>
          </div>
        </ul>
      </div>

      {/* Navigation Section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Navigasi</h3>
        <ul className="text-sm text-gray-600">
          <li>
            <Link href="/peringkat" className="text-blue-500 hover:underline">
              Papan Skor Mingguan
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
