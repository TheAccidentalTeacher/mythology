// Prompt Builder for Image Generation
// Builds AI image prompts from mythology entities

import { 
  EntityType, 
  ImageStyle, 
  STYLE_PRESETS,
  ImageGenerationRequest 
} from './types';
import { wrapPromptWithSafety } from './safetyFilter';

// =====================================================
// ENTITY-SPECIFIC PROMPT BUILDERS
// =====================================================

/**
 * Build prompt for a character (god, hero, etc.)
 */
function buildCharacterPrompt(
  name: string,
  description: string,
  mythologyName?: string,
  mythologyStyle?: string
): string {
  const context = mythologyName 
    ? `from the ${mythologyName} mythology` 
    : 'from an original mythology';
  
  const styleHint = mythologyStyle 
    ? `with ${mythologyStyle} cultural influences` 
    : '';
  
  return `A mythological character portrait: ${name}, ${description}. ${context} ${styleHint}. 
The character should look powerful yet approachable, suitable for a children's mythology book.
Focus on their divine or heroic qualities, their costume/armor, and any symbolic elements that represent their domain or powers.`;
}

/**
 * Build prompt for a creature (beast, monster, etc.)
 */
function buildCreaturePrompt(
  name: string,
  description: string,
  mythologyName?: string,
  mythologyStyle?: string
): string {
  const context = mythologyName 
    ? `from the ${mythologyName} mythology` 
    : 'from an original mythology';
  
  return `A mythological creature illustration: ${name}, ${description}. ${context}.
The creature should be fantastical and awe-inspiring. It can be scary or fierce, but should look like it belongs in a children's mythology book.
Show the creature in its natural habitat or in a dynamic pose that displays its unique features and abilities.`;
}

/**
 * Build prompt for a realm/location
 */
function buildRealmPrompt(
  name: string,
  description: string,
  mythologyName?: string,
  mythologyStyle?: string
): string {
  const context = mythologyName 
    ? `from the ${mythologyName} mythology` 
    : 'from an original mythology';
  
  return `A mythological realm landscape: ${name}, ${description}. ${context}.
This is a magical place from mythology - it should feel otherworldly and wondrous.
Include distinctive features that make this realm unique: unusual sky colors, magical flora, ancient architecture, or supernatural phenomena.
The scene should invite exploration and spark imagination.`;
}

/**
 * Build prompt for a story illustration
 */
function buildStoryPrompt(
  name: string,
  description: string,
  mythologyName?: string,
  mythologyStyle?: string
): string {
  const context = mythologyName 
    ? `from the ${mythologyName} mythology` 
    : 'from an original mythology';
  
  return `A scene illustration for the myth "${name}": ${description}. ${context}.
Create a dramatic moment that captures the essence of this mythological story.
The scene should be dynamic and emotional, showing characters in action or at a pivotal moment.
This should look like a key illustration from a mythology storybook.`;
}

/**
 * Build prompt for a mythology "cover art"
 */
function buildMythologyPrompt(
  name: string,
  description: string,
  mythologyStyle?: string
): string {
  return `A mythology cover illustration for "${name}": ${description}.
This should be the definitive image representing this entire mythology system.
Include symbolic elements, key characters or creatures, and the overall aesthetic of this mythological world.
It should feel epic and complete, like the cover of a mythology textbook or encyclopedia.
${mythologyStyle ? `Cultural style influences: ${mythologyStyle}` : ''}`;
}

/**
 * Build prompt for a map illustration
 */
function buildMapPrompt(
  name: string,
  description: string,
  mythologyName?: string,
  mythologyStyle?: string
): string {
  const context = mythologyName 
    ? `for the ${mythologyName} mythology` 
    : 'for an original mythology';
  
  return `A fantasy mythology map illustration ${context}: ${name}.
${description}
Create an artistic, hand-drawn style map showing this mythological world.
Include terrain features, important locations, decorative borders, a compass rose, and mythological symbols.
The map should look aged and magical, like an ancient artifact from this mythology.
Think of maps from fantasy novels like Lord of the Rings or classic mythology atlases.`;
}

// =====================================================
// MAIN PROMPT BUILDER
// =====================================================

/**
 * Get the style prompt suffix for a given style
 */
function getStylePrompt(style: ImageStyle): string {
  const preset = STYLE_PRESETS.find(s => s.id === style);
  return preset?.promptSuffix || STYLE_PRESETS[0].promptSuffix;
}

/**
 * Build complete prompt for image generation
 */
export function buildImagePrompt(request: ImageGenerationRequest): {
  fullPrompt: string;
  basePrompt: string;
  stylePrompt: string;
  safetyWrappedPrompt: string;
} {
  let basePrompt: string;
  
  switch (request.entityType) {
    case 'character':
      basePrompt = buildCharacterPrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyName,
        request.mythologyStyle
      );
      break;
    case 'creature':
      basePrompt = buildCreaturePrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyName,
        request.mythologyStyle
      );
      break;
    case 'realm':
      basePrompt = buildRealmPrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyName,
        request.mythologyStyle
      );
      break;
    case 'story':
      basePrompt = buildStoryPrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyName,
        request.mythologyStyle
      );
      break;
    case 'mythology':
      basePrompt = buildMythologyPrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyStyle
      );
      break;
    case 'map':
      basePrompt = buildMapPrompt(
        request.entityName,
        request.entityDescription,
        request.mythologyName,
        request.mythologyStyle
      );
      break;
    default:
      basePrompt = `An illustration of ${request.entityName}: ${request.entityDescription}`;
  }
  
  // Add student addition if provided
  if (request.studentAddition && request.studentAddition.trim()) {
    basePrompt += `\n\nAdditional details: ${request.studentAddition}`;
  }
  
  const stylePrompt = getStylePrompt(request.stylePreset);
  
  // Create the full prompt
  const fullPrompt = `${basePrompt}\n\nStyle: ${stylePrompt}`;
  
  // Create safety-wrapped version for the AI
  const safetyWrappedPrompt = wrapPromptWithSafety(basePrompt, stylePrompt);
  
  return {
    fullPrompt,
    basePrompt,
    stylePrompt,
    safetyWrappedPrompt
  };
}

// =====================================================
// TRADING CARD PROMPT BUILDER
// =====================================================

export function buildTradingCardPrompt(
  entityName: string,
  entityType: EntityType,
  entityDescription: string,
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
  mythologyName?: string
): string {
  const rarityStyles: Record<string, string> = {
    common: 'simple, clean illustration with basic lighting',
    uncommon: 'slightly enhanced illustration with gentle glow effects',
    rare: 'vibrant illustration with magical sparkles and enhanced lighting',
    epic: 'dramatic illustration with powerful aura effects and dynamic lighting',
    legendary: 'breathtaking illustration with golden glow, ethereal energy, and epic composition'
  };
  
  return `A trading card portrait of ${entityName}, a ${entityType} from ${mythologyName || 'mythology'}.
${entityDescription}

This is a ${rarity.toUpperCase()} card, so the art should be: ${rarityStyles[rarity]}

The illustration should be:
- Centered and well-framed for a vertical card format
- Character/creature shown from chest up or full body
- Dynamic pose or expression
- Clear focal point
- ${rarity === 'legendary' ? 'Radiating power and majesty' : 'Suitable for the rarity level'}

Style: Digital trading card game art, vibrant colors, professional illustration`;
}

// =====================================================
// BATTLE SCENE PROMPT BUILDER
// =====================================================

export function buildBattleScenePrompt(
  combatant1Name: string,
  combatant1Description: string,
  combatant2Name: string,
  combatant2Description: string,
  mythologyName?: string,
  battleContext?: string
): string {
  return `An epic battle scene between two mythological beings:

On the left: ${combatant1Name} - ${combatant1Description}
On the right: ${combatant2Name} - ${combatant2Description}

${battleContext ? `Battle context: ${battleContext}` : ''}
${mythologyName ? `From the ${mythologyName} mythology.` : ''}

The scene should be:
- Dynamic and action-packed
- Both combatants clearly visible and recognizable
- Energy, magic, or weapon effects showing the clash
- Dramatic lighting and composition
- Epic and awe-inspiring, but suitable for children's mythology

Style: Dynamic action illustration, epic fantasy art, vibrant colors`;
}

// =====================================================
// CROSSOVER MASHUP PROMPT BUILDER
// =====================================================

export function buildCrossoverPrompt(
  entity1Name: string,
  entity1Description: string,
  entity1Mythology: string,
  entity2Name: string,
  entity2Description: string,
  entity2Mythology: string,
  interactionType: 'battle' | 'alliance' | 'meeting'
): string {
  const interactions = {
    battle: 'facing off against each other in an epic confrontation',
    alliance: 'standing together as powerful allies, united in purpose',
    meeting: 'meeting for the first time, sizing each other up with mutual respect'
  };
  
  return `A mythological crossover scene:

${entity1Name} from ${entity1Mythology}: ${entity1Description}
${entity2Name} from ${entity2Mythology}: ${entity2Description}

These two beings from different mythologies are ${interactions[interactionType]}.

The scene should:
- Show both mythology styles blending together
- Highlight the unique characteristics of each being
- Create a sense of wonder at these two worlds colliding
- Be visually striking and memorable

Style: Epic fantasy illustration, dramatic composition, rich colors, children's mythology book quality`;
}

// =====================================================
// PROPHECY SCROLL PROMPT BUILDER
// =====================================================

export function buildProphecyPrompt(
  prophecyTitle: string,
  prophecyText: string,
  relatedCharacter?: string,
  mythologyStyle?: string
): string {
  return `A mystical prophecy scroll illustration:

Title: "${prophecyTitle}"
${relatedCharacter ? `Related to: ${relatedCharacter}` : ''}

The image should show:
- An aged, mystical parchment or scroll
- Ethereal, mysterious imagery related to: ${prophecyText}
- Symbolic elements and ancient runes or text decorations
- A single central figure or symbol representing the prophecy
- Magical glow and mystical atmosphere

${mythologyStyle ? `Cultural style: ${mythologyStyle}` : ''}

Style: Ancient mystical document, aged parchment texture, ethereal glow, mysterious and prophetic`;
}

// =====================================================
// CHARACTER EVOLUTION PROMPT BUILDER
// =====================================================

export type EvolutionStage = 'novice' | 'awakened' | 'warrior' | 'champion' | 'legendary';

export function buildEvolutionPrompt(
  characterName: string,
  characterDescription: string,
  stage: EvolutionStage,
  mythologyName?: string
): string {
  const stageDescriptions: Record<EvolutionStage, string> = {
    novice: 'young and inexperienced, simple clothing, humble beginnings, potential visible but untapped',
    awakened: 'power awakening, glowing eyes or subtle aura, beginning to show true nature',
    warrior: 'battle-ready, wearing armor or wielding weapons, confident and capable',
    champion: 'powerful and respected, elaborate armor with magical enhancements, radiating strength',
    legendary: 'at the peak of power, full divine/legendary form, magnificent and awe-inspiring, ultimate evolution'
  };
  
  return `A character evolution portrait of ${characterName} at the ${stage.toUpperCase()} stage:

Base character: ${characterDescription}
${mythologyName ? `From: ${mythologyName} mythology` : ''}

At this stage, they are: ${stageDescriptions[stage]}

The portrait should:
- Show the character's current power level clearly
- Include visual elements that indicate their ${stage} status
- Maintain the character's core identity while showing growth
- ${stage === 'legendary' ? 'Be the most impressive and powerful version possible' : 'Hint at potential for future growth'}

Style: Character portrait, fantasy RPG art style, evolution/progression aesthetic`;
}
