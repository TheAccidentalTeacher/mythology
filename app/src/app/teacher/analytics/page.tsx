'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Users, BookOpen, CheckCircle, TrendingUp, Award, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  totalAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  averageScore: number;
  completionRate: number;
  revisionRate: number;
  studentsWithWork: number;
  totalStudents: number;
  recentActivity: {
    studentName: string;
    assignmentTitle: string;
    status: string;
    submittedAt: string;
  }[];
}

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [classroomName, setClassroomName] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get teacher's classroom
      const { data: classroomData } = await supabase
        .from('classrooms')
        .select('id, name')
        .eq('teacher_id', user.id)
        .single();

      if (!classroomData) {
        router.push('/teacher/dashboard');
        return;
      }

      setClassroomName(classroomData.name);

      // Get total assignments
      const { data: assignments } = await supabase
        .from('assignments')
        .select('id')
        .eq('classroom_id', classroomData.id);

      const totalAssignments = assignments?.length || 0;

      // Get all submissions
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('id, status, points_earned, revision_number, student_id, assignment_id, submitted_at, assignments(title, points_possible), profiles(full_name)')
        .in('assignment_id', assignments?.map(a => a.id) || []);

      const totalSubmissions = submissions?.length || 0;
      const gradedSubmissions = submissions?.filter(s => s.status === 'graded').length || 0;

      // Calculate average score
      const scoredSubmissions = submissions?.filter(s => 
        s.points_earned !== null && s.points_earned !== undefined
      ) || [];
      
      let averageScore = 0;
      if (scoredSubmissions.length > 0) {
        const totalPoints = scoredSubmissions.reduce((sum, s) => {
          // @ts-ignore
          const possible = s.assignments?.points_possible || 100;
          const earned = s.points_earned || 0;
          return sum + (earned / possible) * 100;
        }, 0);
        averageScore = Math.round(totalPoints / scoredSubmissions.length);
      }

      // Calculate completion rate
      const submittedCount = submissions?.filter(s => 
        s.status === 'submitted' || s.status === 'graded'
      ).length || 0;
      const completionRate = totalAssignments > 0 
        ? Math.round((submittedCount / (totalAssignments * (submissions?.length || 1))) * 100)
        : 0;

      // Calculate revision rate
      const revisionsCount = submissions?.filter(s => s.revision_number > 1).length || 0;
      const revisionRate = totalSubmissions > 0 
        ? Math.round((revisionsCount / totalSubmissions) * 100)
        : 0;

      // Get unique students
      const uniqueStudents = new Set(submissions?.map(s => s.student_id));
      const studentsWithWork = uniqueStudents.size;

      // Get total students in classroom
      const { data: students } = await supabase
        .from('profiles')
        .select('id')
        .eq('classroom_id', classroomData.id)
        .eq('role', 'student');

      const totalStudents = students?.length || 0;

      // Get recent activity
      const recentSubmissions = submissions
        ?.filter(s => s.submitted_at)
        .sort((a, b) => new Date(b.submitted_at!).getTime() - new Date(a.submitted_at!).getTime())
        .slice(0, 10);

      const recentActivity = recentSubmissions?.map(s => ({
        // @ts-ignore
        studentName: s.profiles?.full_name || 'Unknown',
        // @ts-ignore
        assignmentTitle: s.assignments?.title || 'Unknown Assignment',
        status: s.status,
        submittedAt: s.submitted_at!
      })) || [];

      setAnalytics({
        totalAssignments,
        totalSubmissions,
        gradedSubmissions,
        averageScore,
        completionRate,
        revisionRate,
        studentsWithWork,
        totalStudents,
        recentActivity
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'graded') return 'text-green-300';
    if (status === 'submitted') return 'text-blue-300';
    if (status === 'in_progress') return 'text-yellow-300';
    return 'text-gray-400';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'graded') return 'Graded';
    if (status === 'submitted') return 'Submitted';
    if (status === 'in_progress') return 'In Progress';
    return status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-purple-200">{classroomName} - Assignment Insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 border border-blue-400/30 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <h3 className="text-3xl font-bold text-white">{analytics.totalAssignments}</h3>
            </div>
            <p className="text-blue-300">Total Assignments</p>
          </div>

          <div className="bg-green-500/20 border border-green-400/30 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h3 className="text-3xl font-bold text-white">{analytics.completionRate}%</h3>
            </div>
            <p className="text-green-300">Completion Rate</p>
          </div>

          <div className="bg-purple-500/20 border border-purple-400/30 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-purple-400" />
              <h3 className="text-3xl font-bold text-white">{analytics.averageScore}%</h3>
            </div>
            <p className="text-purple-300">Average Score</p>
          </div>

          <div className="bg-pink-500/20 border border-pink-400/30 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="w-8 h-8 text-pink-400" />
              <h3 className="text-3xl font-bold text-white">{analytics.revisionRate}%</h3>
            </div>
            <p className="text-pink-300">Revision Rate</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">
                {analytics.studentsWithWork}/{analytics.totalStudents}
              </h3>
            </div>
            <p className="text-gray-300">Students with Submissions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">{analytics.totalSubmissions}</h3>
            </div>
            <p className="text-gray-300">Total Submissions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">{analytics.gradedSubmissions}</h3>
            </div>
            <p className="text-gray-300">Graded Submissions</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
          
          {analytics.recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{activity.studentName}</h3>
                    <p className="text-gray-400 text-sm">{activity.assignmentTitle}</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(activity.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            💡 Insights
          </h3>
          <ul className="space-y-2 text-gray-300">
            {analytics.revisionRate > 30 && (
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span><strong>Great growth mindset!</strong> {analytics.revisionRate}% of submissions include revisions - students are learning from feedback.</span>
              </li>
            )}
            {analytics.completionRate < 50 && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <span><strong>Low completion rate.</strong> Consider checking in with students who haven't submitted work.</span>
              </li>
            )}
            {analytics.averageScore >= 85 && (
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">⭐</span>
                <span><strong>Excellent work!</strong> Average score of {analytics.averageScore}% shows strong understanding across the classroom.</span>
              </li>
            )}
            {analytics.gradedSubmissions < analytics.totalSubmissions && (
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">📝</span>
                <span><strong>Pending grading:</strong> {analytics.totalSubmissions - analytics.gradedSubmissions} submission(s) waiting for feedback.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
