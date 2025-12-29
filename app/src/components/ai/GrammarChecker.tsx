// =====================================================
// GRAMMAR CHECKER COMPONENT
// AI-powered grammar and writing improvement tool
// =====================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookCheck, 
  Loader2, 
  AlertCircle, 
  X,
  Sparkles 
} from 'lucide-react';
import { useAIAssistance } from '@/hooks/useAIAssistance';

// =====================================================
// TYPES
// =====================================================

interface GrammarCheckerProps {
  text: string;
  contentType?: 'story' | 'description' | 'general';
  className?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export function GrammarChecker({ 
  text, 
  contentType = 'general',
  className = '' 
}: GrammarCheckerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, response, error, checkGrammar, clearResponse } = useAIAssistance();

  const handleCheck = async () => {
    if (!text || text.trim().length < 10) {
      return;
    }
    setIsOpen(true);
    await checkGrammar(text, contentType);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearResponse();
  };

  const canCheck = text && text.trim().length >= 10;

  return (
    <div className={`relative ${className}`}>
      {/* Grammar Check Button */}
      <button
        onClick={handleCheck}
        disabled={!canCheck || isLoading}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${canCheck 
            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          }
        `}
        title={canCheck ? 'Check grammar and get writing tips' : 'Need at least 10 characters to check'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <BookCheck className="w-4 h-4" />
        )}
        <span>Check Grammar</span>
      </button>

      {/* Results Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-gray-900 rounded-xl border border-gray-700 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-linear-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-sm text-white">Grammar Check</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-sm text-gray-400">Analyzing your writing...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-400 text-sm">Error checking grammar</div>
                    <div className="text-xs text-red-300/70 mt-1">{error}</div>
                  </div>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <span className="text-sm">Click &quot;Check Grammar&quot; to analyze your writing</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Grammar suggestions to help you improve
                </p>
                {response && (
                  <button
                    onClick={handleCheck}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Re-check
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GrammarChecker;
