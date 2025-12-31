'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

interface Child {
  id: string;
  full_name: string;
  grade_level: number;
  avatar_url: string | null;
  submission_stats: {
    total: number;
    submitted: number;
    graded: number;
    average_score: number;
  };
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [classroomName, setClassroomName] = useState('');

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

      // Get parent's classroom
      const { data: parentProfile } = await supabase
        .from('profiles')
        .select('classroom_id, classrooms(name)')
        .eq('id', user.id)
        .single();

      if (!parentProfile?.classroom_id) {
        alert('You are not enrolled in a classroom yet.');
        return;
      }

      // @ts-ignore
      setClassroomName(parentProfile.classrooms?.name || 'Classroom');

      // Get all students (children) in the same classroom
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, full_name, grade_level, avatar_url')
        .eq('classroom_id', parentProfile.classroom_id)
        .eq('role', 'student')
        .order('full_name');

      if (!studentsData) {
        setLoading(false);
        return;
      }

      // Get submission stats for each child
      const childrenWithStats = await Promise.all(
        studentsData.map(async (student) => {
          const { data: submissions } = await supabase
            .from('assignment_submissions')
            .select('status, points_earned, assignment_id')
            .eq('student_id', student.id);

          const total = submissions?.length || 0;
          const submitted = submissions?.filter(s => 
            s.status === 'submitted' || s.status === 'graded'
          ).length || 0;
          const graded = submissions?.filter(s => s.status === 'graded').length || 0;
          
          const scores = submissions?.filter(s => s.points_earned !== null)
            .map(s => s.points_earned) || [];
          const average_score = scores.length > 0 
            ? scores.reduce((a, b) => a + b, 0) / scores.length 
            : 0;

          return {
            ...student,
            submission_stats: {
              total,
              submitted,
              graded,
              average_score: Math.round(average_score)
            }
          };
        })
      );

      setChildren(childrenWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Parent Dashboard</h1>
          <p className="text-purple-200">{classroomName}</p>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center">
            <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Students Found</h2>
            <p className="text-gray-300">
              There are no students in your classroom yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/parent/children/${child.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all group"
              >
                {/* Child Info */}
                <div className="flex items-center gap-4 mb-6">
                  {child.avatar_url ? (
                    <img
                      src={child.avatar_url}
                      alt={child.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-400"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-400">
                      <span className="text-2xl font-bold text-white">
                        {child.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-200">
                      {child.full_name}
                    </h3>
                    <p className="text-purple-200 text-sm">Grade {child.grade_level}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Assignments</span>
                    </div>
                    <span className="text-white font-semibold">
                      {child.submission_stats.submitted}/{child.submission_stats.total}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Graded</span>
                    </div>
                    <span className="text-white font-semibold">
                      {child.submission_stats.graded}
                    </span>
                  </div>

                  {child.submission_stats.average_score > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">Avg Score</span>
                      </div>
                      <span className="text-white font-semibold">
                        {child.submission_stats.average_score}%
                      </span>
                    </div>
                  )}
                </div>

                {/* View Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-purple-300 text-sm font-medium group-hover:text-purple-200">
                    View Assignments →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="mt-8 bg-purple-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            👨‍👩‍👧‍👦 Parent Features
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>View your children's assignments and submissions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Add collaborative feedback to support their learning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Track progress and growth over time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Celebrate their creativity and effort!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
