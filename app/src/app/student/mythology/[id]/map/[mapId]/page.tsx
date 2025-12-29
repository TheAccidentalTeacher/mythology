'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import MapCanvas from '@/components/MapCanvas';

interface MapLocation {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  color?: string;
  size?: number;
}

interface Map {
  id: string;
  title: string;
  description: string;
  map_type: string;
  canvas_data: unknown;
  background_color: string;
  width: number;
  height: number;
  locations: MapLocation[];
  created_at: string;
  created_by: string;
}

interface Author {
  display_name: string;
}

export default function MapDetailPage() {
  const params = useParams();
  const mythologyId = params.id as string;
  const mapId = params.mapId as string;

  console.log('🗺️ Map Detail - Map ID:', mapId);

  const [map, setMap] = useState<Map | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMap();
  }, [mapId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMap = async () => {
    console.log('📥 Fetching map...');
    const supabase = createClient();

    try {
      // Get map
      const { data: mapData, error: mapError } = await supabase
        .from('maps')
        .select('*')
        .eq('id', mapId)
        .single();

      if (mapError) throw mapError;

      console.log('✅ Map loaded:', mapData.title);
      setMap(mapData);

      // Get author
      const { data: authorData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', mapData.created_by)
        .single();

      setAuthor(authorData);
      setLoading(false);
    } catch (err: unknown) {
      console.error('❌ Error loading map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setLoading(false);
    }
  };

  const getMapTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; color: string; emoji: string }> = {
      world: { label: 'World Map', color: 'bg-blue-500', emoji: '🌍' },
      region: { label: 'Regional Map', color: 'bg-green-500', emoji: '🗾' },
      city: { label: 'City/Settlement', color: 'bg-yellow-500', emoji: '🏛️' },
      realm: { label: 'Mystical Realm', color: 'bg-purple-500', emoji: '✨' },
      other: { label: 'Map', color: 'bg-gray-500', emoji: '🗺️' },
    };

    const badge = badges[type] || badges.other;
    return (
      <span className={`${badge.color} px-3 py-1 rounded-full text-sm font-medium text-white`}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-900 via-blue-900 to-indigo-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading map...</div>
      </div>
    );
  }

  if (error || !map) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <p className="text-red-200">⚠️ {error || 'Map not found'}</p>
            <Link
              href={`/student/mythology/${mythologyId}`}
              className="text-red-300 hover:text-red-100 underline mt-4 inline-block"
            >
              ← Back to Mythology
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-blue-900 to-indigo-900 p-8">
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
          <span className="text-white">Map</span>
        </div>

        {/* Map Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{map.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {getMapTypeBadge(map.map_type)}
              </div>
              {map.description && (
                <p className="text-white/80 mb-4">{map.description}</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl text-sm">
            <div>
              <div className="text-white/60">Author</div>
              <div className="text-white font-medium">{author?.display_name || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-white/60">Locations</div>
              <div className="text-white font-medium">{map.locations?.length || 0}</div>
            </div>
            <div>
              <div className="text-white/60">Dimensions</div>
              <div className="text-white font-medium">{map.width} × {map.height}</div>
            </div>
            <div>
              <div className="text-white/60">Created</div>
              <div className="text-white font-medium">
                {new Date(map.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Map Canvas (Read-only) */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
          <MapCanvas
            width={map.width}
            height={map.height}
            backgroundColor={map.background_color}
            locations={(map.locations || []).map(loc => ({
              ...loc,
              color: loc.color ?? '#4f46e5',
              size: loc.size ?? 20
            }))}
            onLocationsChange={() => {}} // Read-only
            editable={false}
          />
        </div>

        {/* Locations List */}
        {map.locations && map.locations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Locations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {map.locations.map((location: MapLocation) => (
                <div
                  key={location.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="text-2xl mb-2">{location.icon}</div>
                  <h3 className="text-white font-semibold">{location.name}</h3>
                  <div className="text-white/60 text-sm mt-1">
                    Position: ({Math.round(location.x)}, {Math.round(location.y)})
                  </div>
                </div>
              ))}
            </div>
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
          {/* Edit button stubbed for now */}
          <button
            className="px-6 py-3 bg-cyan-500/20 text-cyan-200 rounded-xl hover:bg-cyan-500/30 transition-all"
            onClick={() => console.log('🖊️ Edit map (coming soon)')}
          >
            ✏️ Edit Map
          </button>
        </div>
      </div>
    </div>
  );
}
