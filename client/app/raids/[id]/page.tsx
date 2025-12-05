"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { raidsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/lib/theme";

interface RaidDetail {
  id: string;
  user_id: string;
  team_id?: string;
  boss_id: string;
  mode: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_score: number;
  time_taken_minutes?: number;
  photo_proof_url?: string;
  notes?: string;
  boss_name: string;
  boss_description: string;
  difficulty: string;
  required_ingredients: any;
  instructions: any;
  team_name?: string;
}

interface Participant {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  individual_score: number;
  contributed_ingredients: any;
}

export default function RaidDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [raid, setRaid] = useState<RaidDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeForm, setCompleteForm] = useState({
    score: 0,
    timeTakenMinutes: 0,
    notes: "",
  });

  useEffect(() => {
    loadRaidDetails();
  }, [params.id]);

  const loadRaidDetails = async () => {
    try {
      const response = await raidsAPI.get(params.id);
      setRaid(response.data.raid);
      setParticipants(response.data.participants || []);
    } catch (error: any) {
      toast.error("Failed to load raid details");
      router.push("/raids");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRaid = async () => {
    if (completeForm.score <= 0 || completeForm.timeTakenMinutes <= 0) {
      toast.error("Please enter valid score and time");
      return;
    }

    setCompleting(true);
    try {
      await raidsAPI.complete(params.id, completeForm);
      toast.success("Raid completed!");
      setShowCompleteModal(false);
      loadRaidDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to complete raid");
    } finally {
      setCompleting(false);
    }
  };

  const handleAbandonRaid = async () => {
    if (!confirm("Are you sure you want to abandon this raid?")) return;

    try {
      await raidsAPI.abandon(params.id);
      toast.success("Raid abandoned");
      loadRaidDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to abandon raid");
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
    return colors[difficulty?.toLowerCase()] || "text-gray-500";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-black dark:bg-white text-white dark:text-black",
      completed: "bg-gray-800 dark:bg-gray-200 text-white dark:text-black",
      failed: "bg-gray-600 dark:bg-gray-400 text-white dark:text-black",
      abandoned: "bg-gray-400 dark:bg-gray-600 text-white dark:text-black",
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${colors[status] || "bg-gray-500"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors">
          <div className="text-2xl text-black dark:text-white">Loading raid...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!raid) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors">
          <div className="text-center">
            <div className="text-2xl mb-4 text-black dark:text-white">Raid not found</div>
            <Link href="/raids" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline">
              Back to Raids
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
          {/* Back Button */}
          <Link href="/raids" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6">
            <span className="mr-2">←</span> Back to Raids
          </Link>

          {/* Raid Header */}
          <div className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">{raid.boss_name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{raid.boss_description}</p>
              </div>
              <div className="flex gap-3 items-center">
                <span className={`text-lg font-semibold ${getDifficultyColor(raid.difficulty)}`}>
                  {raid.difficulty?.toUpperCase()}
                </span>
                {getStatusBadge(raid.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-black dark:text-white">
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Mode</span>
                <p className="font-semibold text-lg capitalize">{raid.mode}</p>
              </div>
              {raid.team_name && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Team</span>
                  <p className="font-semibold text-lg">{raid.team_name}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Started</span>
                <p className="font-semibold text-lg">
                  {new Date(raid.started_at).toLocaleString()}
                </p>
              </div>
              {raid.completed_at && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Completed</span>
                  <p className="font-semibold text-lg">
                    {new Date(raid.completed_at).toLocaleString()}
                  </p>
                </div>
              )}
              {raid.total_score > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Score</span>
                  <p className="font-semibold text-lg">{raid.total_score}</p>
                </div>
              )}
              {raid.time_taken_minutes && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Time Taken</span>
                  <p className="font-semibold text-lg">{raid.time_taken_minutes} min</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {raid.status === "active" && raid.user_id === user?.id && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCompleteModal(true)}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  Complete Raid
                </button>
                <button
                  onClick={handleAbandonRaid}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Abandon Raid
                </button>
              </div>
            )}

            {raid.notes && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-2 text-black dark:text-white">Notes:</h3>
                <p className="text-gray-700 dark:text-gray-300">{raid.notes}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {raid.instructions && (
            <div className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Instructions</h2>
              <ol className="space-y-3">
                {Array.isArray(raid.instructions) ? (
                  raid.instructions.map((step: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-bold text-black dark:text-white">{index + 1}.</span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 dark:text-gray-300">{raid.instructions}</li>
                )}
              </ol>
            </div>
          )}

          {/* Required Ingredients */}
          {raid.required_ingredients && (
            <div className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Required Ingredients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.isArray(raid.required_ingredients) ? (
                  raid.required_ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-800">
                      <span className="text-gray-700 dark:text-gray-300">
                        {ingredient.name || ingredient.ingredient_name || `Ingredient ${index + 1}`}
                      </span>
                      <span className="font-semibold text-black dark:text-white">
                        {ingredient.quantity || 1}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No ingredients listed</p>
                )}
              </div>
            </div>
          )}

          {/* Participants */}
          {participants.length > 0 && (
            <div className="bg-white dark:bg-black rounded-lg p-6 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Participants</h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {participant.avatar_url ? (
                        <img
                          src={participant.avatar_url}
                          alt={participant.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center font-bold text-white dark:text-black">
                          {participant.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-black dark:text-white">{participant.display_name || participant.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{participant.username}</p>
                      </div>
                    </div>
                    {participant.individual_score > 0 && (
                      <span className="font-semibold text-black dark:text-white">
                        {participant.individual_score} pts
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Complete Raid Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Complete Raid</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Score <span className="text-gray-600 dark:text-gray-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={completeForm.score}
                    onChange={(e) => setCompleteForm({ ...completeForm, score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                    placeholder="Enter your score"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Time Taken (minutes) <span className="text-gray-600 dark:text-gray-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={completeForm.timeTakenMinutes}
                    onChange={(e) => setCompleteForm({ ...completeForm, timeTakenMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                    placeholder="How long did it take?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">Notes (optional)</label>
                  <textarea
                    value={completeForm.notes}
                    onChange={(e) => setCompleteForm({ ...completeForm, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                    placeholder="Any notes about your raid?"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCompleteRaid}
                    disabled={completing}
                    className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    {completing ? "Completing..." : "Complete"}
                  </button>
                  <button
                    onClick={() => setShowCompleteModal(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
