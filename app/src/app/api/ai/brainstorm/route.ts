// =====================================================
// AI BRAINSTORM API ENDPOINT
// Generate name suggestions and creative ideas
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/aiClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, entityType, mythologyContext, constraints } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!entityType || !mythologyContext) {
      return NextResponse.json(
        { success: false, error: 'Entity type and mythology context required' },
        { status: 400 }
      );
    }

    const result = await aiClient.brainstormNames(
      userId,
      entityType,
      mythologyContext,
      constraints
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI brainstorm error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
