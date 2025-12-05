import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-red-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            Recipe Raid Co-op
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Gamify cooking as co-op raids. Assemble teams, battle recipe bosses, and conquer the kitchen!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Raiding
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="raid-card">
            <div className="text-4xl mb-4">🍳</div>
            <h3 className="text-2xl font-bold mb-2">Epic Recipe Bosses</h3>
            <p className="text-gray-300">
              Battle escalating recipe challenges with your team. From easy appetizers to legendary main courses!
            </p>
          </div>

          <div className="raid-card">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-2">Team Up & Conquer</h3>
            <p className="text-gray-300">
              Form clans, coordinate ingredients, and use multiplayer voice chat to dominate the kitchen.
            </p>
          </div>

          <div className="raid-card">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2">Leaderboards & Proof</h3>
            <p className="text-gray-300">
              Upload photo proof of your conquests and climb the global leaderboards!
            </p>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Go Premium</h2>
          <p className="text-gray-300 mb-6">
            Unlock premium ingredients, clan halls, and exclusive power-ups!
          </p>
          <div className="text-4xl font-bold text-purple-400 mb-4">$6/month</div>
          <Link
            href="/premium"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}
