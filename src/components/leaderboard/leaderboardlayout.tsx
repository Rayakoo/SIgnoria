import React from "react";

export default function LeaderboardLayout({ data }: { data: Array<any> }) {
  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Papan Skor Mingguan</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4">RANK</th>
            <th className="py-2 px-4">USERNAME</th>
            <th className="py-2 px-4">SCORE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4 flex items-center gap-2">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{user.username}</span>
                <span className={`text-xs px-2 py-1 rounded ${user.level === "Ahli" ? "bg-blue-100 text-blue-600" : user.level === "Menengah" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                  {user.level}
                </span>
              </td>
              <td className="py-2 px-4 text-yellow-600">⭐ {user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
