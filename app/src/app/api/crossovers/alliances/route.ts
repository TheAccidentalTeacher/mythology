import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/crossovers/alliances - Get alliances for a mythology
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mythologyId = searchParams.get('mythologyId');

    if (!mythologyId) {
      return NextResponse.json({ error: 'mythologyId is required' }, { status: 400 });
    }

    // Get all alliances for this mythology
    const { data: alliances, error } = await supabase
      .from('mythology_alliances')
      .select(`
        *,
        mythology_1:mythologies!mythology_alliances_mythology_1_id_fkey(
          id, name, description, created_by,
          owner:profiles!mythologies_created_by_fkey(id, display_name, avatar_url)
        ),
        mythology_2:mythologies!mythology_alliances_mythology_2_id_fkey(
          id, name, description, created_by,
          owner:profiles!mythologies_created_by_fkey(id, display_name, avatar_url)
        )
      `)
      .or(`mythology_1_id.eq.${mythologyId},mythology_2_id.eq.${mythologyId}`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alliances:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to show "partner" mythology consistently
    const transformedAlliances = alliances?.map(alliance => {
      const isMyth1 = alliance.mythology_1_id === mythologyId;
      return {
        ...alliance,
        partner_mythology: isMyth1 ? alliance.mythology_2 : alliance.mythology_1
      };
    });

    return NextResponse.json({ alliances: transformedAlliances });
  } catch (error) {
    console.error('Error in GET /api/crossovers/alliances:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/crossovers/alliances - Update an alliance
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { allianceId, relationshipType, allianceName, description, isActive } = body;

    if (!allianceId) {
      return NextResponse.json({ error: 'allianceId is required' }, { status: 400 });
    }

    // Get alliance and verify ownership
    const { data: alliance, error: fetchError } = await supabase
      .from('mythology_alliances')
      .select(`
        *,
        mythology_1:mythologies!mythology_alliances_mythology_1_id_fkey(created_by),
        mythology_2:mythologies!mythology_alliances_mythology_2_id_fkey(created_by)
      `)
      .eq('id', allianceId)
      .single();

    if (fetchError || !alliance) {
      return NextResponse.json({ error: 'Alliance not found' }, { status: 404 });
    }

    // Check if user owns either mythology
    const isOwner = 
      alliance.mythology_1?.created_by === user.id || 
      alliance.mythology_2?.created_by === user.id;

    if (!isOwner) {
      return NextResponse.json({ error: 'Not authorized to modify this alliance' }, { status: 403 });
    }

    // Build update object
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (relationshipType !== undefined) updates.relationship_type = relationshipType;
    if (allianceName !== undefined) updates.alliance_name = allianceName;
    if (description !== undefined) updates.description = description;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data: updatedAlliance, error: updateError } = await supabase
      .from('mythology_alliances')
      .update(updates)
      .eq('id', allianceId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating alliance:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ alliance: updatedAlliance });
  } catch (error) {
    console.error('Error in PATCH /api/crossovers/alliances:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
