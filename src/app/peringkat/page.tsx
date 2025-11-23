import Sidebar from "@/components/common/sidebar";
import LeaderboardLayout from "@/components/leaderboard/leaderboardlayout";

const mockData = [
  { username: "Alibaba089", avatar: "/avatar1.png", level: "Ahli", score: 323 },
  { username: "Shintaokt", avatar: "/avatar2.png", level: "Menengah", score: 288 },
  { username: "achan", avatar: "/avatar3.png", level: "Menengah", score: 123 },
  { username: "hafizsyarif", avatar: "/avatar4.png", level: "Pemula", score: 54 },
  { username: "Bambang", avatar: "/avatar5.png", level: "Pemula", score: 23 },
  { username: "chandraa2", avatar: "/avatar6.png", level: "Pemula", score: 11 },
  { username: "rafinug", avatar: "/avatar7.png", level: "Pemula", score: 6 },
  { username: "achmad", avatar: "/avatar8.png", level: "Pemula", score: 4 },
  { username: "Fifi123", avatar: "/avatar9.png", level: "Pemula", score: 4 },
  { username: "Aliyazzz", avatar: "/avatar10.png", level: "Pemula", score: 3 },
];

export default function PeringkatPage() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      
      <div className="w-full md:w-2/3">
        <LeaderboardLayout data={mockData} />
      </div>
    </div>
  );
}
