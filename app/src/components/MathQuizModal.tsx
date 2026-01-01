'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import StandardsModal from './StandardsModal';
import { getStandardsForActivity } from '@/lib/standards';
import { soundManager } from '@/lib/soundManager';

interface MathProblem {
  type: string;
  typeName?: string;
  question: string;
  questionHtml?: string;
  diagram?: string;
  answerHash: string;
  hints?: string[];
  difficulty: number;
  gradeLevel: number;
  category: string;
}

interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
  streak: number;
  tokensEarned: number;
  totalTokens: number;
  streakBonus: number;
  streakDescription?: string;
  questionsUntilNextToken: number;
  questionsPerToken: number;
}

interface MathQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokensEarned?: (tokens: number, totalTokens: number) => void;
  initialTokens?: number;
  devMode?: boolean;
}

export default function MathQuizModal({ 
  isOpen, 
  onClose, 
  onTokensEarned,
  initialTokens = 0,
  devMode = false,
}: MathQuizModalProps) {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [streak, setStreak] = useState(0);
  const [tokens, setTokens] = useState(initialTokens);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [totalInSession, setTotalInSession] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [selectedMathType, setSelectedMathType] = useState<string>('random');
  const [showStandardsModal, setShowStandardsModal] = useState(false);

  // Get math standards for this activity
  const mathStandards = getStandardsForActivity('math-quiz');

  // Load a new problem
  const loadProblem = useCallback(async (specificType?: string) => {
    setIsLoading(true);
    setAnswer('');
    setResult(null);
    setShowHint(false);
    setCurrentHintIndex(0);
    
    try {
      const typeToUse = specificType || selectedMathType;
      const body = typeToUse && typeToUse !== 'random' 
        ? JSON.stringify({ mathType: typeToUse, random: false })
        : undefined;
      
      const response = await fetch('/api/quiz/generate', { 
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      });
      const data = await response.json();
      
      if (data.success && data.problem) {
        setProblem(data.problem);
        setStreak(data.currentStreak || 0);
        setTokens(data.currentTokens || 0);
        setStartTime(Date.now());
      } else {
        console.error('Failed to load problem:', data.error);
      }
    } catch (error) {
      console.error('Error loading problem:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMathType]);

  // Check the answer
  const checkAnswer = async () => {
    if (!problem || !answer.trim()) return;
    
    setIsChecking(true);
    const timeSpent = Date.now() - startTime;
    
    try {
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType: problem.type,
          answerHash: problem.answerHash,
          userAnswer: answer.trim(),
          timeSpentMs: timeSpent,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setStreak(data.streak);
        setTokens(data.totalTokens);
        setTotalInSession(prev => prev + 1);
        
        if (data.isCorrect) {
          setCorrectInSession(prev => prev + 1);
          
          // Play success sound
          soundManager.play('success', { volume: 0.4 });
          
          // Trigger confetti for correct answers
          if (data.streakBonus > 1) {
            // Big celebration for streak bonus!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } else {
            // Small celebration
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.7 },
            });
          }
          
          // Notify parent of tokens earned
          if (data.tokensEarned > 0 && onTokensEarned) {
            onTokensEarned(data.tokensEarned, data.totalTokens);
          }
        } else {
          // Play error sound for incorrect answer
          soundManager.play('error', { volume: 0.3 });
        }
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Enter' && !result) {
        e.preventDefault();
        checkAnswer();
      } else if (e.key === 'Enter' && result) {
        e.preventDefault();
        loadProblem();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, result, answer, loadProblem, onClose]);

  // Load first problem when modal opens
  useEffect(() => {
    if (isOpen && !problem) {
      loadProblem();
    }
  }, [isOpen, problem, loadProblem]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProblem(null);
      setAnswer('');
      setResult(null);
      setCorrectInSession(0);
      setTotalInSession(0);
    }
  }, [isOpen]);

  const showNextHint = () => {
    if (problem?.hints && currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden relative z-[10000]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                🧮 Math Quest
              </h2>
              <p className="text-purple-100 text-sm">
                Answer correctly to earn image tokens!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Standards Button */}
          <button
            onClick={() => setShowStandardsModal(true)}
            className="mt-2 flex items-center gap-1 text-xs text-purple-100 hover:text-white transition-colors"
          >
            <span>📚</span>
            <span>View {mathStandards.length} Standards</span>
          </button>
          
          {/* Stats Bar */}
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <span>🎨</span>
              <span className="font-semibold">{tokens}</span>
              <span className="text-purple-200">tokens</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔥</span>
              <span className="font-semibold">{streak}</span>
              <span className="text-purple-200">streak</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span className="font-semibold">{correctInSession}/{totalInSession}</span>
              <span className="text-purple-200">this session</span>
            </div>
          </div>
          
          {/* Dev Mode Type Selector */}
          {devMode && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-200">🔧 Dev:</span>
                <select
                  value={selectedMathType}
                  onChange={(e) => {
                    setSelectedMathType(e.target.value);
                    loadProblem(e.target.value);
                  }}
                  className="text-xs bg-white/20 border border-white/30 rounded px-2 py-1 text-white flex-1"
                >
                  <option value="random" className="text-gray-800">🎲 Random</option>
                  <optgroup label="Arithmetic" className="text-gray-800">
                    <option value="addition-single" className="text-gray-800">Single Digit Addition</option>
                    <option value="addition-double" className="text-gray-800">Double Digit Addition</option>
                    <option value="subtraction-single" className="text-gray-800">Single Digit Subtraction</option>
                    <option value="subtraction-double" className="text-gray-800">Double Digit Subtraction</option>
                    <option value="multiplication-basic" className="text-gray-800">Basic Multiplication</option>
                    <option value="multiplication-tables" className="text-gray-800">Times Tables</option>
                    <option value="division-basic" className="text-gray-800">Basic Division</option>
                  </optgroup>
                  <optgroup label="Fractions & Decimals" className="text-gray-800">
                    <option value="fractions-simple" className="text-gray-800">Simple Fractions</option>
                    <option value="fractions-add" className="text-gray-800">Adding Fractions</option>
                    <option value="decimals-add" className="text-gray-800">Adding Decimals</option>
                    <option value="percentages" className="text-gray-800">Percentages</option>
                  </optgroup>
                  <optgroup label="Algebra" className="text-gray-800">
                    <option value="algebra-simple" className="text-gray-800">Simple Equations</option>
                    <option value="algebra-linear" className="text-gray-800">Linear Equations</option>
                    <option value="order-operations" className="text-gray-800">Order of Operations</option>
                  </optgroup>
                  <optgroup label="Geometry" className="text-gray-800">
                    <option value="geometry-perimeter" className="text-gray-800">Perimeter</option>
                    <option value="geometry-area" className="text-gray-800">Area</option>
                    <option value="geometry-angles" className="text-gray-800">Angles</option>
                  </optgroup>
                  <optgroup label="Word Problems" className="text-gray-800">
                    <option value="word-add-sub" className="text-gray-800">Addition/Subtraction Word</option>
                    <option value="word-multiply" className="text-gray-800">Multiplication Word</option>
                  </optgroup>
                </select>
              </div>
              {problem && (
                <div className="text-xs text-purple-200 mt-1">
                  Current: {problem.typeName || problem.type}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">Loading problem...</p>
              </motion.div>
            ) : problem ? (
              <motion.div
                key="problem"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Problem */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                      {problem.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Grade {problem.gradeLevel}
                    </span>
                  </div>
                  
                  {/* Question - render HTML if available (for SVG diagrams) */}
                  {problem.questionHtml ? (
                    <div 
                      className="text-lg font-medium mb-4"
                      dangerouslySetInnerHTML={{ __html: problem.questionHtml }}
                    />
                  ) : (
                    <p className="text-lg font-medium mb-4">{problem.question}</p>
                  )}
                  
                  {/* Diagram (for coordinate plane, geometry, etc) */}
                  {problem.diagram && (
                    <div 
                      className="flex justify-center mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      dangerouslySetInnerHTML={{ __html: problem.diagram }}
                    />
                  )}
                </div>

                {/* Result feedback */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-4 p-4 rounded-lg ${
                      result.isCorrect 
                        ? 'bg-green-100 dark:bg-green-900/30 border border-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 border border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {result.isCorrect ? '🎉' : '❌'}
                      </span>
                      <div>
                        <p className={`font-semibold ${
                          result.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        }`}>
                          {result.isCorrect ? 'Correct!' : 'Not quite...'}
                        </p>
                        {!result.isCorrect && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            The answer was: <strong>{result.correctAnswer}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Token/Streak info */}
                    {result.isCorrect && (
                      <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-700">
                        {result.tokensEarned > 0 && (
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            🎨 +{result.tokensEarned} token{result.tokensEarned > 1 ? 's' : ''}!
                            {result.streakBonus > 1 && ` (${result.streakBonus}x streak bonus!)`}
                          </p>
                        )}
                        {result.streakDescription && (
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            {result.streakDescription}
                          </p>
                        )}
                        {result.questionsUntilNextToken > 0 && result.tokensEarned === 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.questionsUntilNextToken} more correct for next token
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Answer input */}
                {!result && (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                        autoFocus
                        disabled={isChecking}
                      />
                    </div>

                    {/* Hints */}
                    {problem.hints && problem.hints.length > 0 && (
                      <div className="mb-4">
                        {showHint ? (
                          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              💡 <strong>Hint:</strong> {problem.hints[currentHintIndex]}
                            </p>
                            {currentHintIndex < problem.hints.length - 1 && (
                              <button
                                onClick={showNextHint}
                                className="mt-2 text-xs text-yellow-700 dark:text-yellow-300 underline hover:no-underline"
                              >
                                Show another hint ({problem.hints.length - currentHintIndex - 1} left)
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowHint(true)}
                            className="text-sm text-gray-500 hover:text-purple-600 underline"
                          >
                            Need a hint?
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  {!result ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!answer.trim() || isChecking}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      {isChecking ? 'Checking...' : 'Check Answer'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => loadProblem()}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Next Problem →
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Done
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                Failed to load problem. 
                <button onClick={() => loadProblem()} className="text-purple-600 underline ml-1">
                  Try again
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer tip */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-center text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Enter</kbd> to submit • 
          Build a streak for bonus tokens! 🔥
        </div>
      </motion.div>

      {/* Standards Modal */}
      <StandardsModal
        isOpen={showStandardsModal}
        onClose={() => setShowStandardsModal(false)}
        activityType="math-quiz"
        activityName="Math Quiz"
      />
    </div>
  );
}
