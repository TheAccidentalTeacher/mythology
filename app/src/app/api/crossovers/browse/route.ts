import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/crossovers/browse - Browse other mythologies for crossover
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const excludeMythologyId = searchParams.get('excludeMythologyId'); // Exclude current mythology
    const classroomOnly = searchParams.get('classroomOnly') === 'true';
    const search = searchParams.get('search');

    // Get user's profile to find their classroom
    const { data: profile } = await supabase
      .from('profiles')
      .select('classroom_id, role')
      .eq('id', user.id)
      .single();

    // Build query for public mythologies
    let query = supabase
      .from('mythologies')
      .select(`
        id,
        name,
        description,
        timeframe,
        genre,
        geography_type,
        cultural_inspiration,
        created_by,
        classroom_id,
        view_count,
        created_at,
        owner:profiles!mythologies_created_by_fkey(
          id,
          display_name,
          avatar_url
        ),
        characters:characters(count),
        creatures:creatures(count),
        stories:stories(count)
      `)
      .eq('visibility', 'public')
      .neq('created_by', user.id) // Don't show own mythologies
      .order('view_count', { ascending: false });

    // Exclude specific mythology
    if (excludeMythologyId) {
      query = query.neq('id', excludeMythologyId);
    }

    // Filter to classroom only
    if (classroomOnly && profile?.classroom_id) {
      query = query.eq('classroom_id', profile.classroom_id);
    }

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Limit results
    query = query.limit(50);

    const { data: mythologies, error } = await query;

    if (error) {
      console.error('Error browsing mythologies:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform counts
    const transformedMythologies = mythologies?.map(myth => ({
      ...myth,
      characterCount: myth.characters?.[0]?.count || 0,
      creatureCount: myth.creatures?.[0]?.count || 0,
      storyCount: myth.stories?.[0]?.count || 0,
      characters: undefined,
      creatures: undefined,
      stories: undefined
    }));

    return NextResponse.json({ mythologies: transformedMythologies });
  } catch (error) {
    console.error('Error in GET /api/crossovers/browse:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
