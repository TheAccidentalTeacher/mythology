'use client';

import { useState, useEffect } from 'react';
import { calculateLevel, getXpToNextLevel, getLevelTitle } from '@/lib/gamification';

interface LevelProgressProps {
  userId: string;
  showStreak?: boolean;
  compact?: boolean;
}

export function LevelProgress({ userId, showStreak = true, compact = false }: LevelProgressProps) {
  const [data, setData] = useState<{
    totalPoints: number;
    level: number;
    title: string;
    xpProgress: { current: number; needed: number; percentage: number };
    loginStreak: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchData() {
    try {
      const response = await fetch(`/api/gamification/points?userId=${userId}`);
      const result = await response.json();
      
      setData({
        totalPoints: result.totalPoints || 0,
        level: result.level || calculateLevel(result.totalPoints || 0),
        title: result.title || getLevelTitle(result.level || 1),
        xpProgress: result.xpProgress || getXpToNextLevel(result.totalPoints || 0),
        loginStreak: result.loginStreak || 0,
      });
    } catch (error) {
      console.error('Error fetching level data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
          {data.level}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{data.title}</div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-500"
              style={{ width: `${data.xpProgress.percentage}%` }}
            />
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="font-bold">{data.totalPoints.toLocaleString()}</div>
          <div className="text-white/70">points</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      {/* Header with level badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Level Circle */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">{data.level}</span>
              </div>
            </div>
            {/* Star decorations */}
            <div className="absolute -top-1 -right-1 text-yellow-400 text-xl">⭐</div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">{data.title}</h3>
            <p className="text-gray-500">Level {data.level}</p>
          </div>
        </div>

        {/* Streak */}
        {showStreak && data.loginStreak > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-500">
              🔥 {data.loginStreak}
            </div>
            <div className="text-sm text-gray-500">day streak</div>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress to Level {data.level + 1}</span>
          <span className="text-gray-500">
            {data.xpProgress.current.toLocaleString()} / {data.xpProgress.needed.toLocaleString()} XP
          </span>
        </div>
        
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${data.xpProgress.percentage}%` }}
          >
            <div className="h-full bg-white/30 animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-indigo-600 font-semibold">
            {data.xpProgress.percentage}% complete
          </span>
          <span className="text-gray-500">
            {(data.xpProgress.needed - data.xpProgress.current).toLocaleString()} XP to go
          </span>
        </div>
      </div>

      {/* Total Points */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span className="text-gray-600">Total Points</span>
        <span className="text-2xl font-bold text-indigo-600">
          {data.totalPoints.toLocaleString()} ⭐
        </span>
      </div>
    </div>
  );
}

// Simple inline version for headers
export function LevelBadge({ level, title }: { level: number; title: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full">
      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
        {level}
      </div>
      <span className="text-sm font-medium text-indigo-700">{title}</span>
    </div>
  );
}
