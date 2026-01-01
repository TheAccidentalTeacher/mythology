'use client';

import { useState, useCallback } from 'react';
import { soundManager } from '@/lib/soundManager';

interface PointsResult {
  success: boolean;
  pointsAwarded: number;
  totalPoints: number;
  level: number;
  title: string;
  leveledUp: boolean;
  earnedBadges: string[];
  xpProgress: { current: number; needed: number; percentage: number };
}

interface UseGamificationReturn {
  awardPoints: (actionType: string, description?: string, referenceId?: string, referenceType?: string) => Promise<PointsResult | null>;
  loading: boolean;
  error: string | null;
  lastResult: PointsResult | null;
}

export function useGamification(userId: string): UseGamificationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<PointsResult | null>(null);

  const awardPoints = useCallback(async (
    actionType: string,
    description?: string,
    referenceId?: string,
    referenceType?: string
  ): Promise<PointsResult | null> => {
    if (!userId) {
      console.warn('No userId provided to useGamification');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gamification/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          actionType,
          description,
          referenceId,
          referenceType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to award points');
      }

      const result: PointsResult = await response.json();
      setLastResult(result);
      
      // Play appropriate sounds
      if (result.earnedBadges && result.earnedBadges.length > 0) {
        soundManager.play('badgeUnlock', { volume: 0.6 });
      } else if (result.leveledUp) {
        soundManager.play('levelUp', { volume: 0.6 });
      } else if (result.pointsAwarded > 0) {
        soundManager.play('xpGain', { volume: 0.3 });
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error awarding points:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { awardPoints, loading, error, lastResult };
}

// Toast notification for points/badges earned
export function PointsToast({ result, onClose }: { result: PointsResult; onClose: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border p-4 max-w-sm">
        {/* Points awarded */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div>
            <div className="font-bold text-green-600">+{result.pointsAwarded} Points!</div>
            <div className="text-sm text-gray-500">
              Total: {result.totalPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Level up */}
        {result.leveledUp && (
          <div className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-3 mb-2">
            <div className="font-bold">🎉 LEVEL UP!</div>
            <div className="text-sm">
              You&apos;re now Level {result.level}: {result.title}
            </div>
          </div>
        )}

        {/* Badges earned */}
        {result.earnedBadges.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-3 mb-2">
            <div className="font-bold text-yellow-700">🏅 Badge{result.earnedBadges.length > 1 ? 's' : ''} Earned!</div>
            {result.earnedBadges.map(badge => (
              <div key={badge} className="text-sm text-yellow-600">{badge}</div>
            ))}
          </div>
        )}

        {/* XP Progress */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Level {result.level} Progress</span>
            <span>{result.xpProgress.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${result.xpProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// CSS for animation (add to globals.css)
// @keyframes slide-up {
//   from { transform: translateY(100%); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }
// .animate-slide-up { animation: slide-up 0.3s ease-out; }
