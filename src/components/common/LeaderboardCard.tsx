"use client";

import Link from "next/link";

export default function LeaderboardCard({ remainingLessons }: { remainingLessons: number }) {
  return (
    <div className="mt-4  rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#022F40]">Lihat Peringkat mu!</h3>
      <p className="text-sm text-gray-600">
        Tinggal {remainingLessons} pelajaran lagi untuk mulai berkompetisi. Semangat, kamu pasti bisa!
      </p>
      <Link href="/peringkat">
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition w-full">
          Lihat Leaderboard
        </button>
      </Link>
    </div>
  );
}
