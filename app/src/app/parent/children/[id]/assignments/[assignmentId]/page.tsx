'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, TrendingUp, Lightbulb, MessageSquare, Send } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  subject_area: string;
  due_date: string | null;
  points_possible: number;
}

interface Submission {
  id: string;
  status: string;
  submitted_at: string | null;
  submission_content: string;
  points_earned: number | null;
  grade_released: boolean;
  revision_number: number;
  narrative_feedback: string | null;
  strength_comments: string[];
  growth_comments: string[];
  next_steps: string[];
  parent_feedback: string | null;
}

interface Child {
  id: string;
  full_name: string;
}

export default function ParentAssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const childId = params?.id as string;
  const assignmentId = params?.assignmentId as string;

  const [child, setChild] = useState<Child | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentFeedback, setParentFeedback] = useState('');
  const [savingFeedback, setSavingFeedback] = useState(false);

  useEffect(() => {
    loadData();
  }, [childId, assignmentId]);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get child info
      const { data: childData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', childId)
        .single();

      if (!childData) {
        router.push('/parent/dashboard');
        return;
      }

      setChild(childData);

      // Get assignment
      const { data: assignmentData } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (!assignmentData) {
        router.push(`/parent/children/${childId}`);
        return;
      }

      setAssignment(assignmentData);

      // Get submission
      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', childId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .single();

      if (submissionData) {
        setSubmission(submissionData);
        setParentFeedback(submissionData.parent_feedback || '');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  async function handleSaveFeedback() {
    if (!submission) return;

    setSavingFeedback(true);
    try {
      const { error } = await supabase
        .from('assignment_submissions')
        .update({ parent_feedback: parentFeedback })
        .eq('id', submission.id);

      if (error) throw error;

      alert('Your feedback has been saved! Your child will see it when they view their assignment.');
      await loadData();
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setSavingFeedback(false);
    }
  }

  if (loading || !child || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const hasSubmission = submission && submission.status !== 'not_started';
  const hasGrade = submission?.grade_released;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/parent/children/${childId}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {child.full_name}'s Assignments
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">{assignment.title}</h1>
          <p className="text-purple-200">{child.full_name}'s Work</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Assignment & Student Work */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Assignment</h2>
              {assignment.description && (
                <p className="text-gray-200 mb-4">{assignment.description}</p>
              )}
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300">
                  {assignment.instructions}
                </div>
              </div>
            </div>

            {/* Student's Work */}
            {hasSubmission ? (
              <>
                <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
                  <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                    {child.full_name}'s Work
                  </h2>
                  {submission.revision_number > 1 && (
                    <div className="mb-4 text-sm text-blue-200">
                      Revision #{submission.revision_number}
                    </div>
                  )}
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {submission.submission_content || 'No content submitted yet.'}
                    </p>
                  </div>
                </div>

                {/* Teacher Feedback (if graded) */}
                {hasGrade && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Teacher's Feedback</h2>
                    
                    {/* Score */}
                    {submission.points_earned !== null && (
                      <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                        <div className="text-green-400 font-semibold text-3xl">
                          {submission.points_earned}/{assignment.points_possible}
                        </div>
                        <div className="text-green-300 text-sm">Points Earned</div>
                      </div>
                    )}

                    {/* Strengths */}
                    {submission.strength_comments && submission.strength_comments.length > 0 && (
                      <div className="bg-green-500/10 backdrop-blur-lg rounded-xl border border-green-400/30 p-6">
                        <h3 className="text-xl font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5" />
                          What They Did Well
                        </h3>
                        <ul className="space-y-2">
                          {submission.strength_comments.map((comment, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>{comment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Growth Areas */}
                    {submission.growth_comments && submission.growth_comments.length > 0 && (
                      <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
                        <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Room to Grow
                        </h3>
                        <ul className="space-y-2">
                          {submission.growth_comments.map((comment, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="text-blue-400 mt-1">→</span>
                              <span>{comment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps */}
                    {submission.next_steps && submission.next_steps.length > 0 && (
                      <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
                        <h3 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Next Steps
                        </h3>
                        <ul className="space-y-2">
                          {submission.next_steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="text-purple-400 mt-1">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Overall Comment */}
                    {submission.narrative_feedback && (
                      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">Teacher's Comments</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{submission.narrative_feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center">
                <p className="text-gray-300">
                  {child.full_name} hasn't submitted this assignment yet.
                </p>
              </div>
            )}

            {/* Parent Feedback Section */}
            {hasSubmission && (
              <div className="bg-pink-500/10 backdrop-blur-lg rounded-xl border border-pink-400/30 p-6">
                <h2 className="text-2xl font-semibold text-pink-300 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Your Feedback
                </h2>
                <p className="text-gray-300 mb-4 text-sm">
                  Add your thoughts and encouragement! Your child will see this feedback.
                </p>
                
                <textarea
                  value={parentFeedback}
                  onChange={(e) => setParentFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Share what you think about their work, ask questions, or offer encouragement..."
                />

                <button
                  onClick={handleSaveFeedback}
                  disabled={savingFeedback}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {savingFeedback ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4">Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subject:</span>
                  <span className="text-white font-medium">{assignment.subject_area}</span>
                </div>
                {assignment.due_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Due:</span>
                    <span className="text-white font-medium">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="text-white font-medium">{assignment.points_possible}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="text-white font-medium">
                    {hasSubmission ? 'Yes' : 'Not yet'}
                  </span>
                </div>
                {submission?.submitted_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">When:</span>
                    <span className="text-white font-medium">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Graded:</span>
                  <span className="text-white font-medium">
                    {hasGrade ? 'Yes' : 'Not yet'}
                  </span>
                </div>
                {submission && submission.revision_number > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revision:</span>
                    <span className="text-white font-medium">
                      #{submission.revision_number}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                💜 Feedback Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Celebrate their creativity and effort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Ask questions about their choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Share what surprised or impressed you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Encourage them to keep learning!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
