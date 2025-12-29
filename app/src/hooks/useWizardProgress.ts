// =====================================================
// useWizardProgress Hook
// Manages multi-step wizard state and persistence
// =====================================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { WizardData } from '@/lib/ai/prompts';

// =====================================================
// TYPES
// =====================================================

export type WizardStep = 
  | 'category'
  | 'geography'
  | 'five_themes'
  | 'name'
  | 'preview'
  | 'complete';

export interface WizardState {
  currentStep: WizardStep;
  data: WizardData;
  isLoading: boolean;
  error: string | null;
  progressId: string | null;
}

export interface UseWizardProgressReturn extends WizardState {
  // Navigation
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Data management
  updateData: (updates: Partial<WizardData>) => void;
  updateStepData: (step: WizardStep, data: unknown) => void;
  
  // Persistence
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  clearProgress: () => Promise<void>;
  
  // Completion
  completeWizard: () => Promise<{ mythologyId: string } | null>;
}

// =====================================================
// STEP ORDER
// =====================================================

const STEP_ORDER: WizardStep[] = ['category', 'geography', 'five_themes', 'name', 'preview', 'complete'];

// =====================================================
// HOOK IMPLEMENTATION
// =====================================================

export function useWizardProgress(): UseWizardProgressReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const [state, setState] = useState<WizardState>({
    currentStep: 'category',
    data: {},
    isLoading: false,
    error: null,
    progressId: null,
  });

  // Get user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, [supabase.auth]);

  // Load existing progress on mount
  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigation methods
  const goToStep = useCallback((step: WizardStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setState(prev => ({ ...prev, currentStep: STEP_ORDER[currentIndex + 1] }));
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, currentStep: STEP_ORDER[currentIndex - 1] }));
    }
  }, [state.currentStep]);

  // Data management
  const updateData = useCallback((updates: Partial<WizardData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
    }));
  }, []);

  const updateStepData = useCallback((step: WizardStep, data: unknown) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [step]: data },
    }));
  }, []);

  // Save progress to database
  const saveProgress = useCallback(async () => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const progressData = {
        user_id: userId,
        wizard_type: 'mythology_creation',
        current_step: state.currentStep,
        step_data: state.data,
        last_active: new Date().toISOString(),
      };

      if (state.progressId) {
        // Update existing progress
        const { error } = await supabase
          .from('wizard_progress')
          .update(progressData)
          .eq('id', state.progressId);

        if (error) throw error;
      } else {
        // Create new progress
        const { data, error } = await supabase
          .from('wizard_progress')
          .insert(progressData)
          .select('id')
          .single();

        if (error) throw error;
        setState(prev => ({ ...prev, progressId: data.id }));
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to save progress',
      }));
    }
  }, [userId, state.currentStep, state.data, state.progressId, supabase]);

  // Load progress from database
  const loadProgress = useCallback(async () => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Don't use .single() - it throws 406 when no rows exist
      const { data, error } = await supabase
        .from('wizard_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('wizard_type', 'mythology_creation')
        .eq('is_complete', false)
        .order('last_active', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      // data is an array, get first item if exists
      const progress = data?.[0];
      
      if (progress) {
        setState(prev => ({
          ...prev,
          currentStep: progress.current_step as WizardStep,
          data: progress.step_data as WizardData,
          progressId: progress.id,
          isLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load progress',
      }));
    }
  }, [userId, supabase]);

  // Clear progress
  const clearProgress = useCallback(async () => {
    if (state.progressId) {
      await supabase
        .from('wizard_progress')
        .delete()
        .eq('id', state.progressId);
    }

    setState({
      currentStep: 'category',
      data: {},
      isLoading: false,
      error: null,
      progressId: null,
    });
  }, [state.progressId, supabase]);

  // Complete wizard and create mythology
  const completeWizard = useCallback(async (): Promise<{ mythologyId: string } | null> => {
    if (!userId || !state.data.selected_name) {
      console.error('Cannot complete wizard: missing userId or name');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Build the setting description from wizard data
      const geography = state.data.geography || {};
      const fiveThemes = state.data.five_themes || {};
      
      const settingParts = [
        geography.environment && `Setting: ${geography.environment}`,
        geography.climate && `Climate: ${geography.climate}`,
        geography.features && `Features: ${geography.features}`,
      ].filter(Boolean);

      const settingDescription = settingParts.join('. ') || undefined;
      
      // Build full description including five themes
      const descriptionParts = [
        state.data.description || `A ${state.data.category || 'custom'} mythology`,
        fiveThemes.location && `\n\nLocation: ${fiveThemes.location}`,
        fiveThemes.place && `\nPlace: ${fiveThemes.place}`,
        fiveThemes.interaction && `\nInteraction: ${fiveThemes.interaction}`,
        fiveThemes.movement && `\nMovement: ${fiveThemes.movement}`,
        fiveThemes.regions && `\nRegions: ${fiveThemes.regions}`,
      ].filter(Boolean);

      const fullDescription = descriptionParts.join('');

      // Map category to genre/geography_type
      const categoryToGenre: Record<string, string> = {
        classic: 'fantasy',
        historical: 'historical',
        future: 'scifi',
        modern: 'modern',
        abstract: 'fantasy',
        custom: 'fantasy',
      };

      console.log('Creating mythology with data:', {
        name: state.data.selected_name,
        description: fullDescription.substring(0, 100) + '...',
        genre: categoryToGenre[state.data.category || 'custom'],
        setting_description: settingDescription,
      });

      // Create the mythology using existing table columns
      const { data: mythology, error: mythologyError } = await supabase
        .from('mythologies')
        .insert({
          name: state.data.selected_name,
          description: fullDescription,
          genre: categoryToGenre[state.data.category || 'custom'] || 'fantasy',
          geography_type: geography.environment?.split(',')[0]?.trim().toLowerCase() || undefined,
          setting_description: settingDescription,
          cultural_inspiration: state.data.subcategory || undefined,
          created_by: userId,
        })
        .select('id')
        .single();

      if (mythologyError) {
        console.error('Error creating mythology:', mythologyError);
        throw mythologyError;
      }

      console.log('Mythology created successfully:', mythology.id);

      // Mark wizard progress as complete
      if (state.progressId) {
        await supabase
          .from('wizard_progress')
          .update({
            is_complete: true,
            completed_at: new Date().toISOString(),
            result_id: mythology.id,
          })
          .eq('id', state.progressId);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 'complete',
      }));

      return { mythologyId: mythology.id };
    } catch (err) {
      console.error('completeWizard error:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create mythology',
      }));
      return null;
    }
  }, [userId, state.data, state.progressId, supabase]);

  return {
    ...state,
    goToStep,
    nextStep,
    prevStep,
    updateData,
    updateStepData,
    saveProgress,
    loadProgress,
    clearProgress,
    completeWizard,
  };
}
