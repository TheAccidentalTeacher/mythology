'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight">
              The Mythology
            </h1>
            <h1 className="text-7xl md:text-8xl font-bold bg-linear-to-r from-yellow-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              Codex
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto">
            Create Your Own Mythology Universe
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Build worlds, craft legendary characters, write epic stories, and bring your mythology to life with AI-powered tools
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => router.push('/signup')}
              className="px-12 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              Enter the Codex →
            </button>
          </div>

          {/* Login Link */}
          <div className="pt-4">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Already have an account? <span className="text-purple-400 font-semibold">Sign in</span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold text-white mb-2">Build Worlds</h3>
            <p className="text-gray-300">
              Create unique mythologies with gods, heroes, and legendary creatures
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-300">
              Generate images, get writing help, and bring your ideas to life
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">Gamified Learning</h3>
            <p className="text-gray-300">
              Earn badges, level up, and compete on leaderboards
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm">
        <p>Built for 6th-8th grade students • COPPA/FERPA Compliant</p>
      </div>
    </div>
  );
}
