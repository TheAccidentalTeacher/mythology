'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject_area: string;
  due_date: string | null;
  points_possible: number;
  submission: {
    id: string;
    status: string;
    submitted_at: string | null;
    points_earned: number | null;
    grade_released: boolean;
  } | null;
}

interface Child {
  id: string;
  full_name: string;
  grade_level: number;
}

export default function ParentChildAssignmentsPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const childId = params?.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  useEffect(() => {
    loadData();
  }, [childId]);

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
        .select('id, full_name, grade_level, classroom_id')
        .eq('id', childId)
        .single();

      if (!childData) {
        router.push('/parent/dashboard');
        return;
      }

      setChild(childData);

      // Get all published assignments in the classroom
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('id, title, subject_area, due_date, points_possible')
        .eq('classroom_id', childData.classroom_id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!assignmentsData) {
        setLoading(false);
        return;
      }

      // Get child's submissions
      const { data: submissionsData } = await supabase
        .from('assignment_submissions')
        .select('id, assignment_id, status, submitted_at, points_earned, grade_released')
        .eq('student_id', childId);

      // Combine assignments with submissions
      const assignmentsWithSubmissions = assignmentsData.map(assignment => ({
        ...assignment,
        submission: submissionsData?.find(s => s.assignment_id === assignment.id) || null
      }));

      setAssignments(assignmentsWithSubmissions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  if (loading || !child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !a.submission || a.submission.status === 'in_progress';
    if (filter === 'submitted') return a.submission?.status === 'submitted';
    if (filter === 'graded') return a.submission?.grade_released;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/parent/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">{child.full_name}'s Assignments</h1>
          <p className="text-purple-200">Grade {child.grade_level}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: assignments.length },
            { key: 'pending', label: 'To Do', count: assignments.filter(a => !a.submission || a.submission.status === 'in_progress').length },
            { key: 'submitted', label: 'Submitted', count: assignments.filter(a => a.submission?.status === 'submitted').length },
            { key: 'graded', label: 'Graded', count: assignments.filter(a => a.submission?.grade_released).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center">
            <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Assignments</h2>
            <p className="text-gray-300">
              No assignments match this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
              const needsAttention = !assignment.submission || assignment.submission.status === 'in_progress';
              
              return (
                <Link
                  key={assignment.id}
                  href={`/parent/children/${childId}/assignments/${assignment.id}`}
                  className="block bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {assignment.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm font-medium rounded-full">
                          {assignment.subject_area}
                        </span>
                        
                        {assignment.due_date && (
                          <div className={`flex items-center gap-1 text-sm ${
                            isOverdue ? 'text-red-300' : 'text-white/80'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>Due {new Date(assignment.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-white/80 text-sm">
                          <span>{assignment.points_possible} points</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {!assignment.submission ? (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Not started</span>
                          </div>
                        ) : assignment.submission.status === 'in_progress' ? (
                          <div className="flex items-center gap-2 text-yellow-300">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">In progress</span>
                          </div>
                        ) : assignment.submission.status === 'submitted' ? (
                          <div className="flex items-center gap-2 text-blue-300">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">
                              Submitted {new Date(assignment.submission.submitted_at!).toLocaleDateString()}
                            </span>
                          </div>
                        ) : assignment.submission.grade_released ? (
                          <div className="flex items-center gap-2 text-green-300">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">
                              Graded: {assignment.submission.points_earned}/{assignment.points_possible}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* View Arrow */}
                    <div className="text-purple-300 text-sm font-medium">
                      View →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
