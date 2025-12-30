'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useState, useRef, useCallback } from 'react';
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

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, wordCount: number) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [interimText, setInterimText] = useState(''); // Show text as user speaks
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your story...',
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      const words = text.split(/\s+/).filter(w => w.length > 0).length;
      onChange(JSON.stringify(json), words);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-100 px-4 py-3',
      },
    },
  });

  // Check for voice support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognitionAPI);
  }, []);

  // Voice input handlers
  const startListening = useCallback(() => {
    if (!editor) return;
    
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

      if (finalTranscript && editor) {
        // Insert text at cursor position
        editor.chain().focus().insertContent(finalTranscript + ' ').run();
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
  }, [editor]);

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

  // AI cleanup for the entire content
  const handleAICleanup = async () => {
    if (!editor) return;
    const text = editor.getText();
    if (!text.trim()) return;
    
    setIsCleaningUp(true);
    try {
      const res = await fetch('/api/ai/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: 'cleanup' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.cleaned) {
          // Replace content with cleaned version
          editor.commands.setContent(data.cleaned);
        }
      }
    } catch (err) {
      console.error('AI cleanup error:', err);
    } finally {
      setIsCleaningUp(false);
    }
  };

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      try {
        const parsed = JSON.parse(content);
        editor.commands.setContent(parsed);
      } catch {
        // If not JSON, treat as plain text
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();

  return (
    <div className={`bg-white/5 border rounded-xl overflow-hidden ${isListening ? 'border-red-500/50' : 'border-white/10'}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-white/5 border-b border-white/10">
        {/* Voice Input Button */}
        {voiceSupported && (
          <>
            <button
              type="button"
              onClick={toggleVoice}
              className={`px-3 py-1 rounded text-sm transition-all flex items-center gap-1.5 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Stop' : 'Voice'}
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
          </>
        )}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('bold')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('italic')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('strike')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <s>S</s>
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('bulletList')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('orderedList')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('blockquote')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          &quot; Quote
        </button>

        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded text-sm bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded text-sm bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ↷ Redo
        </button>

        {/* AI Cleanup Button */}
        {wordCount > 10 && (
          <>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button
              type="button"
              onClick={handleAICleanup}
              disabled={isCleaningUp}
              className="px-3 py-1 rounded text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {isCleaningUp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Fix Spelling
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Voice Recording Indicator */}
      {isListening && (
        <div className="bg-red-500/10 border-b border-red-500/30 p-2">
          <p className="text-red-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            🎤 Recording... speak clearly. Click &quot;Stop&quot; when done.
          </p>
          {/* Live speech preview */}
          {interimText && (
            <p className="text-red-200 text-sm mt-1 italic flex items-center gap-2">
              <span className="animate-pulse">💬</span>
              {interimText}
              <span className="text-red-400/50 text-xs">(listening...)</span>
            </p>
          )}
        </div>
      )}

      {/* Voice Error */}
      {voiceError && (
        <div className="bg-red-500/10 border-b border-red-500/30 p-2">
          <p className="text-red-400 text-xs">⚠️ {voiceError}</p>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} className="text-white" />

      {/* Stats */}
      <div className="flex justify-between items-center p-3 bg-white/5 border-t border-white/10 text-sm text-white/60">
        <span>{wordCount} words</span>
        <div className="flex items-center gap-3">
          {voiceSupported && (
            <span className="text-green-400/60 text-xs">🎤 Voice available</span>
          )}
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  );
}
