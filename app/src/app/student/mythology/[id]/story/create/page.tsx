'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';
import { HelpCircle, Sparkles, Lightbulb } from 'lucide-react';
import StandardsBadge from '@/components/StandardsBadge';

interface Character {
  id: string;
  name: string;
}

interface Creature {
  id: string;
  name: string;
}

// Story writing tips
const STORY_TIPS = {
  origin: {
    title: 'Origin Story',
    tips: [
      'Start with "In the beginning..." or a moment of creation',
      'Explain WHY things came to be, not just how',
      'Include consequences that shaped the world'
    ],
    examples: ['How the gods were born', 'Why the sun rises', 'The creation of humans']
  },
  legend: {
    title: 'Legend',
    tips: [
      'Center on a hero or memorable figure',
      'Include a challenge they must overcome',
      'Show how their actions affected the world'
    ],
    examples: ['A hero\'s impossible quest', 'A sacrifice that saved many', 'A clever trick']
  },
  battle: {
    title: 'Battle/Conflict',
    tips: [
      'Establish what\'s at stake if one side loses',
      'Show character through combat choices',
      'Include consequences - victory has a cost'
    ],
    examples: ['War between realms', 'Duel of rivals', 'Battle against a monster']
  },
  quest: {
    title: 'Quest/Adventure',
    tips: [
      'Define a clear goal the hero seeks',
      'Include obstacles that test their character',
      'The journey should change them'
    ],
    examples: ['Searching for a lost artifact', 'Journey to the underworld', 'Finding a cure']
  },
  relationship: {
    title: 'Relationship Story',
    tips: [
      'Show how the characters feel about each other',
      'Include conflict or tension between them',
      'Explore how the relationship changes them'
    ],
    examples: ['Forbidden love', 'Bitter rivalry', 'Unlikely friendship']
  },
  prophecy: {
    title: 'Prophecy',
    tips: [
      'Use mysterious, poetic language',
      'Include symbols that could mean multiple things',
      'Connect to events in your mythology'
    ],
    examples: ['The end of the world', 'The rise of a chosen one', 'A curse\'s end']
  },
  other: {
    title: 'Other Story',
    tips: [
      'Make sure it connects to your mythology',
      'Include at least one character or creature',
      'Give it meaning within your world'
    ],
    examples: ['A day in the life', 'A mystery to solve', 'A moral lesson']
  }
};

export default function CreateStoryPage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;
  const supabase = createClient();

  // Mythology context for tips
  const [mythologyContext, setMythologyContext] = useState<{
    name: string;
    genre?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    story_type: 'legend',
    featured_characters: [] as string[],
    featured_creatures: [] as string[],
    visibility: 'public',
    is_complete: false,
  });

  const [wordCount, setWordCount] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    fetchCharactersAndCreatures();
    fetchMythology();
  }, [mythologyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMythology = async () => {
    const { data } = await supabase
      .from('mythologies')
      .select('name, genre')
      .eq('id', mythologyId)
      .single();
    
    if (data) {
      setMythologyContext({
        name: data.name,
        genre: data.genre,
      });
    }
  };

  const fetchCharactersAndCreatures = async () => {
    // Get characters
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name')
      .eq('mythology_id', mythologyId);

    setCharacters(chars || []);

    // Get creatures
    const { data: creat } = await supabase
      .from('creatures')
      .select('id, name')
      .eq('mythology_id', mythologyId);

    setCreatures(creat || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('You must be logged in');

      // Create story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert([{
          ...formData,
          mythology_id: mythologyId,
          created_by: user.id,
          word_count: wordCount,
          content_text: extractPlainText(formData.content),
          excerpt: extractExcerpt(formData.content),
        }])
        .select()
        .single();

      if (storyError) throw new Error(storyError.message);

      // Award points
      try {
        await fetch('/api/gamification/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'story_completed',
            referenceId: story.id,
            referenceType: 'story',
          }),
        });
      } catch {}

      router.push(`/student/mythology/${mythologyId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create story';
      setError(message);
      setLoading(false);
    }
  };

  const extractPlainText = (content: string): string => {
    try {
      const parsed = JSON.parse(content);
      const getText = (node: Record<string, unknown>): string => {
        if (typeof node.text === 'string') return node.text;
        if (Array.isArray(node.content)) return node.content.map((n) => getText(n as Record<string, unknown>)).join(' ');
        return '';
      };
      return getText(parsed);
    } catch {
      return content;
    }
  };

  const extractExcerpt = (content: string): string => {
    const text = extractPlainText(content);
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  };

  const handleEditorChange = (content: string, words: number) => {
    setFormData({ ...formData, content });
    setWordCount(words);
  };

  const toggleCharacter = (id: string) => {
    setFormData({
      ...formData,
      featured_characters: formData.featured_characters.includes(id)
        ? formData.featured_characters.filter(cid => cid !== id)
        : [...formData.featured_characters, id],
    });
  };

  const toggleCreature = (id: string) => {
    setFormData({
      ...formData,
      featured_creatures: formData.featured_creatures.includes(id)
        ? formData.featured_creatures.filter(cid => cid !== id)
        : [...formData.featured_creatures, id],
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/student/mythology/${mythologyId}`}
          className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mb-6"
        >
          ← Back to Mythology
        </Link>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">📖 Write a Story</h1>
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
          <p className="text-white/60 mb-4">Craft a narrative within your mythology</p>

          {mythologyContext && (
            <div className="bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-indigo-200">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Writing for: {mythologyContext.name}</span>
              </div>
              {mythologyContext.genre && (
                <p className="text-white/50 text-sm mt-1">Genre: {mythologyContext.genre}</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-200">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">Story Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="The Battle of..."
              />
              {showTips && (
                <p className="text-white/50 text-sm mt-2">💡 A good title hints at the story without giving it all away</p>
              )}
            </div>

            {/* Story Type */}
            <div>
              <label className="block text-white font-medium mb-2">Story Type *</label>
              <select
                value={formData.story_type}
                onChange={(e) => setFormData({ ...formData, story_type: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="origin">Origin Story</option>
                <option value="legend">Legend</option>
                <option value="battle">Battle/Conflict</option>
                <option value="quest">Quest/Adventure</option>
                <option value="relationship">Relationship</option>
                <option value="prophecy">Prophecy</option>
                <option value="other">Other</option>
              </select>

              {/* Dynamic Tips based on story type */}
              {showTips && STORY_TIPS[formData.story_type as keyof typeof STORY_TIPS] && (
                <div className="mt-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-300 font-medium mb-2">
                    <Lightbulb className="w-4 h-4" />
                    Tips for {STORY_TIPS[formData.story_type as keyof typeof STORY_TIPS].title}
                  </div>
                  <ul className="space-y-1">
                    {STORY_TIPS[formData.story_type as keyof typeof STORY_TIPS].tips.map((tip, i) => (
                      <li key={i} className="text-amber-100/80 text-sm">• {tip}</li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-amber-500/20">
                    <span className="text-amber-300/70 text-xs">Examples: </span>
                    <span className="text-amber-100/60 text-xs">
                      {STORY_TIPS[formData.story_type as keyof typeof STORY_TIPS].examples.join(' • ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-white font-medium mb-2">Story Content * ({wordCount} words)</label>
              <RichTextEditor
                content={formData.content}
                onChange={handleEditorChange}
                placeholder="Begin your tale..."
              />
              {wordCount < 100 && wordCount > 0 && (
                <p className="text-yellow-300 text-sm mt-2">Stories should be at least 100 words</p>
              )}
              {showTips && wordCount === 0 && (
                <div className="mt-2 text-white/50 text-sm space-y-1">
                  <p>💡 <strong>Story structure:</strong> Beginning (setup) → Middle (conflict) → End (resolution)</p>
                  <p>💡 <strong>Show, don&apos;t tell:</strong> Instead of &quot;Thor was angry,&quot; write &quot;Thunder cracked as Thor&apos;s grip crushed the goblet&quot;</p>
                </div>
              )}
            </div>

            {/* Featured Characters */}
            {characters.length > 0 && (
              <div>
                <label className="block text-white font-medium mb-3">Featured Characters (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => toggleCharacter(char.id)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        formData.featured_characters.includes(char.id)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {char.name}
                    </button>
                  ))}
                </div>
                {showTips && (
                  <p className="text-white/50 text-sm mt-2">💡 Tag characters who appear in this story for easy reference</p>
                )}
              </div>
            )}

            {/* Featured Creatures */}
            {creatures.length > 0 && (
              <div>
                <label className="block text-white font-medium mb-3">Featured Creatures (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {creatures.map((creature) => (
                    <button
                      key={creature.id}
                      type="button"
                      onClick={() => toggleCreature(creature.id)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        formData.featured_creatures.includes(creature.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {creature.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <input
                type="checkbox"
                checked={formData.is_complete}
                onChange={(e) => setFormData({ ...formData, is_complete: e.target.checked })}
                className="w-5 h-5"
              />
              <div>
                <div className="text-white font-medium">Mark as Complete</div>
                <div className="text-white/60 text-sm">Check this when your story is finished</div>
              </div>
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
                    <div className="text-white/60 text-sm">Everyone can read this story</div>
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
                    <div className="text-white/60 text-sm">Only your teacher can read this</div>
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
                disabled={loading || wordCount < 100 || !formData.title}
                className="flex-1 px-6 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? '📖 Creating Story...' : '✨ Publish Story (+100 pts)'}
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

      {/* Floating Standards Badge */}
      <StandardsBadge 
        activityType="story-writing" 
        activityName="Write a Story"
        position="bottom-right"
      />
    </div>
  );
}
