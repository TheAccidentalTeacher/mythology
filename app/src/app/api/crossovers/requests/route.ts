import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/crossovers/requests - Get user's crossover requests
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'sent', 'received', 'all'
    const status = searchParams.get('status'); // 'pending', 'accepted', etc.

    let query = supabase
      .from('crossover_requests')
      .select(`
        *,
        requester_mythology:mythologies!crossover_requests_requester_mythology_id_fkey(id, name, description),
        target_mythology:mythologies!crossover_requests_target_mythology_id_fkey(id, name, description),
        requester:profiles!crossover_requests_requester_id_fkey(id, display_name, avatar_url),
        target_user:profiles!crossover_requests_target_user_id_fkey(id, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    // Filter by type
    if (type === 'sent') {
      query = query.eq('requester_id', user.id);
    } else if (type === 'received') {
      query = query.eq('target_user_id', user.id);
    } else {
      query = query.or(`requester_id.eq.${user.id},target_user_id.eq.${user.id}`);
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Error fetching crossover requests:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error in GET /api/crossovers/requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/crossovers/requests - Create a new crossover request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      requesterMythologyId,
      targetMythologyId,
      requestType,
      message
    } = body;

    // Validate required fields
    if (!requesterMythologyId || !targetMythologyId || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields: requesterMythologyId, targetMythologyId, requestType' },
        { status: 400 }
      );
    }

    // Verify requester owns the mythology
    const { data: requesterMythology, error: mythError } = await supabase
      .from('mythologies')
      .select('id, name, created_by')
      .eq('id', requesterMythologyId)
      .single();

    if (mythError || !requesterMythology) {
      return NextResponse.json({ error: 'Requester mythology not found' }, { status: 404 });
    }

    if (requesterMythology.created_by !== user.id) {
      return NextResponse.json({ error: 'You can only request crossovers from your own mythologies' }, { status: 403 });
    }

    // Get target mythology and owner
    const { data: targetMythology, error: targetError } = await supabase
      .from('mythologies')
      .select('id, name, created_by, visibility')
      .eq('id', targetMythologyId)
      .single();

    if (targetError || !targetMythology) {
      return NextResponse.json({ error: 'Target mythology not found' }, { status: 404 });
    }

    // Can't request crossover with yourself
    if (targetMythology.created_by === user.id) {
      return NextResponse.json({ error: 'Cannot create crossover request with your own mythology' }, { status: 400 });
    }

    // Check if there's already a pending request between these mythologies
    const { data: existingRequest } = await supabase
      .from('crossover_requests')
      .select('id')
      .eq('requester_mythology_id', requesterMythologyId)
      .eq('target_mythology_id', targetMythologyId)
      .eq('request_type', requestType)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A pending request of this type already exists between these mythologies' },
        { status: 409 }
      );
    }

    // Create the request
    const { data: newRequest, error: createError } = await supabase
      .from('crossover_requests')
      .insert({
        requester_mythology_id: requesterMythologyId,
        target_mythology_id: targetMythologyId,
        requester_id: user.id,
        target_user_id: targetMythology.created_by,
        request_type: requestType,
        message: message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating crossover request:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/crossovers/requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
