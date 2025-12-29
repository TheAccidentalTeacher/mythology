import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/events - Get events for a classroom
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get('classroomId');
    const status = searchParams.get('status');

    // Get user's profile to find their classroom
    const { data: profile } = await supabase
      .from('profiles')
      .select('classroom_id, role')
      .eq('id', user.id)
      .single();

    const targetClassroom = classroomId || profile?.classroom_id;

    if (!targetClassroom) {
      return NextResponse.json({ error: 'No classroom specified' }, { status: 400 });
    }

    let query = supabase
      .from('teacher_events')
      .select(`
        *,
        creator:profiles!teacher_events_created_by_fkey(id, display_name),
        participants:event_participants(
          id,
          user_id,
          mythology_id,
          placement,
          score,
          completed,
          mythology:mythologies(id, name)
        )
      `)
      .eq('classroom_id', targetClassroom)
      .order('start_date', { ascending: true });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/events - Create a new event (teachers only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a teacher
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create events' }, { status: 403 });
    }

    const body = await request.json();
    const {
      classroomId,
      title,
      description,
      eventType,
      startDate,
      endDate,
      rules,
      maxParticipants,
      pointsReward,
      badgeReward
    } = body;

    // Validate required fields
    if (!classroomId || !title || !eventType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: classroomId, title, eventType, startDate, endDate' },
        { status: 400 }
      );
    }

    // Verify teacher owns the classroom
    const { data: classroom } = await supabase
      .from('classrooms')
      .select('id')
      .eq('id', classroomId)
      .eq('teacher_id', user.id)
      .single();

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found or not owned by you' }, { status: 403 });
    }

    // Determine initial status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let status = 'upcoming';
    if (now >= start && now <= end) status = 'active';
    if (now > end) status = 'completed';

    // Create the event
    const { data: event, error: createError } = await supabase
      .from('teacher_events')
      .insert({
        created_by: user.id,
        classroom_id: classroomId,
        title,
        description: description || null,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
        rules: rules || null,
        max_participants: maxParticipants || null,
        points_reward: pointsReward || 0,
        badge_reward: badgeReward || null,
        status
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating event:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
