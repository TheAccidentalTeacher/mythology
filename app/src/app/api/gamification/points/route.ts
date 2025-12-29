import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { POINT_VALUES, calculateLevel, getXpToNextLevel, getLevelTitle } from '@/lib/gamification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/gamification/points - Award points to a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, actionType, description, referenceId, referenceType } = body;

    if (!userId || !actionType) {
      return NextResponse.json({ error: 'userId and actionType are required' }, { status: 400 });
    }

    // Get point value for this action
    const pointKey = actionType.toUpperCase() as keyof typeof POINT_VALUES;
    const points = POINT_VALUES[pointKey] || 0;

    if (points === 0) {
      return NextResponse.json({ error: 'Unknown action type' }, { status: 400 });
    }

    // Insert into points_log
    const { error: logError } = await supabase
      .from('points_log')
      .insert({
        user_id: userId,
        points,
        action_type: actionType,
        description: description || null,
        reference_id: referenceId || null,
        reference_type: referenceType || null,
      });

    if (logError) {
      console.error('Error logging points:', logError);
      // Continue anyway - profile update is more important
    }

    // Update profile total points
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('total_points, points')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentTotalPoints = profile?.total_points || profile?.points || 0;
    const newTotalPoints = currentTotalPoints + points;
    const newLevel = calculateLevel(newTotalPoints);
    const xpProgress = getXpToNextLevel(newTotalPoints);
    const title = getLevelTitle(newLevel);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_points: newTotalPoints,
        points: newTotalPoints,
        current_level: newLevel,
        xp_to_next_level: xpProgress.needed - xpProgress.current,
        title_prefix: title,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
    }

    // Check if user leveled up
    const previousLevel = calculateLevel(currentTotalPoints);
    const leveledUp = newLevel > previousLevel;

    // Check for badges based on action
    const earnedBadges = await checkAndAwardBadges(userId, actionType, referenceType);

    return NextResponse.json({
      success: true,
      pointsAwarded: points,
      totalPoints: newTotalPoints,
      level: newLevel,
      title,
      leveledUp,
      xpProgress,
      earnedBadges,
    });
  } catch (error) {
    console.error('Error in POST /api/gamification/points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/gamification/points?userId=xxx - Get user's points and level info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points, points, current_level, title_prefix, login_streak, creation_streak')
      .eq('id', userId)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalPoints = profile?.total_points || profile?.points || 0;
    const level = profile?.current_level || calculateLevel(totalPoints);
    const title = profile?.title_prefix || getLevelTitle(level);
    const xpProgress = getXpToNextLevel(totalPoints);

    // Get recent points history
    const { data: recentPoints } = await supabase
      .from('points_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get user's badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    return NextResponse.json({
      totalPoints,
      level,
      title,
      xpProgress,
      loginStreak: profile?.login_streak || 0,
      creationStreak: profile?.creation_streak || 0,
      recentPoints: recentPoints || [],
      badges: badges || [],
    });
  } catch (error) {
    console.error('Error in GET /api/gamification/points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to check and award badges
async function checkAndAwardBadges(userId: string, actionType: string, referenceType?: string): Promise<string[]> {
  const earnedBadges: string[] = [];

  try {
    // Get counts for this user
    const counts = await getUserCounts(userId);

    // Define badge checks based on action type
    const badgesToCheck: { name: string; entity: string; count: number }[] = [];

    if (actionType === 'character_created' || referenceType === 'character') {
      badgesToCheck.push(
        { name: 'First Steps', entity: 'character', count: 1 },
        { name: 'Pantheon Builder', entity: 'character', count: 5 },
        { name: 'Divine Assembly', entity: 'character', count: 10 },
        { name: 'Legendary Pantheon', entity: 'character', count: 25 }
      );
    }

    if (actionType === 'creature_created' || referenceType === 'creature') {
      badgesToCheck.push(
        { name: 'Beast Tamer', entity: 'creature', count: 1 },
        { name: 'Bestiary Keeper', entity: 'creature', count: 5 },
        { name: 'Monster Master', entity: 'creature', count: 10 },
        { name: 'Legendary Bestiary', entity: 'creature', count: 25 }
      );
    }

    if (actionType === 'story_completed' || referenceType === 'story') {
      badgesToCheck.push(
        { name: 'Epic Chronicler', entity: 'story', count: 1 },
        { name: 'Saga Weaver', entity: 'story', count: 5 },
        { name: 'Lore Master', entity: 'story', count: 10 },
        { name: 'Epic Anthology', entity: 'story', count: 25 }
      );
    }

    if (actionType === 'map_created' || referenceType === 'map') {
      badgesToCheck.push(
        { name: 'Cartographer', entity: 'map', count: 1 },
        { name: 'Atlas Maker', entity: 'map', count: 3 },
        { name: 'World Builder', entity: 'map', count: 5 }
      );
    }

    if (actionType === 'battle_won') {
      badgesToCheck.push(
        { name: 'First Blood', entity: 'battle_wins', count: 1 },
        { name: 'Warrior', entity: 'battle_wins', count: 5 },
        { name: 'Battle Legend', entity: 'battle_wins', count: 25 },
        { name: 'God of War', entity: 'battle_wins', count: 50 }
      );
    }

    if (actionType === 'crossover_completed' || referenceType === 'crossover') {
      badgesToCheck.push(
        { name: 'Crossover Pioneer', entity: 'crossover', count: 1 },
        { name: 'Multiverse Traveler', entity: 'crossover', count: 5 }
      );
    }

    if (actionType === 'alliance_formed' || referenceType === 'alliance') {
      badgesToCheck.push(
        { name: 'Alliance Forger', entity: 'alliance', count: 1 },
        { name: 'Diplomatic Master', entity: 'alliance', count: 5 }
      );
    }

    // Check each badge
    for (const badge of badgesToCheck) {
      const userCount = counts[badge.entity] || 0;
      if (userCount >= badge.count) {
        const awarded = await awardBadgeIfNotEarned(userId, badge.name);
        if (awarded) {
          earnedBadges.push(badge.name);
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }

  return earnedBadges;
}

async function getUserCounts(userId: string): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  // Get character count
  const { count: charCount } = await supabase
    .from('characters')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId);
  counts['character'] = charCount || 0;

  // Get creature count
  const { count: creatureCount } = await supabase
    .from('creatures')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId);
  counts['creature'] = creatureCount || 0;

  // Get story count
  const { count: storyCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId);
  counts['story'] = storyCount || 0;

  // Get map count
  const { count: mapCount } = await supabase
    .from('maps')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId);
  counts['map'] = mapCount || 0;

  // Get battle wins count
  const { count: battleWins } = await supabase
    .from('battle_stories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('winner_id', userId);
  counts['battle_wins'] = battleWins || 0;

  // Get crossover count
  const { count: crossoverCount } = await supabase
    .from('crossover_battles')
    .select('*', { count: 'exact', head: true })
    .or(`mythology1_id.eq.${userId},mythology2_id.eq.${userId}`);
  counts['crossover'] = crossoverCount || 0;

  // Get alliance count
  const { count: allianceCount } = await supabase
    .from('mythology_alliances')
    .select('*', { count: 'exact', head: true })
    .or(`mythology1_id.eq.${userId},mythology2_id.eq.${userId}`);
  counts['alliance'] = allianceCount || 0;

  return counts;
}

async function awardBadgeIfNotEarned(userId: string, badgeName: string): Promise<boolean> {
  try {
    // Get badge ID
    const { data: badge } = await supabase
      .from('badges')
      .select('id, points_reward')
      .eq('name', badgeName)
      .single();

    if (!badge) return false;

    // Check if already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .single();

    if (existing) return false;

    // Award the badge
    const { error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badge.id });

    if (error) {
      console.error('Error awarding badge:', error);
      return false;
    }

    // Award bonus points for the badge
    if (badge.points_reward > 0) {
      await supabase
        .from('points_log')
        .insert({
          user_id: userId,
          points: badge.points_reward,
          action_type: 'badge_earned',
          description: `Earned badge: ${badgeName}`,
        });

      // Update total points
      try {
        await supabase.rpc('increment_points', { 
          user_id_param: userId, 
          points_to_add: badge.points_reward 
        });
      } catch {
        // Fallback if RPC doesn't exist
        const { data } = await supabase
          .from('profiles')
          .select('total_points, points')
          .eq('id', userId)
          .single();
        
        if (data) {
          await supabase
            .from('profiles')
            .update({ 
              total_points: (data.total_points || data.points || 0) + badge.points_reward,
              points: (data.points || 0) + badge.points_reward
            })
            .eq('id', userId);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in awardBadgeIfNotEarned:', error);
    return false;
  }
}
