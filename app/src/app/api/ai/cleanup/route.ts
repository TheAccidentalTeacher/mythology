import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, mode = 'cleanup' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Different prompts based on mode
    const prompts: Record<string, string> = {
      cleanup: `You are helping a middle school student (grades 6-8) clean up their voice-to-text transcription. 
Fix any grammar, spelling, and punctuation errors while preserving their original meaning and voice.
Make minimal changes - only fix clear errors. Keep their vocabulary level and writing style.
Do not add new content or change their ideas.

Original text:
${text}

Return ONLY the cleaned up text, nothing else.`,
      
      format: `You are helping a middle school student (grades 6-8) format their text.
Add proper paragraph breaks, fix run-on sentences, and improve readability.
Keep their original words and ideas - just improve the formatting.

Original text:
${text}

Return ONLY the formatted text, nothing else.`,
      
      expand: `You are helping a middle school student (grades 6-8) expand their ideas.
They've written a brief description using voice-to-text. Help them add more descriptive details while keeping their voice.
Add 1-2 more sentences that expand on their ideas. Keep the same vocabulary level.

Original text:
${text}

Return the expanded text, nothing else.`,
    };

    const prompt = prompts[mode] || prompts.cleanup;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant for middle school students. Be supportive and make minimal changes to preserve their voice.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent corrections
    });

    const cleanedText = response.choices[0]?.message?.content?.trim();

    if (!cleanedText) {
      return NextResponse.json({ error: 'Failed to process text' }, { status: 500 });
    }

    return NextResponse.json({
      original: text,
      cleaned: cleanedText,
      mode,
    });
  } catch (error) {
    console.error('AI cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to process text with AI' },
      { status: 500 }
    );
  }
}
