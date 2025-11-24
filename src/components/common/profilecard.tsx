"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileCard({ user }: { user: any }) {
  return user ? (
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
  );
}
