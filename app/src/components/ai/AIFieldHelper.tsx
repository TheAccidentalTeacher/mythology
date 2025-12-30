// =====================================================
// AI FIELD HELPER COMPONENT
// Provides suggestions, hints, and guidance for form fields
// =====================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Lightbulb, X, Mic, MicOff, Loader2 } from 'lucide-react';
import { useAIAssistance } from '@/hooks/useAIAssistance';

// =====================================================
// WEB SPEECH API TYPES
// =====================================================

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

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
  
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [interimText, setInterimText] = useState(''); // Show text as user speaks
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { getFieldHelp, response, isLoading, clearResponse } = useAIAssistance();

  // Check for voice support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognitionAPI);
  }, []);

  // Voice input handlers
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Show interim results as user speaks
      setInterimText(interimTranscript);

      if (finalTranscript) {
        // Append to existing content with a space
        onChange(value ? `${value} ${finalTranscript}` : finalTranscript);
        // Clear interim text once finalized
        setInterimText('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Try again.');
      } else {
        setVoiceError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [value, onChange]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // AI cleanup for voice input
  const handleAICleanup = async () => {
    if (!value.trim()) return;
    
    setIsCleaningUp(true);
    try {
      const res = await fetch('/api/ai/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, mode: 'cleanup' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.cleaned) {
          onChange(data.cleaned);
        }
      }
    } catch (err) {
      console.error('AI cleanup error:', err);
    } finally {
      setIsCleaningUp(false);
    }
  };

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

      {/* Text Input with Voice */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? '🎤 Listening... speak now!' : placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
            isListening ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'
          }`}
        />
        
        {/* Voice Input Button */}
        {voiceSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Voice error message */}
      {voiceError && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <X className="w-3 h-3" />
          {voiceError}
        </p>
      )}

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-2"
        >
          <p className="text-red-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Listening... speak clearly. Click the microphone again to stop.
          </p>
          {/* Live speech preview */}
          {interimText && (
            <p className="text-red-200 text-sm mt-1 italic flex items-center gap-2">
              <span className="animate-pulse">💬</span>
              {interimText}
              <span className="text-red-400/50 text-xs">(listening...)</span>
            </p>
          )}
        </motion.div>
      )}

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

        {/* AI Cleanup Button - Fix spelling/grammar after voice input */}
        {value.trim().length > 20 && (
          <button
            type="button"
            onClick={handleAICleanup}
            disabled={isCleaningUp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-xs border border-green-500/30 disabled:opacity-50"
          >
            {isCleaningUp ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                ✏️ Fix Spelling & Grammar
              </>
            )}
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
// With AI-powered name generation
// =====================================================

interface NameSuggestion {
  name: string;
  explanation: string;
}

interface AIInputHelperProps {
  config: FieldHelperConfig;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  mythologyId?: string; // For AI-powered suggestions
  entityType?: 'character' | 'creature'; // What type of entity
}

export function AIInputHelper({
  config,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  mythologyId,
  entityType = 'character',
}: AIInputHelperProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<NameSuggestion[]>([]);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleCategoryClick = async (category: string) => {
    // If no mythologyId, just use the category as the value (fallback behavior)
    if (!mythologyId) {
      onChange(category);
      setShowSuggestions(false);
      return;
    }

    // If already selected this category, toggle off
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setAiSuggestions([]);
      return;
    }

    // Call AI to generate names for this category
    setLoadingCategory(category);
    setSelectedCategory(category);
    setAiError(null);
    setAiSuggestions([]);

    try {
      const res = await fetch('/api/ai/name-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mythologyId,
          category,
          entityType,
          existingName: value.trim() || undefined, // If they have a name, refine it
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.suggestions) {
          setAiSuggestions(data.suggestions);
        } else {
          setAiError('Could not generate suggestions. Try again!');
        }
      } else {
        setAiError('AI is busy. Try again in a moment!');
      }
    } catch (err) {
      console.error('AI name suggestion error:', err);
      setAiError('Something went wrong. Try again!');
    } finally {
      setLoadingCategory(null);
    }
  };

  const selectName = (name: string) => {
    onChange(name);
    setShowSuggestions(false);
    setSelectedCategory(null);
    setAiSuggestions([]);
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
            onClick={() => {
              setShowSuggestions(!showSuggestions);
              if (showSuggestions) {
                setSelectedCategory(null);
                setAiSuggestions([]);
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
            title="Get AI name suggestions"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Selection */}
      <AnimatePresence>
        {showSuggestions && config.suggestions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-3"
          >
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {config.suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCategoryClick(s.text)}
                  disabled={loadingCategory !== null}
                  className={`px-2 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
                    selectedCategory === s.text
                      ? 'bg-purple-500 text-white border-purple-400'
                      : loadingCategory === s.text
                      ? 'bg-purple-500/30 text-purple-200 border-purple-400/50 animate-pulse'
                      : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border-purple-500/30 hover:border-purple-500/50'
                  }`}
                >
                  {s.emoji && <span>{s.emoji}</span>}
                  <span>{s.text}</span>
                  {loadingCategory === s.text && (
                    <Loader2 className="w-3 h-3 animate-spin ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* AI Helper Text */}
            {mythologyId && !selectedCategory && !loadingCategory && (
              <p className="text-purple-300/60 text-xs">
                ✨ Click a theme above to get AI-generated name ideas that fit your mythology!
              </p>
            )}

            {/* Loading State */}
            {loadingCategory && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-200 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating {loadingCategory.toLowerCase()} names for your mythology...
                </p>
              </div>
            )}

            {/* AI Error */}
            {aiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                <p className="text-red-300 text-xs">⚠️ {aiError}</p>
              </div>
            )}

            {/* AI Generated Names */}
            {aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 space-y-2"
              >
                <p className="text-purple-200 text-xs font-medium mb-2">
                  ✨ AI Suggestions for &quot;{selectedCategory}&quot;:
                </p>
                <div className="space-y-1.5">
                  {aiSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectName(suggestion.name)}
                      className="w-full text-left px-3 py-2 bg-white/5 hover:bg-purple-500/20 rounded-lg transition-all group"
                    >
                      <span className="text-white font-medium group-hover:text-purple-200">
                        {suggestion.name}
                      </span>
                      <span className="text-white/50 text-xs ml-2">
                        — {suggestion.explanation}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-purple-300/50 text-xs mt-2">
                  Click a name to use it, or type your own!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIFieldHelper;
