'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Mythology {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  genre: string;
  geography_type: string;
  setting_description: string;
  cultural_inspiration: string;
  visibility: string;
  created_at: string;
}

interface Character {
  id: string;
  name: string;
  character_type: string;
  archetype: string;
  domain: string;
  description: string;
}

interface Creature {
  id: string;
  name: string;
  creature_type: string;
  danger_level: string;
  size_category: string;
  description: string;
}

interface Story {
  id: string;
  title: string;
  story_type: string;
  excerpt: string;
  word_count: number;
  is_complete: boolean;
}

interface MapLocation {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

interface Map {
  id: string;
  title: string;
  map_type: string;
  description: string;
  locations: MapLocation[];
}

interface Realm {
  id: string;
  name: string;
  realm_type: string;
  description: string;
  access_requirements: string;
  inhabitants: string;
  geography: string;
}

export default function MythologyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;
  
  const [mythology, setMythology] = useState<Mythology | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🏛️ Mythology Detail Page - ID:', mythologyId);

  useEffect(() => {
    async function loadMythology() {
      console.log('📥 Starting mythology load...');
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user:', user?.id);
        if (userError) {
          console.error('❌ User error:', userError);
          throw userError;
        }

        // Load mythology
        console.log('🔍 Fetching mythology:', mythologyId);
        const { data: mythData, error: mythError } = await supabase
          .from('mythologies')
          .select('*')
          .eq('id', mythologyId)
          .single();

        if (mythError) {
          console.error('❌ Mythology error:', mythError);
          throw new Error(`Failed to load mythology: ${mythError.message}`);
        }

        console.log('✅ Mythology loaded:', mythData?.name);
        setMythology(mythData);

        // Load characters
        console.log('🔍 Fetching characters for mythology:', mythologyId);
        const { data: charData, error: charError } = await supabase
          .from('characters')
          .select('*')
          .eq('mythology_id', mythologyId)
          .order('created_at', { ascending: false });

        if (charError) {
          console.error('❌ Characters error:', charError);
        } else {
          console.log(`✅ Loaded ${charData?.length || 0} characters`);
          setCharacters(charData || []);
        }

        // Load creatures
        console.log('🔍 Fetching creatures for mythology:', mythologyId);
        const { data: creatureData, error: creatureError } = await supabase
          .from('creatures')
          .select('*')
          .eq('mythology_id', mythologyId)
          .order('created_at', { ascending: false });

        if (creatureError) {
          console.error('❌ Creatures error:', creatureError);
        } else {
          console.log(`✅ Loaded ${creatureData?.length || 0} creatures`);
          setCreatures(creatureData || []);
        }

        // Load stories
        console.log('🔍 Fetching stories for mythology:', mythologyId);
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('mythology_id', mythologyId)
          .order('created_at', { ascending: false });

        if (storyError) {
          console.error('❌ Stories error:', storyError);
        } else {
          console.log(`✅ Loaded ${storyData?.length || 0} stories`);
          setStories(storyData || []);
        }

        // Load maps
        console.log('🔍 Fetching maps for mythology:', mythologyId);
        const { data: mapData, error: mapError } = await supabase
          .from('maps')
          .select('*')
          .eq('mythology_id', mythologyId)
          .order('created_at', { ascending: false });

        if (mapError) {
          console.error('❌ Maps error:', mapError);
        } else {
          console.log(`✅ Loaded ${mapData?.length || 0} maps`);
          setMaps(mapData || []);
        }

        // Load realms
        console.log('🔍 Fetching realms for mythology:', mythologyId);
        const { data: realmData, error: realmError } = await supabase
          .from('realms')
          .select('*')
          .eq('mythology_id', mythologyId)
          .order('created_at', { ascending: false });

        if (realmError) {
          console.error('❌ Realms error:', realmError);
        } else {
          console.log(`✅ Loaded ${realmData?.length || 0} realms`);
          setRealms(realmData || []);
        }

      } catch (err: unknown) {
        console.error('💥 Fatal error loading mythology:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mythology');
      } finally {
        setLoading(false);
        console.log('✅ Mythology load complete');
      }
    }

    if (mythologyId) {
      loadMythology();
    } else {
      console.error('❌ No mythology ID provided');
    }
  }, [mythologyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading mythology...</div>
      </div>
    );
  }

  if (error || !mythology) {
    console.error('❌ Rendering error state:', error);
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">⚠️ Error Loading Mythology</h1>
            <p className="text-lg mb-6">{error || 'Mythology not found'}</p>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering mythology:', mythology.name);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/student/dashboard"
            className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-white">{mythology.name}</h1>
              <div className="flex gap-2">
                {mythology.visibility === 'public' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    👁️ Public
                  </span>
                )}
                {mythology.visibility === 'teacher_only' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    🔒 Teacher Only
                  </span>
                )}
                {mythology.visibility === 'hidden' && (
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                    ✏️ Hidden
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Timeframe</div>
                <div className="text-white font-medium capitalize">{mythology.timeframe}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Genre</div>
                <div className="text-white font-medium capitalize">{mythology.genre}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Geography</div>
                <div className="text-white font-medium capitalize">{mythology.geography_type}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Created</div>
                <div className="text-white font-medium">
                  {new Date(mythology.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-white/80">{mythology.description}</p>
              </div>

              {mythology.setting_description && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Setting</h3>
                  <p className="text-white/80">{mythology.setting_description}</p>
                </div>
              )}

              {mythology.cultural_inspiration && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Cultural Inspiration</h3>
                  <p className="text-white/80">{mythology.cultural_inspiration}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            href={`/student/mythology/${mythologyId}/relationships`}
            className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl p-4 text-center text-white transition-all hover:scale-105"
          >
            <span className="text-3xl block mb-2">🔗</span>
            <span className="font-medium">Relationships</span>
          </Link>
          <Link
            href={`/student/mythology/${mythologyId}/battle`}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl p-4 text-center text-white transition-all hover:scale-105"
          >
            <span className="text-3xl block mb-2">⚔️</span>
            <span className="font-medium">Battle Arena</span>
          </Link>
          <Link
            href={`/student/mythology/${mythologyId}/crossover`}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl p-4 text-center text-white transition-all hover:scale-105"
          >
            <span className="text-3xl block mb-2">🌐</span>
            <span className="font-medium">Crossover Hub</span>
          </Link>
          <Link
            href={`/student/mythology/${mythologyId}/collection`}
            className="bg-linear-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-xl p-4 text-center text-white transition-all hover:scale-105"
          >
            <span className="text-3xl block mb-2">🎴</span>
            <span className="font-medium">Collection</span>
          </Link>
          <Link
            href={`/student/mythology/${mythologyId}/map/create`}
            className="bg-linear-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-xl p-4 text-center text-white transition-all hover:scale-105"
          >
            <span className="text-3xl block mb-2">🗺️</span>
            <span className="font-medium">Create Map</span>
          </Link>
        </div>

        {/* Characters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Characters ({characters.length})</h2>
            <Link
              href={`/student/mythology/${mythologyId}/character/create`}
              className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              + Add Character
            </Link>
          </div>

          {characters.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60 text-lg mb-4">No characters yet</p>
              <p className="text-white/40">Add gods, heroes, and legendary figures to your mythology</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {characters.map((character) => (
                <Link
                  key={character.id}
                  href={`/student/mythology/${mythologyId}/character/${character.id}`}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs capitalize">
                      {character.character_type}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                      {character.archetype}
                    </span>
                  </div>
                  {character.domain && (
                    <p className="text-white/60 text-sm mb-2">🎯 {character.domain}</p>
                  )}
                  <p className="text-white/80 line-clamp-2">{character.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Creatures Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Creatures ({creatures.length})</h2>
            <Link
              href={`/student/mythology/${mythologyId}/creature/create`}
              className="px-4 py-2 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              + Add Creature
            </Link>
          </div>

          {creatures.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60 text-lg mb-4">No creatures yet</p>
              <p className="text-white/40">Add monsters, beasts, and magical beings to your mythology</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {creatures.map((creature) => (
                <Link
                  key={creature.id}
                  href={`/student/mythology/${mythologyId}/creature/${creature.id}`}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{creature.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs capitalize">
                      {creature.creature_type}
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs capitalize">
                      {creature.danger_level}
                    </span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs capitalize">
                      {creature.size_category}
                    </span>
                  </div>
                  <p className="text-white/80 line-clamp-2">{creature.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Stories ({stories.length})</h2>
            <Link
              href={`/student/mythology/${mythologyId}/story/create`}
              className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              + Write Story
            </Link>
          </div>

          {stories.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60 text-lg mb-4">No stories yet</p>
              <p className="text-white/40">Write narratives, legends, and tales about your mythology</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/student/mythology/${mythologyId}/story/${story.id}`}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white flex-1">{story.title}</h3>
                    {story.is_complete && (
                      <span className="text-green-400 text-sm">✅</span>
                    )}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs capitalize">
                      {story.story_type}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {story.word_count.toLocaleString()} words
                    </span>
                  </div>
                  <p className="text-white/80 line-clamp-3">{story.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Relationships Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Character Relationships</h2>
            <Link
              href={`/student/mythology/${mythologyId}/relationships`}
              className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              🔗 View Relationship Graph
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white/60 text-lg mb-2">Visualize character connections</p>
            <p className="text-white/40">Create relationships between characters and see them in an interactive graph</p>
          </div>
        </div>

        {/* Battle Arena Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">⚔️ Battle Arena</h2>
            <Link
              href={`/student/mythology/${mythologyId}/battle`}
              className="px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              ⚔️ Enter Arena
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white/60 text-lg mb-2">Simulate epic battles with AI narration</p>
            <p className="text-white/40">Pit your characters and creatures against each other in combat powered by GPT-4</p>
          </div>
        </div>

        {/* Maps Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">World Maps ({maps.length})</h2>
            <Link
              href={`/student/mythology/${mythologyId}/map/create`}
              className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              + Create Map
            </Link>
          </div>

          {maps.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60 text-lg mb-4">No maps yet</p>
              <p className="text-white/40">Design the geography and world of your mythology</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {maps.map((map) => (
                <Link
                  key={map.id}
                  href={`/student/mythology/${mythologyId}/map/${map.id}`}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{map.title}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs capitalize">
                      {map.map_type}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {map.locations?.length || 0} locations
                    </span>
                  </div>
                  {map.description && (
                    <p className="text-white/80 line-clamp-2">{map.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Realms Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Realms & Locations ({realms.length})</h2>
          </div>

          {realms.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60 text-lg mb-4">No realms yet</p>
              <p className="text-white/40">Add sacred places, kingdoms, and mystical locations to your mythology</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {realms.map((realm) => (
                <Link
                  key={realm.id}
                  href={`/student/mythology/${mythologyId}/realm/${realm.id}`}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{realm.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs capitalize">
                      {realm.realm_type}
                    </span>
                  </div>
                  <p className="text-white/80 mb-3 line-clamp-2">{realm.description}</p>
                  {realm.inhabitants && (
                    <p className="text-white/60 text-sm mb-2">👥 {realm.inhabitants}</p>
                  )}
                  {realm.access_requirements && (
                    <p className="text-amber-300/80 text-sm">🔒 {realm.access_requirements}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
