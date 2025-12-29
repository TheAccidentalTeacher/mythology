import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { POINT_VALUES, STREAK_MILESTONES } from '@/lib/gamification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/gamification/streak - Record a login/activity and update streak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get current profile data
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('last_login_date, login_streak, creation_streak, total_points, points')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastLogin = profile?.last_login_date;
    let currentStreak = profile?.login_streak || 0;
    let pointsAwarded = 0;
    let streakMilestoneReached: typeof STREAK_MILESTONES[number] | null = null;
    const badgesEarned: string[] = [];

    // Calculate the new streak
    if (lastLogin === today) {
      // Already logged in today - no change
      return NextResponse.json({
        success: true,
        streak: currentStreak,
        message: 'Already logged in today',
        pointsAwarded: 0,
      });
    }

    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastLogin === yesterdayStr) {
      // Consecutive day - increment streak
      currentStreak += 1;
    } else if (!lastLogin) {
      // First login ever
      currentStreak = 1;
    } else {
      // Streak broken - reset to 1
      currentStreak = 1;
    }

    // Award daily login points
    pointsAwarded = POINT_VALUES.DAILY_LOGIN;

    // Check for streak milestones
    for (const milestone of STREAK_MILESTONES) {
      if (currentStreak === milestone.days) {
        streakMilestoneReached = milestone;
        pointsAwarded += milestone.reward;
        break;
      }
    }

    // Update profile
    const newTotalPoints = (profile?.total_points || profile?.points || 0) + pointsAwarded;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_login_date: today,
        login_streak: currentStreak,
        total_points: newTotalPoints,
        points: newTotalPoints,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating streak:', updateError);
      return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
    }

    // Log points
    await supabase.from('points_log').insert({
      user_id: userId,
      points: POINT_VALUES.DAILY_LOGIN,
      action_type: 'daily_login',
      description: 'Daily login bonus',
    });

    if (streakMilestoneReached) {
      await supabase.from('points_log').insert({
        user_id: userId,
        points: streakMilestoneReached.reward,
        action_type: 'streak_milestone',
        description: `${streakMilestoneReached.days}-day streak milestone: ${streakMilestoneReached.name}`,
      });
    }

    // Check for streak badges
    const streakBadges: { days: number; name: string }[] = [
      { days: 3, name: 'Getting Started' },
      { days: 7, name: 'Committed Creator' },
      { days: 14, name: 'Dedicated Mythmaker' },
      { days: 30, name: 'Streak Champion' },
      { days: 60, name: 'Unstoppable' },
      { days: 100, name: 'Legendary Dedication' },
    ];

    for (const badge of streakBadges) {
      if (currentStreak >= badge.days) {
        const earned = await awardStreakBadge(userId, badge.name);
        if (earned) {
          badgesEarned.push(badge.name);
        }
      }
    }

    return NextResponse.json({
      success: true,
      streak: currentStreak,
      pointsAwarded,
      totalPoints: newTotalPoints,
      streakMilestone: streakMilestoneReached,
      badgesEarned,
      message: currentStreak > 1 
        ? `🔥 ${currentStreak} day streak!` 
        : 'Welcome back!',
    });
  } catch (error) {
    console.error('Error in POST /api/gamification/streak:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/gamification/streak?userId=xxx - Get user's streak info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('last_login_date, login_streak, creation_streak')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile?.last_login_date;
    const loginStreak = profile?.login_streak || 0;

    // Check if streak is still active (logged in today or yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const streakActive = lastLogin === today || lastLogin === yesterdayStr;
    const loggedInToday = lastLogin === today;

    // Find next milestone
    const nextMilestone = STREAK_MILESTONES.find(m => m.days > loginStreak);

    return NextResponse.json({
      loginStreak,
      creationStreak: profile?.creation_streak || 0,
      lastLoginDate: lastLogin,
      streakActive,
      loggedInToday,
      nextMilestone: nextMilestone ? {
        ...nextMilestone,
        daysAway: nextMilestone.days - loginStreak,
      } : null,
      milestones: STREAK_MILESTONES.map(m => ({
        ...m,
        achieved: loginStreak >= m.days,
        current: loginStreak === m.days,
      })),
    });
  } catch (error) {
    console.error('Error in GET /api/gamification/streak:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function awardStreakBadge(userId: string, badgeName: string): Promise<boolean> {
  try {
    // Get badge
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

    // Award badge
    await supabase.from('user_badges').insert({
      user_id: userId,
      badge_id: badge.id,
    });

    // Award bonus points
    if (badge.points_reward > 0) {
      await supabase.from('points_log').insert({
        user_id: userId,
        points: badge.points_reward,
        action_type: 'badge_earned',
        description: `Streak badge earned: ${badgeName}`,
      });
    }

    return true;
  } catch (error) {
    console.error('Error awarding streak badge:', error);
    return false;
  }
}
