'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { LevelProgress } from '@/components/LevelProgress';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Leaderboard } from '@/components/Leaderboard';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ACTION_DESCRIPTIONS } from '@/lib/gamification';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  total_points?: number;
  points?: number;
  current_level?: number;
  login_streak?: number;
  classroom_id?: string;
  [key: string]: unknown;
}

interface Activity {
  id: string;
  action_type: string;
  points_earned: number;
  created_at: string;
  points?: number;
  description?: string;
  [key: string]: unknown;
}

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'history'>('overview');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = useCallback(async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      setUser(currentUser);

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      setProfile(profileData);

      // Record login for streak
      await fetch('/api/gamification/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      // Get recent activity
      const { data: activity } = await supabase
        .from('points_log')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your achievements.</p>
          <Link href="/login" className="text-indigo-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/student/dashboard" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">🏆 Achievements & Progress</h1>
          <p className="text-white/80">Track your mythology mastery journey</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'badges', label: 'Badges', icon: '🏅' },
              { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
              { id: 'history', label: 'History', icon: '📜' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Level & Streak */}
            <div className="lg:col-span-2 space-y-6">
              <LevelProgress userId={user.id} />
              <StreakDisplay userId={user.id} />
              
              {/* Recent badges */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold mb-4">🏅 Recent Badges</h3>
                <BadgeDisplay userId={user.id} compact limit={8} />
                <button
                  onClick={() => setActiveTab('badges')}
                  className="mt-4 text-sm text-indigo-600 hover:underline"
                >
                  View all badges →
                </button>
              </div>
            </div>

            {/* Right column - Mini leaderboard */}
            <div className="space-y-6">
              <Leaderboard
                currentUserId={user.id}
                classroomId={profile?.classroom_id}
                compact
              />
              
              {/* Quick stats */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-bold mb-4">📈 Quick Stats</h3>
                <div className="space-y-3">
                  <StatRow label="Total Points" value={profile?.total_points || profile?.points || 0} icon="⭐" />
                  <StatRow label="Current Level" value={profile?.current_level || 1} icon="📊" />
                  <StatRow label="Login Streak" value={profile?.login_streak || 0} suffix="days" icon="🔥" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <BadgeDisplay userId={user.id} showAll />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentUserId={user.id}
            classroomId={profile?.classroom_id}
            limit={20}
          />
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">📜 Points History</h2>
            </div>
            <div className="divide-y">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-4xl mb-2">📝</p>
                  <p>No activity yet. Start creating to earn points!</p>
                </div>
              ) : (
                recentActivity.map(activity => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {ACTION_DESCRIPTIONS[activity.action_type] || activity.action_type}
                        </div>
                        {activity.description && (
                          <div className="text-sm text-gray-500">{String(activity.description)}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className={`font-bold ${(activity.points ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(activity.points ?? 0) >= 0 ? '+' : ''}{activity.points ?? 0}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{icon} {label}</span>
      <span className="font-bold">
        {value.toLocaleString()}{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  );
}
