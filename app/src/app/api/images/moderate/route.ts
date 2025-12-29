// Image Moderation API - Teacher moderation of generated images
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Get images needing moderation
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a teacher
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, classroom_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get images from students in teacher's classroom
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('classroom_id', profile.classroom_id)
      .eq('role', 'student');

    if (studentsError) {
      console.error('Students fetch error:', studentsError);
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }

    const studentIds = students?.map(s => s.id) || [];

    if (studentIds.length === 0) {
      return NextResponse.json({
        success: true,
        images: [],
        pagination: { limit, offset, total: 0 }
      });
    }

    // Get pending images
    let query = supabase
      .from('generated_images')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .in('user_id', studentIds)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: images, error, count } = await query;

    if (error) {
      console.error('Moderation fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    // Also get counts for all statuses
    const { data: statusCounts } = await supabase
      .from('generated_images')
      .select('status')
      .in('user_id', studentIds);

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: statusCounts?.length || 0
    };

    statusCounts?.forEach((img: { status: string }) => {
      if (img.status === 'pending') counts.pending++;
      else if (img.status === 'approved') counts.approved++;
      else if (img.status === 'rejected') counts.rejected++;
    });

    return NextResponse.json({
      success: true,
      images: images || [],
      counts,
      pagination: {
        limit,
        offset,
        total: count || images?.length || 0,
      }
    });
  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// PATCH - Approve or reject an image
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a teacher
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, classroom_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
    }

    const body = await request.json();
    const { imageId, action, reason, isFeatured } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    if (!['approve', 'reject', 'feature', 'unfeature'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action. Use: approve, reject, feature, unfeature' 
      }, { status: 400 });
    }

    // Get the image and verify it belongs to a student in teacher's classroom
    const { data: image, error: imageError } = await supabase
      .from('generated_images')
      .select(`
        id, user_id, status,
        profiles:user_id (classroom_id)
      `)
      .eq('id', imageId)
      .single();

    if (imageError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify the image belongs to a student in teacher's classroom
    // Handle both array and object return types from Supabase joins
    const profileData = image.profiles;
    const imageClassroom = Array.isArray(profileData) 
      ? profileData[0]?.classroom_id 
      : (profileData as { classroom_id: string } | null)?.classroom_id;
    if (imageClassroom !== profile.classroom_id) {
      return NextResponse.json({ 
        error: 'Not authorized to moderate this image' 
      }, { status: 403 });
    }

    // Build update object
    const updateData: Record<string, string | boolean> = {
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    };

    if (action === 'approve') {
      updateData.status = 'approved';
      updateData.rejection_reason = '';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejection_reason = reason || 'Content not appropriate for classroom';
    } else if (action === 'feature') {
      updateData.is_featured = true;
    } else if (action === 'unfeature') {
      updateData.is_featured = false;
    }

    // Update the image
    const { data: updatedImage, error: updateError } = await supabase
      .from('generated_images')
      .update(updateData)
      .eq('id', imageId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
    }

    // Log the moderation action
    await supabase
      .from('moderation_log')
      .insert({
        teacher_id: user.id,
        image_id: imageId,
        action,
        reason: reason || null,
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      image: updatedImage,
      message: action === 'approve' 
        ? 'Image approved! ✅' 
        : action === 'reject' 
        ? 'Image rejected.' 
        : action === 'feature'
        ? 'Image featured! ⭐'
        : 'Image unfeatured.'
    });
  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Permanently delete an image (teacher only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a teacher
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, classroom_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
    }

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get the image
    const { data: image, error: imageError } = await supabase
      .from('generated_images')
      .select(`
        id, user_id, image_url,
        profiles:user_id (classroom_id)
      `)
      .eq('id', imageId)
      .single();

    if (imageError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify the image belongs to a student in teacher's classroom
    // Handle both array and object return types from Supabase joins
    const profileData = image.profiles;
    const imageClassroom = Array.isArray(profileData) 
      ? profileData[0]?.classroom_id 
      : (profileData as { classroom_id: string } | null)?.classroom_id;
    if (imageClassroom !== profile.classroom_id) {
      return NextResponse.json({ 
        error: 'Not authorized to delete this image' 
      }, { status: 403 });
    }

    // Delete from storage
    if (image.image_url && image.image_url.includes('mythology-images')) {
      try {
        const urlParts = image.image_url.split('mythology-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage
            .from('mythology-images')
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error('Storage delete error:', storageError);
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

    // Log the deletion
    await supabase
      .from('moderation_log')
      .insert({
        teacher_id: user.id,
        image_id: imageId,
        action: 'delete',
        reason: 'Permanently deleted by teacher',
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: 'Image permanently deleted'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
