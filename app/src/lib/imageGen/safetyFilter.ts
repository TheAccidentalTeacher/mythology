// Safety Filter for Image Generation
// Triple-layer safety system for student content

import { 
  SafetyCheckResult, 
  BLOCKED_TERMS, 
  ALLOWED_VIOLENCE_TERMS 
} from './types';

// =====================================================
// LAYER 1: INPUT FILTERING
// =====================================================

/**
 * Check if a prompt contains blocked terms
 * Returns safety check result with details
 */
export function checkPromptSafety(prompt: string): SafetyCheckResult {
  const lowerPrompt = prompt.toLowerCase();
  const flaggedTerms: string[] = [];
  
  // Check for blocked terms
  for (const term of BLOCKED_TERMS) {
    if (lowerPrompt.includes(term.toLowerCase())) {
      flaggedTerms.push(term);
    }
  }
  
  // Determine severity
  let severity: SafetyCheckResult['severity'] = 'none';
  let suggestion: string | undefined;
  
  if (flaggedTerms.length > 0) {
    // Check for critical terms (sexual/minors, explicit)
    const criticalTerms = ['nude', 'naked', 'porn', 'sexual', 'nsfw', 'erotic'];
    const hasCritical = flaggedTerms.some(t => criticalTerms.includes(t));
    
    if (hasCritical) {
      severity = 'critical';
      suggestion = 'This content is not allowed. Please describe your mythology character or creature differently.';
    } else if (flaggedTerms.length >= 3) {
      severity = 'high';
      suggestion = 'Your description contains several concerning terms. Try focusing on the heroic or magical aspects of your mythology.';
    } else if (flaggedTerms.length >= 2) {
      severity = 'medium';
      suggestion = 'Some words in your description might not be appropriate. Try rephrasing.';
    } else {
      severity = 'low';
      suggestion = 'One word in your description might need to be changed.';
    }
  }
  
  return {
    safe: flaggedTerms.length === 0,
    flaggedTerms,
    severity,
    suggestion
  };
}

/**
 * Clean and sanitize student additions to prompts
 * Removes potentially harmful content while preserving intent
 */
export function sanitizeStudentAddition(addition: string): {
  sanitized: string;
  wasModified: boolean;
  removedTerms: string[];
} {
  if (!addition || addition.trim().length === 0) {
    return { sanitized: '', wasModified: false, removedTerms: [] };
  }
  
  let sanitized = addition;
  const removedTerms: string[] = [];
  
  // Remove blocked terms
  for (const term of BLOCKED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(sanitized)) {
      removedTerms.push(term);
      sanitized = sanitized.replace(regex, '').trim();
    }
  }
  
  // Clean up extra spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100).trim();
  }
  
  return {
    sanitized,
    wasModified: removedTerms.length > 0,
    removedTerms
  };
}

/**
 * Check if violence level is appropriate
 * Allows mythology-appropriate violence, blocks extreme gore
 */
export function checkViolenceLevel(prompt: string): {
  appropriate: boolean;
  reason?: string;
} {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extreme violence blocklist
  const extremeViolence = [
    'gore', 'gory', 'dismember', 'decapitate', 'mutilate',
    'torture', 'execution', 'disembowel', 'impale', 'crucify',
    'pool of blood', 'blood everywhere', 'bloody corpse',
    'dying', 'dead body', 'corpse', 'death scene'
  ];
  
  for (const term of extremeViolence) {
    if (lowerPrompt.includes(term)) {
      return {
        appropriate: false,
        reason: `The term "${term}" describes content that's too graphic. Try describing the scene with less detail about injuries.`
      };
    }
  }
  
  return { appropriate: true };
}

// =====================================================
// LAYER 2: PROMPT ENHANCEMENT FOR SAFETY
// =====================================================

/**
 * Build safe system prompt prefix
 * Instructs the AI to generate child-safe content
 */
export function getSafetySystemPrompt(): string {
  return `CRITICAL SAFETY INSTRUCTIONS:
- Generate ONLY child-friendly, age-appropriate content suitable for elementary and middle school students
- Art style should be illustrated, NOT photorealistic
- NO nudity, partial nudity, or revealing clothing
- NO gore, graphic wounds, or excessive blood
- NO drugs, alcohol, or substance use
- NO hate symbols or discriminatory imagery
- Violence may include: weapons, battle scenes, scary monsters, danger - but NO graphic death or torture
- Keep the style similar to children's mythology books or animated movies (PG rating)
- When in doubt, make it LESS intense
- DO NOT include any text, words, letters, or writing in the image
- DO NOT add titles, labels, captions, or any text overlays
- The image should be purely visual with no text elements whatsoever

If any part of the prompt seems inappropriate, generate a safe alternative that captures the mythological spirit without the concerning elements.`;
}

/**
 * Wrap user prompt with safety context
 */
export function wrapPromptWithSafety(
  basePrompt: string,
  stylePrompt: string
): string {
  return `${getSafetySystemPrompt()}

Generate an illustration with these specifications:
${basePrompt}

Style: ${stylePrompt}

IMPORTANT: Do NOT include any text, words, titles, labels, or writing in the image. Pure visual art only.

Remember: This is for a children's educational mythology project. Keep it age-appropriate, illustrated, and magical.`;
}

// =====================================================
// LAYER 3: OUTPUT REVIEW (Post-generation)
// =====================================================

/**
 * Keywords that might indicate the output needs teacher review
 * These are detected in the generation response or metadata
 */
export const REVIEW_TRIGGER_KEYWORDS = [
  'violence', 'blood', 'weapon', 'death', 'dark', 'scary',
  'demon', 'evil', 'battle', 'war', 'fight', 'skeleton'
];

/**
 * Check if generated content should be flagged for review
 * This would typically be called after image generation
 * with metadata about what was generated
 */
export function shouldFlagForReview(
  originalPrompt: string,
  generationMetadata?: { labels?: string[] }
): {
  shouldFlag: boolean;
  reason?: string;
} {
  const lowerPrompt = originalPrompt.toLowerCase();
  
  // Check if prompt had any borderline terms
  let triggerCount = 0;
  const triggers: string[] = [];
  
  for (const keyword of REVIEW_TRIGGER_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      triggerCount++;
      triggers.push(keyword);
    }
  }
  
  // If 3+ trigger keywords, suggest review
  if (triggerCount >= 3) {
    return {
      shouldFlag: true,
      reason: `Contains multiple potentially sensitive themes: ${triggers.join(', ')}`
    };
  }
  
  // Check generation metadata labels if provided
  if (generationMetadata?.labels) {
    const sensitiveLabels = generationMetadata.labels.filter(
      label => REVIEW_TRIGGER_KEYWORDS.some(kw => label.toLowerCase().includes(kw))
    );
    
    if (sensitiveLabels.length >= 2) {
      return {
        shouldFlag: true,
        reason: `Generated image contains: ${sensitiveLabels.join(', ')}`
      };
    }
  }
  
  return { shouldFlag: false };
}

// =====================================================
// COMBINED SAFETY CHECK
// =====================================================

export interface FullSafetyCheck {
  allowed: boolean;
  promptSafe: boolean;
  violenceAppropriate: boolean;
  studentAdditionSafe: boolean;
  sanitizedAddition?: string;
  errors: string[];
  warnings: string[];
  shouldFlagForReview: boolean;
}

/**
 * Run complete safety check on an image generation request
 */
export function runFullSafetyCheck(
  basePrompt: string,
  studentAddition?: string
): FullSafetyCheck {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitizedAddition: string | undefined;
  
  // Check base prompt
  const promptCheck = checkPromptSafety(basePrompt);
  if (!promptCheck.safe) {
    if (promptCheck.severity === 'critical' || promptCheck.severity === 'high') {
      errors.push(promptCheck.suggestion || 'Content not allowed');
    } else {
      warnings.push(promptCheck.suggestion || 'Content may need revision');
    }
  }
  
  // Check violence level
  const violenceCheck = checkViolenceLevel(basePrompt);
  if (!violenceCheck.appropriate) {
    errors.push(violenceCheck.reason || 'Violence level too extreme');
  }
  
  // Check and sanitize student addition
  let studentAdditionSafe = true;
  if (studentAddition) {
    const additionCheck = checkPromptSafety(studentAddition);
    if (!additionCheck.safe) {
      if (additionCheck.severity === 'critical' || additionCheck.severity === 'high') {
        errors.push(`Your addition: ${additionCheck.suggestion}`);
        studentAdditionSafe = false;
      } else {
        // Sanitize for low/medium severity
        const sanitizeResult = sanitizeStudentAddition(studentAddition);
        sanitizedAddition = sanitizeResult.sanitized;
        if (sanitizeResult.wasModified) {
          warnings.push(`Some words were removed from your description: ${sanitizeResult.removedTerms.join(', ')}`);
        }
      }
    } else {
      sanitizedAddition = studentAddition;
    }
    
    // Also check violence in addition
    const additionViolence = checkViolenceLevel(studentAddition);
    if (!additionViolence.appropriate) {
      errors.push(additionViolence.reason || 'Description too violent');
      studentAdditionSafe = false;
    }
  }
  
  // Determine if should flag for review
  const fullPrompt = `${basePrompt} ${studentAddition || ''}`;
  const reviewCheck = shouldFlagForReview(fullPrompt);
  
  return {
    allowed: errors.length === 0,
    promptSafe: promptCheck.safe,
    violenceAppropriate: violenceCheck.appropriate,
    studentAdditionSafe,
    sanitizedAddition,
    errors,
    warnings,
    shouldFlagForReview: reviewCheck.shouldFlag
  };
}
