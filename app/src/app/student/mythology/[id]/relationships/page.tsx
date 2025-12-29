'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import RelationshipGraph from '@/components/RelationshipGraph';
import AddRelationshipForm from '@/components/AddRelationshipForm';
import { getAllRelationshipTypes, Relationship } from '@/lib/relationshipTypes';
import { LayoutType } from '@/lib/cytoscape-config';

interface Character {
  id: string;
  name: string;
  character_type: string;
  domain?: string;
}

export default function RelationshipsPage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;
  const supabase = createClient();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('force-directed');
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // Fetch characters and relationships
  useEffect(() => {
    fetchData();
  }, [mythologyId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchData() {
    console.log('📥 Fetching relationship data for mythology:', mythologyId);
    
    try {
      // Fetch characters
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .eq('mythology_id', mythologyId)
        .order('created_at', { ascending: true });

      if (charactersError) throw charactersError;

      console.log('✅ Loaded characters:', charactersData?.length || 0);
      setCharacters(charactersData || []);

      // Fetch relationships
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('relationships')
        .select('*')
        .eq('mythology_id', mythologyId)
        .order('created_at', { ascending: true });

      if (relationshipsError) {
        // Table might not exist yet
        console.log('⚠️ Relationships table not found (run migration 004)');
        setRelationships([]);
      } else {
        console.log('✅ Loaded relationships:', relationshipsData?.length || 0);
        setRelationships(relationshipsData || []);
      }
    } catch (error) {
      console.error('❌ Error fetching relationship data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle node click
  function handleNodeClick(characterId: string) {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setSelectedCharacter(character);
    }
  }

  // Handle edge click
  function handleEdgeClick(relationship: Relationship) {
    console.log('Relationship clicked:', relationship);
    // Could open edit dialog here
  }

  // Toggle relationship type filter
  function toggleFilter(type: string) {
    if (filteredTypes.includes(type)) {
      setFilteredTypes(filteredTypes.filter(t => t !== type));
    } else {
      setFilteredTypes([...filteredTypes, type]);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-blue-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading relationships...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-blue-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-white/60 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Mythology
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">🔗 Character Relationships</h1>
          <p className="text-white/60">
            Visualize connections between characters • {characters.length} characters • {relationships.length} relationships
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Layout selector */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Graph Layout</label>
              <select
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value as LayoutType)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="force-directed" className="bg-gray-800 text-white">Force-Directed</option>
                <option value="hierarchical" className="bg-gray-800 text-white">Hierarchical</option>
                <option value="circular" className="bg-gray-800 text-white">Circular</option>
                <option value="grid" className="bg-gray-800 text-white">Grid</option>
                <option value="concentric" className="bg-gray-800 text-white">Concentric</option>
              </select>
            </div>

            {/* Filter by relationship type */}
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Filter Relationships</label>
              <div className="flex flex-wrap gap-2">
                {getAllRelationshipTypes().map(type => (
                  <button
                    key={type.type}
                    onClick={() => toggleFilter(type.type)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filteredTypes.length === 0 || filteredTypes.includes(type.type)
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {type.emoji} {type.label}
                  </button>
                ))}
                {filteredTypes.length > 0 && (
                  <button
                    onClick={() => setFilteredTypes([])}
                    className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-300 border border-red-500/30"
                  >
                    ✕ Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="h-[600px] mb-6">
          <RelationshipGraph
            characters={characters}
            relationships={relationships}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            selectedLayout={selectedLayout}
            filteredRelationshipTypes={filteredTypes.length > 0 ? filteredTypes : undefined}
            className="h-full"
          />
        </div>

        {/* Selected character info */}
        {selectedCharacter && (
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedCharacter.name}</h3>
                <p className="text-white/60 capitalize">{selectedCharacter.character_type}</p>
                {selectedCharacter.domain && (
                  <p className="text-white/50 text-sm mt-1">{selectedCharacter.domain}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Relationships for this character */}
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-3">Relationships:</h4>
              <div className="space-y-2">
                {relationships
                  .filter(rel => 
                    rel.character_1_id === selectedCharacter.id || 
                    rel.character_2_id === selectedCharacter.id
                  )
                  .map(rel => {
                    const otherCharId = rel.character_1_id === selectedCharacter.id 
                      ? rel.character_2_id 
                      : rel.character_1_id;
                    const otherChar = characters.find(c => c.id === otherCharId);
                    
                    return (
                      <div key={rel.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-2xl">{getAllRelationshipTypes().find(t => t.type === rel.relationship_type)?.emoji}</span>
                        <div>
                          <p className="text-white">
                            <span className="capitalize">{rel.relationship_type}</span> of <strong>{otherChar?.name}</strong>
                          </p>
                          {rel.description && (
                            <p className="text-white/50 text-sm">{rel.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {relationships.filter(rel => 
                  rel.character_1_id === selectedCharacter.id || 
                  rel.character_2_id === selectedCharacter.id
                ).length === 0 && (
                  <p className="text-white/40 text-sm">No relationships yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add relationship button */}
        <div className="mt-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            disabled={characters.length < 2}
          >
            ➕ Add Relationship
          </button>
        </div>

        {/* Empty state */}
        {characters.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No characters yet</p>
            <p className="text-white/40 mb-6">Add characters to your mythology first</p>
            <button
              onClick={() => router.push(`/student/mythology/${mythologyId}`)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            >
              Go to Mythology
            </button>
          </div>
        )}

        {/* Add Relationship Form Modal */}
        {showAddForm && (
          <AddRelationshipForm
            mythologyId={mythologyId}
            characters={characters}
            onSuccess={() => {
              setShowAddForm(false);
              fetchData(); // Refresh data
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}
