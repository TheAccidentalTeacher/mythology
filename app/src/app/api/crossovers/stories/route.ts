import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/crossovers/stories - Get crossover stories
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mythologyId = searchParams.get('mythologyId');
    const status = searchParams.get('status');

    let query = supabase
      .from('crossover_stories')
      .select(`
        *,
        mythology_1:mythologies!crossover_stories_mythology_1_id_fkey(id, name),
        mythology_2:mythologies!crossover_stories_mythology_2_id_fkey(id, name),
        author_1:profiles!crossover_stories_author_1_id_fkey(id, display_name, avatar_url),
        author_2:profiles!crossover_stories_author_2_id_fkey(id, display_name, avatar_url)
      `)
      .order('updated_at', { ascending: false });

    // Filter by mythology
    if (mythologyId) {
      query = query.or(`mythology_1_id.eq.${mythologyId},mythology_2_id.eq.${mythologyId}`);
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    const { data: stories, error } = await query;

    if (error) {
      console.error('Error fetching crossover stories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error in GET /api/crossovers/stories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/crossovers/stories - Create a new crossover story
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      mythology1Id,
      mythology2Id,
      partner2Id, // The other author
      title,
      storyType = 'crossover'
    } = body;

    // Validate required fields
    if (!mythology1Id || !mythology2Id || !partner2Id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the story
    const { data: story, error: createError } = await supabase
      .from('crossover_stories')
      .insert({
        mythology_1_id: mythology1Id,
        mythology_2_id: mythology2Id,
        author_1_id: user.id,
        author_2_id: partner2Id,
        title: title || 'Untitled Crossover Story',
        story_type: storyType,
        status: 'draft',
        content: { type: 'doc', content: [] },
        word_count: 0
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating crossover story:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/crossovers/stories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
