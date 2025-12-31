'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Edit, Eye, Trash2, Users, Calendar, Target, BookOpen, Sparkles } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  subject_area: string;
  min_grade_level: number;
  max_grade_level: number;
  due_date: string | null;
  points_possible: number;
  is_published: boolean;
  ai_accuracy_check: boolean;
  collaboration_mode: string;
  allow_revisions: boolean;
  scaffolding_hints: string[];
  extension_challenges: string[];
  learning_objectives: string[];
}

interface Submission {
  id: string;
  student_id: string;
  status: string;
  submitted_at: string;
  grade: number | null;
  grade_released: boolean;
  student: {
    display_name: string;
    email: string;
  };
}

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const assignmentId = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingTo, setConvertingTo] = useState<string | null>(null);

  useEffect(() => {
    loadAssignment();
    loadSubmissions();
  }, [assignmentId]);

  const loadAssignment = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (error) {
      console.error('Error loading assignment:', error);
      router.push('/teacher/assignments');
      return;
    }

    setAssignment(data);
    setLoading(false);
  };

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
        student:profiles!assignment_submissions_student_id_fkey(display_name, email)
      `)
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });

    if (data) {
      // Transform student from array to object
      const transformedData = data.map(item => ({
        ...item,
        student: Array.isArray(item.student) ? item.student[0] : item.student
      }));
      setSubmissions(transformedData);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assignment? This cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (!error) {
      router.push('/teacher/assignments');
    }
  };

  const handleTogglePublish = async () => {
    if (!assignment) return;

    const { error } = await supabase
      .from('assignments')
      .update({ is_published: !assignment.is_published })
      .eq('id', assignmentId);

    if (!error) {
      setAssignment({ ...assignment, is_published: !assignment.is_published });
    }
  };

  const handleConvertToSubject = async (subject: string) => {
    setConvertingTo(subject);
    
    try {
      // For now, just show a message - we'll implement full conversion later
      alert(`Converting to ${subject} lesson... This will create a new lesson plan based on this assignment.`);
    } finally {
      setConvertingTo(null);
    }
  };

  if (loading || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const statusCounts = {
    notStarted: submissions.filter(s => s.status === 'not_started').length,
    inProgress: submissions.filter(s => s.status === 'in_progress').length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    graded: submissions.filter(s => s.status === 'graded' || s.status === 'released').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/teacher/assignments"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{assignment.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                assignment.is_published
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
              }`}>
                {assignment.is_published ? '✓ Published' : '📝 Draft'}
              </span>
            </div>
            <p className="text-gray-300">{assignment.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTogglePublish}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-lg transition-all"
            >
              <Eye className="w-4 h-4" />
              {assignment.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <Link
              href={`/teacher/assignments/${assignmentId}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 rounded-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Instructions
              </h2>
              <div className="text-gray-200 whitespace-pre-wrap">
                {assignment.instructions || 'No instructions provided'}
              </div>
            </div>

            {/* Learning Objectives */}
            {assignment.learning_objectives && assignment.learning_objectives.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Learning Objectives
                </h2>
                <ul className="space-y-2">
                  {assignment.learning_objectives.map((obj, idx) => (
                    <li key={idx} className="text-gray-200 flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Differentiation */}
            {((assignment.scaffolding_hints && assignment.scaffolding_hints.length > 0) ||
              (assignment.extension_challenges && assignment.extension_challenges.length > 0)) && (
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Multi-Age Differentiation</h2>
                
                {assignment.scaffolding_hints && assignment.scaffolding_hints.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">💡 Scaffolding Hints</h3>
                    <ul className="space-y-1">
                      {assignment.scaffolding_hints.map((hint, idx) => (
                        <li key={idx} className="text-gray-200 text-sm">{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {assignment.extension_challenges && assignment.extension_challenges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">✨ Extension Challenges</h3>
                    <ul className="space-y-1">
                      {assignment.extension_challenges.map((challenge, idx) => (
                        <li key={idx} className="text-gray-200 text-sm">{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cross-Curricular Conversion */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Cross-Curricular Magic
              </h2>
              <p className="text-gray-200 mb-4">
                Convert this assignment into lessons for other subjects using AI!
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleConvertToSubject('science')}
                  disabled={convertingTo !== null}
                  className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  🧬 Science Lesson
                </button>
                <button
                  onClick={() => handleConvertToSubject('civics')}
                  disabled={convertingTo !== null}
                  className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  🗽 Civics Lesson
                </button>
                <button
                  onClick={() => handleConvertToSubject('math')}
                  disabled={convertingTo !== null}
                  className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  ➗ Math Lesson
                </button>
                <button
                  onClick={() => handleConvertToSubject('ela')}
                  disabled={convertingTo !== null}
                  className="px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 text-yellow-300 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  📚 ELA Lesson
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Meta & Submissions */}
          <div className="space-y-6">
            {/* Assignment Meta */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">Subject</div>
                  <div className="text-white font-medium">{assignment.subject_area}</div>
                </div>
                <div>
                  <div className="text-gray-400">Grade Levels</div>
                  <div className="text-white font-medium">
                    {assignment.min_grade_level} - {assignment.max_grade_level}
                  </div>
                </div>
                {assignment.due_date && (
                  <div>
                    <div className="text-gray-400">Due Date</div>
                    <div className="text-white font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-400">Points Possible</div>
                  <div className="text-white font-medium">{assignment.points_possible}</div>
                </div>
                <div>
                  <div className="text-gray-400">Collaboration</div>
                  <div className="text-white font-medium capitalize">
                    {assignment.collaboration_mode.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Revisions</div>
                  <div className="text-white font-medium">
                    {assignment.allow_revisions ? 'Unlimited ✓' : 'Not allowed'}
                  </div>
                </div>
                {assignment.ai_accuracy_check && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2 text-blue-300">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">AI Accuracy Checking Enabled</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Submissions
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Not Started</span>
                  <span className="text-white font-semibold">{statusCounts.notStarted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">In Progress</span>
                  <span className="text-white font-semibold">{statusCounts.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Submitted</span>
                  <span className="text-yellow-300 font-semibold">{statusCounts.submitted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Graded</span>
                  <span className="text-green-300 font-semibold">{statusCounts.graded}</span>
                </div>
              </div>

              {submissions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <Link
                    href={`/teacher/assignments/${assignmentId}/submissions`}
                    className="block text-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 rounded-lg transition-all"
                  >
                    View All Submissions →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
