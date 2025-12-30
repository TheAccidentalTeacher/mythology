'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import MapCanvas from '@/components/MapCanvas';
import VoiceTextarea from '@/components/VoiceTextarea';
import { MapType, MAP_TYPE_CONFIGS, getDefaultCanvasDimensions, getMarkersForType, getInstructionsForType } from '@/lib/mapTypes';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  size: number;
  linkedCharacterId?: string;
  linkedCreatureId?: string;
}

export default function CreateMapPage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;

  console.log('🗺️ Map Creation - Mythology ID:', mythologyId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    map_type: 'world' as MapType,
    background_color: '#1a1a2e',
    width: getDefaultCanvasDimensions('world').width,
    height: getDefaultCanvasDimensions('world').height,
    visibility: 'public',
  });

  console.log('🗺️ Form Data:', { 
    map_type: formData.map_type,
    dimensions: `${formData.width}×${formData.height}`
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Submitting map...', formData.title);
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to create maps');
      }

      // Prepare canvas data (simplified - just store locations for now)
      const canvasData = {
        locations,
        version: 1,
      };

      // Create map
      const { data: map, error: mapError } = await supabase
        .from('maps')
        .insert([{
          ...formData,
          mythology_id: mythologyId,
          created_by: user.id,
          canvas_data: canvasData,
          locations: locations,
        }])
        .select()
        .single();

      if (mapError) {
        console.error('❌ Map creation error:', mapError);
        throw new Error(`Failed to create map: ${mapError.message}`);
      }

      console.log('✅ Map created:', map.id);

      // Award points
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      const newPoints = (profile?.points || 0) + 75; // Maps worth 75 points

      await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id);

      console.log('🏆 Awarded 75 points!');
      router.push(`/student/mythology/${mythologyId}`);
    } catch (err: unknown) {
      console.error('💥 Fatal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create map');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/student/mythology/${mythologyId}`}
          className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mb-6"
        >
          ← Back to Mythology
        </Link>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🗺️ Create World Map</h1>
          <p className="text-white/60 mb-8">Design the geography of your mythology</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-200">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">Map Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="The Kingdom of..."
              />
            </div>

            {/* Description */}
            <div>
              <VoiceTextarea
                label="Description (Optional)"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                rows={3}
                placeholder="Describe the geography, climate, or key features... (Tip: Click the microphone to use voice input!)"
              />
            </div>

            {/* Map Type */}
            <div>
              <label className="block text-white font-medium mb-2">Map Type *</label>
              <select
                value={formData.map_type}
                onChange={(e) => {
                  const newType = e.target.value as MapType;
                  const defaultDims = getDefaultCanvasDimensions(newType);
                  setFormData({ 
                    ...formData, 
                    map_type: newType,
                    width: defaultDims.width,
                    height: defaultDims.height
                  });
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="world">🌍 World Map</option>
                <option value="regional">🗺️ Regional Map</option>
                <option value="city">🏙️ City/Settlement</option>
                <option value="mystical">✨ Mystical Realm</option>
                <option value="other">📜 Other</option>
              </select>
              <p className="text-white/60 text-sm mt-2">
                {MAP_TYPE_CONFIGS[formData.map_type as MapType].description}
              </p>
            </div>

            {/* Canvas Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Canvas Width</label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
                  min={MAP_TYPE_CONFIGS[formData.map_type as MapType].minWidth}
                  max={MAP_TYPE_CONFIGS[formData.map_type as MapType].maxWidth}
                  step={100}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-white/50 text-xs mt-1">
                  Recommended: {MAP_TYPE_CONFIGS[formData.map_type as MapType].minWidth}-{MAP_TYPE_CONFIGS[formData.map_type as MapType].maxWidth}px
                </p>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Canvas Height</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                  min={MAP_TYPE_CONFIGS[formData.map_type as MapType].minHeight}
                  max={MAP_TYPE_CONFIGS[formData.map_type as MapType].maxHeight}
                  step={100}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-white/50 text-xs mt-1">
                  Recommended: {MAP_TYPE_CONFIGS[formData.map_type as MapType].minHeight}-{MAP_TYPE_CONFIGS[formData.map_type as MapType].maxHeight}px
                </p>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-white font-medium mb-2">Background Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.background_color}
                  onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                  className="h-12 w-20 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.background_color}
                  onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="#1a1a2e"
                />
              </div>
            </div>

            {/* Interactive Canvas */}
            <div>
              <label className="block text-white font-medium mb-3">Design Your Map *</label>
              
              {/* Map Type Feature Summary - Always Visible */}
              <div className="mb-4 p-4 bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold text-lg">
                    {MAP_TYPE_CONFIGS[formData.map_type as MapType].emoji} {MAP_TYPE_CONFIGS[formData.map_type as MapType].label}
                  </h4>
                  <span className="text-white/60 text-sm">{formData.width} × {formData.height}</span>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  {getInstructionsForType(formData.map_type as MapType)}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-white/70">
                    ✓ {getMarkersForType(formData.map_type as MapType).length} type-specific markers
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-white/70">
                    Min {MAP_TYPE_CONFIGS[formData.map_type as MapType].minMarkers} markers
                  </span>
                  {MAP_TYPE_CONFIGS[formData.map_type as MapType].allowedMarkerStyles.map(style => (
                    <span key={style} className="px-2 py-1 bg-green-500/20 rounded-full text-green-300">
                      {style === 'pin' && '📍'}{style === 'hex' && '⬡'}{style === 'star' && '⭐'}{style === 'circle' && '⚫'} {style}
                    </span>
                  ))}
                </div>
              </div>
              
              <MapCanvas
                width={formData.width}
                height={formData.height}
                backgroundColor={formData.background_color}
                locations={locations}
                onLocationsChange={setLocations}
                editable={true}
                mapType={formData.map_type as MapType}
              />
              {locations.length === 0 && (
                <p className="text-yellow-300 text-sm mt-2">Add at least one location to your map</p>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-white font-medium mb-3">Visibility</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-white font-medium">👁️ Public</div>
                    <div className="text-white/60 text-sm">Everyone can see this map</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value="teacher_only"
                    checked={formData.visibility === 'teacher_only'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-white font-medium">🔒 Teacher Only</div>
                    <div className="text-white/60 text-sm">Only your teacher can see this</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value="hidden"
                    checked={formData.visibility === 'hidden'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-white font-medium">✏️ Hidden (Draft)</div>
                    <div className="text-white/60 text-sm">Only you can see this while you work on it</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || locations.length === 0 || !formData.title}
                className="flex-1 px-6 py-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? '🗺️ Creating Map...' : '✨ Create Map (+75 pts)'}
              </button>
              <Link
                href={`/student/mythology/${mythologyId}`}
                className="px-6 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
