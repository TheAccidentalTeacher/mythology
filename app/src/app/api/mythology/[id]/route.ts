import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const mythologyId = params.id;
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    console.log(`🗑️ DELETE mythology request - User: ${user.id}, Mythology: ${mythologyId}`);

    // Verify the mythology exists and belongs to the user
    const { data: mythology, error: fetchError } = await supabase
      .from('mythologies')
      .select('id, name, created_by')
      .eq('id', mythologyId)
      .single();

    if (fetchError || !mythology) {
      console.error('❌ Mythology not found:', fetchError);
      return NextResponse.json(
        { error: 'Mythology not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (mythology.created_by !== user.id) {
      console.error('❌ Unauthorized: User does not own this mythology');
      return NextResponse.json(
        { error: 'You can only delete your own mythologies' },
        { status: 403 }
      );
    }

    // Delete the mythology (cascade will handle related content)
    console.log(`🗑️ Deleting mythology: ${mythology.name}`);
    const { error: deleteError } = await supabase
      .from('mythologies')
      .delete()
      .eq('id', mythologyId);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete mythology' },
        { status: 500 }
      );
    }

    console.log('✅ Mythology deleted successfully');

    return NextResponse.json(
      { 
        success: true,
        message: `Successfully deleted "${mythology.name}" and all its content`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Delete mythology error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
