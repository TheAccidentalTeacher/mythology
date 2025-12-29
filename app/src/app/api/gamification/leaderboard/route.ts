import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateLevel, getLevelTitle } from '@/lib/gamification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type LeaderboardType = 
  | 'total_points' 
  | 'stories_written' 
  | 'battles_won' 
  | 'creatures_created'
  | 'characters_created'
  | 'crossovers_completed'
  | 'longest_streak';

// GET /api/gamification/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'total_points') as LeaderboardType;
    const classroomId = searchParams.get('classroomId');
    const limit = parseInt(searchParams.get('limit') || '10');

    let leaderboard: unknown[] = [];

    switch (type) {
      case 'total_points':
        leaderboard = await getPointsLeaderboard(classroomId, limit);
        break;
      case 'stories_written':
        leaderboard = await getStoriesLeaderboard(classroomId, limit);
        break;
      case 'battles_won':
        leaderboard = await getBattlesLeaderboard(classroomId, limit);
        break;
      case 'creatures_created':
        leaderboard = await getCreaturesLeaderboard(classroomId, limit);
        break;
      case 'characters_created':
        leaderboard = await getCharactersLeaderboard(classroomId, limit);
        break;
      case 'crossovers_completed':
        leaderboard = await getCrossoversLeaderboard(classroomId, limit);
        break;
      case 'longest_streak':
        leaderboard = await getStreakLeaderboard(classroomId, limit);
        break;
      default:
        leaderboard = await getPointsLeaderboard(classroomId, limit);
    }

    return NextResponse.json({
      type,
      classroomId,
      leaderboard,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in GET /api/gamification/leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getPointsLeaderboard(classroomId: string | null, limit: number) {
  let query = supabase
    .from('profiles')
    .select('id, username, display_name, total_points, points, current_level, login_streak, avatar_config')
    .eq('role', 'student')
    .order('total_points', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (classroomId) {
    query = query.eq('classroom_id', classroomId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching points leaderboard:', error);
    return [];
  }

  return (data || []).map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    username: user.username,
    displayName: user.display_name || user.username,
    score: user.total_points || user.points || 0,
    level: user.current_level || calculateLevel(user.total_points || user.points || 0),
    title: getLevelTitle(user.current_level || calculateLevel(user.total_points || user.points || 0)),
    streak: user.login_streak || 0,
    avatarConfig: user.avatar_config,
  }));
}

async function getStoriesLeaderboard(classroomId: string | null, limit: number) {
  // Get story counts per user
  const { data: stories, error } = await supabase
    .from('stories')
    .select('created_by, profiles!inner(id, username, display_name, classroom_id)')
    .eq('is_complete', true);

  if (error) {
    console.error('Error fetching stories:', error);
    return [];
  }

  // Count stories per user
  const counts: Record<string, { count: number; user: { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } }> = {};
  stories?.forEach(story => {
    const profileData = story.profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    if (!profile) return;
    if (classroomId && profile.classroom_id !== classroomId) return;
    
    if (!counts[story.created_by]) {
      counts[story.created_by] = { count: 0, user: profile as { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } };
    }
    counts[story.created_by].count++;
  });

  // Sort and return
  return Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([userId, data], index) => ({
      rank: index + 1,
      userId,
      username: data.user.username,
      displayName: data.user.display_name || data.user.username,
      score: data.count,
      label: `${data.count} ${data.count === 1 ? 'story' : 'stories'}`,
    }));
}

async function getBattlesLeaderboard(classroomId: string | null, limit: number) {
  const { data: battles, error } = await supabase
    .from('battle_stories')
    .select('winner_id, user_id, profiles!battle_stories_user_id_fkey(id, username, display_name, classroom_id)');

  if (error) {
    console.error('Error fetching battles:', error);
    return [];
  }

  // Count wins per user
  const counts: Record<string, { wins: number; user: { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } }> = {};
  battles?.forEach(battle => {
    const profileData = battle.profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    if (!battle.winner_id || battle.winner_id !== battle.user_id) return;
    if (classroomId && profile?.classroom_id !== classroomId) return;
    
    if (!counts[battle.winner_id]) {
      counts[battle.winner_id] = { wins: 0, user: profile as { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } };
    }
    counts[battle.winner_id].wins++;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b.wins - a.wins)
    .slice(0, limit)
    .map(([userId, data], index) => ({
      rank: index + 1,
      userId,
      username: data.user?.username || 'Unknown',
      displayName: data.user?.display_name || data.user?.username || 'Unknown',
      score: data.wins,
      label: `${data.wins} ${data.wins === 1 ? 'win' : 'wins'}`,
    }));
}

async function getCreaturesLeaderboard(classroomId: string | null, limit: number) {
  const { data: creatures, error } = await supabase
    .from('creatures')
    .select('created_by, profiles!inner(id, username, display_name, classroom_id)');

  if (error) {
    console.error('Error fetching creatures:', error);
    return [];
  }

  const counts: Record<string, { count: number; user: { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } }> = {};
  creatures?.forEach(creature => {
    const profileData = creature.profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    if (!profile) return;
    if (classroomId && profile.classroom_id !== classroomId) return;
    
    if (!counts[creature.created_by]) {
      counts[creature.created_by] = { count: 0, user: profile as { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } };
    }
    counts[creature.created_by].count++;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([userId, data], index) => ({
      rank: index + 1,
      userId,
      username: data.user.username,
      displayName: data.user.display_name || data.user.username,
      score: data.count,
      label: `${data.count} ${data.count === 1 ? 'creature' : 'creatures'}`,
    }));
}

async function getCharactersLeaderboard(classroomId: string | null, limit: number) {
  const { data: characters, error } = await supabase
    .from('characters')
    .select('created_by, profiles!inner(id, username, display_name, classroom_id)');

  if (error) {
    console.error('Error fetching characters:', error);
    return [];
  }

  const counts: Record<string, { count: number; user: { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } }> = {};
  characters?.forEach(character => {
    const profileData = character.profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    if (!profile) return;
    if (classroomId && profile.classroom_id !== classroomId) return;
    
    if (!counts[character.created_by]) {
      counts[character.created_by] = { count: 0, user: profile as { display_name?: string; username?: string; classroom_id?: string; [key: string]: unknown } };
    }
    counts[character.created_by].count++;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([userId, data], index) => ({
      rank: index + 1,
      userId,
      username: data.user.username,
      displayName: data.user.display_name || data.user.username,
      score: data.count,
      label: `${data.count} ${data.count === 1 ? 'character' : 'characters'}`,
    }));
}

async function getCrossoversLeaderboard(classroomId: string | null, limit: number) {
  // Count crossover battles and stories
  const { data: battles } = await supabase
    .from('crossover_battles')
    .select('initiated_by');

  const { data: stories } = await supabase
    .from('crossover_stories')
    .select('author1_id, author2_id');

  const counts: Record<string, number> = {};
  
  battles?.forEach(battle => {
    counts[battle.initiated_by] = (counts[battle.initiated_by] || 0) + 1;
  });

  stories?.forEach(story => {
    counts[story.author1_id] = (counts[story.author1_id] || 0) + 1;
    counts[story.author2_id] = (counts[story.author2_id] || 0) + 1;
  });

  // Get user info for top users
  const topUserIds = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => id);

  const { data: users } = await supabase
    .from('profiles')
    .select('id, username, display_name, classroom_id')
    .in('id', topUserIds);

  const userMap = new Map(users?.map(u => [u.id, u]) || []);

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .filter(([userId]) => {
      if (!classroomId) return true;
      return userMap.get(userId)?.classroom_id === classroomId;
    })
    .map(([userId, count], index) => {
      const user = userMap.get(userId);
      return {
        rank: index + 1,
        userId,
        username: user?.username || 'Unknown',
        displayName: user?.display_name || user?.username || 'Unknown',
        score: count,
        label: `${count} ${count === 1 ? 'crossover' : 'crossovers'}`,
      };
    });
}

async function getStreakLeaderboard(classroomId: string | null, limit: number) {
  let query = supabase
    .from('profiles')
    .select('id, username, display_name, login_streak, classroom_id')
    .eq('role', 'student')
    .order('login_streak', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (classroomId) {
    query = query.eq('classroom_id', classroomId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching streak leaderboard:', error);
    return [];
  }

  return (data || [])
    .filter(user => (user.login_streak || 0) > 0)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      displayName: user.display_name || user.username,
      score: user.login_streak || 0,
      label: `${user.login_streak || 0} day streak 🔥`,
    }));
}
