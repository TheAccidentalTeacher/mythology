'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, BookOpen, Calendar, Users, Target, ArrowLeft } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  is_published: boolean;
  created_at: string;
  subject_area: string;
  min_grade_level: number | null;
  max_grade_level: number | null;
  _count?: {
    submissions: number;
  };
}

export default function AssignmentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<any>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Get teacher's classroom
    const { data: classroomData } = await supabase
      .from('classrooms')
      .select('*')
      .eq('teacher_id', user.id)
      .single();

    if (!classroomData) {
      router.push('/teacher/dashboard');
      return;
    }

    setClassroom(classroomData);

    // Load assignments
    const { data: assignmentsData } = await supabase
      .from('assignments')
      .select('*')
      .eq('classroom_id', classroomData.id)
      .order('created_at', { ascending: false });

    setAssignments(assignmentsData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/teacher/dashboard"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Assignments</h1>
              <p className="text-gray-300">Create curiosity-driven learning experiences</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/teacher/assignments/templates"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Browse Templates
            </Link>
            <Link
              href="/teacher/assignments/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Assignment
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">✨</div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Revolutionary Assignment System</h3>
              <div className="text-gray-200 space-y-1 text-sm">
                <p>• <strong>Multi-Age Differentiation</strong> - One assignment for ages 8, 10, and 16</p>
                <p>• <strong>Narrative Feedback</strong> - Focus on growth, not arbitrary grades</p>
                <p>• <strong>Unlimited Revisions</strong> - Growth mindset by default</p>
                <p>• <strong>AI Accuracy Check</strong> - Verify facts in science/history assignments</p>
                <p>• <strong>Cross-Curricular Magic</strong> - Connect mythology to all subjects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        {assignments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Assignments Yet</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Create your first assignment to spark curiosity and engage your students. Start with a template or build from scratch.
            </p>
            <Link
              href="/teacher/assignments/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Assignment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/teacher/assignments/${assignment.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all group"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    assignment.is_published
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                  }`}>
                    {assignment.is_published ? '✓ Published' : '📝 Draft'}
                  </span>
                  {assignment.subject_area && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {assignment.subject_area}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {assignment.description || 'No description'}
                </p>

                {/* Meta info */}
                <div className="space-y-2 text-sm text-gray-400">
                  {assignment.due_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {(assignment.min_grade_level || assignment.max_grade_level) && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>
                        Grades {assignment.min_grade_level || '?'}–{assignment.max_grade_level || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{assignment._count?.submissions || 0} submissions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
