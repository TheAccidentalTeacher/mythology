// Image Generation API - Generate AI images for mythology entities
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  generateImage, 
  ImageGenerationRequest,
  DEFAULT_IMAGE_SETTINGS,
  EntityType,
  ImageStyle
} from '@/lib/imageGen';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      entityType, 
      entityId, 
      entityName, 
      entityDescription,
      mythologyName,
      mythologyStyle,
      stylePreset,
      studentAddition 
    } = body;

    // Validate required fields
    if (!entityType || !entityId || !entityName) {
      return NextResponse.json({ 
        error: 'Missing required fields: entityType, entityId, entityName' 
      }, { status: 400 });
    }

    // Get user's profile and image stats
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        role,
        image_tokens,
        total_images_generated,
        images_generated_today,
        last_image_generation_date,
        classroom_id
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // 🔑 TEACHER/ADMIN BYPASS - Unlimited generation for teachers and admins
    const isPrivileged = profile?.role === 'teacher' || profile?.role === 'admin';
    
    // 🔧 DEV CHEAT CODE - Check for secret header (for testing as student)
    const cheatHeader = request.headers.get('x-dev-cheat');
    const expectedSecret = process.env.DEV_CHEAT_SECRET || 'mythology-dev-2024';
    const devCheatEnabled = cheatHeader === expectedSecret;
    
    // Debug logging for cheat mode
    if (cheatHeader) {
      console.log('🔧 Cheat header received:', cheatHeader);
      console.log('🔧 Expected secret:', expectedSecret);
      console.log('🔧 Cheat enabled:', devCheatEnabled);
    }
    
    // Combined unlimited access check
    const hasUnlimitedAccess = isPrivileged || devCheatEnabled;

    // Get classroom settings
    let settings = DEFAULT_IMAGE_SETTINGS;
    
    if (profile?.classroom_id) {
      const { data: classSettings } = await supabase
        .from('classroom_image_settings')
        .select('*')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classSettings) {
        settings = {
          ...DEFAULT_IMAGE_SETTINGS,
          ...classSettings,
        };
      }
    }

    // Check if image generation is enabled (teachers can always generate)
    if (!settings.imageGenEnabled && !hasUnlimitedAccess) {
      return NextResponse.json({ 
        error: 'Image generation is currently disabled by your teacher.' 
      }, { status: 403 });
    }

    // Check daily limit (teachers/admins bypass this)
    const today = new Date().toDateString();
    const lastGenDate = profile?.last_image_generation_date 
      ? new Date(profile.last_image_generation_date).toDateString() 
      : null;
    
    const imagesGeneratedToday = lastGenDate === today 
      ? (profile?.images_generated_today || 0) 
      : 0;

    if (!hasUnlimitedAccess && imagesGeneratedToday >= settings.dailyLimitPerStudent) {
      return NextResponse.json({ 
        error: `You've reached your daily limit of ${settings.dailyLimitPerStudent} images. Come back tomorrow! 🎨`,
        imagesRemainingToday: 0,
        dailyLimit: settings.dailyLimitPerStudent
      }, { status: 429 });
    }

    // Check tokens (first N images are free) - Teachers/admins bypass this
    const totalGenerated = profile?.total_images_generated || 0;
    const freeImagesRemaining = Math.max(0, settings.freeImageCount - totalGenerated);
    const tokensAvailable = profile?.image_tokens || 0;

    if (!hasUnlimitedAccess && freeImagesRemaining === 0 && tokensAvailable < 1) {
      return NextResponse.json({ 
        error: 'You need more image tokens! Complete math quizzes to earn tokens. 🧮',
        tokensRemaining: 0,
        freeImagesRemaining: 0
      }, { status: 402 });
    }

    // Build the generation request
    const genRequest: ImageGenerationRequest = {
      userId: user.id,
      entityType: entityType as EntityType,
      entityId,
      entityName,
      entityDescription: entityDescription || '',
      mythologyName,
      mythologyStyle,
      stylePreset: (stylePreset || 'illustrated-storybook') as ImageStyle,
      studentAddition,
    };

    // Generate the image
    console.log(`🖼️ Generating image for ${entityName} (${entityType})...`);
    const result = await generateImage(genRequest);

    if (!result.success) {
      // If safety check failed, return specific error
      if (!result.safetyCheck.allowed) {
        return NextResponse.json({ 
          error: result.safetyCheck.errors.join(' '),
          safetyWarnings: result.safetyCheck.warnings,
          allowed: false
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: result.error || 'Image generation failed. Please try again.' 
      }, { status: 500 });
    }

    // Determine if image needs teacher approval
    const needsApproval = settings.requireApproval || result.safetyCheck.shouldFlagForReview;
    const status = needsApproval ? 'pending' : 'approved';

    // Store the image in Supabase Storage
    let imageUrl: string;
    
    if (result.imageFormat === 'base64' && result.imageData) {
      // Upload base64 image to Supabase Storage
      const fileName = `${entityType}/${entityId}_${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;
      
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mythology-images')
        .upload(filePath, imageBuffer, {
          contentType: result.mimeType || 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({ 
          error: 'Failed to save image. Please try again.' 
        }, { status: 500 });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mythology-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    } else if (result.imageFormat === 'url' && result.imageData) {
      // For URL-based images (like DALL-E), we should download and re-upload
      // For now, just use the URL directly (but it will expire)
      // TODO: Download and re-upload DALL-E images
      imageUrl = result.imageData;
    } else {
      return NextResponse.json({ 
        error: 'No image data received' 
      }, { status: 500 });
    }

    // Save image record to database
    const { data: imageRecord, error: insertError } = await supabase
      .from('generated_images')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId,
        prompt: result.prompt,
        student_addition: studentAddition || null,
        style_preset: stylePreset || 'illustrated-storybook',
        image_url: imageUrl,
        status,
        flagged_reason: result.safetyCheck.shouldFlagForReview 
          ? 'Auto-flagged for review' 
          : null,
        is_featured: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Image record insert error:', insertError);
      // Image was generated and uploaded, but we couldn't save the record
      // This is not ideal, but we can still return success
    }

    // Update user stats (teachers don't use tokens)
    const usesFreeImage = !hasUnlimitedAccess && freeImagesRemaining > 0;
    const tokensToDeduct = hasUnlimitedAccess ? 0 : (usesFreeImage ? 0 : 1);
    const newImagesGeneratedToday = imagesGeneratedToday + 1;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        image_tokens: Math.max(0, tokensAvailable - tokensToDeduct),
        total_images_generated: totalGenerated + 1,
        images_generated_today: newImagesGeneratedToday,
        last_image_generation_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
    }

    console.log(`✅ Image generated successfully for ${entityName}!`);

    return NextResponse.json({
      success: true,
      imageId: imageRecord?.id,
      imageUrl,
      status,
      provider: result.provider,
      tokensRemaining: Math.max(0, tokensAvailable - tokensToDeduct),
      freeImagesRemaining: Math.max(0, freeImagesRemaining - (usesFreeImage ? 1 : 0)),
      imagesRemainingToday: settings.dailyLimitPerStudent - newImagesGeneratedToday,
      dailyLimit: settings.dailyLimitPerStudent,
      warnings: result.safetyCheck.warnings,
      needsApproval,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - Get user's image stats and available tokens
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        role,
        image_tokens,
        total_images_generated,
        images_generated_today,
        last_image_generation_date,
        quiz_streak,
        classroom_id
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Get classroom settings
    let settings = DEFAULT_IMAGE_SETTINGS;
    
    if (profile?.classroom_id) {
      const { data: classSettings } = await supabase
        .from('classroom_image_settings')
        .select('*')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classSettings) {
        settings = {
          ...DEFAULT_IMAGE_SETTINGS,
          ...classSettings,
        };
      }
    }

    // Calculate today's usage
    const today = new Date().toDateString();
    const lastGenDate = profile?.last_image_generation_date 
      ? new Date(profile.last_image_generation_date).toDateString() 
      : null;
    
    const imagesGeneratedToday = lastGenDate === today 
      ? (profile?.images_generated_today || 0) 
      : 0;

    const totalGenerated = profile?.total_images_generated || 0;
    const freeImagesRemaining = Math.max(0, settings.freeImageCount - totalGenerated);

    // 🔑 TEACHER/ADMIN BYPASS - Show unlimited for privileged users
    const isPrivileged = profile?.role === 'teacher' || profile?.role === 'admin';

    return NextResponse.json({
      success: true,
      isPrivileged, // Let frontend know they have unlimited access
      stats: {
        imageTokens: isPrivileged ? 999 : (profile?.image_tokens || 0),
        quizStreak: profile?.quiz_streak || 0,
        totalImagesGenerated: totalGenerated,
        imagesGeneratedToday,
        freeImagesRemaining: isPrivileged ? 999 : freeImagesRemaining,
        freeImageLimit: settings.freeImageCount,
        dailyLimit: isPrivileged ? 999 : settings.dailyLimitPerStudent,
        imagesRemainingToday: isPrivileged ? 999 : Math.max(0, settings.dailyLimitPerStudent - imagesGeneratedToday),
        canGenerate: isPrivileged || ((freeImagesRemaining > 0 || (profile?.image_tokens || 0) > 0) 
          && imagesGeneratedToday < settings.dailyLimitPerStudent
          && settings.imageGenEnabled),
      },
      settings: {
        imageGenEnabled: settings.imageGenEnabled,
        requireApproval: settings.requireApproval,
        questionsPerToken: settings.questionsPerToken,
      }
    });
  } catch (error) {
    console.error('Image stats error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
