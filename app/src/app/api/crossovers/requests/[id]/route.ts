import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/crossovers/requests/[id] - Respond to a crossover request
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
    const { action, responseMessage } = body; // action: 'accept', 'decline', 'cancel'

    if (!action || !['accept', 'decline', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: accept, decline, or cancel' },
        { status: 400 }
      );
    }

    // Get the request
    const { data: crossoverRequest, error: fetchError } = await supabase
      .from('crossover_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !crossoverRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check permissions
    const isRequester = crossoverRequest.requester_id === user.id;
    const isTarget = crossoverRequest.target_user_id === user.id;

    if (!isRequester && !isTarget) {
      return NextResponse.json({ error: 'Not authorized to modify this request' }, { status: 403 });
    }

    // Validate action permissions
    if (action === 'cancel' && !isRequester) {
      return NextResponse.json({ error: 'Only the requester can cancel a request' }, { status: 403 });
    }

    if ((action === 'accept' || action === 'decline') && !isTarget) {
      return NextResponse.json({ error: 'Only the recipient can accept or decline a request' }, { status: 403 });
    }

    // Check if request is still pending
    if (crossoverRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot ${action} a request that is already ${crossoverRequest.status}` },
        { status: 400 }
      );
    }

    // Map action to status
    const statusMap: Record<string, string> = {
      accept: 'accepted',
      decline: 'declined',
      cancel: 'cancelled'
    };

    // Update the request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('crossover_requests')
      .update({
        status: statusMap[action],
        response_message: responseMessage || null,
        responded_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating crossover request:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // If accepted, create the appropriate relationship based on request type
    if (action === 'accept') {
      await handleAcceptedRequest(supabase, crossoverRequest, user.id);
    }

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error in PATCH /api/crossovers/requests/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/crossovers/requests/[id] - Delete a cancelled/declined request
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

    // Get the request
    const { data: crossoverRequest, error: fetchError } = await supabase
      .from('crossover_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !crossoverRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check permissions - only requester or target can delete
    if (crossoverRequest.requester_id !== user.id && crossoverRequest.target_user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this request' }, { status: 403 });
    }

    // Can only delete non-pending requests
    if (crossoverRequest.status === 'pending') {
      return NextResponse.json(
        { error: 'Cannot delete a pending request. Cancel it first.' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('crossover_requests')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting crossover request:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/crossovers/requests/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to handle accepted requests
async function handleAcceptedRequest(
  supabase: Awaited<ReturnType<typeof createClient>>,
  request: {
    id: string;
    request_type: string;
    requester_mythology_id: string;
    target_mythology_id: string;
    requester_id: string;
    target_user_id: string;
  },
  acceptingUserId: string
) {
  const { request_type, requester_mythology_id, target_mythology_id, id } = request;

  // For alliance/conflict requests, create a mythology alliance record
  if (['alliance', 'conflict', 'trade'].includes(request_type)) {
    const relationshipMap: Record<string, string> = {
      alliance: 'alliance',
      conflict: 'conflict',
      trade: 'trade_partners'
    };

    // Ensure consistent ordering (lower ID first)
    const [myth1, myth2] = requester_mythology_id < target_mythology_id
      ? [requester_mythology_id, target_mythology_id]
      : [target_mythology_id, requester_mythology_id];

    // Check if alliance already exists
    const { data: existing } = await supabase
      .from('mythology_alliances')
      .select('id')
      .eq('mythology_1_id', myth1)
      .eq('mythology_2_id', myth2)
      .single();

    if (existing) {
      // Update existing alliance
      await supabase
        .from('mythology_alliances')
        .update({
          relationship_type: relationshipMap[request_type],
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Create new alliance
      await supabase
        .from('mythology_alliances')
        .insert({
          mythology_1_id: myth1,
          mythology_2_id: myth2,
          relationship_type: relationshipMap[request_type],
          formed_from_request_id: id,
          formed_by: acceptingUserId,
          is_active: true
        });
    }
  }

  // For story requests, create a crossover story draft
  if (request_type === 'story') {
    await supabase
      .from('crossover_stories')
      .insert({
        mythology_1_id: requester_mythology_id,
        mythology_2_id: target_mythology_id,
        author_1_id: request.requester_id,
        author_2_id: request.target_user_id,
        title: 'Untitled Crossover Story',
        story_type: 'crossover',
        status: 'draft'
      });
  }

  // Mark request as completed
  await supabase
    .from('crossover_requests')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', id);
}
