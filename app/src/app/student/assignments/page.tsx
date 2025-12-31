'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen, Target } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_area: string;
  due_date: string | null;
  points_possible: number;
  min_grade_level: number;
  max_grade_level: number;
  is_published: boolean;
  created_at: string;
}

interface Submission {
  id: string;
  assignment_id: string;
  status: string;
  submitted_at: string | null;
  points_earned: number | null;
  grade_released: boolean;
  revision_number: number;
}

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'submitted' | 'graded'>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get student's classroom
      const { data: profile } = await supabase
        .from('profiles')
        .select('classroom_id')
        .eq('id', user.id)
        .single();

      if (!profile?.classroom_id) {
        setLoading(false);
        return;
      }

      // Get all published assignments for this classroom
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('*')
        .eq('classroom_id', profile.classroom_id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Get student's submissions
      const { data: submissionsData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('student_id', user.id);

      setAssignments(assignmentsData || []);
      setSubmissions(submissionsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const getStatusInfo = (assignment: Assignment) => {
    const submission = getSubmissionForAssignment(assignment.id);
    
    if (!submission) {
      return {
        status: 'not_started',
        label: 'Not Started',
        icon: AlertCircle,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-400/30'
      };
    }

    if (submission.grade_released) {
      return {
        status: 'graded',
        label: 'Graded',
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-400/30'
      };
    }

    if (submission.status === 'submitted') {
      return {
        status: 'submitted',
        label: 'Submitted',
        icon: Clock,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-400/30'
      };
    }

    return {
      status: 'in_progress',
      label: 'In Progress',
      icon: BookOpen,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    };
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = date < now;
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      formatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isOverdue,
      daysUntil,
      urgent: daysUntil <= 3 && daysUntil >= 0
    };
  };

  const filteredAssignments = assignments.filter(assignment => {
    const statusInfo = getStatusInfo(assignment);
    if (filter === 'all') return true;
    if (filter === 'todo') return statusInfo.status === 'not_started';
    if (filter === 'submitted') return statusInfo.status === 'submitted' || statusInfo.status === 'in_progress';
    if (filter === 'graded') return statusInfo.status === 'graded';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Assignments</h1>
          <p className="text-gray-300">Complete your curiosity-driven learning journey</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'todo'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            To Do ({assignments.filter(a => getStatusInfo(a).status === 'not_started').length})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'submitted'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            In Progress ({assignments.filter(a => ['submitted', 'in_progress'].includes(getStatusInfo(a).status)).length})
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'graded'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Graded ({assignments.filter(a => getStatusInfo(a).status === 'graded').length})
          </button>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Assignments Yet</h3>
            <p className="text-gray-300">
              {filter === 'all' 
                ? "Your teacher hasn't assigned any work yet. Check back soon!"
                : `No ${filter} assignments right now.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map(assignment => {
              const statusInfo = getStatusInfo(assignment);
              const dueInfo = formatDueDate(assignment.due_date);
              const submission = getSubmissionForAssignment(assignment.id);
              const StatusIcon = statusInfo.icon;

              return (
                <Link
                  key={assignment.id}
                  href={`/student/assignments/${assignment.id}`}
                  className="group bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all hover:scale-[1.02]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs font-medium rounded-full">
                          {assignment.subject_area}
                        </span>
                        <span className="text-gray-400 text-xs">
                          Grades {assignment.min_grade_level}-{assignment.max_grade_level}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 ${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-full`}>
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {assignment.description || 'Click to view assignment details'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {dueInfo && (
                        <div className={`flex items-center gap-1 ${dueInfo.isOverdue ? 'text-red-400' : dueInfo.urgent ? 'text-yellow-400' : ''}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{dueInfo.formatted}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{assignment.points_possible} pts</span>
                      </div>
                    </div>

                    {submission?.grade_released && submission.points_earned !== null && (
                      <div className="text-green-400 font-semibold">
                        {submission.points_earned}/{assignment.points_possible}
                      </div>
                    )}
                  </div>

                  {/* Revision indicator */}
                  {submission && submission.revision_number > 1 && (
                    <div className="mt-2 text-xs text-gray-400">
                      Revision {submission.revision_number}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
