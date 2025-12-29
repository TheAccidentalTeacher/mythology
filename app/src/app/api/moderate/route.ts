import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/lib/openai/moderation';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

/**
 * Moderation API Route
 * 
 * POST /api/moderate
 * 
 * Body:
 * {
 *   content: string,
 *   contentType: 'mythology' | 'character' | 'creature' | 'story',
 *   contentId: string,
 *   userId: string
 * }
 * 
 * Returns:
 * {
 *   flagged: boolean,
 *   severity: 'low' | 'medium' | 'high' | 'critical',
 *   categories: string[],
 *   action: 'allow' | 'review' | 'block'
 * }
 */
export async function POST(req: NextRequest) {
  console.log('🛡️ Moderation API called');

  try {
    const { content, contentType, contentId, userId } = await req.json();

    if (!content || !contentType || !contentId || !userId) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`📝 Moderating ${contentType} (${contentId}) for user ${userId}`);

    // Run OpenAI moderation
    const result = await moderateContent(content);

    // Determine action
    let action: 'allow' | 'review' | 'block' = 'allow';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (result.flagged) {
      // Check severity
      const maxScore = Math.max(...Object.values(result.category_scores));
      
      if (maxScore >= 0.95 || result.categories['sexual/minors']) {
        severity = 'critical';
        action = 'block';
      } else if (maxScore >= 0.85) {
        severity = 'high';
        action = 'block';
      } else if (maxScore >= 0.7) {
        severity = 'medium';
        action = 'review';
      } else {
        severity = 'low';
        action = 'review';
      }

      console.warn(`⚠️ Content flagged: ${severity} - ${action}`);
      console.warn(`   Categories: ${result.flagged_categories.join(', ')}`);

      // Log to moderation_flags table
      const { error: logError } = await supabaseAdmin
        .from('moderation_flags')
        .insert([{
          content_id: contentId,
          content_type: contentType,
          flagged_categories: result.flagged_categories,
          scores: result.category_scores,
          severity,
          action,
          user_id: userId,
        }]);

      if (logError) {
        console.error('❌ Failed to log moderation flag:', logError);
      }

      // If blocked, hide the content immediately
      if (action === 'block') {
        const table = contentType === 'mythology' ? 'mythologies' 
          : contentType === 'character' ? 'characters'
          : contentType === 'creature' ? 'creatures'
          : null;

        if (table) {
          await supabaseAdmin
            .from(table)
            .update({ visibility: 'hidden', locked_by_teacher: true })
            .eq('id', contentId);
          
          console.log(`🔒 Content auto-blocked and hidden`);
        }
      }
    } else {
      console.log('✅ Content passed moderation');
    }

    return NextResponse.json({
      flagged: result.flagged,
      severity,
      categories: result.flagged_categories,
      action,
    });

  } catch (error: unknown) {
    console.error('💥 Moderation API error:', error);
    return NextResponse.json(
      { error: 'Moderation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
