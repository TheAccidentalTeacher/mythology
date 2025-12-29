import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Classroom API called');
    const body = await request.json();
    const { name, teacher_id, invite_code, school_year, school_name, grade_level } = body;

    console.log('📋 Request data:', { name, teacher_id, invite_code, school_year, school_name, grade_level });

    // Validate required fields
    if (!name || !teacher_id || !invite_code) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Wait for profile to be created by trigger (retry up to 10 times with exponential backoff)
    console.log('🔍 Checking for profile existence...');
    let profileExists = false;
    for (let i = 0; i < 10; i++) {
      console.log(`⏳ Retry attempt ${i + 1}/10...`);
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', teacher_id)
        .single();
      
      if (error) {
        console.log(`  ℹ️ Profile not found yet:`, error.message);
      }
      
      if (profile) {
        console.log('✅ Profile found:', profile);
        profileExists = true;
        
        // Update profile with school info
        console.log('📝 Updating profile with school info...');
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            school_name,
            grade_level,
          })
          .eq('id', teacher_id);
        
        if (updateError) {
          console.error('⚠️ Profile update error:', updateError);
        } else {
          console.log('✅ Profile updated with school info');
        }
        
        break;
      }
      
      // Exponential backoff: 200ms, 400ms, 800ms, etc.
      const waitTime = 200 * Math.pow(2, i);
      console.log(`  ⏱️ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    if (!profileExists) {
      console.error('❌ Profile not found after 10 retries');
      return NextResponse.json(
        { error: 'Profile not found after waiting. Please try again.' },
        { status: 404 }
      );
    }

    // Create classroom using admin client (bypasses RLS)
    console.log('🏫 Creating classroom...');
    const { data, error } = await supabaseAdmin
      .from('classrooms')
      .insert({
        name,
        teacher_id,
        invite_code,
        school_year: school_year || '2025-2026',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Classroom creation error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Classroom created:', data);

    // Update the teacher's profile with the classroom_id
    console.log('🔗 Linking classroom to teacher profile...');
    const { error: linkError } = await supabaseAdmin
      .from('profiles')
      .update({ classroom_id: data.id })
      .eq('id', teacher_id);
    
    if (linkError) {
      console.error('⚠️ Failed to link classroom to profile:', linkError);
    } else {
      console.log('✅ Classroom linked to teacher profile');
    }

    console.log('🎉 Classroom API completed successfully');
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('💥 Unexpected error in classroom API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
