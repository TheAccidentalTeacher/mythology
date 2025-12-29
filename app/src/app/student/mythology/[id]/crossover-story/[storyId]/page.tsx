'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

interface CrossoverStory {
  id: string;
  title: string;
  content: Record<string, unknown>;
  story_type: string;
  status: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  mythology_1: { id: string; name: string };
  mythology_2: { id: string; name: string };
  author_1: { id: string; display_name: string };
  author_2: { id: string; display_name: string };
  author_1_id: string;
  author_2_id: string;
  last_edited_by: string;
}

const STORY_TYPES = [
  { value: 'crossover', label: '🌐 Crossover' },
  { value: 'first_contact', label: '👋 First Contact' },
  { value: 'battle_story', label: '⚔️ Battle Story' },
  { value: 'alliance_origin', label: '🤝 Alliance Origin' },
  { value: 'conflict_tale', label: '💥 Conflict Tale' },
  { value: 'cultural_exchange', label: '💫 Cultural Exchange' },
];

export default function CrossoverStoryEditorPage() {
  const params = useParams();
  const mythologyId = params.id as string;
  const storyId = params.storyId as string;

  const [story, setStory] = useState<CrossoverStory | null>(null);
  const [title, setTitle] = useState('');
  const [storyType, setStoryType] = useState('crossover');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your crossover story... Both authors can contribute to this epic tale!',
      }),
      CharacterCount,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-100 focus:outline-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save on content change (debounced)
      debouncedSave(editor.getJSON());
    },
  });

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    }
    getUser();
  }, []);

  // Fetch story
  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await fetch(`/api/crossovers/stories/${storyId}`);
        const data = await response.json();

        if (response.ok && data.story) {
          setStory(data.story);
          setTitle(data.story.title);
          setStoryType(data.story.story_type);
          
          if (editor && data.story.content) {
            editor.commands.setContent(data.story.content);
          }
        } else {
          setError(data.error || 'Failed to load story');
        }
      } catch {
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [storyId, editor]);

  // Debounced save function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((content: unknown) => {
      saveStory(content as Record<string, unknown>);
    }, 2000),
    [storyId]
  );

  // Save story
  async function saveStory(content?: Record<string, unknown>) {
    if (!story) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/crossovers/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          storyType,
          content: content || editor?.getJSON(),
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  }

  // Update status
  async function updateStatus(newStatus: string) {
    if (!story) return;

    try {
      const response = await fetch(`/api/crossovers/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStory({ ...story, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading crossover story...</div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Story not found'}</p>
          <Link
            href={`/student/mythology/${mythologyId}/crossover`}
            className="text-purple-300 hover:text-white"
          >
            ← Back to Crossover Hub
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = editor?.storage.characterCount.words() || story.word_count || 0;
  const isAuthor = currentUserId === story.author_1_id || currentUserId === story.author_2_id;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/student/mythology/${mythologyId}/crossover`}
            className="text-purple-300 hover:text-white inline-flex items-center gap-2"
          >
            ← Back to Crossover Hub
          </Link>
          
          <div className="flex items-center gap-4">
            {saving ? (
              <span className="text-purple-300 text-sm">Saving...</span>
            ) : lastSaved ? (
              <span className="text-green-300 text-sm">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
            
            <button
              onClick={() => saveStory()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
            >
              💾 Save
            </button>
          </div>
        </div>

        {/* Mythology Banner */}
        <div className="bg-linear-to-r from-purple-600/30 to-pink-600/30 rounded-xl p-4 mb-6 flex items-center justify-center gap-4">
          <div className="text-center">
            <span className="text-2xl">🏛️</span>
            <p className="text-white font-medium">{story.mythology_1?.name}</p>
          </div>
          <span className="text-4xl">⚔️</span>
          <div className="text-center">
            <span className="text-2xl">🏛️</span>
            <p className="text-white font-medium">{story.mythology_2?.name}</p>
          </div>
        </div>

        {/* Authors Banner */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {story.author_1?.display_name?.charAt(0) || '?'}
              </div>
              <span className="text-white">{story.author_1?.display_name}</span>
              {story.last_edited_by === story.author_1_id && (
                <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded">editing</span>
              )}
            </div>
            <span className="text-purple-300">&</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {story.author_2?.display_name?.charAt(0) || '?'}
              </div>
              <span className="text-white">{story.author_2?.display_name}</span>
              {story.last_edited_by === story.author_2_id && (
                <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded">editing</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              story.status === 'published' ? 'bg-green-500/30 text-green-300' :
              story.status === 'completed' ? 'bg-blue-500/30 text-blue-300' :
              story.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-300' :
              'bg-gray-500/30 text-gray-300'
            }`}>
              {story.status.charAt(0).toUpperCase() + story.status.slice(1).replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Title & Type */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-purple-200 text-sm mb-2 block">Story Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => saveStory()}
                disabled={!isAuthor}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-xl font-bold placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
                placeholder="Enter story title..."
              />
            </div>
            <div>
              <label className="text-purple-200 text-sm mb-2 block">Story Type</label>
              <select
                value={storyType}
                onChange={(e) => {
                  setStoryType(e.target.value);
                  saveStory();
                }}
                disabled={!isAuthor}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
              >
                {STORY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden mb-6">
          {/* Toolbar */}
          {isAuthor && editor && (
            <div className="bg-white/5 border-b border-white/10 p-2 flex flex-wrap gap-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                <em>I</em>
              </button>
              <div className="w-px bg-white/20 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                H3
              </button>
              <div className="w-px bg-white/20 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                •
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-white/20 text-white' : 'text-purple-300'}`}
              >
                &ldquo;
              </button>
            </div>
          )}
          
          {/* Editor Content */}
          <div className="min-h-100">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer Stats & Actions */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-purple-200">
            <span>📝 {wordCount} words</span>
            <span>📅 Created {new Date(story.created_at).toLocaleDateString()}</span>
          </div>
          
          {isAuthor && (
            <div className="flex items-center gap-2">
              {story.status === 'draft' && (
                <button
                  onClick={() => updateStatus('in_progress')}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm"
                >
                  📝 Mark In Progress
                </button>
              )}
              {story.status === 'in_progress' && (
                <button
                  onClick={() => updateStatus('completed')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
                >
                  ✅ Mark Completed
                </button>
              )}
              {story.status === 'completed' && (
                <button
                  onClick={() => updateStatus('published')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm"
                >
                  🌍 Publish
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Debounce helper
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: unknown[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}
