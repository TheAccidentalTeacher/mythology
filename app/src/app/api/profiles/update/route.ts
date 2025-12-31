import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS during signup
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, classroomId, role, displayName, schoolName, gradeLevel } = body;

    console.log('📝 Profile update request:', { userId, classroomId, role });

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      role: role || 'student',
      display_name: displayName,
    };

    if (classroomId) {
      updateData.classroom_id = classroomId;
    }

    if (role === 'teacher') {
      if (schoolName) updateData.school_name = schoolName;
      if (gradeLevel) updateData.grade_level = gradeLevel;
    }

    console.log('📝 Updating profile with:', updateData);

    // Update profile using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Profile update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully:', data);

    return NextResponse.json({
      success: true,
      profile: data,
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
