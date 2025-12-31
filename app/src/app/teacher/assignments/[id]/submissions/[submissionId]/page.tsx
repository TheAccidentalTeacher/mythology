import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Save } from 'lucide-react';
import NarrativeFeedbackBuilder from '@/components/NarrativeFeedbackBuilder';

export default async function SubmissionGradingPage({ 
  params 
}: { 
  params: { id: string; submissionId: string } 
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get assignment details
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!assignment) {
    redirect('/teacher/assignments');
  }

  // Get submission with student info
  const { data: submission } = await supabase
    .from('assignment_submissions')
    .select(`
      *,
      profiles!assignment_submissions_student_id_fkey (
        id,
        full_name,
        role
      )
    `)
    .eq('id', params.submissionId)
    .single();

  if (!submission) {
    redirect(`/teacher/assignments/${params.id}/submissions`);
  }

  // Get submission history (previous revisions)
  const { data: history } = await supabase
    .from('submission_history')
    .select('*')
    .eq('submission_id', params.submissionId)
    .order('created_at', { ascending: false });

  const student = Array.isArray(submission.profiles) 
    ? submission.profiles[0] 
    : submission.profiles;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" />
            Needs Review
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" />
            Reviewed
          </span>
        );
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" />
            Graded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/teacher/assignments/${params.id}/submissions`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Submissions
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{assignment.title}</h1>
              <p className="text-slate-600 mt-1">
                Reviewing submission from <span className="font-medium">{student?.full_name}</span>
              </p>
            </div>
            {getStatusBadge(submission.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Student Work */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Content */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Student Work</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  Submitted {formatDate(submission.submitted_at)}
                </div>
              </div>

              {submission.submission_content && (
                <div className="prose max-w-none">
                  <div 
                    className="text-slate-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: submission.submission_content }}
                  />
                </div>
              )}

              {submission.submission_url && (
                <div className="mt-4">
                  <a
                    href={submission.submission_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    View External Submission →
                  </a>
                </div>
              )}
            </div>

            {/* AI Accuracy Check Results (if enabled and available) */}
            {assignment.ai_accuracy_check && submission.ai_accuracy_result && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">AI Accuracy Check</h2>
                
                <div className="space-y-4">
                  {submission.ai_accuracy_result.errors && submission.ai_accuracy_result.errors.length > 0 && (
                    <div>
                      <h3 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Factual Errors Found
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {submission.ai_accuracy_result.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.ai_accuracy_result.questionable && submission.ai_accuracy_result.questionable.length > 0 && (
                    <div>
                      <h3 className="font-medium text-yellow-700 mb-2">Questionable Claims</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {submission.ai_accuracy_result.questionable.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.ai_accuracy_result.correct_facts && submission.ai_accuracy_result.correct_facts.length > 0 && (
                    <div>
                      <h3 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Accurate Information
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {submission.ai_accuracy_result.correct_facts.map((fact: string, index: number) => (
                          <li key={index}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Revision History */}
            {history && history.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Revision History</h2>
                <div className="space-y-3">
                  {history.map((revision, index) => (
                    <div key={revision.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          Revision {revision.revision_number}
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatDate(revision.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {revision.content_snapshot?.substring(0, 200)}
                        {revision.content_snapshot && revision.content_snapshot.length > 200 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Grading & Feedback */}
          <div className="space-y-6">
            {/* Submission Meta */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Submission Details</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-600">Student:</span>
                  <div className="font-medium text-slate-900">{student?.full_name}</div>
                </div>

                <div>
                  <span className="text-slate-600">Submitted:</span>
                  <div className="font-medium text-slate-900">{formatDate(submission.submitted_at)}</div>
                </div>

                <div>
                  <span className="text-slate-600">Revision Number:</span>
                  <div className="font-medium text-slate-900">{submission.revision_number}</div>
                </div>

                <div>
                  <span className="text-slate-600">Points Possible:</span>
                  <div className="font-medium text-slate-900">{assignment.points_possible}</div>
                </div>

                {submission.ai_assistance_used && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      AI Assistance Used
                    </span>
                  </div>
                )}

                {submission.grade_released && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Grade Released
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Narrative Feedback Form */}
            <NarrativeFeedbackBuilder
              submissionId={params.submissionId}
              assignmentId={params.id}
              pointsPossible={assignment.points_possible}
              existingFeedback={{
                strengthComments: submission.strength_comments || [],
                growthComments: submission.growth_comments || [],
                nextSteps: submission.next_steps || [],
                overallComment: submission.narrative_feedback || '',
                pointsEarned: submission.points_earned || 0
              }}
              gradeReleased={submission.grade_released}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
