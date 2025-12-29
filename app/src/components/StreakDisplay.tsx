'use client';

import { useState, useEffect } from 'react';
import { STREAK_MILESTONES } from '@/lib/gamification';

interface StreakDisplayProps {
  userId: string;
  compact?: boolean;
}

export function StreakDisplay({ userId, compact = false }: StreakDisplayProps) {
  const [data, setData] = useState<{
    loginStreak: number;
    streakActive: boolean;
    loggedInToday: boolean;
    nextMilestone: { days: number; name: string; reward: number; daysAway: number } | null;
    milestones: Array<{ days: number; name: string; reward: number; achieved: boolean; current: boolean }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchStreak() {
    try {
      const response = await fetch(`/api/gamification/streak?userId=${userId}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse h-16 bg-gray-200 rounded-lg" />
    );
  }

  if (!data) {
    return null;
  }

  if (compact) {
    if (data.loginStreak === 0) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xl">🔥</span>
          <span className="text-sm">Start your streak!</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-orange-500">
        <span className="text-xl">🔥</span>
        <span className="font-bold">{data.loginStreak}</span>
        <span className="text-sm text-gray-500">day streak</span>
        {data.nextMilestone && (
          <span className="text-xs text-gray-400">
            ({data.nextMilestone.daysAway} to next reward)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🔥 Login Streak
        </h3>
        {data.loggedInToday ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            ✓ Logged in today
          </span>
        ) : data.streakActive ? (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            ⚠️ Log in today to keep streak
          </span>
        ) : (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Start a new streak
          </span>
        )}
      </div>

      {/* Current Streak */}
      <div className="text-center py-4">
        <div className="text-6xl font-bold text-orange-500 mb-2">
          {data.loginStreak}
        </div>
        <div className="text-gray-600">
          {data.loginStreak === 1 ? 'day' : 'days'} in a row
        </div>
      </div>

      {/* Next Milestone */}
      {data.nextMilestone && (
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-orange-700">
                Next: {data.nextMilestone.name}
              </div>
              <div className="text-sm text-orange-600">
                {data.nextMilestone.daysAway} more {data.nextMilestone.daysAway === 1 ? 'day' : 'days'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-yellow-600">
                +{data.nextMilestone.reward}
              </div>
              <div className="text-xs text-gray-500">bonus points</div>
            </div>
          </div>
          {/* Progress to next milestone */}
          <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-400 to-yellow-400 rounded-full"
              style={{
                width: `${Math.min(100, (data.loginStreak / data.nextMilestone.days) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Milestones</h4>
        <div className="grid grid-cols-3 gap-2">
          {STREAK_MILESTONES.map(milestone => {
            const achieved = data.loginStreak >= milestone.days;
            const isCurrent = data.loginStreak >= milestone.days && 
              !STREAK_MILESTONES.find(m => m.days > milestone.days && data.loginStreak >= m.days);
            
            return (
              <div
                key={milestone.days}
                className={`p-2 rounded-lg text-center ${
                  achieved 
                    ? isCurrent
                      ? 'bg-orange-100 border-2 border-orange-400'
                      : 'bg-green-100'
                    : 'bg-gray-100'
                }`}
              >
                <div className={`text-lg font-bold ${achieved ? 'text-green-600' : 'text-gray-400'}`}>
                  {achieved ? '✓' : milestone.days}
                </div>
                <div className={`text-xs ${achieved ? 'text-green-700' : 'text-gray-500'}`}>
                  {milestone.days} days
                </div>
                <div className={`text-xs ${achieved ? 'text-yellow-600' : 'text-gray-400'}`}>
                  +{milestone.reward}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
