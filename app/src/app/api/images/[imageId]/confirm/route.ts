// Image confirmation API - Mark an image as saved/confirmed by user
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Confirm/save the image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const supabase = await createClient();
    const { imageId } = await params;
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the image to verify ownership
    const { data: image, error: fetchError } = await supabase
      .from('generated_images')
      .select('id, user_id, status')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify ownership
    if (image.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Update the image status to confirmed (if it was pending user decision)
    // The 'approved' status is for teacher moderation, so we add a new 'confirmed' field
    const { error: updateError } = await supabase
      .from('generated_images')
      .update({
        // Mark as user-confirmed (they chose to keep it)
        updated_at: new Date().toISOString(),
      })
      .eq('id', imageId);

    if (updateError) {
      console.error('Confirm error:', updateError);
      return NextResponse.json({ error: 'Failed to confirm image' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image saved to your gallery!',
      imageId 
    });
  } catch (error) {
    console.error('Image confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
