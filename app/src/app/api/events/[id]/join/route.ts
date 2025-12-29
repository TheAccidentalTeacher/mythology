import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/events/[id]/join - Join an event
export async function POST(
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
    const { mythologyId } = body;

    if (!mythologyId) {
      return NextResponse.json({ error: 'mythologyId is required' }, { status: 400 });
    }

    // Get the event
    const { data: event, error: eventError } = await supabase
      .from('teacher_events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is open for joining
    if (event.status !== 'upcoming' && event.status !== 'active') {
      return NextResponse.json({ error: 'Event is not open for registration' }, { status: 400 });
    }

    // Check max participants
    if (event.max_participants) {
      const { count } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      if (count && count >= event.max_participants) {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 });
      }
    }

    // Check if already participating
    const { data: existingParticipant } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', id)
      .eq('mythology_id', mythologyId)
      .single();

    if (existingParticipant) {
      return NextResponse.json({ error: 'Already participating in this event' }, { status: 409 });
    }

    // Verify user owns the mythology
    const { data: mythology } = await supabase
      .from('mythologies')
      .select('id')
      .eq('id', mythologyId)
      .eq('created_by', user.id)
      .single();

    if (!mythology) {
      return NextResponse.json({ error: 'Mythology not found or not owned by you' }, { status: 403 });
    }

    // Join the event
    const { data: participant, error: joinError } = await supabase
      .from('event_participants')
      .insert({
        event_id: id,
        mythology_id: mythologyId,
        user_id: user.id
      })
      .select()
      .single();

    if (joinError) {
      console.error('Error joining event:', joinError);
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events/[id]/join:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/events/[id]/join - Leave an event
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
    const { searchParams } = new URL(request.url);
    const mythologyId = searchParams.get('mythologyId');

    if (!mythologyId) {
      return NextResponse.json({ error: 'mythologyId is required' }, { status: 400 });
    }

    // Verify user owns the mythology
    const { data: mythology } = await supabase
      .from('mythologies')
      .select('id')
      .eq('id', mythologyId)
      .eq('created_by', user.id)
      .single();

    if (!mythology) {
      return NextResponse.json({ error: 'Mythology not found or not owned by you' }, { status: 403 });
    }

    // Get the event
    const { data: event } = await supabase
      .from('teacher_events')
      .select('status')
      .eq('id', id)
      .single();

    if (event?.status === 'active') {
      return NextResponse.json({ error: 'Cannot leave an active event' }, { status: 400 });
    }

    // Leave the event
    const { error: leaveError } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', id)
      .eq('mythology_id', mythologyId)
      .eq('user_id', user.id);

    if (leaveError) {
      console.error('Error leaving event:', leaveError);
      return NextResponse.json({ error: leaveError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/events/[id]/join:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
