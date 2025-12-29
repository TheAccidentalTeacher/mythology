'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ProphecyScrollGeneratorProps {
  storyTitle: string;
  storyContent: string;
  mythologyName: string;
  mythologyStyle?: string;
  relatedCharacter?: string;
  onGenerated?: (imageUrl: string) => void;
}

export default function ProphecyScrollGenerator({
  storyTitle,
  storyContent,
  mythologyName,
  mythologyStyle,
  relatedCharacter,
  onGenerated
}: ProphecyScrollGeneratorProps) {
  const [prophecyText, setProphecyText] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; provider: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Cheat code state
  const [cheatModeEnabled, setCheatModeEnabled] = useState(false);
  const [cheatClickCount, setCheatClickCount] = useState(0);
  const [lastCheatClick, setLastCheatClick] = useState(0);

  const handleCheatClick = () => {
    const now = Date.now();
    if (now - lastCheatClick > 3000) {
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

  // Generate prophecy text from story using AI
  const generateProphecyText = async () => {
    setIsGeneratingText(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-prophecy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle,
          storyContent,
          mythologyName,
          mythologyStyle,
          relatedCharacter
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prophecy');
      }

      setProphecyText(data.prophecy);
    } catch (err) {
      console.error('Error generating prophecy:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate prophecy text');
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Generate scroll image
  const generateScrollImage = async () => {
    if (!prophecyText) return;

    setIsGeneratingImage(true);
    setError(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType: 'prophecy_scroll',
          entityId: `prophecy-${storyTitle}`,
          entityName: `Prophecy of ${storyTitle}`,
          entityDescription: `A mystical prophecy scroll containing: "${prophecyText}". ${relatedCharacter ? `Related to ${relatedCharacter}.` : ''} From ${mythologyName}. ${mythologyStyle ? `Style: ${mythologyStyle}` : ''}`,
          mythologyName,
          mythologyStyle,
          stylePreset: 'ancient_artifact',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate scroll image');
      }

      setGeneratedImage({ url: data.imageUrl, provider: data.provider });
      if (onGenerated) {
        onGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating scroll:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate scroll image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const providerBadge = (provider: string) => {
    if (provider === 'gemini') {
      return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">🍌 Nano Banana</span>;
    }
    return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">🎨 DALL-E</span>;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-700/50">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span 
            onClick={(e) => { e.stopPropagation(); handleCheatClick(); }}
            className="cursor-pointer select-none hover:scale-110 transition-transform"
            title={cheatClickCount > 0 ? `${5 - cheatClickCount} more clicks...` : undefined}
          >
            {cheatModeEnabled ? '🔧' : '📜'}
          </span>
          Prophecy Scroll
          {cheatModeEnabled && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded ml-2">
              Dev Mode
            </span>
          )}
        </h3>
        <span className="text-2xl">{isCollapsed ? '▼' : '▲'}</span>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 mt-2 mb-4">
              Create a mystical prophecy scroll based on your story!
            </p>

            {/* Step 1: Generate Prophecy Text */}
            {!prophecyText && (
              <button
                onClick={generateProphecyText}
                disabled={isGeneratingText}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-50"
              >
                {isGeneratingText ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Divining the Prophecy...
                  </span>
                ) : (
                  '🔮 Generate Prophecy Text'
                )}
              </button>
            )}

            {/* Prophecy Text Display */}
            {prophecyText && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-700/30">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">📜 The Prophecy</h4>
                  <p className="text-gray-200 italic font-serif text-lg leading-relaxed">
                    &ldquo;{prophecyText}&rdquo;
                  </p>
                </div>

                {/* Customize Prophecy */}
                <textarea
                  value={prophecyText}
                  onChange={(e) => setProphecyText(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 resize-y min-h-[100px]"
                  placeholder="Edit the prophecy text..."
                />

                {/* Generate Scroll Image */}
                {!generatedImage && (
                  <button
                    onClick={generateScrollImage}
                    disabled={isGeneratingImage}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Inscribing the Scroll...
                      </span>
                    ) : (
                      '✨ Create Scroll Image'
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Generated Scroll Image */}
            {generatedImage && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✅ Scroll Created!</span>
                  {providerBadge(generatedImage.provider)}
                </div>

                <div className="relative rounded-lg overflow-hidden border-4 border-amber-800 shadow-lg">
                  <Image
                    src={generatedImage.url}
                    alt="Prophecy Scroll"
                    width={512}
                    height={512}
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex gap-2">
                  <a
                    href={generatedImage.url}
                    download={`prophecy-${storyTitle}.png`}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white text-center"
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => {
                      setGeneratedImage(null);
                      setProphecyText('');
                    }}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    🔄 New Prophecy
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
