'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ImageGenPanel from '@/components/ImageGenPanel';
import ImageGallery from '@/components/ImageGallery';
import RealmPostcardGenerator from '@/components/RealmPostcardGenerator';

interface Realm {
  id: string;
  name: string;
  realm_type: string;
  description: string;
  access_requirements: string;
  inhabitants: string;
  geography: string;
  dangers: string;
  cultural_significance: string;
  visibility: string;
  created_at: string;
  mythology_id: string;
}

interface Mythology {
  id: string;
  name: string;
}

export default function RealmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const realmId = params.realmId as string;
  const mythologyId = params.id as string;

  const [realm, setRealm] = useState<Realm | null>(null);
  const [mythology, setMythology] = useState<Mythology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  const handleImageGenerated = () => {
    setGalleryKey(prev => prev + 1);
  };

  console.log('🏰 Realm Detail - ID:', realmId, 'Mythology:', mythologyId);

  useEffect(() => {
    async function loadRealm() {
      console.log('📥 Loading realm...');
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }
        console.log('👤 Current user:', user.id);

        // Fetch realm
        console.log('🔍 Fetching realm:', realmId);
        const { data: realmData, error: realmError } = await supabase
          .from('realms')
          .select('*')
          .eq('id', realmId)
          .single();

        if (realmError) {
          console.error('❌ Realm error:', realmError);
          throw new Error('Realm not found');
        }

        console.log('✅ Realm loaded:', realmData.name);
        setRealm(realmData);

        // Fetch mythology
        console.log('🔍 Fetching mythology:', mythologyId);
        const { data: mythData, error: mythError } = await supabase
          .from('mythologies')
          .select('id, name')
          .eq('id', mythologyId)
          .single();

        if (!mythError && mythData) {
          console.log('✅ Mythology loaded:', mythData.name);
          setMythology(mythData);
        }

        setLoading(false);
        console.log('✅ Realm load complete');
      } catch (err: unknown) {
        console.error('💥 Error loading realm:', err);
        setError(err instanceof Error ? err.message : 'Failed to load realm');
        setLoading(false);
      }
    }

    if (realmId && mythologyId) {
      loadRealm();
    }
  }, [realmId, mythologyId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading realm...</div>
      </div>
    );
  }

  if (error || !realm) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-900 via-cyan-900 to-blue-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">⚠️ Error Loading Realm</h1>
            <p className="text-lg mb-6">{error || 'Realm not found'}</p>
            <button
              onClick={() => router.push(`/student/mythology/${mythologyId}`)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              ← Back to Mythology
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRealmTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      divine_realm: '⛅',
      underworld: '💀',
      mortal_world: '🌍',
      elemental_plane: '🔥',
      spirit_world: '👻',
      celestial: '✨',
      aquatic: '🌊',
      forest: '🌲',
      mountain: '🏔️',
      desert: '🏜️',
      island: '🏝️',
      city: '🏛️',
      other: '🗺️',
    };
    return emojis[type] || '🗺️';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-900 via-cyan-900 to-blue-900 p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-white/70 mb-4">
          <Link href="/student/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <span>→</span>
          <Link href={`/student/mythology/${mythologyId}`} className="hover:text-white transition-colors">
            {mythology?.name || 'Mythology'}
          </Link>
          <span>→</span>
          <span className="text-white">{realm.name}</span>
        </div>
      </div>

      {/* Main Layout: Two columns on large screens */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column: Realm Details (70%) */}
        <div className="flex-1 lg:w-[70%] space-y-6">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {getRealmTypeEmoji(realm.realm_type)} {realm.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm capitalize">
                  {realm.realm_type.replace('_', ' ')}
                </span>
                {realm.visibility === 'public' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    👁️ Public
                  </span>
                )}
                {realm.visibility === 'teacher_only' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    🔒 Teacher Only
                  </span>
                )}
                {realm.visibility === 'hidden' && (
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                    ✏️ Hidden
                  </span>
                )}
              </div>
            </div>

            <p className="text-white/90 text-lg leading-relaxed">{realm.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {realm.geography && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">🗺️ Geography</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{realm.geography}</p>
              </div>
            )}

            {realm.inhabitants && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">👥 Inhabitants</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{realm.inhabitants}</p>
              </div>
            )}

            {realm.access_requirements && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">🔐 Access Requirements</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{realm.access_requirements}</p>
              </div>
            )}

            {realm.dangers && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">⚠️ Dangers</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{realm.dangers}</p>
              </div>
            )}

            {realm.cultural_significance && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-3">🎭 Cultural Significance</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{realm.cultural_significance}</p>
              </div>
            )}
          </div>

          {/* Generated Images Gallery */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🖼️ Generated Images</h3>
            <ImageGallery
              key={galleryKey}
              entityType="realm"
              entityId={realm.id}
              maxImages={12}
            />
          </div>

          {/* Creative Exports Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">✨ Creative Exports</h2>
            
            {/* Realm Postcard Generator */}
            <RealmPostcardGenerator
              realmName={realm.name}
              realmDescription={realm.description}
              realmType={realm.realm_type}
              mythologyName={mythology?.name || 'Mythology'}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href={`/student/mythology/${mythologyId}`}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              ← Back to Mythology
            </Link>
            <button
              onClick={() => console.log('🚧 Edit realm - Coming soon!')}
              className="px-6 py-3 bg-teal-500/20 text-teal-300 rounded-xl hover:bg-teal-500/30 transition-all"
            >
              ✏️ Edit Realm
            </button>
          </div>
        </div>

        {/* Right Column: Image Generation Panel (30%) */}
        <div className="lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px]">
          <div className="lg:sticky lg:top-4 space-y-4">
            <ImageGenPanel
              entityType="realm"
              entityId={realm.id}
              entityName={realm.name}
              entityDescription={`${realm.description || ''} ${realm.geography || ''}`}
              mythologyName={mythology?.name}
              onImageGenerated={handleImageGenerated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
