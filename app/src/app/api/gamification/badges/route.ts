import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/gamification/badges - Get all badges or user's badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (userId) {
      // Get user's earned badges
      const query = supabase
        .from('user_badges')
        .select(`
          id,
          earned_at,
          is_displayed,
          badge:badges(
            id,
            name,
            description,
            icon,
            category,
            points_reward,
            rarity,
            is_hidden
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      const { data: userBadges, error } = await query;

      if (error) {
        console.error('Error fetching user badges:', error);
        return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
      }

      // Get all available badges for comparison
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .eq('is_hidden', false)
        .order('category', { ascending: true });

      // Organize badges by category
      const earnedBadgeIds = new Set(userBadges?.map(ub => (ub.badge as unknown as { id: string })?.id) || []);
      
      const badgesByCategory: Record<string, unknown[]> = {};
      
      allBadges?.forEach(badge => {
        if (!badgesByCategory[badge.category]) {
          badgesByCategory[badge.category] = [];
        }
        badgesByCategory[badge.category].push({
          ...badge,
          earned: earnedBadgeIds.has(badge.id),
          earnedAt: userBadges?.find(ub => (ub.badge as unknown as { id: string })?.id === badge.id)?.earned_at,
        });
      });

      return NextResponse.json({
        userBadges: userBadges || [],
        allBadges: allBadges || [],
        badgesByCategory,
        totalEarned: userBadges?.length || 0,
        totalAvailable: allBadges?.length || 0,
      });
    } else {
      // Get all available badges
      let query = supabase
        .from('badges')
        .select('*')
        .eq('is_hidden', false)
        .order('category', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data: badges, error } = await query;

      if (error) {
        console.error('Error fetching badges:', error);
        return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
      }

      // Group by category
      const badgesByCategory: Record<string, unknown[]> = {};
      badges?.forEach(badge => {
        if (!badgesByCategory[badge.category]) {
          badgesByCategory[badge.category] = [];
        }
        badgesByCategory[badge.category].push(badge);
      });

      return NextResponse.json({
        badges: badges || [],
        badgesByCategory,
        total: badges?.length || 0,
      });
    }
  } catch (error) {
    console.error('Error in GET /api/gamification/badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/gamification/badges - Teacher awards a manual badge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badgeName, teacherId } = body;

    if (!userId || !badgeName) {
      return NextResponse.json({ error: 'userId and badgeName are required' }, { status: 400 });
    }

    // Verify teacher (optional, for now we trust the request)
    if (teacherId) {
      const { data: teacher } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', teacherId)
        .single();

      if (teacher?.role !== 'teacher') {
        return NextResponse.json({ error: 'Only teachers can award manual badges' }, { status: 403 });
      }
    }

    // Get badge
    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .select('*')
      .eq('name', badgeName)
      .single();

    if (badgeError || !badge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 });
    }

    // Check if already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'User already has this badge' }, { status: 400 });
    }

    // Award badge
    const { error: awardError } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badge.id });

    if (awardError) {
      console.error('Error awarding badge:', awardError);
      return NextResponse.json({ error: 'Failed to award badge' }, { status: 500 });
    }

    // Award points
    if (badge.points_reward > 0) {
      await supabase
        .from('points_log')
        .insert({
          user_id: userId,
          points: badge.points_reward,
          action_type: 'badge_earned',
          description: `Teacher awarded badge: ${badgeName}`,
        });

      // Update profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points, points')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_points: (profile.total_points || profile.points || 0) + badge.points_reward,
            points: (profile.points || 0) + badge.points_reward,
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({
      success: true,
      badge,
      message: `Awarded "${badgeName}" badge to user`,
    });
  } catch (error) {
    console.error('Error in POST /api/gamification/badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
