'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RELATIONSHIP_TYPES, RelationshipType } from '@/lib/relationshipTypes';
import { HelpCircle, Lightbulb } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  character_type: string;
}

interface AddRelationshipFormProps {
  mythologyId: string;
  characters: Character[];
  onSuccess: () => void;
  onCancel: () => void;
}

// Tips for creating meaningful relationships
const RELATIONSHIP_TIPS = {
  general: [
    'Relationships create drama and conflict in your mythology',
    'Think about HOW this relationship affects both characters',
    'Consider: How did this relationship begin?',
  ],
  strengthGuide: {
    1: 'Barely acquainted, distant',
    3: 'Know each other, occasional interaction',
    5: 'Significant relationship, regular contact',
    7: 'Close bond, major influence on each other',
    10: 'Inseparable, life-defining connection',
  },
  typeHints: {
    friend: 'Friends support each other through challenges. What do they do together?',
    enemy: 'Enemies create conflict. What caused their enmity? What would resolve it?',
    rival: 'Rivals push each other to improve. Is the rivalry friendly or hostile?',
    parent: 'Parents shape who their children become. What values did they pass on?',
    child: 'Children carry their parents\' legacy. How do they honor or rebel against it?',
    sibling: 'Siblings share history. Are they close, competitive, or estranged?',
    mentor: 'Mentors guide growth. What wisdom or skills do they teach?',
    student: 'Students seek knowledge. What are they hoping to learn?',
    creator: 'Creators bring beings into existence. Why did they create them?',
    creation: 'Creations owe their existence to another. How do they feel about their creator?',
    lover: 'Lovers share deep emotional bonds. What draws them together?',
    spouse: 'Spouses are bound together in partnership. What unites them beyond love?',
    ally: 'Allies work together toward common goals. What brings them together?',
    romantic: 'Romantic interests share attraction and affection. What sparked the connection?',
    servant: 'Servants serve a purpose. Is it willing service or forced?',
    master: 'Masters hold power. How do they treat those who serve them?',
  } as Record<string, string>
};

export default function AddRelationshipForm({
  mythologyId,
  characters,
  onSuccess,
  onCancel
}: AddRelationshipFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  // Form state
  const [character1Id, setCharacter1Id] = useState<string>('');
  const [character2Id, setCharacter2Id] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('friend');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!character1Id || !character2Id) {
      setError('Please select both characters');
      return;
    }

    if (character1Id === character2Id) {
      setError('Cannot create relationship with the same character');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to create relationships');
        return;
      }

      const relationshipConfig = RELATIONSHIP_TYPES[relationshipType];
      const isMutual = relationshipConfig.isMutual;

      // Insert relationship
      const { error: insertError } = await supabase
        .from('relationships')
        .insert({
          mythology_id: mythologyId,
          character_1_id: character1Id,
          character_2_id: character2Id,
          relationship_type: relationshipType,
          description: description || null,
          strength,
          is_mutual: isMutual,
          created_by: user.id
        });

      if (insertError) {
        console.error('Error creating relationship:', insertError);
        setError(insertError.message);
        return;
      }

      // Success!
      onSuccess();
    } catch (err: unknown) {
      console.error('Error creating relationship:', err);
      setError(err instanceof Error ? err.message : 'Failed to create relationship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Relationship</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all ${
                showTips 
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              {showTips ? 'Tips On' : 'Tips Off'}
            </button>
            <button
              onClick={onCancel}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tips Panel */}
        {showTips && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-300 font-medium text-sm mb-2">
              <Lightbulb className="w-4 h-4" />
              Creating Meaningful Relationships
            </div>
            <ul className="space-y-1">
              {RELATIONSHIP_TIPS.general.map((tip, i) => (
                <li key={i} className="text-amber-100/70 text-xs">• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Character 1 */}
          <div>
            <label className="block text-white mb-2 font-medium">
              First Character
            </label>
            <select
              value={character1Id}
              onChange={(e) => setCharacter1Id(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="">Select a character...</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id} className="bg-gray-800">
                  {char.name} ({char.character_type})
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Type */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Relationship Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(RELATIONSHIP_TYPES) as RelationshipType[]).map((type) => {
                const config = RELATIONSHIP_TYPES[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRelationshipType(type)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      relationshipType === type
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="text-2xl mb-1">{config.emoji}</div>
                    <div className="text-white text-sm font-medium">{config.label}</div>
                    {config.isMutual && (
                      <div className="text-white/40 text-xs mt-1">Mutual</div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-white/60 text-sm mt-2">
              {RELATIONSHIP_TYPES[relationshipType].description}
            </p>
            {showTips && RELATIONSHIP_TIPS.typeHints[relationshipType] && (
              <p className="text-amber-300/70 text-xs mt-1">
                💡 {RELATIONSHIP_TIPS.typeHints[relationshipType]}
              </p>
            )}
          </div>

          {/* Character 2 */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Second Character
            </label>
            <select
              value={character2Id}
              onChange={(e) => setCharacter2Id(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="">Select a character...</option>
              {characters
                .filter((char) => char.id !== character1Id)
                .map((char) => (
                  <option key={char.id} value={char.id} className="bg-gray-800">
                    {char.name} ({char.character_type})
                  </option>
                ))}
            </select>
          </div>

          {/* Relationship Strength */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Relationship Strength: {strength}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={strength}
              onChange={(e) => setStrength(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${strength * 10}%, rgba(255,255,255,0.2) ${strength * 10}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <div className="flex justify-between text-white/40 text-xs mt-1">
              <span>Weak</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
            {showTips && (
              <p className="text-amber-300/70 text-xs mt-2">
                💡 {RELATIONSHIP_TIPS.strengthGuide[strength as keyof typeof RELATIONSHIP_TIPS.strengthGuide] || 'How significant is this relationship?'}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the nature of this relationship..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 focus:outline-none resize-none"
            />
            {showTips && (
              <p className="text-white/50 text-xs mt-1">
                💡 Describe key events, shared history, or what makes this relationship unique
              </p>
            )}
          </div>

          {/* Preview */}
          {character1Id && character2Id && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-white/60 text-sm mb-2">Preview:</div>
              <div className="text-white font-medium">
                {characters.find(c => c.id === character1Id)?.name}{' '}
                <span className="text-purple-400">
                  {RELATIONSHIP_TYPES[relationshipType].emoji} {RELATIONSHIP_TYPES[relationshipType].label}
                </span>{' '}
                {characters.find(c => c.id === character2Id)?.name}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !character1Id || !character2Id}
            >
              {loading ? 'Creating...' : 'Create Relationship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
