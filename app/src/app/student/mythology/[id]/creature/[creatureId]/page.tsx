'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ImageGenPanel from '@/components/ImageGenPanel';
import ImageGallery from '@/components/ImageGallery';
import WantedPosterGenerator from '@/components/WantedPosterGenerator';
import TradingCardGenerator from '@/components/TradingCardGenerator';
import CharacterStatCard from '@/components/CharacterStatCard';
import RealmPostcardGenerator from '@/components/RealmPostcardGenerator';

interface Creature {
  id: string;
  name: string;
  creature_type: string;
  alignment: string;
  intelligence_level: string;
  size_category: string;
  danger_level: string;
  description: string;
  habitat: string;
  abilities: string;
  cultural_significance: string;
  origin_story: string;
  weaknesses: string;
  is_unique: boolean;
  visibility: string;
  created_at: string;
  mythology_id: string;
}

interface Mythology {
  id: string;
  name: string;
}

export default function CreatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const creatureId = params.creatureId as string;
  const mythologyId = params.id as string;

  const [creature, setCreature] = useState<Creature | null>(null);
  const [mythology, setMythology] = useState<Mythology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  // Callback when new image is generated - refresh gallery
  const handleImageGenerated = () => {
    setGalleryKey(prev => prev + 1);
  };

  console.log('🐉 Creature Detail - ID:', creatureId, 'Mythology:', mythologyId);

  useEffect(() => {
    async function loadCreature() {
      console.log('📥 Loading creature...');
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user:', user?.id);
        if (userError) throw userError;

        console.log('🔍 Fetching creature:', creatureId);
        const { data: creatureData, error: creatureError } = await supabase
          .from('creatures')
          .select('*')
          .eq('id', creatureId)
          .single();

        if (creatureError) {
          console.error('❌ Creature error:', creatureError);
          throw new Error(`Failed to load creature: ${creatureError.message}`);
        }

        console.log('✅ Creature loaded:', creatureData?.name);
        setCreature(creatureData);

        console.log('🔍 Fetching mythology:', mythologyId);
        const { data: mythData, error: mythError } = await supabase
          .from('mythologies')
          .select('id, name')
          .eq('id', mythologyId)
          .single();

        if (mythError) {
          console.error('❌ Mythology error:', mythError);
        } else {
          console.log('✅ Mythology loaded:', mythData?.name);
          setMythology(mythData);
        }

      } catch (err: unknown) {
        console.error('💥 Fatal error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load creature');
      } finally {
        setLoading(false);
        console.log('✅ Creature load complete');
      }
    }

    if (creatureId && mythologyId) {
      loadCreature();
    }
  }, [creatureId, mythologyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-900 via-teal-900 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading creature...</div>
      </div>
    );
  }

  if (error || !creature) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-900 via-teal-900 to-emerald-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">⚠️ Error Loading Creature</h1>
            <p className="text-lg mb-6">{error || 'Creature not found'}</p>
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

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'harmless': return 'text-green-300 bg-green-500/20';
      case 'minor_threat': return 'text-yellow-300 bg-yellow-500/20';
      case 'dangerous': return 'text-orange-300 bg-orange-500/20';
      case 'deadly': return 'text-red-300 bg-red-500/20';
      case 'catastrophic': return 'text-purple-300 bg-purple-500/20';
      default: return 'text-gray-300 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-900 via-teal-900 to-emerald-900 p-4 lg:p-8">
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
          <span className="text-white">{creature.name}</span>
        </div>
      </div>

      {/* Main Layout: Two columns on large screens */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column: Creature Details (70%) */}
        <div className="flex-1 lg:w-[70%] space-y-6">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">🐉 {creature.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm capitalize">
                  {creature.creature_type.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getDangerColor(creature.danger_level)}`}>
                  {creature.danger_level.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm capitalize">
                  {creature.size_category}
                </span>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm capitalize">
                  {creature.alignment}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm capitalize">
                  {creature.intelligence_level.replace('_', ' ')}
                </span>
                {creature.is_unique && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    ⭐ Unique Entity
                  </span>
                )}
                {creature.visibility === 'public' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    👁️ Public
                  </span>
                )}
                {creature.visibility === 'teacher_only' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    🔒 Teacher Only
                  </span>
                )}
                {creature.visibility === 'hidden' && (
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                    ✏️ Hidden
                  </span>
                )}
              </div>
            </div>

            <p className="text-white/90 text-lg leading-relaxed">{creature.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {creature.habitat && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">🏞️ Habitat</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{creature.habitat}</p>
              </div>
            )}

            {creature.abilities && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">⚡ Abilities & Powers</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{creature.abilities}</p>
              </div>
            )}

            {creature.origin_story && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-3">📖 Origin Story</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{creature.origin_story}</p>
              </div>
            )}

            {creature.cultural_significance && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">🎭 Cultural Significance</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{creature.cultural_significance}</p>
              </div>
            )}

            {creature.weaknesses && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">💔 Weaknesses</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{creature.weaknesses}</p>
              </div>
            )}
          </div>

          {/* Generated Images Gallery */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🖼️ Generated Images</h3>
            <ImageGallery
              key={galleryKey}
              entityType="creature"
              entityId={creature.id}
              maxImages={12}
            />
          </div>

          {/* Collectibles Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">🎴 Collectibles</h2>
            
            {/* Trading Card Generator */}
            <TradingCardGenerator
              entityName={creature.name}
              entityDescription={`${creature.description || ''} ${creature.abilities || ''}`}
              entityType="creature"
              mythologyName={mythology?.name || 'Mythology'}
            />

            {/* Wanted Poster Generator */}
            <WantedPosterGenerator
              entityName={creature.name}
              entityDescription={`${creature.description || ''} ${creature.abilities || ''}`}
              entityType="creature"
              mythologyName={mythology?.name || 'Mythology'}
            />
          </div>

          {/* Creative Exports Section */}
          {creature.habitat && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">✨ Creative Exports</h2>
              
              {/* Realm Postcard - from their habitat */}
              <RealmPostcardGenerator
                realmName={`${creature.name}'s Habitat`}
                realmDescription={creature.habitat}
                realmType="mortal_world"
                mythologyName={mythology?.name || 'Mythology'}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href={`/student/mythology/${mythologyId}`}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              ← Back to Mythology
            </Link>
            <button
              onClick={() => console.log('🚧 Edit creature - Coming soon!')}
              className="px-6 py-3 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-all"
            >
              ✏️ Edit Creature
            </button>
          </div>
        </div>

        {/* Right Column: Image Generation Panel (30%) */}
        <div className="lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px]">
          <div className="lg:sticky lg:top-4 space-y-4">
            <ImageGenPanel
              entityType="creature"
              entityId={creature.id}
              entityName={creature.name}
              entityDescription={`${creature.description || ''} ${creature.habitat || ''}`}
              mythologyName={mythology?.name}
              onImageGenerated={handleImageGenerated}
            />
            
            {/* Creature Stat Card */}
            <CharacterStatCard
              entityName={creature.name}
              entityDescription={creature.description || ''}
              entityType="creature"
              mythologyName={mythology?.name || 'Mythology'}
              creatureType={creature.creature_type}
              abilities={creature.abilities}
              dangerLevel={creature.danger_level}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
