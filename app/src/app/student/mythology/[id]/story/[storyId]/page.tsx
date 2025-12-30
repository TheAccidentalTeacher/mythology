'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ComicStripGenerator from '@/components/ComicStripGenerator';
import ProphecyScrollGenerator from '@/components/ProphecyScrollGenerator';
import TradingCardGenerator from '@/components/TradingCardGenerator';
import StandardsBadge from '@/components/StandardsBadge';

interface Story {
  id: string;
  title: string;
  content: unknown;
  story_type: string;
  is_complete: boolean;
  word_count: number;
  view_count: number;
  created_at: string;
  excerpt: string;
  featured_characters: string[];
  featured_creatures: string[];
  created_by: string;
  is_group_story: boolean;
  collaborators: string[];
}

interface Character {
  id: string;
  name: string;
}

interface Creature {
  id: string;
  name: string;
}

interface Author {
  display_name: string;
}

export default function StoryDetailPage() {
  const params = useParams();
  const mythologyId = params.id as string;
  const storyId = params.storyId as string;

  console.log('📖 Story Detail - Story ID:', storyId);

  const [story, setStory] = useState<Story | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mythologyName, setMythologyName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read-only editor for display
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    fetchStory();
    incrementViewCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const fetchStory = async () => {
    console.log('📥 Fetching story...');
    const supabase = createClient();

    try {
      // Get story
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (storyError) throw storyError;
      
      console.log('✅ Story loaded:', storyData.title);
      setStory(storyData);

      // Set editor content
      if (editor) {
        try {
          const content = typeof storyData.content === 'string'
            ? JSON.parse(storyData.content)
            : storyData.content;
          editor.commands.setContent(content);
        } catch {
          editor.commands.setContent(storyData.content);
        }
      }

      // Get author
      const { data: authorData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', storyData.created_by)
        .single();

      setAuthor(authorData);

      // Get featured characters
      if (storyData.featured_characters?.length > 0) {
        const { data: charData } = await supabase
          .from('characters')
          .select('id, name')
          .in('id', storyData.featured_characters);

        setCharacters(charData || []);
      }

      // Get featured creatures
      if (storyData.featured_creatures?.length > 0) {
        const { data: creatData } = await supabase
          .from('creatures')
          .select('id, name')
          .in('id', storyData.featured_creatures);

        setCreatures(creatData || []);
      }

      // Get mythology name
      const { data: mythData } = await supabase
        .from('mythologies')
        .select('name')
        .eq('id', mythologyId)
        .single();
      
      if (mythData) setMythologyName(mythData.name);

      setLoading(false);
    } catch (err: unknown) {
      console.error('❌ Error loading story:', err);
      setError(err instanceof Error ? err.message : 'Failed to load story');
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    const supabase = createClient();
    await supabase
      .from('stories')
      .update({ view_count: story?.view_count ? story.view_count + 1 : 1 })
      .eq('id', storyId);
  };

  const getStoryTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; color: string; emoji: string }> = {
      origin: { label: 'Origin Story', color: 'bg-blue-500', emoji: '🌟' },
      legend: { label: 'Legend', color: 'bg-purple-500', emoji: '📜' },
      battle: { label: 'Battle', color: 'bg-red-500', emoji: '⚔️' },
      quest: { label: 'Quest', color: 'bg-yellow-500', emoji: '🗺️' },
      relationship: { label: 'Relationship', color: 'bg-pink-500', emoji: '💕' },
      prophecy: { label: 'Prophecy', color: 'bg-indigo-500', emoji: '🔮' },
      other: { label: 'Story', color: 'bg-gray-500', emoji: '📖' },
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
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading story...</div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <p className="text-red-200">⚠️ {error || 'Story not found'}</p>
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
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
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
          <span className="text-white">Story</span>
        </div>

        {/* Story Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{story.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {getStoryTypeBadge(story.story_type)}
                {story.is_complete && (
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                    ✅ Complete
                  </span>
                )}
                {story.is_group_story && (
                  <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                    👥 Group Story
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl text-sm">
            <div>
              <div className="text-white/60">Author</div>
              <div className="text-white font-medium">{author?.display_name || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-white/60">Word Count</div>
              <div className="text-white font-medium">{story.word_count.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-white/60">Views</div>
              <div className="text-white font-medium">{story.view_count || 0}</div>
            </div>
            <div>
              <div className="text-white/60">Published</div>
              <div className="text-white font-medium">
                {new Date(story.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Characters/Creatures */}
        {(characters.length > 0 || creatures.length > 0) && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
            {characters.length > 0 && (
              <div className="mb-4">
                <h2 className="text-white font-semibold mb-3">Featured Characters</h2>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char) => (
                    <Link
                      key={char.id}
                      href={`/student/mythology/${mythologyId}/character/${char.id}`}
                      className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-200 hover:bg-purple-500/30 transition-all"
                    >
                      {char.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {creatures.length > 0 && (
              <div>
                <h2 className="text-white font-semibold mb-3">Featured Creatures</h2>
                <div className="flex flex-wrap gap-2">
                  {creatures.map((creature) => (
                    <Link
                      key={creature.id}
                      href={`/student/mythology/${mythologyId}/creature/${creature.id}`}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-green-500/30 transition-all"
                    >
                      {creature.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Story Content */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
          <div className="text-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Creative Exports Section */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">✨ Creative Exports</h2>
          
          {/* Comic Strip Generator */}
          <ComicStripGenerator
            storyTitle={story.title}
            storyContent={editor?.getText() || story.excerpt || ''}
            characters={characters.map(c => c.name)}
            mythologyName={mythologyName || 'Mythology'}
          />
          
          {/* Prophecy Scroll Generator */}
          {(story.story_type === 'prophecy' || story.story_type === 'origin' || story.story_type === 'legend') && (
            <ProphecyScrollGenerator
              storyTitle={story.title}
              storyContent={editor?.getText() || story.excerpt || ''}
              mythologyName={mythologyName || 'Mythology'}
              relatedCharacter={characters[0]?.name}
            />
          )}
        </div>

        {/* Collectibles Section */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">🎴 Collectibles</h2>
          
          {/* Story Trading Card */}
          <TradingCardGenerator
            entityName={story.title}
            entityDescription={story.excerpt || editor?.getText()?.slice(0, 200) || 'An epic tale from mythology'}
            entityType="story"
            mythologyName={mythologyName || 'Mythology'}
          />
        </div>

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
            className="px-6 py-3 bg-purple-500/20 text-purple-200 rounded-xl hover:bg-purple-500/30 transition-all"
            onClick={() => console.log('🖊️ Edit story (coming soon)')}
          >
            ✏️ Edit Story
          </button>
        </div>
      </div>

      {/* Floating Standards Badge */}
      <StandardsBadge 
        activityType="story-writing" 
        activityName="Story Details"
        position="bottom-right"
      />
    </div>
  );
}
