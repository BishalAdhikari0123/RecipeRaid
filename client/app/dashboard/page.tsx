"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { usersAPI, raidsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { useTheme } from "@/lib/theme";

interface UserStats {
  user: any;
  rank: number;
  teams: any[];
  recentRaids: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isHydrated } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isHydrated) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    loadStats();
  }, [user, router, isHydrated]);

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

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors">
        <div className="text-2xl text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Header */}
      <header className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-black dark:text-white">
            Recipe Raid
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/raids" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Raids
            </Link>
            <Link href="/teams" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Teams
            </Link>
            <Link href="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/pantry" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Pantry
            </Link>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-xl"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="mb-8 bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">{stats?.user.display_name || stats?.user.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">@{stats?.user.username}</p>
            </div>
            {stats?.user.is_premium && (
              <span className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold">
                ⭐ Premium
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-black dark:text-white">{stats?.user.total_score || 0}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Score</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-black dark:text-white">{stats?.user.total_raids_completed || 0}</div>
              <div className="text-gray-600 dark:text-gray-400">Raids Completed</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-black dark:text-white">#{stats?.rank || "N/A"}</div>
              <div className="text-gray-600 dark:text-gray-400">Global Rank</div>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black dark:text-white">Your Teams</h2>
            <Link
              href="/teams/create"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors"
            >
              Create Team
            </Link>
          </div>

          {stats?.teams.length === 0 ? (
            <div className="bg-white dark:bg-black rounded-lg p-8 text-center border-2 border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 mb-4">You're not in any teams yet</p>
              <Link
                href="/teams/create"
                className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors"
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
                  className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{team.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Role: {team.role}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Raids */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Recent Raids</h2>

          {stats?.recentRaids.length === 0 ? (
            <div className="bg-white dark:bg-black rounded-lg p-8 text-center border-2 border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No raids yet</p>
              <Link
                href="/raids"
                className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors"
              >
                Start Your First Raid
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentRaids.map((raid) => (
                <div key={raid.id} className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-black dark:text-white">{raid.boss_name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{raid.mode === "team" && raid.team_name ? `Team: ${raid.team_name}` : "Solo Raid"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Difficulty: <span className="font-semibold text-gray-700 dark:text-gray-300">{raid.difficulty}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          raid.status === "completed"
                            ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-black"
                            : raid.status === "active"
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-gray-400 dark:bg-gray-600 text-white dark:text-black"
                        }`}
                      >
                        {raid.status.toUpperCase()}
                      </div>
                      {raid.total_score > 0 && (
                        <div className="mt-2 text-2xl font-bold text-black dark:text-white">{raid.total_score} pts</div>
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
