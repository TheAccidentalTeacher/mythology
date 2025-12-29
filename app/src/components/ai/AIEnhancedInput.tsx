// =====================================================
// AI ENHANCED INPUT COMPONENT
// Form input with integrated AI help button
// =====================================================

'use client';

import { useId } from 'react';
import { AIHelpButton } from './AIHelpButton';
import type { FieldContext } from '@/lib/ai/prompts';

// =====================================================
// TYPES
// =====================================================

interface AIEnhancedInputProps {
  // Standard input props
  type?: 'text' | 'textarea';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  
  // AI props
  mythologyContext: {
    mythologyId?: string;
    mythologyName: string;
    mythologyCategory?: string;
    mythologyGeography?: string;
  };
  entityType: 'character' | 'creature' | 'story' | 'mythology';
  entityDetails?: Record<string, string>;
  assistanceLevel?: 'guide_me' | 'support_me' | 'challenge_me';
  
  // Labeling
  label: string;
  helpText?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export function AIEnhancedInput({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
  
  mythologyContext,
  entityType,
  entityDetails,
  assistanceLevel = 'support_me',
  
  label,
  helpText,
}: AIEnhancedInputProps) {
  const inputId = useId();

  // Build field context for AI
  const fieldContext: FieldContext = {
    mythologyId: mythologyContext.mythologyId,
    mythologyName: mythologyContext.mythologyName,
    mythologyCategory: mythologyContext.mythologyCategory,
    mythologyGeography: mythologyContext.mythologyGeography,
    entityType,
    entityDetails,
    fieldName: name,
    existingContent: value,
    assistanceLevel,
  };

  const baseInputClasses = `
    w-full px-4 py-3 pr-12
    bg-white/5 border border-white/10 rounded-xl 
    text-white placeholder-white/40 
    focus:outline-none focus:ring-2 focus:ring-purple-500
    transition-colors
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      <label htmlFor={inputId} className="block text-white font-medium mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={baseInputClasses}
          />
        ) : (
          <input
            id={inputId}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
          />
        )}

        {/* AI Help Button */}
        <div className="absolute right-3 top-3">
          <AIHelpButton
            fieldContext={fieldContext}
            position="inline"
            size="sm"
          />
        </div>
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="text-white/40 text-sm mt-1.5">{helpText}</p>
      )}
    </div>
  );
}

export default AIEnhancedInput;
