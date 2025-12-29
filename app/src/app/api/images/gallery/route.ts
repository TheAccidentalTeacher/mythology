// Image Gallery API - Fetch user's generated images
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const status = searchParams.get('status'); // 'approved', 'pending', 'rejected', 'all'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('generated_images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by entity type if provided
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    // Filter by specific entity
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: images, error, count } = await query;

    if (error) {
      console.error('Gallery fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      images: images || [],
      pagination: {
        limit,
        offset,
        total: count || images?.length || 0,
      }
    });
  } catch (error) {
    console.error('Gallery error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete an image (only own images that are not approved)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get the image first to verify ownership and status
    const { data: image, error: fetchError } = await supabase
      .from('generated_images')
      .select('id, user_id, status, image_url')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Check ownership
    if (image.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this image' }, { status: 403 });
    }

    // Can only delete pending images (approved images should be kept)
    if (image.status === 'approved') {
      return NextResponse.json({ 
        error: 'Cannot delete approved images. Contact your teacher if needed.' 
      }, { status: 403 });
    }

    // Delete from storage if URL looks like our storage
    if (image.image_url && image.image_url.includes('mythology-images')) {
      try {
        // Extract the path from the URL
        const urlParts = image.image_url.split('mythology-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage
            .from('mythology-images')
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error('Storage delete error:', storageError);
        // Continue with database deletion even if storage fails
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

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
