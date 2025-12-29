'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AIFieldHelper, AIInputHelper } from '@/components/ai/AIFieldHelper';
import { CREATURE_FIELD_CONFIGS } from '@/lib/ai/fieldConfigs';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function CreateCreaturePage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;
  const supabase = createClient();

  // Mythology context for AI
  const [mythologyContext, setMythologyContext] = useState<{
    name: string;
    category?: string;
    geography?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    creature_type: 'beast',
    alignment: 'neutral',
    intelligence_level: 'animal_intelligence',
    size_category: 'medium',
    danger_level: 'minor_threat',
    description: '',
    habitat: '',
    abilities: '',
    cultural_significance: '',
    origin_story: '',
    weaknesses: '',
    is_unique: false,
    visibility: 'public',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  // Fetch mythology info for context
  useEffect(() => {
    async function fetchMythology() {
      const { data } = await supabase
        .from('mythologies')
        .select('name, genre, geography_type, setting_description')
        .eq('id', mythologyId)
        .single();
      
      if (data) {
        setMythologyContext({
          name: data.name,
          category: data.genre,
          geography: data.setting_description || data.geography_type,
        });
      }
    }
    fetchMythology();
  }, [mythologyId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('You must be logged in');

      const { data: mythology, error: mythError } = await supabase
        .from('mythologies')
        .select('id, created_by')
        .eq('id', mythologyId)
        .single();

      if (mythError || !mythology) throw new Error('Mythology not found');
      if (mythology.created_by !== user.id) throw new Error('You can only add creatures to your own mythologies');

      const { data: creature, error: creatureError } = await supabase
        .from('creatures')
        .insert([{
          ...formData,
          mythology_id: mythologyId,
          created_by: user.id,
        }])
        .select()
        .single();

      if (creatureError) throw new Error(creatureError.message);

      // Award points
      try {
        await fetch('/api/gamification/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'creature_created',
            referenceId: creature.id,
            referenceType: 'creature',
          }),
        });
      } catch {}

      router.push(`/student/mythology/${mythologyId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create creature';
      setError(message);
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-900 via-teal-900 to-emerald-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href={`/student/mythology/${mythologyId}`}
          className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mb-6"
        >
          ← Back to Mythology
        </Link>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">🐉 Create Creature</h1>
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                showTips 
                  ? 'bg-green-500/30 text-green-200 border border-green-400/30' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">{showTips ? 'Tips On' : 'Tips Off'}</span>
            </button>
          </div>
          <p className="text-white/60 mb-4">Add a monster, beast, or magical being to your mythology</p>

          {mythologyContext && (
            <div className="bg-linear-to-r from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-green-200">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Creating for: {mythologyContext.name}</span>
              </div>
              {mythologyContext.category && (
                <p className="text-white/50 text-sm mt-1">Genre: {mythologyContext.category}</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-200">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <AIInputHelper
              config={CREATURE_FIELD_CONFIGS.name}
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              placeholder="Cerberus, Phoenix, Kraken..."
              required
            />

            {/* Grid for dropdowns */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Creature Type */}
              <div>
                <label className="block text-white font-medium mb-2">Creature Type *</label>
                <select
                  name="creature_type"
                  value={formData.creature_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="beast">Beast</option>
                  <option value="monster">Monster</option>
                  <option value="magical_being">Magical Being</option>
                  <option value="spirit">Spirit</option>
                  <option value="undead">Undead</option>
                  <option value="construct">Construct</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="elemental">Elemental</option>
                  <option value="dragon">Dragon</option>
                  <option value="other">Other</option>
                </select>
                {showTips && (
                  <p className="text-white/50 text-xs mt-1">💡 Beasts are natural, monsters are unnatural or dangerous, magical beings have innate magic</p>
                )}
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-white font-medium mb-2">Alignment *</label>
                <select
                  name="alignment"
                  value={formData.alignment}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="good">Good</option>
                  <option value="neutral">Neutral</option>
                  <option value="evil">Evil</option>
                  <option value="ambiguous">Ambiguous</option>
                  <option value="lawful">Lawful</option>
                  <option value="chaotic">Chaotic</option>
                </select>
                {showTips && (
                  <p className="text-white/50 text-xs mt-1">💡 Does this creature help, harm, or ignore people?</p>
                )}
              </div>

              {/* Intelligence */}
              <div>
                <label className="block text-white font-medium mb-2">Intelligence Level *</label>
                <select
                  name="intelligence_level"
                  value={formData.intelligence_level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="non_sentient">Non-Sentient</option>
                  <option value="animal_intelligence">Animal Intelligence</option>
                  <option value="sentient">Sentient</option>
                  <option value="highly_intelligent">Highly Intelligent</option>
                </select>
                {showTips && (
                  <p className="text-white/50 text-xs mt-1">💡 Can it think, plan, and communicate?</p>
                )}
              </div>

              {/* Size */}
              <div>
                <label className="block text-white font-medium mb-2">Size Category *</label>
                <select
                  name="size_category"
                  value={formData.size_category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="tiny">Tiny</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="huge">Huge</option>
                  <option value="gargantuan">Gargantuan</option>
                </select>
                {showTips && (
                  <p className="text-white/50 text-xs mt-1">💡 Tiny = insect, Medium = human, Gargantuan = mountain</p>
                )}
              </div>

              {/* Danger Level */}
              <div>
                <label className="block text-white font-medium mb-2">Danger Level *</label>
                <select
                  name="danger_level"
                  value={formData.danger_level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="harmless">Harmless</option>
                  <option value="minor_threat">Minor Threat</option>
                  <option value="dangerous">Dangerous</option>
                  <option value="deadly">Deadly</option>
                  <option value="catastrophic">Catastrophic</option>
                </select>
                {showTips && (
                  <p className="text-white/50 text-xs mt-1">💡 How much trouble would meeting this creature cause?</p>
                )}
              </div>

              {/* Unique */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <input
                  type="checkbox"
                  name="is_unique"
                  checked={formData.is_unique}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <div>
                  <div className="text-white font-medium">Unique Entity</div>
                  <div className="text-white/60 text-sm">One of a kind vs. a species</div>
                  {showTips && (
                    <p className="text-white/40 text-xs mt-1">💡 Is this THE Kraken or just A kraken?</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.description}
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              placeholder="A brief overview of this creature..."
              mythologyContext={mythologyContext || undefined}
              required
              minLength={50}
              maxLength={500}
              rows={4}
            />

            {/* Habitat */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.habitat}
              value={formData.habitat}
              onChange={(value) => updateField('habitat', value)}
              placeholder="Where does this creature live?"
              mythologyContext={mythologyContext || undefined}
              rows={2}
            />

            {/* Abilities */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.abilities}
              value={formData.abilities}
              onChange={(value) => updateField('abilities', value)}
              placeholder="What special abilities does this creature have?"
              mythologyContext={mythologyContext || undefined}
              rows={3}
            />

            {/* Cultural Significance */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.cultural_significance}
              value={formData.cultural_significance}
              onChange={(value) => updateField('cultural_significance', value)}
              placeholder="What role does this creature play in your mythology?"
              mythologyContext={mythologyContext || undefined}
              rows={3}
            />

            {/* Origin Story */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.origin_story}
              value={formData.origin_story}
              onChange={(value) => updateField('origin_story', value)}
              placeholder="How did this creature come to exist?"
              mythologyContext={mythologyContext || undefined}
              rows={4}
            />

            {/* Weaknesses */}
            <AIFieldHelper
              config={CREATURE_FIELD_CONFIGS.weaknesses}
              value={formData.weaknesses}
              onChange={(value) => updateField('weaknesses', value)}
              placeholder="What are its vulnerabilities?"
              mythologyContext={mythologyContext || undefined}
              rows={2}
            />

            {/* Visibility */}
            <div>
              <label className="block text-white font-medium mb-3">Visibility</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-white font-medium">👁️ Public</div>
                    <div className="text-white/60 text-sm">Everyone can see this creature</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    name="visibility"
                    value="teacher_only"
                    checked={formData.visibility === 'teacher_only'}
                    onChange={handleChange}
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
                    name="visibility"
                    value="hidden"
                    checked={formData.visibility === 'hidden'}
                    onChange={handleChange}
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
                disabled={loading || formData.description.length < 50}
                className="flex-1 px-6 py-4 bg-linear-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? '🐉 Creating Creature...' : '✨ Create Creature (+50 pts)'}
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
