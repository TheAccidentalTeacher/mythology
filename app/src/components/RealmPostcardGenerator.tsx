'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface RealmPostcardGeneratorProps {
  realmName: string;
  realmDescription: string;
  realmType?: string;
  mythologyName: string;
  mythologyStyle?: string;
  onGenerated?: (imageUrl: string) => void;
}

const POSTCARD_STYLES = [
  { id: 'vintage', label: 'Vintage', emoji: '🏛️', description: 'Classic vintage travel poster style' },
  { id: 'watercolor', label: 'Watercolor', emoji: '🎨', description: 'Soft watercolor painting style' },
  { id: 'retro', label: 'Retro', emoji: '🚀', description: '1950s sci-fi/fantasy travel poster' },
  { id: 'modern', label: 'Modern', emoji: '✨', description: 'Clean modern minimalist style' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🐉', description: 'Epic fantasy illustration style' },
];

const POSTCARD_GREETINGS = [
  'Wish You Were Here!',
  'Greetings from',
  'Adventures in',
  'Visit Beautiful',
  'Welcome to',
  'Journey to',
];

export default function RealmPostcardGenerator({
  realmName,
  realmDescription,
  realmType,
  mythologyName,
  mythologyStyle,
  onGenerated
}: RealmPostcardGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState('vintage');
  const [customGreeting, setCustomGreeting] = useState('Wish You Were Here!');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const generatePostcard = async () => {
    setIsGenerating(true);
    setError(null);

    const styleConfig = POSTCARD_STYLES.find(s => s.id === selectedStyle) || POSTCARD_STYLES[0];

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const postcardPrompt = `Create a ${styleConfig.description} postcard image for the mythological realm "${realmName}".

Realm description: ${realmDescription}
${realmType ? `Realm type: ${realmType}` : ''}
From: ${mythologyName} mythology
${mythologyStyle ? `Cultural style: ${mythologyStyle}` : ''}

The postcard should:
- Be in horizontal/landscape orientation
- Feature the most iconic and beautiful view of this realm
- Have space for the text "${customGreeting}" at the top or bottom
- Look like a vintage travel postcard or poster
- Capture the magical essence of this mythological place
- Be colorful and inviting

Style: ${styleConfig.description}, travel postcard art, illustrated, vibrant colors`;

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType: 'realm_postcard',
          entityId: `postcard-${realmName}`,
          entityName: `${realmName} Postcard`,
          entityDescription: postcardPrompt,
          mythologyName,
          mythologyStyle,
          stylePreset: 'illustrated_storybook',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate postcard');
      }

      setGeneratedImage({ url: data.imageUrl, provider: data.provider });
      if (onGenerated) {
        onGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating postcard:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate postcard');
    } finally {
      setIsGenerating(false);
    }
  };

  const providerBadge = (provider: string) => {
    if (provider === 'gemini') {
      return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">🍌 Nano Banana</span>;
    }
    return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">🎨 DALL-E</span>;
  };

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 rounded-xl p-6 border border-cyan-700/50">
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
            {cheatModeEnabled ? '🔧' : '🏝️'}
          </span>
          Realm Postcard
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
              Create a vintage travel postcard from this mythological realm!
            </p>

            {/* Style Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Postcard Style</label>
              <div className="grid grid-cols-5 gap-2">
                {POSTCARD_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-2 rounded-lg transition-all text-center ${
                      selectedStyle === style.id 
                        ? 'bg-cyan-600 text-white ring-2 ring-cyan-400' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    title={style.description}
                  >
                    <span className="text-xl block">{style.emoji}</span>
                    <span className="text-xs">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Greeting Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Greeting</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {POSTCARD_GREETINGS.map(greeting => (
                  <button
                    key={greeting}
                    onClick={() => setCustomGreeting(greeting === 'Wish You Were Here!' ? greeting : `${greeting} ${realmName}!`)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      customGreeting.startsWith(greeting.split(' ')[0])
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {greeting}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customGreeting}
                onChange={(e) => setCustomGreeting(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100"
                placeholder="Custom greeting..."
                maxLength={50}
              />
            </div>

            {/* Generate Button */}
            {!generatedImage && (
              <button
                onClick={generatePostcard}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating Postcard...
                  </span>
                ) : (
                  '✉️ Generate Postcard'
                )}
              </button>
            )}

            {/* Generated Postcard */}
            {generatedImage && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✅ Postcard Created!</span>
                  {providerBadge(generatedImage.provider)}
                </div>

                <div className="relative rounded-lg overflow-hidden shadow-lg border-8 border-white">
                  <Image
                    src={generatedImage.url}
                    alt={`${realmName} Postcard`}
                    width={512}
                    height={512}
                    className="w-full h-auto"
                  />
                  {/* Overlay greeting text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-bold text-xl drop-shadow-lg text-center">
                      {customGreeting}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={generatedImage.url}
                    download={`postcard-${realmName}.png`}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white text-center"
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    🔄 New Style
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
