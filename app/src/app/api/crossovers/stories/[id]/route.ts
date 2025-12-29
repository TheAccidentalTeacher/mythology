import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/crossovers/stories/[id] - Get a specific crossover story
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

    const { data: story, error } = await supabase
      .from('crossover_stories')
      .select(`
        *,
        mythology_1:mythologies!crossover_stories_mythology_1_id_fkey(id, name, description),
        mythology_2:mythologies!crossover_stories_mythology_2_id_fkey(id, name, description),
        author_1:profiles!crossover_stories_author_1_id_fkey(id, display_name, avatar_url),
        author_2:profiles!crossover_stories_author_2_id_fkey(id, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error || !story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Check if user has access (is one of the authors or story is published)
    if (story.status !== 'published' && 
        story.author_1_id !== user.id && 
        story.author_2_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error in GET /api/crossovers/stories/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/crossovers/stories/[id] - Update a crossover story
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
    const { title, content, status, storyType, featuredCharacters } = body;

    // Get the story first
    const { data: story, error: fetchError } = await supabase
      .from('crossover_stories')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Check if user is one of the authors
    if (story.author_1_id !== user.id && story.author_2_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this story' }, { status: 403 });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      last_edited_by: user.id
    };

    if (title !== undefined) updates.title = title;
    if (content !== undefined) {
      updates.content = content;
      // Calculate word count from TipTap content
      const wordCount = calculateWordCount(content);
      updates.word_count = wordCount;
    }
    if (status !== undefined) updates.status = status;
    if (storyType !== undefined) updates.story_type = storyType;
    if (featuredCharacters !== undefined) updates.featured_characters = featuredCharacters;

    const { data: updatedStory, error: updateError } = await supabase
      .from('crossover_stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating crossover story:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ story: updatedStory });
  } catch (error) {
    console.error('Error in PATCH /api/crossovers/stories/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/crossovers/stories/[id] - Delete a crossover story
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

    // Get the story first
    const { data: story, error: fetchError } = await supabase
      .from('crossover_stories')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Check if user is one of the authors
    if (story.author_1_id !== user.id && story.author_2_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this story' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('crossover_stories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting crossover story:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/crossovers/stories/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate word count from TipTap JSON
function calculateWordCount(content: { type: string; content?: unknown[] }): number {
  if (!content || !content.content) return 0;
  
  let text = '';
  
  function extractText(node: { type: string; text?: string; content?: unknown[] }): void {
    if (node.text) {
      text += node.text + ' ';
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: unknown) => {
        if (typeof child === 'object' && child !== null) {
          extractText(child as { type: string; text?: string; content?: unknown[] });
        }
      });
    }
  }
  
  extractText(content);
  
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
