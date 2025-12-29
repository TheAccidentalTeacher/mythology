'use client';

import TeacherImageSettings from '@/components/TeacherImageSettings';
import Link from 'next/link';

export default function ImageSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/teacher/images"
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Moderation
            </Link>
            <span className="text-white/30">|</span>
            <h1 className="text-white font-semibold">Image Generation Settings</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-8">
        <TeacherImageSettings />
      </main>
    </div>
  );
}
