'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Target, BookOpen, AlertTriangle, CheckCircle, ThumbsUp, TrendingUp, Lightbulb, Send, Save, Sparkles } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  subject_area: string;
  due_date: string | null;
  points_possible: number;
  min_grade_level: number;
  max_grade_level: number;
  scaffolding_hints: string[];
  extension_challenges: string[];
  learning_objectives: string[];
  allow_revisions: boolean;
  ai_accuracy_check: boolean;
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
  ai_accuracy_result: any;
}

export default function StudentAssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const assignmentId = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workContent, setWorkContent] = useState('');
  const [selectedMythology, setSelectedMythology] = useState('');
  const [mythologies, setMythologies] = useState<any[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [gettingAIFeedback, setGettingAIFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load assignment
      const { data: assignmentData } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (!assignmentData) {
        router.push('/student/assignments');
        return;
      }

      setAssignment(assignmentData);

      // Load student's submission if exists
      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', user.id)
        .order('revision_number', { ascending: false })
        .limit(1)
        .single();

      if (submissionData) {
        setSubmission(submissionData);
        setWorkContent(submissionData.submission_content || '');
      }

      // Load student's mythologies for submission
      const { data: mythologiesData } = await supabase
        .from('mythologies')
        .select('id, title, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setMythologies(mythologiesData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!workContent.trim()) {
      alert('Please write something before saving!');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const submissionData = {
        assignment_id: assignmentId,
        student_id: user.id,
        submission_content: workContent,
        mythology_id: selectedMythology || null,
        status: 'in_progress',
        revision_number: submission ? submission.revision_number : 1
      };

      if (submission) {
        // Update existing
        const { error } = await supabase
          .from('assignment_submissions')
          .update(submissionData)
          .eq('id', submission.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('assignment_submissions')
          .insert([submissionData]);

        if (error) throw error;
      }

      alert('Draft saved!');
      await loadData();
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (!workContent.trim()) {
      alert('Please write something before submitting!');
      return;
    }

    if (!confirm('Are you ready to submit? Your teacher will review your work.')) {
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const submissionData = {
        assignment_id: assignmentId,
        student_id: user.id,
        submission_content: workContent,
        mythology_id: selectedMythology || null,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        revision_number: submission ? submission.revision_number : 1
      };

      if (submission) {
        const { error } = await supabase
          .from('assignment_submissions')
          .update(submissionData)
          .eq('id', submission.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assignment_submissions')
          .insert([submissionData]);

        if (error) throw error;
      }

      alert('Assignment submitted! Your teacher will review it soon.');
      await loadData();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGetAIFeedback() {
    if (!workContent.trim()) {
      alert('Please write something first!');
      return;
    }

    setGettingAIFeedback(true);
    try {
      const response = await fetch('/api/ai/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: workContent })
      });

      if (!response.ok) throw new Error('Failed to get feedback');

      const feedback = await response.json();
      setAiFeedback(feedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      alert('Failed to get AI feedback. Please try again.');
    } finally {
      setGettingAIFeedback(false);
    }
  }

  if (loading || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading assignment...</p>
        </div>
      </div>
    );
  }

  const isSubmitted = submission?.status === 'submitted';
  const hasGrade = submission?.grade_released;
  const canRevise = assignment.allow_revisions && hasGrade;

  async function handleStartRevision() {
    if (!confirm('Ready to submit a revision? Your previous work will be saved in history.')) {
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!submission) return;

      // Save current submission to history
      const { error: historyError } = await supabase
        .from('submission_history')
        .insert([{
          submission_id: submission.id,
          revision_number: submission.revision_number,
          content_snapshot: submission.submission_content,
          submitted_at: submission.submitted_at,
          feedback_at_time: submission.narrative_feedback
        }]);

      if (historyError) throw historyError;

      // Update submission for new revision
      const { error: updateError } = await supabase
        .from('assignment_submissions')
        .update({
          status: 'in_progress',
          revision_number: submission.revision_number + 1,
          grade_released: false,
          submitted_at: null,
          // Keep the old content so student can improve it
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      alert('Revision started! You can now improve your work based on the feedback.');
      await loadData();
    } catch (error) {
      console.error('Error starting revision:', error);
      alert('Failed to start revision. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/assignments"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{assignment.title}</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm font-medium rounded-full">
                  {assignment.subject_area}
                </span>
                {assignment.due_date && (
                  <div className="flex items-center gap-1 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Due {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/80">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">{assignment.points_possible} points</span>
                </div>
              </div>
            </div>

            {hasGrade && submission && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                <div className="text-green-400 font-semibold text-2xl">
                  {submission.points_earned}/{assignment.points_possible}
                </div>
                <div className="text-green-300 text-sm">Points Earned</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description & Instructions */}
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

            {/* Learning Objectives */}
            {assignment.learning_objectives && assignment.learning_objectives.length > 0 && (
              <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  What You'll Learn
                </h3>
                <ul className="space-y-2">
                  {assignment.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Your Work */}
            {!hasGrade && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Work</h2>
                
                {/* Mythology Selector */}
                {mythologies.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-white font-medium mb-2">
                      Connect to Your Mythology (Optional)
                    </label>
                    <select
                      value={selectedMythology}
                      onChange={(e) => setSelectedMythology(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitted}
                    >
                      <option value="">None</option>
                      {mythologies.map(myth => (
                        <option key={myth.id} value={myth.id}>
                          {myth.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <textarea
                  value={workContent}
                  onChange={(e) => setWorkContent(e.target.value)}
                  disabled={isSubmitted}
                  rows={15}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Write your response here..."
                />

                {!isSubmitted && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleGetAIFeedback}
                      disabled={gettingAIFeedback || !workContent.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 rounded-lg transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {gettingAIFeedback ? 'Checking...' : 'Get Writing Help'}
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </div>
                )}

                {isSubmitted && !hasGrade && (
                  <div className="mt-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-blue-300">
                    <CheckCircle className="w-5 h-5 inline-block mr-2" />
                    Submitted! Your teacher will review this soon.
                  </div>
                )}
              </div>
            )}

            {/* AI Writing Feedback */}
            {aiFeedback && !isSubmitted && (
              <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-300">AI Writing Help</h3>
                </div>

                {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-green-300 font-semibold mb-2">✨ What's Working Well:</h4>
                    <ul className="space-y-1">
                      {aiFeedback.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-gray-300 text-sm">
                          <span className="text-green-400">•</span> {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-blue-300 font-semibold mb-2">💡 Suggestions to Consider:</h4>
                    <ul className="space-y-2">
                      {aiFeedback.suggestions.map((item: any, index: number) => (
                        <li key={index} className="text-gray-300 text-sm">
                          <div className="font-medium text-blue-300">{item.issue}</div>
                          <div className="text-gray-400 text-xs mt-1">{item.suggestion}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiFeedback.encouragement && (
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                    <p className="text-purple-200 text-sm italic">{aiFeedback.encouragement}</p>
                  </div>
                )}

                <button
                  onClick={() => setAiFeedback(null)}
                  className="mt-4 text-sm text-gray-400 hover:text-gray-300"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Feedback (if graded) */}
            {hasGrade && submission && (
              <div className="space-y-4">
                {/* Strengths */}
                {submission.strength_comments && submission.strength_comments.length > 0 && (
                  <div className="bg-green-500/10 backdrop-blur-lg rounded-xl border border-green-400/30 p-6">
                    <h3 className="text-xl font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      What You Did Well
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

                {/* Revise Button */}
                {canRevise && (
                  <div className="bg-yellow-500/10 backdrop-blur-lg rounded-xl border border-yellow-400/30 p-6">
                    <p className="text-yellow-300 mb-4">
                      Want to improve your work? You can revise and resubmit based on your teacher's feedback!
                    </p>
                    <button
                      onClick={handleStartRevision}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                    >
                      Start a Revision
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Help & Resources */}
          <div className="space-y-6">
            {/* Scaffolding Hints */}
            {assignment.scaffolding_hints && assignment.scaffolding_hints.length > 0 && (
              <div className="bg-green-500/10 backdrop-blur-lg rounded-xl border border-green-400/30 p-6">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="w-full flex items-center justify-between text-green-300 font-semibold mb-3"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Need Help? Click for Hints
                  </span>
                  <span>{showHints ? '▼' : '▶'}</span>
                </button>
                
                {showHints && (
                  <ul className="space-y-2">
                    {assignment.scaffolding_hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-green-400 mt-0.5">💡</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Extension Challenges */}
            {assignment.extension_challenges && assignment.extension_challenges.length > 0 && (
              <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
                <button
                  onClick={() => setShowChallenges(!showChallenges)}
                  className="w-full flex items-center justify-between text-purple-300 font-semibold mb-3"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Want a Challenge?
                  </span>
                  <span>{showChallenges ? '▼' : '▶'}</span>
                </button>
                
                {showChallenges && (
                  <ul className="space-y-2">
                    {assignment.extension_challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-purple-400 mt-0.5">🔥</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4">Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="text-white font-medium">
                    {submission ? 'Yes' : 'Not yet'}
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
          </div>
        </div>
      </div>
    </div>
  );
}
