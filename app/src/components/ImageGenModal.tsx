'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import MathQuizModal from './MathQuizModal';

// Style presets matching the backend
const STYLE_PRESETS = [
  { id: 'illustrated-storybook', name: 'Storybook', emoji: '📖', description: 'Classic illustration style' },
  { id: 'watercolor', name: 'Watercolor', emoji: '🎨', description: 'Soft, flowing colors' },
  { id: 'stone-carving', name: 'Stone Carving', emoji: '🗿', description: 'Ancient carved look' },
  { id: 'comic-book', name: 'Comic Book', emoji: '💥', description: 'Bold and dynamic' },
  { id: 'pixel-art', name: 'Pixel Art', emoji: '👾', description: 'Retro game style' },
  { id: 'oil-painting', name: 'Oil Painting', emoji: '🖼️', description: 'Classical fine art' },
  { id: 'cave-painting', name: 'Cave Painting', emoji: '🦬', description: 'Prehistoric art style' },
  { id: 'anime-manga', name: 'Anime', emoji: '✨', description: 'Japanese animation style' },
];

interface ImageStats {
  imageTokens: number;
  quizStreak: number;
  totalImagesGenerated: number;
  imagesGeneratedToday: number;
  freeImagesRemaining: number;
  freeImageLimit: number;
  dailyLimit: number;
  imagesRemainingToday: number;
  canGenerate: boolean;
}

interface ImageGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'character' | 'creature' | 'realm' | 'story' | 'mythology' | 'map';
  entityId: string;
  entityName: string;
  entityDescription?: string;
  mythologyName?: string;
  mythologyStyle?: string;
  onImageGenerated?: (imageUrl: string, imageId: string) => void;
}

export default function ImageGenModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
  entityDescription,
  mythologyName,
  mythologyStyle,
  onImageGenerated,
}: ImageGenModalProps) {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('illustrated-storybook');
  const [studentAddition, setStudentAddition] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    id: string;
    needsApproval: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Fetch user's image stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/images/generate');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      setGeneratedImage(null);
      setError(null);
      setStudentAddition('');
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!stats?.canGenerate) {
      if (stats && stats.imageTokens === 0 && stats.freeImagesRemaining === 0) {
        setShowQuizModal(true);
        return;
      }
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
          entityName,
          entityDescription,
          mythologyName,
          mythologyStyle,
          stylePreset: selectedStyle,
          studentAddition: studentAddition.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage({
          url: data.imageUrl,
          id: data.imageId,
          needsApproval: data.needsApproval,
        });
        
        // Update local stats
        setStats(prev => prev ? {
          ...prev,
          imageTokens: data.tokensRemaining,
          freeImagesRemaining: data.freeImagesRemaining,
          imagesRemainingToday: data.imagesRemainingToday,
          totalImagesGenerated: prev.totalImagesGenerated + 1,
          imagesGeneratedToday: prev.imagesGeneratedToday + 1,
        } : null);

        // Notify parent
        if (onImageGenerated) {
          onImageGenerated(data.imageUrl, data.imageId);
        }
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizTokensEarned = (earned: number, total: number) => {
    setStats(prev => prev ? {
      ...prev,
      imageTokens: total,
      canGenerate: total > 0 || (prev.freeImagesRemaining > 0),
    } : null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col relative z-[9999]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🎨 Generate Image
                </h2>
                <p className="text-indigo-100 text-sm">
                  Create AI art for <strong>{entityName}</strong>
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

            {/* Stats bar */}
            {stats && (
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span>🎨</span>
                  <span className="font-semibold">{stats.imageTokens}</span>
                  <span className="text-indigo-200">tokens</span>
                </div>
                {stats.freeImagesRemaining > 0 && (
                  <div className="flex items-center gap-1">
                    <span>🎁</span>
                    <span className="font-semibold">{stats.freeImagesRemaining}</span>
                    <span className="text-indigo-200">free left</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span className="font-semibold">{stats.imagesRemainingToday}/{stats.dailyLimit}</span>
                  <span className="text-indigo-200">today</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {generatedImage ? (
                // Success state - show generated image
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
                    <Image
                      src={generatedImage.url}
                      alt={entityName}
                      width={512}
                      height={512}
                      className="w-full h-auto"
                    />
                  </div>

                  {generatedImage.needsApproval && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        ⏳ This image is pending teacher approval before it will be visible to others.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setGeneratedImage(null);
                        setStudentAddition('');
                      }}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Generate Another
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                // Loading state
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl">
                      🎨
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Creating your artwork...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This usually takes 10-20 seconds
                  </p>
                </motion.div>
              ) : (
                // Form state
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Error message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* No tokens warning */}
                  {stats && !stats.canGenerate && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🧮</span>
                        <div>
                          <p className="font-medium text-amber-800 dark:text-amber-200">
                            Need more tokens!
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Complete math quizzes to earn image tokens.
                            3 correct answers = 1 token!
                          </p>
                          <button
                            onClick={() => setShowQuizModal(true)}
                            className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Start Math Quiz →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Style Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose a Style
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {STYLE_PRESETS.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            selectedStyle === style.id
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{style.emoji}</span>
                          <span className="text-xs font-medium">{style.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {STYLE_PRESETS.find(s => s.id === selectedStyle)?.description}
                    </p>
                  </div>

                  {/* Custom Addition */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add Your Touch (optional)
                    </label>
                    <input
                      type="text"
                      value={studentAddition}
                      onChange={(e) => setStudentAddition(e.target.value.slice(0, 100))}
                      placeholder="e.g., standing on a mountain, holding a lightning bolt..."
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      maxLength={100}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {studentAddition.length}/100 characters
                    </p>
                  </div>

                  {/* Preview info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Creating:</strong> {entityName}
                      {mythologyName && <span className="text-gray-400"> from {mythologyName}</span>}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <strong>Style:</strong> {STYLE_PRESETS.find(s => s.id === selectedStyle)?.name}
                    </p>
                    {studentAddition && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <strong>With:</strong> {studentAddition}
                      </p>
                    )}
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!stats?.canGenerate}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      stats?.canGenerate
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {stats?.canGenerate
                      ? (stats.freeImagesRemaining > 0 
                          ? '✨ Generate Free Image' 
                          : '🎨 Generate Image (1 token)')
                      : '🔒 Earn tokens to generate'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Math Quiz Modal */}
      <MathQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onTokensEarned={handleQuizTokensEarned}
        initialTokens={stats?.imageTokens || 0}
      />
    </>
  );
}
