// =====================================================
// useAIAssistance Hook
// Main React hook for AI assistance features
// =====================================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { FieldContext, AssistanceType } from '@/lib/ai/prompts';

// =====================================================
// TYPES
// =====================================================

export interface AIAssistanceState {
  isLoading: boolean;
  response: string | null;
  error: string | null;
  remainingUsage: { today: number; limit: number } | null;
}

export interface UseAIAssistanceReturn extends AIAssistanceState {
  // Field help methods
  getFieldHelp: (
    fieldContext: FieldContext,
    assistanceType: AssistanceType,
    customPrompt?: string
  ) => Promise<void>;
  
  // Brainstorming methods
  brainstormNames: (
    entityType: string,
    mythologyContext: { name: string; category?: string; geography?: string },
    constraints?: string
  ) => Promise<void>;
  
  // Grammar checking
  checkGrammar: (text: string, contentType: 'story' | 'description' | 'general') => Promise<void>;
  
  // Wizard assistance
  getWizardHelp: (step: string, wizardData: Record<string, unknown>, userInput?: string) => Promise<void>;
  
  // State management
  clearResponse: () => void;
  checkUsageAvailable: () => Promise<boolean>;
}

// =====================================================
// HOOK IMPLEMENTATION
// =====================================================

export function useAIAssistance(): UseAIAssistanceReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState<AIAssistanceState>({
    isLoading: false,
    response: null,
    error: null,
    remainingUsage: null,
  });

  // Get user on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  // Helper to make API calls
  const makeRequest = useCallback(async (
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<{ success: boolean; content?: string; error?: string; remainingUsage?: { today: number; limit: number } }> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, userId }),
    });

    return response.json();
  }, [userId]);

  // Get field-specific help
  const getFieldHelp = useCallback(async (
    fieldContext: FieldContext,
    assistanceType: AssistanceType,
    customPrompt?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await makeRequest('/api/ai/assist', {
        type: 'field_help',
        fieldContext,
        assistanceType,
        customPrompt,
      });

      setState({
        isLoading: false,
        response: result.success ? result.content || null : null,
        error: result.success ? null : result.error || 'Request failed',
        remainingUsage: result.remainingUsage || null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [makeRequest]);

  // Brainstorm names
  const brainstormNames = useCallback(async (
    entityType: string,
    mythologyContext: { name: string; category?: string; geography?: string },
    constraints?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await makeRequest('/api/ai/brainstorm', {
        entityType,
        mythologyContext,
        constraints,
      });

      setState({
        isLoading: false,
        response: result.success ? result.content || null : null,
        error: result.success ? null : result.error || 'Request failed',
        remainingUsage: result.remainingUsage || null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [makeRequest]);

  // Check grammar
  const checkGrammar = useCallback(async (
    text: string,
    contentType: 'story' | 'description' | 'general'
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await makeRequest('/api/ai/grammar', {
        text,
        contentType,
      });

      setState({
        isLoading: false,
        response: result.success ? result.content || null : null,
        error: result.success ? null : result.error || 'Request failed',
        remainingUsage: result.remainingUsage || null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [makeRequest]);

  // Wizard help
  const getWizardHelp = useCallback(async (
    step: string,
    wizardData: Record<string, unknown>,
    userInput?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await makeRequest('/api/ai/wizard', {
        step,
        wizardData,
        userInput,
      });

      setState({
        isLoading: false,
        response: result.success ? result.content || null : null,
        error: result.success ? null : result.error || 'Request failed',
        remainingUsage: result.remainingUsage || null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [makeRequest]);

  // Clear response
  const clearResponse = useCallback(() => {
    setState(prev => ({ ...prev, response: null, error: null }));
  }, []);

  // Check if usage is available
  const checkUsageAvailable = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const response = await fetch(`/api/ai/usage?userId=${userId}`);
      const data = await response.json();
      
      if (data.remaining !== undefined) {
        setState(prev => ({
          ...prev,
          remainingUsage: { today: data.remaining, limit: data.limit },
        }));
      }
      
      return data.allowed ?? false;
    } catch {
      return false;
    }
  }, [userId]);

  return {
    ...state,
    getFieldHelp,
    brainstormNames,
    checkGrammar,
    getWizardHelp,
    clearResponse,
    checkUsageAvailable,
  };
}
