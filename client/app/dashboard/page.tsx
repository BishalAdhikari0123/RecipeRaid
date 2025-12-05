"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { usersAPI, raidsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface UserStats {
  user: any;
  rank: number;
  teams: any[];
  recentRaids: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      const response = await usersAPI.getStats();
      setStats(response.data);
    } catch (error: any) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-red-900 to-black flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-red-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            Recipe Raid
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/raids" className="hover:text-purple-400 transition-colors">
              Raids
            </Link>
            <Link href="/teams" className="hover:text-purple-400 transition-colors">
              Teams
            </Link>
            <Link href="/leaderboard" className="hover:text-purple-400 transition-colors">
              Leaderboard
            </Link>
            <Link href="/pantry" className="hover:text-purple-400 transition-colors">
              Pantry
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{stats?.user.display_name || stats?.user.username}</h1>
              <p className="text-gray-400">@{stats?.user.username}</p>
            </div>
            {stats?.user.is_premium && (
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">
                ⭐ Premium
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold">{stats?.user.total_score || 0}</div>
              <div className="text-gray-400">Total Score</div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold">{stats?.user.total_raids_completed || 0}</div>
              <div className="text-gray-400">Raids Completed</div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold">#{stats?.rank || "N/A"}</div>
              <div className="text-gray-400">Global Rank</div>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Teams</h2>
            <Link
              href="/teams/create"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Create Team
            </Link>
          </div>

          {stats?.teams.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 text-center border border-purple-500/30">
              <p className="text-gray-400 mb-4">You're not in any teams yet</p>
              <Link
                href="/teams/create"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stats?.teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="raid-card hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                  <p className="text-gray-400">Role: {team.role}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Raids */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Raids</h2>

          {stats?.recentRaids.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 text-center border border-purple-500/30">
              <p className="text-gray-400 mb-4">No raids yet</p>
              <Link
                href="/raids"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Start Your First Raid
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentRaids.map((raid) => (
                <div key={raid.id} className="raid-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{raid.boss_name}</h3>
                      <p className="text-gray-400">Team: {raid.team_name}</p>
                      <p className="text-sm text-gray-500">
                        Difficulty: <span className={`rarity-${raid.difficulty}`}>{raid.difficulty}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          raid.status === "completed"
                            ? "bg-green-600"
                            : raid.status === "active"
                            ? "bg-blue-600"
                            : "bg-gray-600"
                        }`}
                      >
                        {raid.status}
                      </div>
                      {raid.total_score > 0 && (
                        <div className="mt-2 text-2xl font-bold text-purple-400">{raid.total_score} pts</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
