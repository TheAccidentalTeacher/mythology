import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a gentle, encouraging writing tutor for students in grades 3-12. Review this student's work and provide KIND, CONSTRUCTIVE feedback. Focus on:

1. Grammar and spelling (only major issues, not nitpicking)
2. Sentence structure and clarity
3. Organization and flow
4. Vocabulary and word choice

IMPORTANT:
- Be EXTREMELY encouraging and positive
- Don't be harsh or discouraging
- Praise what they did well first
- Suggest improvements gently ("You might consider..." not "You should...")
- Keep it age-appropriate and supportive
- Don't rewrite their work - just suggest improvements

Student's work:
${content}

Return a JSON object with:
{
  "strengths": ["positive observation 1", "positive observation 2"],
  "suggestions": [
    {"issue": "brief description", "suggestion": "gentle improvement idea"}
  ],
  "encouragement": "overall encouraging message"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive writing tutor. Always be encouraging and kind. Never be harsh or discouraging. Focus on helping students grow, not pointing out every tiny mistake.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
    });

    const feedbackText = completion.choices[0]?.message?.content || '{}';
    const feedback = JSON.parse(feedbackText);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error generating writing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate writing feedback' },
      { status: 500 }
    );
  }
}
