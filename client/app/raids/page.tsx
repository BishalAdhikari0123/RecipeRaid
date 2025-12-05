"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { raidsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/lib/theme";

interface Boss {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  difficulty_level: number;
  cuisine_type: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  base_score: number;
}

interface Raid {
  id: string;
  boss_name: string;
  difficulty: string;
  difficulty_level: number;
  mode: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_score: number;
  time_taken_minutes?: number;
  team_name?: string;
}

export default function RaidsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"browse" | "my-raids">("browse");
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [raids, setRaids] = useState<Raid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<"solo" | "team">("solo");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [activeTab, selectedDifficulty]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "browse") {
        const params = selectedDifficulty !== "all" ? { difficulty: selectedDifficulty } : {};
        const response = await raidsAPI.getAvailableBosses(params);
        setBosses(response.data.bosses);
      } else {
        const response = await raidsAPI.getUserRaids();
        setRaids(response.data.raids);
      }
    } catch (error: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartRaid = async (bossId: string) => {
    try {
      const data = {
        bossId,
        mode: selectedMode,
        teamId: selectedMode === "team" ? null : undefined,
      };
      const response = await raidsAPI.start(data);
      toast.success("Raid started!");
      router.push(`/raids/${response.data.raid.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to start raid");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "text-gray-600 dark:text-gray-400",
      medium: "text-gray-700 dark:text-gray-300",
      hard: "text-gray-800 dark:text-gray-200",
      extreme: "text-gray-900 dark:text-gray-100",
      legendary: "text-black dark:text-white font-bold",
    };
    return colors[difficulty.toLowerCase()] || "text-gray-500";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-black dark:bg-white text-white dark:text-black",
      completed: "bg-gray-800 dark:bg-gray-200 text-white dark:text-black",
      failed: "bg-gray-600 dark:bg-gray-400 text-white dark:text-black",
      abandoned: "bg-gray-400 dark:bg-gray-600 text-white dark:text-black",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || "bg-gray-500"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        {/* Header */}
        <header className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-black dark:text-white">
              Recipe Raid
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/raids" className="text-black dark:text-white font-semibold">
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
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "browse"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              Browse Bosses
            </button>
            <button
              onClick={() => setActiveTab("my-raids")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "my-raids"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              My Raids
            </button>
          </div>

          {/* Browse Bosses Tab */}
          {activeTab === "browse" && (
            <>
              {/* Filters */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex gap-4 items-center flex-wrap">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Mode:</label>
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value as "solo" | "team")}
                      className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                    >
                      <option value="solo">Solo</option>
                      <option value="team">Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Difficulty:</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                    >
                      <option value="all">All</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="extreme">Extreme</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bosses Grid */}
              {loading ? (
                <div className="text-center text-2xl py-12">Loading...</div>
              ) : bosses.length === 0 ? (
                <div className="text-center text-gray-400 py-12">No bosses found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bosses.map((boss) => (
                    <div
                      key={boss.id}
                      className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-black dark:text-white">{boss.name}</h3>
                        <span className={`text-sm font-semibold ${getDifficultyColor(boss.difficulty)}`}>
                          {boss.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{boss.description}</p>
                      <div className="space-y-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span>Cuisine:</span>
                          <span className="font-semibold">{boss.cuisine_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-semibold">
                            {boss.prep_time_minutes + boss.cook_time_minutes} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Score:</span>
                          <span className="font-semibold">{boss.base_score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Servings:</span>
                          <span className="font-semibold">{boss.servings}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartRaid(boss.id)}
                        className="w-full py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                      >
                        Start {selectedMode === "solo" ? "Solo" : "Team"} Raid
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* My Raids Tab */}
          {activeTab === "my-raids" && (
            <>
              {loading ? (
                <div className="text-center text-2xl py-12 text-black dark:text-white">Loading...</div>
              ) : raids.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-12">No raids yet</div>
              ) : (
                <div className="space-y-4">
                  {raids.map((raid) => (
                    <Link
                      key={raid.id}
                      href={`/raids/${raid.id}`}
                      className="block bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-black dark:text-white">{raid.boss_name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {raid.mode === "team" && raid.team_name ? `Team: ${raid.team_name}` : "Solo Raid"}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className={`text-sm font-semibold ${getDifficultyColor(raid.difficulty)}`}>
                            {raid.difficulty.toUpperCase()}
                          </span>
                          {getStatusBadge(raid.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Started:</span>
                          <p className="font-semibold">
                            {new Date(raid.started_at).toLocaleDateString()}
                          </p>
                        </div>
                        {raid.completed_at && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                            <p className="font-semibold">
                              {new Date(raid.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {raid.total_score > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Score:</span>
                            <p className="font-semibold">{raid.total_score}</p>
                          </div>
                        )}
                        {raid.time_taken_minutes && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Time:</span>
                            <p className="font-semibold">{raid.time_taken_minutes} min</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
