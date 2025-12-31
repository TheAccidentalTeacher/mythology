import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface Submission {
  id: string;
  student_id: string;
  submitted_at: string;
  status: string;
  grade_released: boolean;
  revision_number: number;
  ai_assistance_used: boolean;
  profiles: {
    id: string;
    full_name: string;
    role: string;
  };
}

export default async function AssignmentSubmissionsPage({ params }: { params: { id: string } }) {
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

  // Get all submissions for this assignment
  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select(`
      *,
      profiles!assignment_submissions_student_id_fkey (
        id,
        full_name,
        role
      )
    `)
    .eq('assignment_id', params.id)
    .order('submitted_at', { ascending: false });

  // Get all students in classroom
  const { data: allStudents } = await supabase
    .from('classroom_students')
    .select(`
      student_id,
      profiles!classroom_students_student_id_fkey (
        id,
        full_name
      )
    `)
    .eq('classroom_id', assignment.classroom_id);

  // Find students who haven't submitted
  const submittedStudentIds = new Set(submissions?.map(s => s.student_id) || []);
  const notSubmitted = allStudents?.filter(s => !submittedStudentIds.has(s.student_id)) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Needs Review
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            <Eye className="w-3 h-3" />
            Reviewed
          </span>
        );
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Graded
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const submittedCount = submissions?.length || 0;
  const totalStudents = allStudents?.length || 0;
  const gradedCount = submissions?.filter(s => s.status === 'graded').length || 0;
  const needsReviewCount = submissions?.filter(s => s.status === 'submitted').length || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/teacher/assignments/${params.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignment
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900">{assignment.title}</h1>
          <p className="text-slate-600 mt-1">Review and grade student submissions</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{submittedCount}/{totalStudents}</div>
                <div className="text-sm text-slate-600">Submitted</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{needsReviewCount}</div>
                <div className="text-sm text-slate-600">Needs Review</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{gradedCount}</div>
                <div className="text-sm text-slate-600">Graded</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{notSubmitted.length}</div>
                <div className="text-sm text-slate-600">Not Submitted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Submissions</h2>
          </div>

          {submissions && submissions.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {submissions.map((submission) => {
                const student = Array.isArray(submission.profiles) 
                  ? submission.profiles[0] 
                  : submission.profiles;
                
                return (
                  <Link
                    key={submission.id}
                    href={`/teacher/assignments/${params.id}/submissions/${submission.id}`}
                    className="block p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {student?.full_name || 'Unknown Student'}
                          </h3>
                          {getStatusBadge(submission.status)}
                          {submission.ai_assistance_used && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              AI Assisted
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Submitted {formatDate(submission.submitted_at)}</span>
                          <span>•</span>
                          <span>Revision {submission.revision_number}</span>
                          {submission.grade_released && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">Grade Released</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Eye className="w-5 h-5 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Submissions Yet</h3>
              <p className="text-slate-600">
                Students haven't submitted their work yet. Check back later!
              </p>
            </div>
          )}
        </div>

        {/* Not Submitted List */}
        {notSubmitted.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 mt-6">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Not Yet Submitted</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {notSubmitted.map((student) => {
                  const profile = Array.isArray(student.profiles)
                    ? student.profiles[0]
                    : student.profiles;
                  
                  return (
                    <div
                      key={student.student_id}
                      className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700"
                    >
                      {profile?.full_name || 'Unknown Student'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
