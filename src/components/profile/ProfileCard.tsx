"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/userservice";
import { logout } from "@/services/authservice";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getProfile();
        setUser(profile);
        setEditedName(profile.username);
        setEditedBio(profile.bio || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/"; 
  };

  const handleSaveName = () => {
    setUser((prev) => ({ ...prev, username: editedName }));
    setIsEditingName(false);
  };

  const handleSaveBio = () => {
    setUser((prev) => ({ ...prev, bio: editedBio }));
    setIsEditingBio(false);
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-10">
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-400 text-6xl" />
        )}
        <div>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSaveName}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setEditedName(user.username);
                  setIsEditingName(false);
                }}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm"
              >
                Batal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
              Pemula
            </span>
            <span className="text-sm text-gray-500">⭐ {user.stars || 0}</span>
          </div>
        </div>
      </div>

      {/* Informasi Pribadi */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Informasi Pribadi</h2>
        <div className="space-y-3">
          <InputField label="Nama" value={user.username} />
          <InputField label="Email" value={user.email} />
          <InputField label="Nomor" value="nomor" />
        </div>
      </div>

      {/* Bio Section */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Bio</h2>
        {isEditingBio ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveBio}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setEditedBio(user.bio || "");
                  setIsEditingBio(false);
                }}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-gray-500">
              {user.bio ||
                "Belum ada bio. Ceritakan sedikit tentang dirimu di sini!"}
            </p>
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Informasi Akun */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Informasi Akun</h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Total Bintang" value={user.stars || 0} />
          <InfoItem label="Terakhir Login" value="23 Nov 2025, 12:00" />
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-right">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 w-24">{label}</span>
      <input
        type="text"
        value={value}
        readOnly
        className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  );
}
