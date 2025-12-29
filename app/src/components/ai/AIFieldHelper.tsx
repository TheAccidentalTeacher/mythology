// =====================================================
// AI FIELD HELPER COMPONENT
// Provides suggestions, hints, and guidance for form fields
// =====================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Lightbulb, X } from 'lucide-react';
import { useAIAssistance } from '@/hooks/useAIAssistance';

// =====================================================
// TYPES
// =====================================================

export interface Suggestion {
  emoji?: string;
  text: string;
}

export interface FieldHelperConfig {
  fieldName: string;
  fieldLabel: string;
  explanation?: string;
  realWorldExample?: string;
  suggestions?: Suggestion[];
  thinkAbout?: string[];
  stuckHints?: string[];
  aiPromptContext?: string;
}

interface AIFieldHelperProps {
  config: FieldHelperConfig;
  value: string;
  onChange: (newValue: string) => void;
  mythologyContext?: {
    name: string;
    category?: string;
    geography?: string;
  };
  placeholder?: string;
  rows?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

// =====================================================
// COMPONENT
// =====================================================

export function AIFieldHelper({
  config,
  value,
  onChange,
  mythologyContext,
  placeholder,
  rows = 3,
  required = false,
  minLength,
  maxLength,
}: AIFieldHelperProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  const { getFieldHelp, response, isLoading, clearResponse } = useAIAssistance();

  // Add suggestion to field
  const addSuggestion = (text: string) => {
    if (value) {
      onChange(`${value}, ${text.toLowerCase()}`);
    } else {
      onChange(text);
    }
  };

  // Get random hint
  const getHint = () => {
    if (!config.stuckHints?.length) return;
    const nextIndex = (currentHintIndex + 1) % config.stuckHints.length;
    setCurrentHintIndex(nextIndex);
    setShowHint(true);
  };

  // Get AI help
  const handleAIHelp = async () => {
    if (!mythologyContext) return;
    
    await getFieldHelp(
      {
        fieldName: config.fieldName,
        entityType: 'character', // Will be passed dynamically
        mythologyName: mythologyContext.name,
        mythologyCategory: mythologyContext.category,
        existingContent: value,
        assistanceLevel: 'support_me', // Default assistance level
      },
      'give_ideas',
      config.aiPromptContext
    );
    
    if (response) {
      setAiResponse(response);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label with help toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-white font-medium">
          {config.fieldLabel}
          {required && <span className="text-red-400 ml-1">*</span>}
          {maxLength && (
            <span className="text-white/40 font-normal ml-2">
              ({value.length}/{maxLength})
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <Lightbulb className="w-3 h-3" />
          {showHelp ? 'Hide Help' : 'Need Help?'}
          <ChevronDown className={`w-3 h-3 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/50 rounded-lg p-3 space-y-3 border border-gray-700">
              {/* Explanation */}
              {config.explanation && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                  <p className="text-blue-300 text-xs">💡 {config.explanation}</p>
                </div>
              )}

              {/* Real World Example */}
              {config.realWorldExample && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                  <p className="text-green-300 text-xs">🌍 {config.realWorldExample}</p>
                </div>
              )}

              {/* Think About */}
              {config.thinkAbout && config.thinkAbout.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">🤔 Think about:</p>
                  <ul className="space-y-0.5">
                    {config.thinkAbout.map((q, i) => (
                      <li key={i} className="text-gray-400 text-xs flex items-start gap-1">
                        <span className="text-amber-500">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Input */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />

      {/* Min length warning */}
      {minLength && value.length > 0 && value.length < minLength && (
        <p className="text-yellow-300 text-xs">Need {minLength - value.length} more characters</p>
      )}

      {/* Quick Suggestions */}
      {config.suggestions && config.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {config.suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addSuggestion(s.text)}
              className="px-2 py-1 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all"
            >
              {s.emoji && <span className="mr-1">{s.emoji}</span>}
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Stuck Hint Button */}
        {config.stuckHints && config.stuckHints.length > 0 && (
          <button
            type="button"
            onClick={getHint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors text-xs border border-amber-500/30"
          >
            <Sparkles className="w-3 h-3" />
            {showHint ? 'Another Hint?' : 'Stuck? Get a Hint!'}
          </button>
        )}

        {/* AI Help Button (only if mythology context provided) */}
        {mythologyContext && config.aiPromptContext && (
          <button
            type="button"
            onClick={handleAIHelp}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors text-xs border border-purple-500/30 disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3" />
            {isLoading ? 'Thinking...' : '✨ AI Ideas'}
          </button>
        )}
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && config.stuckHints && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-amber-300 text-xs">
                💭 <strong>Try this:</strong> {config.stuckHints[currentHintIndex]}
              </p>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="text-amber-500/50 hover:text-amber-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response Display */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-purple-400 font-medium text-xs">✨ AI Suggestions</span>
              <button
                type="button"
                onClick={() => { clearResponse(); setAiResponse(null); }}
                className="text-purple-500/50 hover:text-purple-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-gray-300 text-xs whitespace-pre-wrap">{aiResponse}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================
// SIMPLE INPUT VERSION (for single-line inputs)
// =====================================================

interface AIInputHelperProps {
  config: FieldHelperConfig;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export function AIInputHelper({
  config,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
}: AIInputHelperProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSuggestion = (text: string) => {
    onChange(text);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-white font-medium">
        {config.fieldLabel}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        {config.suggestions && config.suggestions.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && config.suggestions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap gap-1.5"
          >
            {config.suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addSuggestion(s.text)}
                className="px-2 py-1 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all"
              >
                {s.emoji && <span className="mr-1">{s.emoji}</span>}
                {s.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIFieldHelper;
