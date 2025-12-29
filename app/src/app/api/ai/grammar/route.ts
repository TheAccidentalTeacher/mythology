// =====================================================
// AI GRAMMAR API ENDPOINT
// Grammar checking and writing improvement
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/aiClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text, contentType } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text content required' },
        { status: 400 }
      );
    }

    // Limit text length for grammar checking
    const maxLength = 5000;
    const truncatedText = text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;

    const result = await aiClient.checkGrammar(
      userId,
      truncatedText,
      contentType || 'general'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI grammar error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
