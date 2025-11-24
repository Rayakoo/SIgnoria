"use client";

import { getProfile } from "@/services/userservice";
import { useEffect, useState } from "react";
import ProfileCard from "./profilecard";
import LeaderboardCard from "./LeaderboardCard";
import MissionCard from "./MissionCard";

// Reusable CardWrapper component
function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-4 w-full md:w-80 lg:w-96 bg-white shadow-md p-6 rounded-xl">
      {children}
    </div>
  );
}

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
    <aside className="flex flex-col gap-4">
      {/* Profile Card */}
      <CardWrapper>
        <ProfileCard user={user} />
      </CardWrapper>

      {/* Leaderboard Card */}
        <LeaderboardCard remainingLessons={user?.remainingLessons || 3} />

      {/* Mission Card */}
        <MissionCard
          dailyStars={user?.dailyStars || 0}
          dailySublevels={user?.dailySublevels || 0}
          dailyWords={user?.dailyWords || 0}
        />
    </aside>
  );
}
