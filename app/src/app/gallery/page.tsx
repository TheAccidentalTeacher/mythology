'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Mythology {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  genre: string;
  geography_type: string;
  visibility: string;
  created_at: string;
  created_by: string;
  profiles: {
    display_name: string;
  }[] | { display_name: string };
}

export default function GalleryPage() {
  const [mythologies, setMythologies] = useState<Mythology[]>([]);
  const [filteredMythologies, setFilteredMythologies] = useState<Mythology[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    timeframe: 'all',
    genre: 'all',
    geography: 'all',
  });

  console.log('🏛️ Gallery Page - Loading public mythologies');

  useEffect(() => {
    fetchMythologies();
  }, []);

  const applyFilters = useCallback(() => {
    console.log('🔍 Applying filters:', filters);
    
    let filtered = [...mythologies];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Timeframe filter
    if (filters.timeframe !== 'all') {
      filtered = filtered.filter(m => m.timeframe === filters.timeframe);
    }

    // Genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter(m => m.genre === filters.genre);
    }

    // Geography filter
    if (filters.geography !== 'all') {
      filtered = filtered.filter(m => m.geography_type === filters.geography);
    }

    console.log(`✅ Filtered to ${filtered.length} mythologies`);
    setFilteredMythologies(filtered);
  }, [filters, mythologies]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchMythologies = async () => {
    console.log('📥 Fetching public mythologies...');
    setLoading(true);

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('mythologies')
        .select(`
          id,
          name,
          description,
          timeframe,
          genre,
          geography_type,
          visibility,
          created_at,
          created_by,
          profiles!mythologies_created_by_fkey (
            display_name
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Gallery error:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} public mythologies`);
      setMythologies(data || []);
      setFilteredMythologies(data || []);
    } catch (err: unknown) {
      console.error('💥 Fatal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">🏛️ Mythology Gallery</h1>
            <Link
              href="/student/dashboard"
              className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🔍 Filters</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-white/80 text-sm mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search mythologies..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Timeframe</label>
              <select
                value={filters.timeframe}
                onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="all">All Timeframes</option>
                <option value="ancient">Ancient</option>
                <option value="medieval">Medieval</option>
                <option value="renaissance">Renaissance</option>
                <option value="modern">Modern</option>
                <option value="future">Future</option>
                <option value="post_apocalyptic">Post-Apocalyptic</option>
                <option value="primordial">Primordial</option>
                <option value="mythical_age">Mythical Age</option>
                <option value="golden_age">Golden Age</option>
                <option value="age_of_legends">Age of Legends</option>
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="all">All Genres</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Sci-Fi</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="steampunk">Steampunk</option>
                <option value="horror">Horror</option>
                <option value="dark_fantasy">Dark Fantasy</option>
                <option value="epic_fantasy">Epic Fantasy</option>
                <option value="urban_fantasy">Urban Fantasy</option>
                <option value="mythology_fusion">Mythology Fusion</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Geography */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-white/80 text-sm mb-2">Geography</label>
              <select
                value={filters.geography}
                onChange={(e) => handleFilterChange('geography', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="all">All Geographies</option>
                <option value="arctic">Arctic</option>
                <option value="desert">Desert</option>
                <option value="forest">Forest</option>
                <option value="jungle">Jungle</option>
                <option value="mountains">Mountains</option>
                <option value="ocean">Ocean</option>
                <option value="plains">Plains</option>
                <option value="swamps">Swamps</option>
                <option value="tundra">Tundra</option>
                <option value="underground">Underground</option>
                <option value="urban">Urban</option>
                <option value="volcanic">Volcanic</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', timeframe: 'all', genre: 'all', geography: 'all' })}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="mt-4 text-white/60 text-sm">
            Showing {filteredMythologies.length} of {mythologies.length} mythologies
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredMythologies.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-white/60 text-lg">No mythologies found matching your filters</p>
            <button
              onClick={() => setFilters({ search: '', timeframe: 'all', genre: 'all', geography: 'all' })}
              className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMythologies.map((mythology) => (
              <Link
                key={mythology.id}
                href={`/student/mythology/${mythology.id}`}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:scale-105 transition-all cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{mythology.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs capitalize">
                    {mythology.timeframe.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                    {mythology.genre.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs capitalize">
                    {mythology.geography_type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-white/80 mb-4 line-clamp-3">{mythology.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    By: {Array.isArray(mythology.profiles) 
                      ? mythology.profiles[0]?.display_name 
                      : mythology.profiles?.display_name || 'Unknown'}
                  </span>
                  <span className="text-white/40">
                    {new Date(mythology.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
