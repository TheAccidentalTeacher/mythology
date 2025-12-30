// =====================================================
// VOICE TEXTAREA COMPONENT
// A textarea with built-in voice-to-text support
// Drop-in replacement for regular textareas
// =====================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';

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
// COMPONENT PROPS
// =====================================================

interface VoiceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  showAICleanup?: boolean;
  label?: string;
  helpText?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function VoiceTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  required = false,
  minLength,
  maxLength,
  showAICleanup = true,
  label,
  helpText,
}: VoiceTextareaProps) {
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        // Append to existing content with a space
        onChange(value ? `${value} ${finalTranscript}` : finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied. Please allow microphone access in your browser.');
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.');
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

  const baseClass = "w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none";
  const borderClass = isListening ? "border-red-500/50 bg-red-500/5" : "border-white/30";

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-white font-semibold">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {voiceSupported && (
            <span className="text-green-400/60 text-xs flex items-center gap-1">
              <Mic className="w-3 h-3" />
              Voice available
            </span>
          )}
        </div>
      )}

      {/* Textarea with voice button */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? '🎤 Listening... speak now!' : placeholder}
          rows={rows}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          className={`${baseClass} ${borderClass} ${className} pr-12`}
        />

        {/* Voice Button */}
        {voiceSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
            title={isListening ? 'Stop recording' : 'Start voice input (speak to type)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Voice Error */}
      {voiceError && (
        <p className="text-red-400 text-xs">⚠️ {voiceError}</p>
      )}

      {/* Listening Indicator */}
      {isListening && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
          <p className="text-red-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording... speak clearly. Click the microphone to stop.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* AI Cleanup Button */}
        {showAICleanup && value.trim().length > 20 && (
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

        {/* Character count */}
        {(minLength || maxLength) && (
          <span className="text-gray-400 text-xs ml-auto">
            {value.length}{maxLength ? `/${maxLength}` : ''} characters
            {minLength && value.length < minLength && (
              <span className="text-yellow-400 ml-1">
                (need {minLength - value.length} more)
              </span>
            )}
          </span>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="text-gray-400 text-sm">{helpText}</p>
      )}
    </div>
  );
}
