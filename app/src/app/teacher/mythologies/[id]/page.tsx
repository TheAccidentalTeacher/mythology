'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, User, Calendar, Star, Flag, CheckCircle, 
  MessageSquare, Eye, EyeOff, Save, Users, Swords, MapPin, Scroll,
  AlertTriangle, X
} from 'lucide-react';

interface Creator {
  display_name: string;
  email: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface Creature {
  id: string;
  name: string;
  creature_type: string;
  description: string;
}

interface Story {
  id: string;
  title: string;
  story_type: string;
  content: string;
}

interface TeacherComment {
  id: string;
  comment: string;
  created_at: string;
}

interface Mythology {
  id: string;
  name: string;
  description: string | null;
  genre: string | null;
  geography_type: string | null;
  setting_description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  moderation_status: string;
  flagged_reason: string | null;
  teacher_grade: string | null;
  teacher_feedback: string | null;
  visibility: string;
  created_by: string;
  five_themes: Record<string, string> | null;
  creator?: Creator;
}

export default function TeacherMythologyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mythologyId = params.id as string;

  const [mythology, setMythology] = useState<Mythology | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<TeacherComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  useEffect(() => {
    fetchMythologyData();
  }, [mythologyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMythologyData = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Verify teacher access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get mythology with creator
      const { data: mythData, error: mythError } = await supabase
        .from('mythologies')
        .select(`
          *,
          creator:profiles!mythologies_created_by_fkey(display_name, email)
        `)
        .eq('id', mythologyId)
        .single();

      if (mythError || !mythData) {
        console.error('Mythology not found:', mythError);
        router.push('/teacher/mythologies');
        return;
      }

      setMythology(mythData);
      setGrade(mythData.teacher_grade || '');
      setFeedback(mythData.teacher_feedback || '');

      // Fetch related content in parallel
      const [charsResult, creaturesResult, storiesResult, commentsResult] = await Promise.all([
        supabase.from('characters').select('*').eq('mythology_id', mythologyId).order('created_at'),
        supabase.from('creatures').select('*').eq('mythology_id', mythologyId).order('created_at'),
        supabase.from('stories').select('*').eq('mythology_id', mythologyId).order('created_at'),
        supabase.from('mythology_comments').select('*').eq('mythology_id', mythologyId).order('created_at', { ascending: false }),
      ]);

      setCharacters(charsResult.data || []);
      setCreatures(creaturesResult.data || []);
      setStories(storiesResult.data || []);
      setComments(commentsResult.data || []);

    } catch (error) {
      console.error('Error loading mythology:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGradeAndFeedback = async () => {
    if (!mythology) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('mythologies')
      .update({
        teacher_grade: grade || null,
        teacher_feedback: feedback || null,
        graded_at: grade ? new Date().toISOString() : null,
        graded_by: grade ? user?.id : null,
      })
      .eq('id', mythology.id);

    if (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } else {
      setMythology({ ...mythology, teacher_grade: grade, teacher_feedback: feedback });
      alert('Grade and feedback saved!');
    }

    setSaving(false);
  };

  const addComment = async () => {
    if (!mythology || !newComment.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('mythology_comments')
      .insert({
        mythology_id: mythology.id,
        teacher_id: user?.id,
        comment: newComment.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } else if (data) {
      setComments([data, ...comments]);
      setNewComment('');
    }

    setSaving(false);
  };

  const approveContent = async () => {
    if (!mythology) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('mythologies')
      .update({
        moderation_status: 'approved',
        flagged_reason: null,
      })
      .eq('id', mythology.id);

    if (!error) {
      setMythology({ ...mythology, moderation_status: 'approved', flagged_reason: null });
    }

    setSaving(false);
  };

  const flagContent = async () => {
    if (!mythology || !flagReason.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('mythologies')
      .update({
        moderation_status: 'flagged',
        flagged_reason: flagReason.trim(),
      })
      .eq('id', mythology.id);

    if (!error) {
      setMythology({ ...mythology, moderation_status: 'flagged', flagged_reason: flagReason });
      setShowFlagModal(false);
      setFlagReason('');
    }

    setSaving(false);
  };

  const toggleVisibility = async () => {
    if (!mythology) return;
    setSaving(true);

    const newVisibility = mythology.visibility === 'private' ? 'classroom' : 'private';
    const supabase = createClient();
    
    const { error } = await supabase
      .from('mythologies')
      .update({ visibility: newVisibility })
      .eq('id', mythology.id);

    if (!error) {
      setMythology({ ...mythology, visibility: newVisibility });
    }

    setSaving(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading mythology...</div>
      </div>
    );
  }

  if (!mythology) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Mythology not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/teacher/mythologies"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{mythology.name}</h1>
            <p className="text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              By {mythology.creator?.display_name || 'Unknown Student'}
              <span className="text-gray-500">•</span>
              <Calendar className="w-4 h-4" />
              Created {formatDate(mythology.created_at)}
            </p>
          </div>
        </div>

        {/* Teacher Action Toolbar */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 mb-6 border border-blue-500/30">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" /> Teacher Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={approveContent}
              disabled={saving || mythology.moderation_status === 'approved'}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                mythology.moderation_status === 'approved'
                  ? 'bg-green-500/30 text-green-300 cursor-default'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {mythology.moderation_status === 'approved' ? 'Approved' : 'Approve'}
            </button>

            <button
              onClick={() => setShowFlagModal(true)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                mythology.moderation_status === 'flagged'
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Flag className="w-4 h-4" />
              {mythology.moderation_status === 'flagged' ? 'Flagged' : 'Flag Content'}
            </button>

            <button
              onClick={toggleVisibility}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              {mythology.visibility === 'private' ? (
                <>
                  <Eye className="w-4 h-4" /> Make Visible
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" /> Hide from Class
                </>
              )}
            </button>

            <Link
              href={`/student/mythology/${mythology.id}`}
              target="_blank"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> View as Student
            </Link>
          </div>

          {mythology.moderation_status === 'flagged' && mythology.flagged_reason && (
            <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
              <p className="text-red-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <strong>Flag Reason:</strong> {mythology.flagged_reason}
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mythology Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Mythology Details
              </h2>
              
              {mythology.cover_image_url && (
                <img
                  src={mythology.cover_image_url}
                  alt={mythology.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {mythology.description && (
                <div className="mb-4">
                  <h3 className="text-gray-400 text-sm mb-1">Description</h3>
                  <p className="text-white">{mythology.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {mythology.genre && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Genre</h3>
                    <p className="text-white capitalize">{mythology.genre.replace('_', ' ')}</p>
                  </div>
                )}
                {mythology.geography_type && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Geography</h3>
                    <p className="text-white capitalize">{mythology.geography_type.replace('_', ' ')}</p>
                  </div>
                )}
              </div>

              {mythology.setting_description && (
                <div className="mt-4">
                  <h3 className="text-gray-400 text-sm mb-1">Setting</h3>
                  <p className="text-white">{mythology.setting_description}</p>
                </div>
              )}

              {mythology.five_themes && Object.keys(mythology.five_themes).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-gray-400 text-sm mb-2">Five Themes of Geography</h3>
                  <div className="space-y-2">
                    {Object.entries(mythology.five_themes).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-2">
                        <span className="text-purple-300 capitalize">{key}:</span>{' '}
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Characters */}
            {characters.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Characters ({characters.length})
                </h2>
                <div className="space-y-3">
                  {characters.map((char) => (
                    <div key={char.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">{char.name}</h3>
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                          {char.role}
                        </span>
                      </div>
                      {char.description && (
                        <p className="text-gray-300 text-sm">{char.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Creatures */}
            {creatures.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Swords className="w-5 h-5" /> Creatures ({creatures.length})
                </h2>
                <div className="space-y-3">
                  {creatures.map((creature) => (
                    <div key={creature.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">{creature.name}</h3>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                          {creature.creature_type}
                        </span>
                      </div>
                      {creature.description && (
                        <p className="text-gray-300 text-sm">{creature.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stories */}
            {stories.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Scroll className="w-5 h-5" /> Stories ({stories.length})
                </h2>
                <div className="space-y-4">
                  {stories.map((story) => (
                    <div key={story.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{story.title}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {story.story_type}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {story.content.length > 500 ? story.content.substring(0, 500) + '...' : story.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Grade & Feedback */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" /> Grade & Feedback
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Grade</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="A, B+, 95%, etc."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Feedback for Student</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Great job on the character development..."
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <button
                  onClick={saveGradeAndFeedback}
                  disabled={saving}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Grade & Feedback'}
                </button>
              </div>
            </div>

            {/* Teacher Comments */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Teacher Notes
              </h2>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a private note about this mythology..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <button
                    onClick={addComment}
                    disabled={saving || !newComment.trim()}
                    className="mt-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    Add Note
                  </button>
                </div>

                {comments.length > 0 && (
                  <div className="space-y-3 mt-4 max-h-64 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                        <p className="text-white text-sm">{comment.comment}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Content Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Characters</span>
                  <span className="text-white font-semibold">{characters.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Creatures</span>
                  <span className="text-white font-semibold">{creatures.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stories</span>
                  <span className="text-white font-semibold">{stories.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Visibility</span>
                  <span className="text-white font-semibold capitalize">{mythology.visibility}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white font-semibold">
                    {new Date(mythology.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Content Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" /> Flag Content
              </h3>
              <button
                onClick={() => setShowFlagModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-4">
              Please provide a reason for flagging this mythology. This will be visible to other teachers.
            </p>

            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Reason for flagging..."
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={flagContent}
                disabled={!flagReason.trim() || saving}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
              >
                {saving ? 'Flagging...' : 'Flag Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
