// =====================================================
// AI NAME SUGGESTIONS API ENDPOINT
// Generates contextual name suggestions for characters/creatures
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/aiClient';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      mythologyId, 
      category, // e.g., "Storm-related", "Moon/Night", etc.
      entityType, // "character" or "creature"
      existingName, // optional - if they want to refine a name
    } = body;

    if (!mythologyId || !category) {
      return NextResponse.json(
        { success: false, error: 'Mythology ID and category required' },
        { status: 400 }
      );
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Auth error:', userError);
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Fetch mythology context - use minimal fields and ignore missing optional data
    const { data: mythology, error: mythError } = await supabase
      .from('mythologies')
      .select('name, genre, geography_type, setting_description, cultural_inspiration, five_themes')
      .eq('id', mythologyId)
      .single();

    console.log('🔍 Mythology query result:', { 
      mythologyId, 
      found: !!mythology, 
      error: mythError?.message,
      errorDetails: mythError 
    });

    // If we can't find the mythology, just use generic context
    const mythologyContext = mythology || {
      name: 'Your Mythology',
      genre: 'fantasy',
      geography_type: 'islands',
      setting_description: 'A mythological world',
      cultural_inspiration: 'mixed',
      five_themes: {}
    };

    // Build the prompt
    const prompt = buildNameSuggestionPrompt(mythologyContext, category, entityType, existingName);

    // Make AI request using the aiClient's request method
    const result = await aiClient.request({
      userId: user.id,
      prompt,
      requestType: 'brainstorm',
      maxTokens: 500,
      temperature: 0.8, // A bit creative for names
    });

    if (!result.success || !result.content) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate suggestions' },
        { status: 500 }
      );
    }

    // Parse the response to extract names
    const names = parseNameSuggestions(result.content);

    return NextResponse.json({
      success: true,
      suggestions: names,
      rawResponse: result.content,
    });
  } catch (error) {
    console.error('Name suggestions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface MythologyContext {
  name: string;
  genre?: string;
  geography_type?: string;
  setting_description?: string;
  cultural_inspiration?: string;
  five_themes?: {
    location?: string;
    place?: string;
    interaction?: string;
    movement?: string;
    regions?: string;
  };
}

function buildNameSuggestionPrompt(
  mythology: MythologyContext,
  category: string,
  entityType: string = 'character',
  existingName?: string
): string {
  const entityLabel = entityType === 'creature' ? 'creature/beast' : 'character/deity';
  
  let context = `You are helping a middle school student name a ${entityLabel} for their original mythology called "${mythology.name}".`;
  
  if (mythology.genre) {
    context += `\n- Genre: ${mythology.genre}`;
  }
  if (mythology.geography_type) {
    context += `\n- Setting: ${mythology.geography_type}`;
  }
  if (mythology.cultural_inspiration) {
    context += `\n- Cultural inspiration: ${mythology.cultural_inspiration}`;
  }
  if (mythology.setting_description) {
    context += `\n- World description: ${mythology.setting_description}`;
  }
  if (mythology.five_themes?.location) {
    context += `\n- Location theme: ${mythology.five_themes.location}`;
  }
  if (mythology.five_themes?.place) {
    context += `\n- What makes this world unique: ${mythology.five_themes.place}`;
  }

  let instruction = '';
  
  if (existingName) {
    instruction = `
The student has a name idea: "${existingName}" and wants variations or refinements.

Generate 5 name variations that:
1. Keep the essence or meaning of "${existingName}"
2. Fit the "${category}" theme they selected
3. Sound mythological and memorable
4. Would fit naturally in their mythology world

For each name, briefly explain what it means or why it fits.`;
  } else {
    instruction = `
The student selected the "${category}" theme for their ${entityLabel}'s name.

Generate 5 unique name suggestions that:
1. Fit the "${category}" theme
2. Sound mythological, powerful, and memorable
3. Would fit naturally in their "${mythology.name}" mythology
4. Are appropriate for middle school students
5. Are original (not famous existing mythology names like Zeus or Thor)

For each name, briefly explain what it means or evokes.`;
  }

  return `${context}

${instruction}

Format your response as a numbered list like this:
1. **NameHere** - Brief explanation of meaning/origin
2. **AnotherName** - Brief explanation
...and so on.

Keep explanations short (one sentence). Make names easy to pronounce.`;
}

interface NameSuggestion {
  name: string;
  explanation: string;
}

function parseNameSuggestions(text: string): NameSuggestion[] {
  const suggestions: NameSuggestion[] = [];
  
  // Match patterns like "1. **Name** - explanation" or "1. Name - explanation"
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Try to match numbered list items
    const match = line.match(/^\d+\.\s*\*?\*?([^*\-–—]+)\*?\*?\s*[-–—]\s*(.+)$/);
    if (match) {
      const name = match[1].trim();
      const explanation = match[2].trim();
      if (name && explanation) {
        suggestions.push({ name, explanation });
      }
    }
  }

  // If parsing failed, try a simpler approach
  if (suggestions.length === 0) {
    // Look for bold names
    const boldMatches = text.matchAll(/\*\*([^*]+)\*\*\s*[-–—:]\s*([^*\n]+)/g);
    for (const match of boldMatches) {
      suggestions.push({
        name: match[1].trim(),
        explanation: match[2].trim(),
      });
    }
  }

  return suggestions.slice(0, 6); // Max 6 suggestions
}
