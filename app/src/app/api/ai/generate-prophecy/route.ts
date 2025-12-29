// =====================================================
// GENERATE PROPHECY API
// Uses GPT-4 to create mystical prophecy text from a story
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyTitle, storyContent, mythologyName, mythologyStyle, relatedCharacter } = body;

    if (!storyTitle || !storyContent) {
      return NextResponse.json(
        { success: false, error: 'Story title and content required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an ancient oracle who speaks in mysterious prophecies. 
Your prophecies are poetic, cryptic, and hint at the events of mythology stories without being too literal.

Your prophecies should:
1. Be 3-5 lines of poetic verse
2. Use archaic/mystical language ("thee", "shall", "behold", "ere")
3. Reference key story elements symbolically
4. Sound mysterious and ancient
5. Be appropriate for children (no dark or scary content)

${mythologyStyle ? `Use imagery and references fitting ${mythologyStyle} mythology.` : ''}`;

    const userPrompt = `Create a mystical prophecy based on this mythology story:

**Title:** ${storyTitle}
**From:** ${mythologyName || 'Ancient Mythology'}
${relatedCharacter ? `**Key Figure:** ${relatedCharacter}` : ''}

**The Story:**
${storyContent.slice(0, 1500)}

Write ONLY the prophecy text (3-5 poetic lines), no introduction or explanation.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const prophecy = response.choices[0]?.message?.content?.trim() || 
      'When stars align and shadows flee,\nThe chosen one shall set us free.\nThrough trials dark and waters deep,\nThe ancient oath they all shall keep.';

    return NextResponse.json({
      success: true,
      prophecy,
    });
  } catch (error) {
    console.error('Error generating prophecy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to divine the prophecy' },
      { status: 500 }
    );
  }
}
