import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function LeaderboardLayout({ data }: { data: Array<any> }) {
  return (
    <div className="w-full h-screen bg-white shadow-md p-4 md:p-8 rounded-lg overflow-auto">
      <h2 className="text-lg md:text-2xl font-bold mb-4 text-center">
        Papan Skor Mingguan
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-sm md:text-base">RANK</th>
            <th className="py-2 px-4 text-sm md:text-base">USERNAME</th>
            <th className="py-2 px-4 text-sm md:text-base">SCORE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-sm md:text-base">{index + 1}</td>
              <td className="py-2 px-4 flex items-center gap-2 text-sm md:text-base">
                <FaUserCircle className="text-gray-400 text-4xl" />
                <span>{user.username}</span>
                <span
                  className={`text-xs md:text-sm px-2 py-1 rounded ${
                    user.level === "Ahli"
                      ? "bg-blue-100 text-blue-600"
                      : user.level === "Menengah"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.level}
                </span>
              </td>
              <td className="py-2 px-4 text-yellow-600 text-sm md:text-base">
                ⭐ {user.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
