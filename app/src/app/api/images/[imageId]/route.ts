// Image management API - Delete/manage individual images
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE - Delete/discard an image
export async function DELETE(
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
      .select('id, user_id, image_url, status')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify ownership (user can only delete their own images)
    if (image.user_id !== user.id) {
      // Check if teacher
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Not authorized to delete this image' }, { status: 403 });
      }
    }

    // Delete from storage if it's a Supabase URL
    if (image.image_url?.includes('supabase.co/storage')) {
      const urlParts = image.image_url.split('/mythology-images/');
      if (urlParts[1]) {
        const filePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from('mythology-images').remove([filePath]);
      }
    }

    // Delete the database record
    const { error: deleteError } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get image details
export async function GET(
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

    const { data: image, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error('Image fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
