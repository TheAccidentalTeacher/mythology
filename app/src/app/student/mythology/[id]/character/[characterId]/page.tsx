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
import StandardsBadge from '@/components/StandardsBadge';

interface Character {
  id: string;
  name: string;
  character_type: string;
  archetype: string;
  domain: string;
  description: string;
  origin_story: string;
  personality: string;
  geography_connection: string;
  powers_abilities: string;
  weaknesses: string;
  appearance_description: string;
  visibility: string;
  created_at: string;
  mythology_id: string;
}

interface Mythology {
  id: string;
  name: string;
}

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  const mythologyId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [mythology, setMythology] = useState<Mythology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  console.log('🎭 Character Detail - ID:', characterId, 'Mythology:', mythologyId);

  useEffect(() => {
    async function loadCharacter() {
      console.log('📥 Loading character...');
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user:', user?.id);
        if (userError) throw userError;

        // Load character
        console.log('🔍 Fetching character:', characterId);
        const { data: charData, error: charError } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .single();

        if (charError) {
          console.error('❌ Character error:', charError);
          throw new Error(`Failed to load character: ${charError.message}`);
        }

        console.log('✅ Character loaded:', charData?.name);
        setCharacter(charData);

        // Load mythology
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
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setLoading(false);
        console.log('✅ Character load complete');
      }
    }

    if (characterId && mythologyId) {
      loadCharacter();
    }
  }, [characterId, mythologyId]);

  const handleImageGenerated = () => {
    // Refresh the gallery when a new image is generated
    setGalleryKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading character...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">⚠️ Error Loading Character</h1>
            <p className="text-lg mb-6">{error || 'Character not found'}</p>
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

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 lg:p-8">
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
          <span className="text-white">{character.name}</span>
        </div>
      </div>

      {/* Main Layout: Two columns on large screens */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column: Character Details (70%) */}
        <div className="flex-1 lg:w-[70%] space-y-6">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">🎭 {character.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm capitalize">
                  {character.character_type.replace('_', ' ')}
                </span>
                {character.archetype && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm capitalize">
                    {character.archetype}
                  </span>
                )}
                {character.visibility === 'public' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    👁️ Public
                  </span>
                )}
                {character.visibility === 'teacher_only' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    🔒 Teacher Only
                  </span>
                )}
                {character.visibility === 'hidden' && (
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                    ✏️ Hidden
                  </span>
                )}
              </div>
            </div>

            {character.domain && (
              <div className="mb-4">
                <span className="text-white/60">Domain: </span>
                <span className="text-white font-medium">{character.domain}</span>
              </div>
            )}

            <p className="text-white/90 text-lg leading-relaxed">{character.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {character.origin_story && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">📖 Origin Story</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.origin_story}</p>
              </div>
            )}

            {character.personality && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">💭 Personality</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.personality}</p>
              </div>
            )}

            {character.powers_abilities && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">⚡ Powers & Abilities</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.powers_abilities}</p>
              </div>
            )}

            {character.weaknesses && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">💔 Weaknesses</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.weaknesses}</p>
              </div>
            )}

            {character.appearance_description && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">👤 Appearance</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.appearance_description}</p>
              </div>
            )}

            {character.geography_connection && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">🗺️ Geography Connection</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{character.geography_connection}</p>
              </div>
            )}
          </div>

          {/* Generated Images Gallery */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white mb-4">🖼️ Generated Images</h3>
            <ImageGallery
              key={galleryKey}
              entityType="character"
              entityId={character.id}
              maxImages={12}
            />
          </div>

          {/* Collectibles Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">🎴 Collectibles</h2>
            
            {/* Trading Card Generator */}
            <TradingCardGenerator
              entityName={character.name}
              entityDescription={`${character.description || ''} ${character.appearance_description || ''}`}
              entityType="character"
              mythologyName={mythology?.name || 'Mythology'}
            />

            {/* Wanted Poster Generator */}
            <WantedPosterGenerator
              entityName={character.name}
              entityDescription={`${character.description || ''} ${character.appearance_description || ''}`}
              entityType="character"
              mythologyName={mythology?.name || 'Mythology'}
            />
          </div>

          {/* Creative Exports Section */}
          {character.geography_connection && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">✨ Creative Exports</h2>
              
              {/* Realm Postcard - from their homeland */}
              <RealmPostcardGenerator
                realmName={`${character.name}'s Domain`}
                realmDescription={character.geography_connection}
                realmType="divine_realm"
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
              onClick={() => console.log('🚧 Edit character - Coming soon!')}
              className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all"
            >
              ✏️ Edit Character
            </button>
          </div>
        </div>

        {/* Right Column: Image Generation Panel (30%) */}
        <div className="lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px]">
          <div className="lg:sticky lg:top-4 space-y-4">
            <ImageGenPanel
              entityType="character"
              entityId={character.id}
              entityName={character.name}
              entityDescription={`${character.description || ''} ${character.appearance_description || ''}`}
              mythologyName={mythology?.name}
              onImageGenerated={handleImageGenerated}
            />
            
            {/* Character Stat Card */}
            <CharacterStatCard
              entityName={character.name}
              entityDescription={character.description || ''}
              entityType="character"
              mythologyName={mythology?.name || 'Mythology'}
              characterType={character.character_type}
              domain={character.domain}
              abilities={character.powers_abilities}
            />
          </div>
        </div>
      </div>

      {/* Floating Standards Badge */}
      <StandardsBadge 
        activityType="character-creation" 
        activityName="Character Details"
        position="bottom-right"
      />
    </div>
  );
}
