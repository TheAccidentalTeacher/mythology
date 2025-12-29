// =====================================================
// AI WIZARD API ENDPOINT
// Mythology creation wizard assistance
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

// Helper to get the full category name and cultural context
function getCategoryContext(category: string): { name: string; culturalNotes: string } {
  const categories: Record<string, { name: string; culturalNotes: string }> = {
    greek_roman: {
      name: 'Greek/Roman (Classical)',
      culturalNotes: 'Names should sound Mediterranean - Greek or Latin roots. Think names ending in -us, -ia, -os. Examples: Zeus, Athena, Minerva, Apollo.',
    },
    norse: {
      name: 'Norse/Viking',
      culturalNotes: 'Names should sound Scandinavian - Old Norse roots. Think names with Thor-, Frey-, -heim, -gard. Examples: Odin, Freya, Asgard, Mjolnir.',
    },
    egyptian: {
      name: 'Egyptian',
      culturalNotes: 'Names should sound ancient Egyptian. Think names with Ra-, -is, -en, Amen-. Examples: Osiris, Isis, Anubis, Sekhmet.',
    },
    celtic: {
      name: 'Celtic',
      culturalNotes: 'Names should sound Irish/Welsh/Scottish. Think names with Bri-, Mór-, -wen, -an. Examples: Brigid, Morrigan, Cernunnos, Danu.',
    },
    asian: {
      name: 'Asian',
      culturalNotes: 'Names can draw from Chinese, Japanese, or other Asian traditions. Think names with meaning in nature, virtues, or elements.',
    },
    african: {
      name: 'African',
      culturalNotes: 'Names should reflect African linguistic patterns. Many names have meanings related to nature, virtues, or ancestors.',
    },
    indigenous_americas: {
      name: 'Indigenous Americas',
      culturalNotes: 'Names should reflect Native American linguistic patterns from Central/South America. Often descriptive, relating to nature, animals, or qualities.',
    },
    alaska_native: {
      name: 'Alaska Native',
      culturalNotes: `Names should reflect Alaska Native cultures (Ahtna, Yup'ik, Tlingit, Inupiaq). 
- Ahtna (Copper River region): Names often relate to the land, animals, and natural features. The word "Ahtna" means "Ice People."
- Consider names that reference: ravens, salmon, caribou, bears, glaciers, northern lights, mountains, rivers
- Names can be descriptive of qualities or natural phenomena
- Examples of sounds: -na, -tna, Dene-, -'a (glottal stops are common)
- The land itself is sacred - mountains, rivers, and glaciers often have spiritual significance`,
    },
    mesopotamian: {
      name: 'Mesopotamian',
      culturalNotes: 'Names should sound ancient Sumerian, Babylonian, or Akkadian. Examples: Gilgamesh, Ishtar, Marduk, Tiamat.',
    },
    polynesian: {
      name: 'Polynesian',
      culturalNotes: 'Names should reflect Hawaiian, Maori, or other Pacific Island traditions. Often relate to ocean, sky, and volcanic features.',
    },
    hindu: {
      name: 'Hindu',
      culturalNotes: 'Names from Sanskrit traditions. Often have deep meanings related to qualities, elements, or cosmic concepts.',
    },
    japanese: {
      name: 'Japanese (Shinto)',
      culturalNotes: 'Names should sound Japanese. Kami (spirits) often have -no-kami suffix. Nature spirits are common.',
    },
    chinese: {
      name: 'Chinese',
      culturalNotes: 'Names often have meanings - dragons, phoenixes, jade, mountains, rivers are common themes.',
    },
    slavic: {
      name: 'Slavic',
      culturalNotes: 'Names from Eastern European traditions. Think -mir, -slav, -a endings. Examples: Perun, Veles, Morana.',
    },
    cyberpunk: {
      name: 'Cyberpunk/Tech',
      culturalNotes: 'Names can blend tech terms with mythic sounds. Think circuit, neon, chrome, data mixed with epic naming conventions.',
    },
    post_apocalyptic: {
      name: 'Post-Apocalyptic',
      culturalNotes: 'Names often reference the old world, survival, or rebirth. Can be gritty or hopeful.',
    },
    space_opera: {
      name: 'Space Opera',
      culturalNotes: 'Names should sound cosmic and grand. Stars, galaxies, and cosmic phenomena make good roots.',
    },
    urban_fantasy: {
      name: 'Urban Fantasy',
      culturalNotes: 'Blend modern city vibes with mythic elements. Street names, boroughs, modern terms with magical twists.',
    },
    elemental: {
      name: 'Elemental',
      culturalNotes: 'Names should relate to fire, water, earth, air, or combinations. Elemental forces and natural phenomena.',
    },
    cosmic_horror: {
      name: 'Cosmic Horror',
      culturalNotes: 'Names should feel ancient, unknowable, hard to pronounce. Think Lovecraftian - apostrophes, unusual letter combinations.',
    },
    dream_realm: {
      name: 'Dream Realm',
      culturalNotes: 'Names should feel ethereal, flowing, dreamlike. Soft sounds, mystical references.',
    },
    custom: {
      name: 'Custom',
      culturalNotes: 'Create unique names that fit the specific world being built.',
    },
  };
  return categories[category] || categories.custom;
}

const SYSTEM_PROMPT = `You are a creative mythology assistant helping middle school students (ages 11-14) build their own mythological worlds.
Your role is to inspire creativity while teaching geography concepts through the Five Themes of Geography.

CRITICAL RULES:
- Names and suggestions MUST reflect the student's chosen mythology style/culture
- Pay close attention to the cultural naming conventions provided
- Be encouraging and use age-appropriate language
- Give specific, actionable suggestions that build on what the student has already chosen
- Keep responses concise (2-3 paragraphs max) and fun!
- Never suggest generic fantasy names - always tie to the chosen culture`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, step, wizardData, userInput } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!step) {
      return NextResponse.json(
        { success: false, error: 'Wizard step required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Extract all wizard data for context
    const category = wizardData?.category || 'custom';
    const categoryInfo = getCategoryContext(category);
    const geography = wizardData?.geography || {};
    const fiveThemes = wizardData?.five_themes || {};
    
    // Build a comprehensive context string
    const worldContext = `
STUDENT'S MYTHOLOGY STYLE: ${categoryInfo.name}
CULTURAL NAMING GUIDANCE: ${categoryInfo.culturalNotes}

GEOGRAPHY CHOICES:
- Environment/Setting: ${geography.environment || 'not yet chosen'}
- Climate/Weather: ${geography.climate || 'not yet chosen'}  
- Special Landmarks: ${geography.features || 'not yet chosen'}

FIVE THEMES OF GEOGRAPHY (if answered):
- Location (center of power): ${fiveThemes.location || 'not yet answered'}
- Place (what makes it unique): ${fiveThemes.place || 'not yet answered'}
- Human-Environment Interaction: ${fiveThemes.interaction || 'not yet answered'}
- Movement (how things travel): ${fiveThemes.movement || 'not yet answered'}
- Region (different areas): ${fiveThemes.region || 'not yet answered'}
`.trim();

    // Build context-aware prompt based on wizard step
    let prompt = '';
    
    switch (step) {
      case 'geography':
        prompt = `${worldContext}

The student needs geography ideas for their ${categoryInfo.name} mythology.
${userInput ? `They mentioned: "${userInput}"` : 'They need inspiration.'}

Suggest:
1. 2-3 unique environment/setting ideas that fit their ${categoryInfo.name} style
2. An interesting climate or atmosphere idea that matches
3. 1-2 special landmarks that would be important in a ${categoryInfo.name} mythology

Make sure all suggestions feel authentic to the ${categoryInfo.name} cultural style!`;
        break;
        
      case 'five_themes':
        prompt = `${worldContext}

The student is working on the Five Themes of Geography for their ${categoryInfo.name} mythology.
${userInput ? `Current theme question: "${userInput}"` : ''}

Help them think about how these geography concepts apply to their ${categoryInfo.name} mythology.
Reference specific elements from their world that they've already chosen.
Keep the cultural style consistent throughout!`;
        break;
        
      case 'name':
        prompt = `${worldContext}

The student needs help naming their ${categoryInfo.name} mythology.
${userInput ? `They're considering: "${userInput}"` : ''}

IMPORTANT: Generate names that authentically reflect ${categoryInfo.name} culture and naming patterns.
${categoryInfo.culturalNotes}

Suggest 5 creative mythology names that:
1. Sound authentic to ${categoryInfo.name} naming conventions
2. Reflect their geography choices (${geography.environment}, ${geography.climate})
3. Feel epic and memorable for a middle schooler
4. Connect to any Five Themes answers they've provided

For each name:
- Give the name
- Explain what it means or references in ${categoryInfo.name} tradition
- Connect it to something specific they chose for their world`;
        break;
        
      default:
        prompt = `${worldContext}

Help the student with their ${categoryInfo.name} mythology creation.
${userInput ? `Their question: "${userInput}"` : 'Provide general creative guidance.'}

Keep all suggestions consistent with ${categoryInfo.name} cultural style and their existing choices!`;
    }

    // Make OpenAI request
    const openai = new OpenAI({ apiKey });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '';

    // Log usage (optional - don't fail if this errors)
    try {
      const supabase = await createClient();
      await supabase.from('ai_usage_log').insert({
        user_id: userId,
        assistance_type: 'wizard_help',
        field_name: step,
        ai_response: content.substring(0, 1000), // Truncate for storage
        tokens_used: completion.usage?.total_tokens || 0,
      });
    } catch (logError) {
      console.warn('Failed to log AI usage:', logError);
    }

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('AI wizard error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
