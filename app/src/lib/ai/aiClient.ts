// =====================================================
// AI CLIENT - OpenAI API Wrapper
// Centralized AI communication with usage tracking
// =====================================================

import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { 
  SYSTEM_CONTEXT, 
  ASSISTANCE_LEVEL_MODIFIERS,
  type FieldContext,
  type AssistanceType 
} from './prompts';

// =====================================================
// TYPES
// =====================================================

export interface AIRequestOptions {
  userId: string;
  prompt: string;
  context?: string;
  assistanceLevel?: 'guide_me' | 'support_me' | 'challenge_me';
  maxTokens?: number;
  temperature?: number;
  requestType: 'wizard' | 'field_help' | 'grammar' | 'brainstorm';
  fieldContext?: FieldContext;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  remainingUsage?: {
    today: number;
    limit: number;
  };
}

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}

// =====================================================
// AI CLIENT CLASS
// =====================================================

class AIClient {
  private openai: OpenAI | null = null;

  private getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  // =====================================================
  // USAGE CHECKING
  // =====================================================

  async checkUsage(userId: string): Promise<UsageCheckResult> {
    const supabase = await createClient();

    // Get user's AI usage and any classroom settings
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_usage_today, last_ai_use, classroom_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return { allowed: false, remaining: 0, limit: 0, reason: 'User not found' };
    }

    // Reset daily usage if it's a new day
    const today = new Date().toDateString();
    const lastUse = profile.last_ai_use ? new Date(profile.last_ai_use).toDateString() : null;
    const currentUsage = lastUse === today ? profile.ai_usage_today : 0;

    // Get classroom settings if user is in a classroom
    let dailyLimit = 50; // Default limit
    let aiEnabled = true;

    if (profile.classroom_id) {
      const { data: classroomSettings } = await supabase
        .from('classroom_ai_settings')
        .select('ai_enabled, daily_limit_per_student')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classroomSettings) {
        aiEnabled = classroomSettings.ai_enabled;
        dailyLimit = classroomSettings.daily_limit_per_student || 50;
      }
    }

    if (!aiEnabled) {
      return { allowed: false, remaining: 0, limit: dailyLimit, reason: 'AI assistance disabled by teacher' };
    }

    const remaining = Math.max(0, dailyLimit - currentUsage);

    return {
      allowed: remaining > 0,
      remaining,
      limit: dailyLimit,
      reason: remaining > 0 ? undefined : 'Daily limit reached',
    };
  }

  // =====================================================
  // USAGE LOGGING
  // =====================================================

  async logUsage(
    userId: string,
    requestType: string,
    fieldContext?: FieldContext,
    tokenCount: number = 1
  ): Promise<void> {
    const supabase = await createClient();

    // Log to ai_usage_log
    await supabase.from('ai_usage_log').insert({
      user_id: userId,
      request_type: requestType,
      mythology_id: fieldContext?.mythologyId,
      entity_type: fieldContext?.entityType,
      entity_id: fieldContext?.entityId,
      field_name: fieldContext?.fieldName,
      assistance_level: fieldContext?.assistanceLevel,
      token_count: tokenCount,
    });

    // Update profile usage counts
    const today = new Date().toDateString();
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_usage_today, ai_usage_total, last_ai_use')
      .eq('id', userId)
      .single();

    if (profile) {
      const lastUse = profile.last_ai_use ? new Date(profile.last_ai_use).toDateString() : null;
      const currentDailyUsage = lastUse === today ? profile.ai_usage_today : 0;

      await supabase
        .from('profiles')
        .update({
          ai_usage_today: currentDailyUsage + 1,
          ai_usage_total: (profile.ai_usage_total || 0) + 1,
          last_ai_use: new Date().toISOString(),
        })
        .eq('id', userId);
    }
  }

  // =====================================================
  // MAIN AI REQUEST
  // =====================================================

  async request(options: AIRequestOptions): Promise<AIResponse> {
    const {
      userId,
      prompt,
      context,
      assistanceLevel = 'support_me',
      maxTokens = 500,
      temperature = 0.7,
      requestType,
      fieldContext,
    } = options;

    try {
      // Check usage limits
      const usageCheck = await this.checkUsage(userId);
      if (!usageCheck.allowed) {
        return {
          success: false,
          error: usageCheck.reason || 'Usage limit reached',
          remainingUsage: { today: usageCheck.remaining, limit: usageCheck.limit },
        };
      }

      // Build the system message
      const systemMessage = `${SYSTEM_CONTEXT}

${ASSISTANCE_LEVEL_MODIFIERS[assistanceLevel]}

${context || ''}`;

      // Make the API call
      const openai = this.getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      });

      const content = completion.choices[0]?.message?.content || '';
      const usage = completion.usage;

      // Log the usage
      await this.logUsage(userId, requestType, fieldContext, usage?.total_tokens || 1);

      // Get updated remaining usage
      const updatedUsage = await this.checkUsage(userId);

      return {
        success: true,
        content,
        usage: usage
          ? {
              promptTokens: usage.prompt_tokens,
              completionTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
            }
          : undefined,
        remainingUsage: { today: updatedUsage.remaining, limit: updatedUsage.limit },
      };
    } catch (error) {
      console.error('AI request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // =====================================================
  // CONVENIENCE METHODS
  // =====================================================

  async getFieldHelp(
    userId: string,
    fieldContext: FieldContext,
    assistanceType: AssistanceType,
    prompt: string
  ): Promise<AIResponse> {
    const contextInfo = `
MYTHOLOGY: ${fieldContext.mythologyName}
CATEGORY: ${fieldContext.mythologyCategory || 'Custom'}
GEOGRAPHY: ${fieldContext.mythologyGeography || 'Not specified'}
ENTITY TYPE: ${fieldContext.entityType}
FIELD: ${fieldContext.fieldName}
CURRENT CONTENT: ${fieldContext.existingContent || 'Empty'}
ENTITY DETAILS: ${JSON.stringify(fieldContext.entityDetails || {})}`;

    return this.request({
      userId,
      prompt,
      context: contextInfo,
      assistanceLevel: fieldContext.assistanceLevel,
      requestType: 'field_help',
      fieldContext,
      maxTokens: 400,
    });
  }

  async getWizardResponse(
    userId: string,
    step: string,
    wizardData: Record<string, unknown>,
    userInput?: string
  ): Promise<AIResponse> {
    const contextInfo = `
WIZARD STEP: ${step}
WIZARD DATA SO FAR: ${JSON.stringify(wizardData)}
USER INPUT: ${userInput || 'None yet'}`;

    return this.request({
      userId,
      prompt: `Based on the wizard progress, provide guidance for step "${step}".`,
      context: contextInfo,
      requestType: 'wizard',
      maxTokens: 500,
    });
  }

  async brainstormNames(
    userId: string,
    entityType: string,
    mythologyContext: { name: string; category?: string; geography?: string },
    constraints?: string
  ): Promise<AIResponse> {
    const prompt = `Generate 8-10 creative name suggestions for a ${entityType} in "${mythologyContext.name}".

Category: ${mythologyContext.category || 'Custom'}
Setting: ${mythologyContext.geography || 'Varied'}
${constraints ? `Additional requirements: ${constraints}` : ''}

Provide names as a numbered list with brief explanations of each name's meaning or feel.`;

    return this.request({
      userId,
      prompt,
      requestType: 'brainstorm',
      maxTokens: 400,
    });
  }

  async checkGrammar(
    userId: string,
    text: string,
    contentType: 'story' | 'description' | 'general'
  ): Promise<AIResponse> {
    const prompt = `Review this ${contentType} for grammar, spelling, and clarity:

"${text}"

Provide:
1. Specific corrections needed (if any)
2. Brief explanation of each correction
3. One suggestion to improve the writing style

Keep feedback encouraging and educational. Format corrections clearly.`;

    return this.request({
      userId,
      prompt,
      requestType: 'grammar',
      maxTokens: 400,
      temperature: 0.3, // Lower temperature for grammar checking
    });
  }
}

// Export singleton instance
export const aiClient = new AIClient();

// Export class for testing
export { AIClient };
