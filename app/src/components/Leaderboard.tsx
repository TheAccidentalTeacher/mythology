'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  score: number;
  label?: string;
  level?: number;
  title?: string;
  streak?: number;
}

type LeaderboardType = 
  | 'total_points' 
  | 'stories_written' 
  | 'battles_won' 
  | 'creatures_created'
  | 'characters_created'
  | 'crossovers_completed'
  | 'longest_streak';

const LEADERBOARD_TYPES: { type: LeaderboardType; label: string; icon: string }[] = [
  { type: 'total_points', label: 'Top Points', icon: '🏆' },
  { type: 'characters_created', label: 'Most Characters', icon: '👑' },
  { type: 'creatures_created', label: 'Most Creatures', icon: '🐉' },
  { type: 'stories_written', label: 'Most Stories', icon: '📚' },
  { type: 'battles_won', label: 'Battle Champions', icon: '⚔️' },
  { type: 'crossovers_completed', label: 'Crossover Kings', icon: '🤝' },
  { type: 'longest_streak', label: 'Longest Streaks', icon: '🔥' },
];

interface LeaderboardProps {
  classroomId?: string;
  currentUserId?: string;
  limit?: number;
  compact?: boolean;
}

export function Leaderboard({ classroomId, currentUserId, limit = 10, compact = false }: LeaderboardProps) {
  const [selectedType, setSelectedType] = useState<LeaderboardType>('total_points');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType, classroomId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: selectedType,
        limit: limit.toString(),
      });
      if (classroomId) {
        params.append('classroomId', classroomId);
      }

      const response = await fetch(`/api/gamification/leaderboard?${params}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentTypeInfo = LEADERBOARD_TYPES.find(t => t.type === selectedType);

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          🏆 Leaderboard
        </h3>
        
        <div className="space-y-2">
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-2 p-2 rounded ${
                  entry.userId === currentUserId ? 'bg-indigo-50' : ''
                }`}
              >
                <span className="w-6 text-center font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                </span>
                <span className="flex-1 truncate text-sm">{entry.displayName}</span>
                <span className="text-sm font-semibold text-indigo-600">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {currentTypeInfo?.icon} {currentTypeInfo?.label}
        </h2>
      </div>

      {/* Type selector */}
      <div className="p-3 border-b overflow-x-auto">
        <div className="flex gap-2">
          {LEADERBOARD_TYPES.map(type => (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedType === type.type
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="divide-y">
        {loading ? (
          <div className="animate-pulse p-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">🏆</p>
            <p>No data yet. Be the first on the leaderboard!</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              index={index}
              isCurrentUser={entry.userId === currentUserId}
              type={selectedType}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  index,
  isCurrentUser,
  type,
}: {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
  type: LeaderboardType;
}) {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { icon: '🥇', bg: 'bg-yellow-50' };
    if (rank === 2) return { icon: '🥈', bg: 'bg-gray-50' };
    if (rank === 3) return { icon: '🥉', bg: 'bg-orange-50' };
    return { icon: `${rank}`, bg: '' };
  };

  const rankInfo = getRankDisplay(index + 1);

  return (
    <div
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
        isCurrentUser ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
      } ${rankInfo.bg}`}
    >
      {/* Rank */}
      <div className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center text-lg font-bold shadow-sm">
        {rankInfo.icon}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">
          {entry.displayName}
          {isCurrentUser && (
            <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        {entry.title && (
          <div className="text-sm text-gray-500">{entry.title}</div>
        )}
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="font-bold text-lg text-indigo-600">
          {entry.score.toLocaleString()}
        </div>
        {entry.label ? (
          <div className="text-xs text-gray-500">{entry.label}</div>
        ) : type === 'total_points' ? (
          <div className="text-xs text-gray-500">points</div>
        ) : null}
        {entry.streak !== undefined && entry.streak > 0 && type === 'total_points' && (
          <div className="text-xs text-orange-500">🔥 {entry.streak} day streak</div>
        )}
      </div>
    </div>
  );
}
