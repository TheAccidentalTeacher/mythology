// GPT-4 Battle Narration Service
// Generates epic battle stories from combat logs

import OpenAI from 'openai';
import { Combatant, BattleAction, BattleResult, NarrationStyle, BattleType } from './battleEngine';

// Re-export for convenience
export type { NarrationStyle } from './battleEngine';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface NarrationRequest {
  combatant1: Combatant;
  combatant2: Combatant;
  battleResult: BattleResult;
  battleType: BattleType;
  narrationStyle: NarrationStyle;
  arenaDescription?: string;
  mythologyName?: string;
}

/**
 * Get style-specific writing instructions
 */
function getStyleInstructions(style: NarrationStyle): string {
  const styles: Record<NarrationStyle, string> = {
    epic: `Write in an epic, heroic style reminiscent of Homer's Iliad or Norse sagas. 
           Use grandiose language, emphasize the magnitude of strikes, and treat the combatants as legendary figures.
           Include dramatic pauses and build tension before climactic moments.`,
    
    comedic: `Write in a lighthearted, humorous style with witty commentary and amusing observations.
              Include funny descriptions of misses, unexpected moments, and playful banter.
              Make it entertaining while still respecting the characters.`,
    
    tragic: `Write in a somber, melancholic style emphasizing the cost of battle.
             Focus on the emotional weight, the desperation, and what each combatant stands to lose.
             Make the reader feel the gravity of each blow.`,
    
    dramatic: `Write in a theatrical, suspenseful style like a movie script.
               Use short, punchy sentences during action. Build suspense before major moments.
               Include internal thoughts and dramatic reveals.`,
    
    poetic: `Write in a lyrical, flowing style with vivid imagery and metaphors.
             Use rhythmic prose and evocative descriptions of movement and power.
             Make each moment feel like a verse in an ancient poem.`
  };
  
  return styles[style];
}

/**
 * Get battle type context
 */
function getBattleTypeContext(battleType: BattleType): string {
  const contexts: Record<BattleType, string> = {
    duel: 'This is an honorable duel between two warriors who have agreed to face each other in combat.',
    honor_combat: 'This is a formal combat of honor, where reputation and pride are at stake.',
    ambush: 'This battle began with a surprise attack! One combatant struck from the shadows.',
    divine_contest: 'This is a contest between divine or semi-divine beings, where cosmic powers clash.',
    tournament: 'This is a tournament match, with spectators watching and cheering.'
  };
  
  return contexts[battleType];
}

/**
 * Build the combat summary for GPT-4
 */
function buildCombatSummary(combatLog: BattleAction[], result: BattleResult): string {
  const highlights: string[] = [];
  
  // Get key moments
  const criticals = combatLog.filter(a => a.actionType === 'critical');
  const specials = combatLog.filter(a => a.actionType === 'special');
  const dodges = combatLog.filter(a => a.actionType === 'dodge');
  
  highlights.push(`Total rounds: ${result.totalRounds}`);
  highlights.push(`Critical hits: ${criticals.length}`);
  highlights.push(`Special abilities used: ${specials.length}`);
  highlights.push(`Dodges: ${dodges.length}`);
  
  // Add significant moments
  if (criticals.length > 0) {
    const biggestCrit = criticals.reduce((max, a) => a.damage > max.damage ? a : max);
    highlights.push(`Most devastating blow: ${biggestCrit.attackerName} dealt ${biggestCrit.damage} damage`);
  }
  
  // Final HP
  highlights.push(`Final HP - Combatant 1: ${result.combatant1FinalHp}, Combatant 2: ${result.combatant2FinalHp}`);
  
  return highlights.join('\n');
}

/**
 * Generate battle narration using GPT-4
 */
export async function generateBattleNarration(request: NarrationRequest): Promise<string> {
  const { combatant1, combatant2, battleResult, battleType, narrationStyle, arenaDescription, mythologyName } = request;
  
  const styleInstructions = getStyleInstructions(narrationStyle);
  const battleContext = getBattleTypeContext(battleType);
  const combatSummary = buildCombatSummary(battleResult.combatLog, battleResult);
  
  const systemPrompt = `You are a master storyteller who specializes in epic mythology tales.
Your task is to write a battle narration based on the combat log provided.

${styleInstructions}

Guidelines:
- Write 400-600 words
- Include vivid descriptions of attacks and defenses
- Reference the combatants' abilities, domains, and nature
- Build tension throughout the battle
- Create a satisfying conclusion that honors both combatants
- Make the winner's victory feel earned
- If it's a draw, emphasize the equality of power
- Use age-appropriate language (suitable for 6th-8th grade students)
- Do NOT include graphic violence, gore, or death descriptions
- Focus on the honor and skill of combat, not suffering`;

  const userPrompt = `Write a battle narration for this mythological combat:

**Setting:** ${mythologyName ? `The mythology of ${mythologyName}` : 'A mythological realm'}
${arenaDescription ? `**Arena:** ${arenaDescription}` : ''}

**Battle Type:** ${battleContext}

**Combatant 1:**
- Name: ${combatant1.name}
- Type: ${combatant1.type} (${combatant1.entityType})
- Domain/Abilities: ${combatant1.domain || combatant1.abilities || 'Unknown'}
- Stats: HP ${combatant1.stats.maxHp}, Attack ${combatant1.stats.attack}, Defense ${combatant1.stats.defense}, Speed ${combatant1.stats.speed}
${combatant1.stats.specialAbility ? `- Special Ability: ${combatant1.stats.specialAbility}` : ''}
${combatant1.description ? `- Description: ${combatant1.description.substring(0, 200)}...` : ''}

**Combatant 2:**
- Name: ${combatant2.name}
- Type: ${combatant2.type} (${combatant2.entityType})
- Domain/Abilities: ${combatant2.domain || combatant2.abilities || 'Unknown'}
- Stats: HP ${combatant2.stats.maxHp}, Attack ${combatant2.stats.attack}, Defense ${combatant2.stats.defense}, Speed ${combatant2.stats.speed}
${combatant2.stats.specialAbility ? `- Special Ability: ${combatant2.stats.specialAbility}` : ''}
${combatant2.description ? `- Description: ${combatant2.description.substring(0, 200)}...` : ''}

**Combat Summary:**
${combatSummary}

**Winner:** ${battleResult.winnerName || 'Draw'}

**Key Combat Moments to Include:**
${battleResult.combatLog.slice(0, 10).map(a => `- Round ${a.round}: ${a.description}`).join('\n')}
${battleResult.combatLog.length > 10 ? `\n... and ${battleResult.combatLog.length - 10} more exchanges ...` : ''}

Please write the epic battle narration now:`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.8, // Some creativity
    });

    return response.choices[0]?.message?.content || 'The battle was too intense to describe...';
  } catch (error) {
    console.error('Error generating battle narration:', error);
    
    // Fallback narration if API fails
    return generateFallbackNarration(combatant1, combatant2, battleResult);
  }
}

/**
 * Generate a simple fallback narration if GPT-4 fails
 */
function generateFallbackNarration(
  combatant1: Combatant,
  combatant2: Combatant,
  result: BattleResult
): string {
  const winner = result.winnerName;
  const loser = result.winnerId === combatant1.id ? combatant2.name : combatant1.name;
  
  if (result.winnerType === 'draw') {
    return `The battle between ${combatant1.name} and ${combatant2.name} was legendary!

For ${result.totalRounds} rounds, the two combatants traded blow after blow. ${combatant1.name}, with ${combatant1.entityType} powers, matched ${combatant2.name}'s ${combatant2.entityType} abilities perfectly.

Neither could gain the upper hand. When the dust settled, both warriors stood exhausted but undefeated. This battle would be remembered as a clash of equals, a testament to the power of both fighters.

The result: A draw that echoes through the ages.`;
  }
  
  return `The battle between ${combatant1.name} and ${combatant2.name} was legendary!

The combat raged for ${result.totalRounds} intense rounds. ${combatant1.name} brought ${combatant1.entityType} might, while ${combatant2.name} countered with ${combatant2.entityType} ferocity.

${result.combatLog.filter(a => a.actionType === 'critical').length > 0 
  ? 'Critical blows were exchanged, each one shaking the very foundations of the arena. ' 
  : ''}
${result.combatLog.filter(a => a.actionType === 'special').length > 0 
  ? 'Special abilities lit up the battlefield with raw power. ' 
  : ''}

In the end, ${winner} emerged victorious over ${loser}! The final blow left ${winner} standing with ${result.winnerId === combatant1.id ? result.combatant1FinalHp : result.combatant2FinalHp} HP remaining.

This battle will be remembered in the annals of mythology!`;
}

/**
 * Generate a quick preview narration (without GPT-4)
 */
export function generateQuickNarration(
  combatant1: Combatant,
  combatant2: Combatant,
  result: BattleResult
): string {
  return generateFallbackNarration(combatant1, combatant2, result);
}
