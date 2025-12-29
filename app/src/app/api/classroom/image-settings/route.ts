// Classroom Image Settings API - Teacher configuration for image generation
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch current classroom settings
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile and classroom
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, classroom_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (!profile.classroom_id) {
      return NextResponse.json({ error: 'No classroom assigned' }, { status: 400 });
    }

    // Get classroom settings
    const { data: settings, error: settingsError } = await supabase
      .from('classroom_image_settings')
      .select('*')
      .eq('classroom_id', profile.classroom_id)
      .single();

    // If no settings exist yet, return defaults
    if (settingsError && settingsError.code === 'PGRST116') {
      return NextResponse.json({
        success: true,
        settings: null, // Use defaults in frontend
        isDefault: true
      });
    }

    if (settingsError) {
      console.error('Settings fetch error:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Convert snake_case to camelCase for frontend
    const formattedSettings = {
      imageGenEnabled: settings.image_gen_enabled,
      requireApproval: settings.require_approval,
      dailyLimitPerStudent: settings.daily_limit_per_student,
      freeImageCount: settings.free_image_count,
      questionsPerToken: settings.questions_per_token,
      allowedStyles: settings.allowed_styles,
      blockedMathTopics: settings.blocked_math_topics || [],
      maxStudentAdditionLength: settings.max_student_addition_length,
      customBlockedTerms: settings.custom_blocked_terms || [],
    };

    return NextResponse.json({
      success: true,
      settings: formattedSettings,
      isDefault: false
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// PUT - Update classroom settings (teacher only)
export async function PUT(request: NextRequest) {
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

    if (!profile.classroom_id) {
      return NextResponse.json({ error: 'No classroom assigned' }, { status: 400 });
    }

    const body = await request.json();

    // Validate settings
    const {
      imageGenEnabled,
      requireApproval,
      dailyLimitPerStudent,
      freeImageCount,
      questionsPerToken,
      allowedStyles,
      blockedMathTopics,
      maxStudentAdditionLength,
      customBlockedTerms,
    } = body;

    // Convert camelCase to snake_case for database
    const dbSettings = {
      classroom_id: profile.classroom_id,
      image_gen_enabled: imageGenEnabled ?? true,
      require_approval: requireApproval ?? true,
      daily_limit_per_student: Math.min(20, Math.max(1, dailyLimitPerStudent ?? 3)),
      free_image_count: Math.min(20, Math.max(0, freeImageCount ?? 5)),
      questions_per_token: Math.min(10, Math.max(1, questionsPerToken ?? 3)),
      allowed_styles: allowedStyles ?? [],
      blocked_math_topics: blockedMathTopics ?? [],
      max_student_addition_length: Math.min(200, Math.max(0, maxStudentAdditionLength ?? 100)),
      custom_blocked_terms: customBlockedTerms ?? [],
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };

    // Upsert settings (create if doesn't exist, update if does)
    const { data: savedSettings, error: saveError } = await supabase
      .from('classroom_image_settings')
      .upsert(dbSettings, {
        onConflict: 'classroom_id',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save settings error:', saveError);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: savedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
