// =====================================================
// AI USAGE API ENDPOINT
// Check and retrieve AI usage information
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/aiClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const usageCheck = await aiClient.checkUsage(userId);

    return NextResponse.json({
      success: true,
      allowed: usageCheck.allowed,
      remaining: usageCheck.remaining,
      limit: usageCheck.limit,
      reason: usageCheck.reason,
    });
  } catch (error) {
    console.error('AI usage check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
