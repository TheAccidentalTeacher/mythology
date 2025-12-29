'use client';

import TeacherImageModeration from '@/components/TeacherImageModeration';
import Link from 'next/link';

export default function ModerationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/teacher/dashboard"
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Dashboard
            </Link>
            <span className="text-white/30">|</span>
            <h1 className="text-white font-semibold">Image Moderation</h1>
          </div>
          <Link
            href="/teacher/images/settings"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
          >
            ⚙️ Settings
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="py-8">
        <TeacherImageModeration />
      </main>
    </div>
  );
}
