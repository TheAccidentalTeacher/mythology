'use client';

import { useState, useEffect, useCallback } from 'react';
import { RARITY_COLORS, BADGE_CATEGORIES } from '@/lib/gamification';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points_reward: number;
  rarity: string;
  earned?: boolean;
  earnedAt?: string;
}

interface BadgeDisplayProps {
  userId: string;
  showAll?: boolean; // Show all badges (earned and unearned)
  compact?: boolean; // Compact display mode
  limit?: number;
}

export function BadgeDisplay({ userId, showAll = false, compact = false, limit }: BadgeDisplayProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stats, setStats] = useState({ earned: 0, total: 0 });

  const fetchBadges = useCallback(async () => {
    try {
      const response = await fetch(`/api/gamification/badges?userId=${userId}`);
      const data = await response.json();
      
      // Flatten badges
      const allBadges = Object.values(data.badgesByCategory || {}).flat() as Badge[];
      setBadges(allBadges);
      
      setStats({
        earned: data.totalEarned || 0,
        total: data.totalAvailable || 0,
      });
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  if (loading) {
    return (
      <div className="animate-pulse flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  // Compact mode - just show earned badges
  if (compact) {
    const earnedBadges = badges.filter(b => b.earned).slice(0, limit || 5);
    
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.map(badge => (
          <div
            key={badge.id}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl
              ${RARITY_COLORS[badge.rarity]?.bg || 'bg-gray-100'}
              ${RARITY_COLORS[badge.rarity]?.border || 'border-gray-300'} border-2
              cursor-pointer hover:scale-110 transition-transform`}
            title={`${badge.name}: ${badge.description}`}
          >
            {badge.icon}
          </div>
        ))}
        {stats.earned > (limit || 5) && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 text-sm font-bold">
            +{stats.earned - (limit || 5)}
          </div>
        )}
      </div>
    );
  }

  // Full display
  const displayBadges = showAll ? badges : badges.filter(b => b.earned);

  return (
    <div className="space-y-4">
      {/* Stats header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🏅 Badges
          <span className="text-sm font-normal text-gray-500">
            {stats.earned}/{stats.total} earned
          </span>
        </h3>
        
        {/* Category filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 py-1 text-xs rounded ${
              !selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {BADGE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 text-xs rounded ${
                selectedCategory === cat.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}
              title={cat.description}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {displayBadges
          .filter(b => !selectedCategory || b.category === selectedCategory)
          .map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
      </div>

      {displayBadges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🎯</p>
          <p>No badges earned yet. Start creating to earn your first badge!</p>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = RARITY_COLORS[badge.rarity] || RARITY_COLORS.common;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          w-14 h-14 rounded-lg flex items-center justify-center text-2xl
          ${badge.earned ? colors.bg : 'bg-gray-100'}
          ${badge.earned ? colors.border : 'border-gray-200'} border-2
          ${badge.earned ? '' : 'opacity-40 grayscale'}
          cursor-pointer hover:scale-110 transition-all
        `}
      >
        {badge.icon}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 bg-white rounded-lg shadow-xl border text-sm">
          <div className="font-bold flex items-center gap-1">
            {badge.icon} {badge.name}
          </div>
          <div className={`text-xs ${colors.text} font-medium capitalize`}>
            {badge.rarity}
          </div>
          <div className="text-gray-600 mt-1">{badge.description}</div>
          {badge.points_reward > 0 && (
            <div className="text-yellow-600 mt-1 text-xs">
              +{badge.points_reward} points
            </div>
          )}
          {badge.earned && badge.earnedAt && (
            <div className="text-green-600 mt-1 text-xs">
              ✓ Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
          {!badge.earned && (
            <div className="text-gray-400 mt-1 text-xs">Not yet earned</div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-white" />
          </div>
        </div>
      )}
    </div>
  );
}
