// =====================================================
// AI ASSIST API ENDPOINT
// Main endpoint for field-level AI assistance
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/aiClient';
import { FIELD_HELP_PROMPTS, type FieldContext, type AssistanceType } from '@/lib/ai/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, fieldContext, assistanceType, customPrompt } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (type !== 'field_help') {
      return NextResponse.json(
        { success: false, error: 'Invalid request type' },
        { status: 400 }
      );
    }

    if (!fieldContext || !assistanceType) {
      return NextResponse.json(
        { success: false, error: 'Field context and assistance type required' },
        { status: 400 }
      );
    }

    // Get the appropriate prompt
    let prompt = customPrompt;
    
    if (!prompt) {
      // Build prompt from library
      prompt = buildPromptFromLibrary(fieldContext, assistanceType);
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Could not build prompt for this field' },
        { status: 400 }
      );
    }

    // Make the AI request
    const result = await aiClient.getFieldHelp(
      userId,
      fieldContext,
      assistanceType,
      prompt
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI assist error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Build prompt from the prompt library
function buildPromptFromLibrary(
  context: FieldContext,
  assistanceType: AssistanceType
): string | null {
  const entityPrompts = FIELD_HELP_PROMPTS[context.entityType];
  if (!entityPrompts) return null;

  const fieldPrompts = entityPrompts[context.fieldName as keyof typeof entityPrompts];
  if (!fieldPrompts) {
    // Use generic prompts for fields not in the library
    return buildGenericPrompt(context, assistanceType);
  }

  const promptGenerator = fieldPrompts[assistanceType as keyof typeof fieldPrompts] as unknown;
  if (!promptGenerator) {
    return buildGenericPrompt(context, assistanceType);
  }

  // Call the prompt generator function
  if (typeof promptGenerator === 'function') {
    return (promptGenerator as (ctx: FieldContext) => string)(context);
  }

  return null;
}

// Generic prompts for fields not specifically defined
function buildGenericPrompt(
  context: FieldContext,
  assistanceType: AssistanceType
): string {
  const fieldDisplay = context.fieldName.replace(/_/g, ' ');
  
  switch (assistanceType) {
    case 'give_ideas':
      return `Help the student brainstorm ideas for the "${fieldDisplay}" field of their ${context.entityType}.

Context:
- Mythology: "${context.mythologyName}"
- Entity type: ${context.entityType}
${context.existingContent ? `- Current content: "${context.existingContent}"` : '- Currently empty'}

Provide 3-5 creative suggestions or starting points. Don't write it for them - inspire them!`;

    case 'ask_questions':
      return `The student needs help with the "${fieldDisplay}" field for their ${context.entityType} in "${context.mythologyName}".

Ask 4-5 thoughtful questions that will help them discover what to write. Questions should:
- Unlock their creativity
- Connect to the mythology's themes
- Be fun and engaging`;

    case 'improve':
      return `The student wrote this for "${fieldDisplay}":
"${context.existingContent}"

Provide constructive feedback:
1. What's working well (be specific)
2. One area to potentially expand or clarify
3. A specific tip to try

Keep feedback encouraging!`;

    case 'check_fit':
      return `Does this ${fieldDisplay} fit well in "${context.mythologyName}"?

Content: "${context.existingContent}"

Analyze:
1. Does it match the mythology's style and theme?
2. Is it consistent with other elements?
3. Any suggestions for better integration?`;

    case 'show_examples':
      return `Show 2-3 example approaches for the "${fieldDisplay}" field.

Context:
- Mythology style: ${context.mythologyCategory || 'Custom'}
- Entity type: ${context.entityType}

Provide brief examples that inspire without being copied directly.`;

    default:
      return `Help with the "${fieldDisplay}" field for a ${context.entityType} in "${context.mythologyName}".`;
  }
}
