'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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

export default function TeacherDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

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

      // Get classroom
      if (profileData?.classroom_id) {
        console.log('🏫 Looking for classroom:', profileData.classroom_id);
        const { data: classroomData, error: classroomError } = await supabase
          .from('classrooms')
          .select('*')
          .eq('id', profileData.classroom_id)
          .single();

        console.log('🏫 Classroom data:', classroomData);
        console.log('❌ Classroom error:', classroomError);

        setClassroom(classroomData);
      } else {
        console.log('⚠️ No classroom_id in profile');
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
            <h2 className="text-2xl font-bold text-white mb-4">Your Classroom</h2>
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
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Mythologies</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Pending Reviews</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Flagged Content</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🚧 More Coming Soon 🚧</h2>
          <p className="text-gray-300 text-lg mb-6">
            The teacher dashboard is still being expanded! More features coming:
          </p>
          <ul className="text-gray-300 text-left max-w-2xl mx-auto space-y-2">
            <li>✓ View and manage your students</li>
            <li>✓ Review student mythologies</li>
            <li>✓ Moderate flagged content</li>
            <li>✓ View class analytics</li>
            <li>✓ Impersonate students to see their view</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
