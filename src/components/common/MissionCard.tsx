"use client";

export default function MissionCard({
  dailyStars,
  dailySublevels,
  dailyWords,
}: {
  dailyStars: number;
  dailySublevels: number;
  dailyWords: number;
}) {
  return (
    <div className="mt-4  rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Misi Harian</h3>
      <ul className="text-sm text-gray-600">
        <li>Dapatkan 3 Bintang</li>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-[#022F40] h-2 rounded-full"
            style={{ width: `${(dailyStars / 3) * 100}%` }}
          ></div>
        </div>
        <li>Selesaikan 3 Sublevel</li>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(dailySublevels / 3) * 100}%` }}
          ></div>
        </div>
        <li>Belajar 5 Kosakata Baru</li>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(dailyWords / 5) * 100}%` }}
          ></div>
        </div>
      </ul>
    </div>
  );
}
