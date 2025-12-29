'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AIFieldHelper, AIInputHelper } from '@/components/ai/AIFieldHelper';
import { CHARACTER_FIELD_CONFIGS } from '@/lib/ai/fieldConfigs';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function CreateCharacterPage() {
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
    character_type: 'hero',
    archetype: '',
    domain: '',
    description: '',
    origin_story: '',
    personality: '',
    geography_connection: '',
    powers_abilities: '',
    weaknesses: '',
    appearance_description: '',
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
      if (mythology.created_by !== user.id) throw new Error('You can only add to your own mythologies');

      const { data: character, error: charError } = await supabase
        .from('characters')
        .insert([{
          ...formData,
          mythology_id: mythologyId,
          created_by: user.id,
        }])
        .select()
        .single();

      if (charError) throw new Error(charError.message);

      // Award points
      try {
        await fetch('/api/gamification/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'character_created',
            referenceId: character.id,
            referenceType: 'character',
          }),
        });
      } catch {}

      router.push(`/student/mythology/${mythologyId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href={`/student/mythology/${mythologyId}`}
          className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mb-6"
        >
          ← Back to Mythology
        </Link>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">🎭 Create Character</h1>
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                showTips 
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">{showTips ? 'Tips On' : 'Tips Off'}</span>
            </button>
          </div>
          <p className="text-white/60 mb-4">Add a god, hero, or legendary figure to your mythology</p>

          {mythologyContext && (
            <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-purple-200">
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
              config={CHARACTER_FIELD_CONFIGS.name}
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              placeholder="Thor, Athena, Gilgamesh..."
              required
            />

            {/* Character Type */}
            <div>
              <label className="block text-white font-medium mb-2">Character Type *</label>
              <select
                name="character_type"
                value={formData.character_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="god">God/Goddess</option>
                <option value="demigod">Demigod</option>
                <option value="hero">Hero</option>
                <option value="mortal">Mortal</option>
                <option value="legendary_figure">Legendary Figure</option>
                <option value="founder">Founder/Creator</option>
                <option value="spirit">Spirit</option>
                <option value="other">Other</option>
              </select>
              {showTips && (
                <div className="mt-2 text-white/50 text-sm">
                  💡 <strong>Tip:</strong> Gods control aspects of nature or life. Heroes are mortals who do great deeds. Demigods have one divine parent.
                </div>
              )}
            </div>

            {/* Archetype */}
            <AIInputHelper
              config={CHARACTER_FIELD_CONFIGS.archetype}
              value={formData.archetype}
              onChange={(value) => updateField('archetype', value)}
              placeholder="Warrior, Trickster, Wise Elder, Nature Spirit..."
            />

            {/* Domain */}
            <AIInputHelper
              config={CHARACTER_FIELD_CONFIGS.domain}
              value={formData.domain}
              onChange={(value) => updateField('domain', value)}
              placeholder="Thunder, Wisdom, War, Nature, Death..."
            />

            {/* Description */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.description}
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              placeholder="A brief overview of who this character is..."
              mythologyContext={mythologyContext || undefined}
              required
              minLength={50}
              maxLength={500}
              rows={4}
            />

            {/* Origin Story */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.origin_story}
              value={formData.origin_story}
              onChange={(value) => updateField('origin_story', value)}
              placeholder="How did this character come to be?"
              mythologyContext={mythologyContext || undefined}
              rows={4}
            />

            {/* Personality */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.personality}
              value={formData.personality}
              onChange={(value) => updateField('personality', value)}
              placeholder="Brave, cunning, compassionate, vengeful..."
              mythologyContext={mythologyContext || undefined}
              rows={3}
            />

            {/* Geography Connection */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.geography_connection}
              value={formData.geography_connection}
              onChange={(value) => updateField('geography_connection', value)}
              placeholder="What locations or landscapes are tied to this character?"
              mythologyContext={mythologyContext || undefined}
              rows={2}
            />

            {/* Powers & Abilities */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.powers_abilities}
              value={formData.powers_abilities}
              onChange={(value) => updateField('powers_abilities', value)}
              placeholder="What special abilities or powers does this character have?"
              mythologyContext={mythologyContext || undefined}
              rows={3}
            />

            {/* Weaknesses */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.weaknesses}
              value={formData.weaknesses}
              onChange={(value) => updateField('weaknesses', value)}
              placeholder="What are their vulnerabilities or flaws?"
              mythologyContext={mythologyContext || undefined}
              rows={2}
            />

            {/* Appearance */}
            <AIFieldHelper
              config={CHARACTER_FIELD_CONFIGS.appearance_description}
              value={formData.appearance_description}
              onChange={(value) => updateField('appearance_description', value)}
              placeholder="What do they look like?"
              mythologyContext={mythologyContext || undefined}
              rows={3}
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
                    <div className="text-white/60 text-sm">Everyone can see this character</div>
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
                className="flex-1 px-6 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? '🎭 Creating Character...' : '✨ Create Character (+50 pts)'}
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
