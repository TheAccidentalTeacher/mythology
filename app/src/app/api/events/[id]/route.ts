import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/events/[id] - Get a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: event, error } = await supabase
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
          joined_at,
          user:profiles(id, display_name),
          mythology:mythologies(id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error in GET /api/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/events/[id] - Update an event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get the event first
    const { data: event, error: fetchError } = await supabase
      .from('teacher_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is the creator
    if (event.created_by !== user.id) {
      return NextResponse.json({ error: 'Not authorized to modify this event' }, { status: 403 });
    }

    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      rules,
      maxParticipants,
      pointsReward,
      badgeReward,
      status
    } = body;

    // Build update object
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (eventType !== undefined) updates.event_type = eventType;
    if (startDate !== undefined) updates.start_date = startDate;
    if (endDate !== undefined) updates.end_date = endDate;
    if (rules !== undefined) updates.rules = rules;
    if (maxParticipants !== undefined) updates.max_participants = maxParticipants;
    if (pointsReward !== undefined) updates.points_reward = pointsReward;
    if (badgeReward !== undefined) updates.badge_reward = badgeReward;
    if (status !== undefined) updates.status = status;

    const { data: updatedEvent, error: updateError } = await supabase
      .from('teacher_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating event:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error('Error in PATCH /api/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the event first
    const { data: event, error: fetchError } = await supabase
      .from('teacher_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is the creator
    if (event.created_by !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this event' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('teacher_events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting event:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
