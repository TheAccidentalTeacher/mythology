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

interface ImageGenPanelProps {
  entityType: 'character' | 'creature' | 'realm' | 'story' | 'mythology' | 'map';
  entityId: string;
  entityName: string;
  entityDescription?: string;
  mythologyName?: string;
  mythologyStyle?: string;
  onImageGenerated?: (imageUrl: string, imageId: string) => void;
}

export default function ImageGenPanel({
  entityType,
  entityId,
  entityName,
  entityDescription,
  mythologyName,
  mythologyStyle,
  onImageGenerated,
}: ImageGenPanelProps) {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [isPrivileged, setIsPrivileged] = useState(false);
  const [cheatModeEnabled, setCheatModeEnabled] = useState(false);
  const [cheatClickCount, setCheatClickCount] = useState(0);
  const [lastCheatClick, setLastCheatClick] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('illustrated-storybook');

  // Secret cheat code: Click the 🎨 emoji 5 times quickly (within 3 seconds)
  const handleCheatClick = () => {
    const now = Date.now();
    if (now - lastCheatClick > 3000) {
      // Reset if more than 3 seconds since last click
      setCheatClickCount(1);
    } else {
      const newCount = cheatClickCount + 1;
      setCheatClickCount(newCount);
      if (newCount >= 5) {
        setCheatModeEnabled(!cheatModeEnabled);
        setCheatClickCount(0);
        console.log(cheatModeEnabled ? '🔒 Cheat mode disabled' : '🔓 Cheat mode enabled!');
      }
    }
    setLastCheatClick(now);
  };

  // Combined privileged state (either real teacher OR cheat mode)
  const hasUnlimitedAccess = isPrivileged || cheatModeEnabled;
  const [studentAddition, setStudentAddition] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    id: string;
    needsApproval: boolean;
    saved: boolean;
    provider: 'gemini' | 'dalle' | 'none';
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  // Fetch user's image stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/images/generate');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setIsPrivileged(data.isPrivileged || false);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGenerate = async () => {
    // Teachers/admins/cheat mode can always generate
    if (!hasUnlimitedAccess && !stats?.canGenerate) {
      if (stats && stats.imageTokens === 0 && stats.freeImagesRemaining === 0) {
        setShowQuizModal(true);
        return;
      }
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Build headers - include cheat code if dev mode is active
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
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
          saved: false, // Not saved yet - user needs to decide
          provider: data.provider || 'none',
        });
        
        console.log(`🖼️ Image generated using: ${data.provider}`);  // Log which provider was used
        
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

  // Save the generated image (keep it)
  const handleSaveImage = async () => {
    if (!generatedImage) return;
    
    setIsSaving(true);
    try {
      // Mark the image as saved/confirmed
      const response = await fetch(`/api/images/${generatedImage.id}/confirm`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setGeneratedImage(prev => prev ? { ...prev, saved: true } : null);
        // Notify parent to refresh gallery
        if (onImageGenerated) {
          onImageGenerated(generatedImage.url, generatedImage.id);
        }
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Discard the image and generate a new one (doesn't cost extra)
  const handleDiscardImage = async () => {
    if (!generatedImage) return;
    
    setIsDiscarding(true);
    try {
      // Delete the image from the database
      await fetch(`/api/images/${generatedImage.id}`, {
        method: 'DELETE',
      });
      
      // Clear and allow regeneration
      setGeneratedImage(null);
      setStudentAddition('');
    } catch (error) {
      console.error('Error discarding image:', error);
    } finally {
      setIsDiscarding(false);
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span 
              onClick={handleCheatClick} 
              className="cursor-pointer select-none"
              title={cheatClickCount > 0 ? `${5 - cheatClickCount} more...` : undefined}
            >
              🎨
            </span> 
            Generate Image
            {cheatModeEnabled && !isPrivileged && (
              <span className="text-xs bg-red-500/50 px-1.5 py-0.5 rounded ml-1">DEV</span>
            )}
          </h2>
          <p className="text-indigo-100 text-xs">
            Create AI art for <strong>{entityName}</strong>
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="flex flex-wrap gap-3 mt-2 text-xs">
              {hasUnlimitedAccess ? (
                <div className="flex items-center gap-1 bg-amber-500/30 px-2 py-0.5 rounded-full">
                  <span>{cheatModeEnabled && !isPrivileged ? '🔧' : '👑'}</span>
                  <span className="font-semibold">Unlimited</span>
                  <span className="text-amber-200">- {cheatModeEnabled && !isPrivileged ? 'Dev Mode' : 'Teacher Mode'}</span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
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
                <div className="relative rounded-xl overflow-hidden shadow-lg mb-3">
                  <Image
                    src={generatedImage.url}
                    alt={entityName}
                    width={512}
                    height={512}
                    className="w-full h-auto"
                  />
                  {/* Provider badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/80">
                    {generatedImage.provider === 'gemini' ? '🍌 Nano Banana' : '🎨 DALL-E'}
                  </div>
                </div>

                {generatedImage.needsApproval && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 mb-3">
                    <p className="text-yellow-200 text-xs">
                      ⏳ Pending teacher approval
                    </p>
                  </div>
                )}

                {/* Save/Discard options - show before saving */}
                {!generatedImage.saved ? (
                  <div className="space-y-2">
                    <p className="text-white/70 text-xs mb-2">Do you want to keep this image?</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSaveImage}
                        disabled={isSaving || isDiscarding}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        {isSaving ? (
                          <>
                            <span className="animate-spin">⏳</span> Saving...
                          </>
                        ) : (
                          <>✅ Save Image</>
                        )}
                      </button>
                      <button
                        onClick={handleDiscardImage}
                        disabled={isSaving || isDiscarding}
                        className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-700 disabled:bg-red-600/50 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        {isDiscarding ? (
                          <>
                            <span className="animate-spin">⏳</span> Discarding...
                          </>
                        ) : (
                          <>🔄 Try Again</>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Already saved - show success and generate another option
                  <div className="space-y-2">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                      <p className="text-green-200 text-xs">✅ Image saved to gallery!</p>
                    </div>
                    <button
                      onClick={() => {
                        setGeneratedImage(null);
                        setStudentAddition('');
                      }}
                      className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                )}
              </motion.div>
            ) : isGenerating ? (
              // Loading state
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 border-4 border-indigo-200/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">
                    🎨
                  </span>
                </div>
                <p className="text-white text-sm font-medium">
                  Creating your artwork...
                </p>
                <p className="text-white/60 text-xs mt-1">
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
                className="space-y-4"
              >
                {/* Error message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                    <p className="text-red-300 text-xs">{error}</p>
                  </div>
                )}

                {/* No tokens warning - Don't show for privileged users */}
                {stats && !stats.canGenerate && !hasUnlimitedAccess && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">🧮</span>
                      <div>
                        <p className="font-medium text-amber-200 text-sm">
                          Need more tokens!
                        </p>
                        <p className="text-xs text-amber-300/80 mt-1">
                          Complete math quizzes to earn image tokens.
                          3 correct answers = 1 token!
                        </p>
                        <button
                          onClick={() => setShowQuizModal(true)}
                          className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Start Math Quiz →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Style Selection */}
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-2">
                    Choose a Style
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          selectedStyle === style.id
                            ? 'border-indigo-400 bg-indigo-500/30'
                            : 'border-white/20 hover:border-white/40 bg-white/5'
                        }`}
                      >
                        <span className="text-lg block">{style.emoji}</span>
                        <span className="text-[10px] font-medium text-white/80 leading-tight block mt-0.5">{style.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-white/50">
                    {STYLE_PRESETS.find(s => s.id === selectedStyle)?.description}
                  </p>
                </div>

                {/* Custom Addition */}
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    Add Your Touch (optional)
                  </label>
                  <input
                    type="text"
                    value={studentAddition}
                    onChange={(e) => setStudentAddition(e.target.value.slice(0, 100))}
                    placeholder="e.g., standing on a mountain..."
                    className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-indigo-400 focus:outline-none bg-white/10 text-white placeholder-white/40"
                    maxLength={100}
                  />
                  <p className="mt-1 text-[10px] text-white/40">
                    {studentAddition.length}/100 characters
                  </p>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!hasUnlimitedAccess && !stats?.canGenerate}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                    hasUnlimitedAccess || stats?.canGenerate
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {hasUnlimitedAccess
                    ? (cheatModeEnabled && !isPrivileged ? '🔧 Generate (Dev Mode)' : '👑 Generate Image (Unlimited)')
                    : stats?.canGenerate
                      ? (stats.freeImagesRemaining > 0 
                          ? '✨ Generate Free Image' 
                          : '🎨 Generate Image (1 token)')
                      : '🔒 Earn tokens to generate'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Math Quiz Modal */}
      <MathQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onTokensEarned={handleQuizTokensEarned}
        initialTokens={stats?.imageTokens || 0}
        devMode={cheatModeEnabled}
      />
    </>
  );
}
