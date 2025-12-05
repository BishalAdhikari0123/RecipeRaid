"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent"
          >
            Recipe Raid
          </Link>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 hover:text-purple-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent"
        >
          Recipe Raid
        </Link>

        <nav className="flex gap-6 items-center">
          <Link
            href="/dashboard"
            className="hover:text-purple-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link href="/raids" className="hover:text-purple-400 transition-colors">
            Raids
          </Link>
          <Link href="/teams" className="hover:text-purple-400 transition-colors">
            Teams
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-purple-400 transition-colors"
          >
            Leaderboard
          </Link>
          <Link href="/pantry" className="hover:text-purple-400 transition-colors">
            Pantry
          </Link>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
            <div className="text-right">
              <div className="font-semibold">{user.displayName || user.username}</div>
              {user.isPremium && (
                <div className="text-xs text-purple-400">⭐ Premium</div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
