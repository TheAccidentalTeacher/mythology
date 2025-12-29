'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import CollectionGallery from '@/components/CollectionGallery';

export default function CollectionPage() {
  const params = useParams();
  const mythologyId = params.id as string;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-white/60 text-sm mb-6 flex items-center gap-2">
          <Link href="/student/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <span>→</span>
          <Link href={`/student/mythology/${mythologyId}`} className="hover:text-white transition-colors">
            Mythology
          </Link>
          <span>→</span>
          <span className="text-white">Collection</span>
        </div>

        {/* Page Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎴 My Collection</h1>
          <p className="text-white/70">
            View all your collected trading cards, stat cards, and other collectibles from this mythology.
          </p>
        </div>

        {/* Collection Gallery */}
        <CollectionGallery mythologyId={mythologyId} />

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href={`/student/mythology/${mythologyId}`}
            className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
          >
            ← Back to Mythology
          </Link>
        </div>
      </div>
    </div>
  );
}
