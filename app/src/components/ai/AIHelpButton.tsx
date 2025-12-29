// =====================================================
// AI HELP BUTTON COMPONENT
// The magical 💡 button that unlocks AI assistance
// =====================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  Wand2,
  BookOpen,
  X,
  Loader2
} from 'lucide-react';
import { useAIAssistance } from '@/hooks/useAIAssistance';
import type { FieldContext, AssistanceType } from '@/lib/ai/prompts';

// =====================================================
// TYPES
// =====================================================

interface AIHelpButtonProps {
  fieldContext: FieldContext;
  position?: 'right' | 'inline' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface HelpOption {
  id: AssistanceType;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

// =====================================================
// HELP OPTIONS
// =====================================================

const HELP_OPTIONS: HelpOption[] = [
  {
    id: 'give_ideas',
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Give me ideas',
    description: 'Get creative suggestions',
    color: 'text-yellow-500',
  },
  {
    id: 'ask_questions',
    icon: <HelpCircle className="w-4 h-4" />,
    label: 'Ask me questions',
    description: 'Discover through guided questions',
    color: 'text-blue-500',
  },
  {
    id: 'improve',
    icon: <Wand2 className="w-4 h-4" />,
    label: 'Help me improve',
    description: 'Get feedback on what you wrote',
    color: 'text-purple-500',
  },
  {
    id: 'check_fit',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Does this fit?',
    description: 'Check if it matches your mythology',
    color: 'text-green-500',
  },
  {
    id: 'show_examples',
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Show examples',
    description: 'See how others might approach this',
    color: 'text-orange-500',
  },
];

// =====================================================
// COMPONENT
// =====================================================

export function AIHelpButton({
  fieldContext,
  position = 'right',
  size = 'md',
  className = '',
}: AIHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const {
    isLoading,
    response,
    error,
    remainingUsage,
    getFieldHelp,
    clearResponse,
  } = useAIAssistance();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (!showResponse) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showResponse]);

  // Show response panel when we get a response
  useEffect(() => {
    if (response) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowResponse(true);
       
      setIsOpen(false);
    }
  }, [response]);

  const handleOptionClick = async (assistanceType: AssistanceType) => {
    await getFieldHelp(fieldContext, assistanceType);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowResponse(false);
    clearResponse();
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Position variants
  const positionClasses = {
    right: 'absolute right-2 top-1/2 -translate-y-1/2',
    inline: 'inline-flex ml-2',
    floating: 'fixed bottom-4 right-4 z-50',
  };

  return (
    <div className={`relative ${positionClasses[position]} ${className}`} ref={menuRef}>
      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-linear-to-br from-amber-400 to-orange-500
          hover:from-amber-300 hover:to-orange-400
          text-white 
          shadow-lg shadow-orange-500/30
          flex items-center justify-center
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-orange-300 ring-offset-2' : ''}
        `}
        title="Get AI help"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Lightbulb className={iconSizes[size]} />
        )}
      </motion.button>

      {/* Usage indicator */}
      {remainingUsage && (
        <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full px-1.5 py-0.5 text-[10px] text-gray-300 border border-gray-700">
          {remainingUsage.today}/{remainingUsage.limit}
        </div>
      )}

      {/* Options Menu */}
      <AnimatePresence>
        {isOpen && !showResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium text-sm">AI Writing Helper</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Choose how you&apos;d like help with this field
              </p>
            </div>

            <div className="p-2">
              {HELP_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isLoading}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-800 transition-colors text-left group"
                >
                  <div className={`${option.color} mt-0.5 group-hover:scale-110 transition-transform`}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{option.label}</div>
                    <div className="text-xs text-gray-400">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Show field context */}
            <div className="px-3 pb-3">
              <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg px-2.5 py-1.5">
                Helping with: <span className="text-gray-400">{fieldContext.fieldName.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response Panel */}
      <AnimatePresence>
        {showResponse && (
          <AIResponsePanel
            response={response}
            error={error}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================
// RESPONSE PANEL
// =====================================================

interface AIResponsePanelProps {
  response: string | null;
  error: string | null;
  onClose: () => void;
}

function AIResponsePanel({ response, error, onClose }: AIResponsePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-linear-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-sm text-white">AI Suggestion</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-72">
        {error ? (
          <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
            {error}
          </div>
        ) : response ? (
          <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
            {response}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No response received</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          Remember: AI helps you think, it doesn&apos;t write for you!
        </p>
      </div>
    </motion.div>
  );
}

export default AIHelpButton;
