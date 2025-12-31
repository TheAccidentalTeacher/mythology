'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import InviteStudentsModal from '@/components/InviteStudentsModal';
import TeacherOnboarding from '@/components/TeacherOnboarding';

interface Profile {
  id: string;
  display_name?: string;
  role?: string;
  classroom_id?: string;
  school_name?: string;
  grade_level?: string;
}

interface Classroom {
  id: string;
  name: string;
  join_code?: string;
  invite_code?: string;
}

interface Stats {
  totalStudents: number;
  totalMythologies: number;
  pendingReviews: number;
  flaggedContent: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalMythologies: 0, pendingReviews: 0, flaggedContent: 0 });
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      console.log('👤 User ID:', user.id);

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📋 Profile data:', profileData);
      console.log('❌ Profile error:', profileError);

      setProfile(profileData);

      // Get classroom (teachers own classrooms via teacher_id, not classroom_id)
      const { data: classroomData, error: classroomError } = await supabase
        .from('classrooms')
        .select('*')
        .eq('teacher_id', user.id)
        .single();

      console.log('🏫 Classroom data:', classroomData);
      console.log('❌ Classroom error:', classroomError);

      setClassroom(classroomData);

      // Get stats if classroom exists
      if (classroomData) {
        // Count students
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('classroom_id', classroomData.id)
          .eq('role', 'student');

        // Count mythologies
        const { count: mythCount } = await supabase
          .from('mythologies')
          .select('id', { count: 'exact', head: true })
          .eq('classroom_id', classroomData.id);

        // TODO: Count pending reviews and flagged content when those features are implemented

        setStats({
          totalStudents: studentCount || 0,
          totalMythologies: mythCount || 0,
          pendingReviews: 0,
          flaggedContent: 0
        });
      }

      setLoading(false);
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
            <p className="text-gray-300">Welcome back, {profile?.display_name}!</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Classroom Info Card */}
        {classroom && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Your Classroom</h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold flex items-center gap-2"
              >
                <span>📧</span>
                Invite Students
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Classroom Name</p>
                <p className="text-white text-lg font-semibold">{classroom.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Invite Code</p>
                <p className="text-white text-lg font-mono font-bold">{classroom.invite_code}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">School</p>
                <p className="text-white text-lg">{profile?.school_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Grade Level</p>
                <p className="text-white text-lg">{profile?.grade_level || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Students</p>
            <p className="text-white text-3xl font-bold">{stats.totalStudents}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Mythologies</p>
            <p className="text-white text-3xl font-bold">{stats.totalMythologies}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Pending Reviews</p>
            <p className="text-white text-3xl font-bold">{stats.pendingReviews}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Flagged Content</p>
            <p className="text-white text-3xl font-bold">{stats.flaggedContent}</p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/teacher/assignments"
              className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 border border-green-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">✍️</span>
              <h3 className="text-white font-semibold mb-1">Assignments</h3>
              <p className="text-gray-400 text-sm">Create curiosity-driven learning</p>
            </Link>

            <Link
              href="/teacher/mythologies"
              className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">📚</span>
              <h3 className="text-white font-semibold mb-1">Review Mythologies</h3>
              <p className="text-gray-400 text-sm">Browse and grade student work</p>
            </Link>

            <Link
              href="/teacher/moderation"
              className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">🛡️</span>
              <h3 className="text-white font-semibold mb-1">Content Moderation</h3>
              <p className="text-gray-400 text-sm">Review flagged content & images</p>
            </Link>

            <Link
              href="/teacher/images"
              className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">🎨</span>
              <h3 className="text-white font-semibold mb-1">Image Moderation</h3>
              <p className="text-gray-400 text-sm">Review student-generated images</p>
            </Link>
            
            <Link
              href="/teacher/images/settings"
              className="p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">⚙️</span>
              <h3 className="text-white font-semibold mb-1">Image Settings</h3>
              <p className="text-gray-400 text-sm">Configure image generation rules</p>
            </Link>
            
            <Link
              href="/teacher/students"
              className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/30 rounded-xl transition-all group"
            >
              <span className="text-3xl block mb-2">👥</span>
              <h3 className="text-white font-semibold mb-1">Students</h3>
              <p className="text-gray-400 text-sm">Manage your classroom</p>
            </Link>
          </div>
        </div>

        {/* More Features Coming */}
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl border-2 border-green-400/30 p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🚀</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">
                Revolutionary Features Coming Soon
              </h2>
              <p className="text-gray-200 mb-4">
                We're not just another assignment tracker. We're building something that actually makes learning FUN.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-green-300">
                  <span>✨</span>
                  <span>Curiosity-driven assignments with multi-age differentiation</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <span>🧬</span>
                  <span>Convert mythology → science/civics lessons</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span>📝</span>
                  <span>Narrative feedback system (not just arbitrary grades)</span>
                </div>
                <div className="flex items-center gap-2 text-pink-300">
                  <span>🤖</span>
                  <span>AI accuracy verification for science/history</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-300">
                  <span>🗽</span>
                  <span>Constitutional foundation & American civics integration</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <span>👨‍👩‍👧</span>
                  <span>Parent portal with collaborative feedback</span>
                </div>
              </div>
              <button 
                onClick={() => localStorage.removeItem('hasSeenTeacherOnboarding')}
                className="mt-4 text-sm text-gray-300 hover:text-white underline"
              >
                See the tour again
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Tour */}
      <TeacherOnboarding />

      {/* Invite Modal */}
      {showInviteModal && classroom && (
        <InviteStudentsModal
          inviteCode={classroom.invite_code || ''}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
