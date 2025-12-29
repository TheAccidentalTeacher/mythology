import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Content Moderation for Student Safety
 * 
 * CRITICAL: This is non-negotiable for a platform with minors.
 * Uses OpenAI Moderation API to detect harmful content.
 * 
 * Categories flagged:
 * - hate: Hateful, threatening language
 * - hate/threatening: Violent hateful content
 * - harassment: Targeted harassment
 * - harassment/threatening: Violent harassment
 * - self-harm: Self-harm content or instructions
 * - self-harm/intent: Intent to harm self
 * - self-harm/instructions: How-to for self-harm
 * - sexual: Sexual content
 * - sexual/minors: CSAM or sexualized minors (ZERO TOLERANCE)
 * - violence: Violence depictions
 * - violence/graphic: Graphic violence
 */

export interface ModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
  flagged_categories: string[];
}

/**
 * Check content for policy violations
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  console.log('🛡️ Moderating content...');
  
  try {
    const moderation = await openai.moderations.create({
      input: content,
    });

    const result = moderation.results[0];
    
    const flagged_categories = Object.entries(result.categories)
      .filter(([, flagged]) => flagged)
      .map(([category]) => category);

    console.log(`✅ Moderation complete. Flagged: ${result.flagged}`);
    if (flagged_categories.length > 0) {
      console.warn('⚠️ Flagged categories:', flagged_categories);
    }

    return {
      flagged: result.flagged,
      categories: result.categories as unknown as Record<string, boolean>,
      category_scores: result.category_scores as unknown as Record<string, number>,
      flagged_categories,
    };
  } catch (error) {
    console.error('❌ Moderation error:', error);
    // FAIL SAFE: If moderation fails, flag for manual review
    return {
      flagged: true,
      categories: { 'error': true },
      category_scores: { 'error': 1.0 },
      flagged_categories: ['error - manual review required'],
    };
  }
}

/**
 * Batch moderate multiple texts
 */
export async function moderateBatch(texts: string[]): Promise<ModerationResult[]> {
  console.log(`🛡️ Batch moderating ${texts.length} texts...`);
  
  try {
    const results = await Promise.all(texts.map(text => moderateContent(text)));
    console.log(`✅ Batch moderation complete. ${results.filter(r => r.flagged).length} flagged`);
    return results;
  } catch (error) {
    console.error('❌ Batch moderation error:', error);
    // FAIL SAFE: Flag all for manual review
    return texts.map(() => ({
      flagged: true,
      categories: { 'error': true },
      category_scores: { 'error': 1.0 },
      flagged_categories: ['error - manual review required'],
    }));
  }
}

/**
 * Check if content should be auto-blocked (high severity)
 * 
 * ZERO TOLERANCE categories that trigger immediate block:
 * - sexual/minors (CSAM)
 * - hate/threatening
 * - violence/graphic
 * - self-harm/instructions
 */
export function shouldAutoBlock(result: ModerationResult): boolean {
  const zeroToleranceCategories = [
    'sexual/minors',
    'hate/threatening',
    'violence/graphic',
    'self-harm/instructions',
  ];

  return zeroToleranceCategories.some(cat => result.categories[cat]);
}

/**
 * Get severity level for flagged content
 */
export function getSeverityLevel(result: ModerationResult): 'low' | 'medium' | 'high' | 'critical' {
  if (shouldAutoBlock(result)) return 'critical';
  
  const maxScore = Math.max(...Object.values(result.category_scores));
  
  if (maxScore >= 0.9) return 'high';
  if (maxScore >= 0.7) return 'medium';
  return 'low';
}
