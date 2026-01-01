'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Database } from '@/types/database.types';
import StandardsBadge from '@/components/StandardsBadge';
import DeleteMythologyModal from '@/components/DeleteMythologyModal';
import { SoundToggle } from '@/components/SoundSettings';

type Mythology = Database['public']['Tables']['mythologies']['Row'];

export default function StudentDashboard() {
  const [mythologies, setMythologies] = useState<Mythology[]>([]);
  const [profile, setProfile] = useState<{ display_name?: string; role?: string; level?: number; points?: number; current_streak?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mythologyId: string; mythologyName: string }>({
    isOpen: false,
    mythologyId: '',
    mythologyName: '',
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      console.log('📥 Student Dashboard - Starting data fetch...');
      const supabaseClient = createClient();
    
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log('👤 Current user:', user?.id);
    
    if (userError) {
      console.error('❌ User error:', userError);
      router.push('/login');
      return;
    }
    
    if (!user) {
      console.error('❌ No user found, redirecting to login');
      router.push('/login');
      return;
    }

    // Fetch profile
    console.log('🔍 Fetching profile for user:', user.id);
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile error:', profileError);
    } else {
      console.log('✅ Profile loaded:', profileData?.display_name, 'Level:', profileData?.level, 'Points:', profileData?.points);
    }

    setProfile(profileData);

    // Fetch user's mythologies
    console.log('🔍 Fetching mythologies for user:', user.id);
    const { data: mythsData, error: mythsError } = await supabaseClient
      .from('mythologies')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (mythsError) {
      console.error('❌ Mythologies error:', mythsError);
    } else {
      console.log(`✅ Loaded ${mythsData?.length || 0} mythologies`);
      // Log each mythology ID to check for duplicates
      mythsData?.forEach((myth, index) => {
        console.log(`  ${index + 1}. ${myth.name} (ID: ${myth.id})`);
      });
    }

    setMythologies(mythsData || []);
    setLoading(false);
    console.log('✅ Dashboard data fetch complete');
    };
    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">The Mythology Codex</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{profile?.display_name}</p>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <span>⭐ Level {profile?.level}</span>
                  <span>🏆 {profile?.points} pts</span>
                  <span>🔥 {profile?.current_streak} day streak</span>
                </div>
              </div>
              <SoundToggle />
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-2">🏛️</div>
            <div className="text-2xl font-bold text-white">{mythologies.length}</div>
            <div className="text-gray-300 text-sm">Mythologies</div>
          </div>
          <div 
            onClick={() => router.push('/student/achievements')}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer hover:border-amber-400 transition-all"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">{profile?.points}</div>
            <div className="text-gray-300 text-sm">Total Points</div>
          </div>
          <div 
            onClick={() => router.push('/student/achievements?tab=streak')}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer hover:border-orange-400 transition-all"
          >
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-white">{profile?.current_streak}</div>
            <div className="text-gray-300 text-sm">Day Streak</div>
          </div>
          <div 
            onClick={() => router.push('/student/achievements?tab=badges')}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer hover:border-purple-400 transition-all"
          >
            <div className="text-3xl mb-2">🎖️</div>
            <div className="text-2xl font-bold text-white">Level {profile?.level}</div>
            <div className="text-gray-300 text-sm">Current Level</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => router.push('/student/mythology/create')}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            + Create New Mythology
          </button>
          <button
            onClick={() => router.push('/student/assignments')}
            className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            📚 My Assignments
          </button>
          <button
            onClick={() => router.push('/gallery')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all"
          >
            Browse Gallery
          </button>
          <button
            onClick={() => router.push('/student/achievements')}
            className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            🏆 Achievements & Badges
          </button>
          <button
            onClick={() => router.push('/crossover')}
            className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            ⚔️ Crossover Battles
          </button>
        </div>

        {/* Mythologies Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Mythologies</h2>
          
          {mythologies.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No mythologies yet</h3>
              <p className="text-gray-300 mb-6">
                Create your first mythology world to get started!
              </p>
              <button
                onClick={() => router.push('/student/mythology/create')}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Create Your First Mythology
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mythologies.map((myth) => (
                <div
                  key={myth.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all group relative"
                >
                  {/* Delete button - positioned absolutely in top-right corner */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({
                        isOpen: true,
                        mythologyId: myth.id,
                        mythologyName: myth.name,
                      });
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete mythology"
                  >
                    🗑️
                  </button>

                  {/* Clickable card content */}
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/student/mythology/${myth.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3 pr-8">
                      <h3 className="text-xl font-bold text-white">{myth.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        myth.visibility === 'public' ? 'bg-green-500/20 text-green-300' :
                        myth.visibility === 'teacher_only' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {myth.visibility === 'public' ? '👁️ Public' :
                         myth.visibility === 'teacher_only' ? '🔒 Teacher Only' :
                         '✏️ Hidden'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {myth.description || 'No description yet'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {myth.timeframe && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {myth.timeframe}
                        </span>
                      )}
                      {myth.genre && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {myth.genre}
                        </span>
                      )}
                      {myth.geography_type && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                          {myth.geography_type}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Created {new Date(myth.created_at).toLocaleDateString()}</span>
                      <span>👁️ {myth.view_count} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Mythology Modal */}
      <DeleteMythologyModal
        mythologyId={deleteModal.mythologyId}
        mythologyName={deleteModal.mythologyName}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mythologyId: '', mythologyName: '' })}
        onSuccess={async () => {
          console.log('🔄 Refreshing mythologies list after deletion...');
          // Refresh mythologies list after successful deletion
          const supabaseClient = createClient();
          const { data: { user } } = await supabaseClient.auth.getUser();
          if (user) {
            const { data: mythsData } = await supabaseClient
              .from('mythologies')
              .select('*')
              .eq('created_by', user.id)
              .order('created_at', { ascending: false });
            console.log(`✅ Refreshed - now ${mythsData?.length || 0} mythologies`);
            setMythologies(mythsData || []);
          }
          // Close the modal
          setDeleteModal({ isOpen: false, mythologyId: '', mythologyName: '' });
        }}
      />

      {/* Floating Standards Badge */}
      <StandardsBadge 
        activityType="mythology-creation" 
        activityName="Mythology Dashboard"
        position="bottom-right"
      />
    </div>
  );
}
