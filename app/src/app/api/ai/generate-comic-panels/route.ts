// =====================================================
// GENERATE COMIC PANELS API
// Uses GPT-4 to break a story into comic panel descriptions
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyTitle, storyContent, characters, panelCount, mythologyName } = body;

    if (!storyTitle || !storyContent) {
      return NextResponse.json(
        { success: false, error: 'Story title and content required' },
        { status: 400 }
      );
    }

    const numPanels = panelCount || 4;

    const systemPrompt = `You are a comic book artist planning a ${numPanels}-panel comic strip adaptation of a mythology story. 
Your job is to break down the story into ${numPanels} distinct visual scenes that tell the story clearly.

Each panel description should:
1. Be a clear, visual scene description (2-3 sentences)
2. Include specific character poses, expressions, and actions
3. Describe the setting/background
4. Capture a key moment that advances the story
5. Be suitable for AI image generation

The panels should flow naturally and tell the complete story arc:
- Panel 1: Setup/introduction
- Middle panels: Rising action and key moments  
- Final panel: Climax or resolution`;

    const userPrompt = `Create ${numPanels} comic panel descriptions for this mythology story:

**Title:** ${storyTitle}
**From:** ${mythologyName || 'Original Mythology'}
**Characters:** ${characters?.join(', ') || 'Various characters'}

**Story:**
${storyContent}

Return ONLY a JSON array of ${numPanels} panel descriptions, no other text. Example format:
["Panel 1 description here", "Panel 2 description here", ...]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Parse the JSON array from the response
    let panels: string[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        panels = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines if not valid JSON
        panels = content.split('\n').filter(line => line.trim()).slice(0, numPanels);
      }
    } catch {
      // If parsing fails, split the content into panels
      panels = content.split('\n').filter(line => line.trim()).slice(0, numPanels);
    }

    // Ensure we have the right number of panels
    while (panels.length < numPanels) {
      panels.push(`Scene ${panels.length + 1} of the story`);
    }

    return NextResponse.json({
      success: true,
      panels: panels.slice(0, numPanels),
    });
  } catch (error) {
    console.error('Error generating comic panels:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate comic panels' },
      { status: 500 }
    );
  }
}
