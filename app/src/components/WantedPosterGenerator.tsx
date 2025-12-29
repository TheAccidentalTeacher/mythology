'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WantedPosterGeneratorProps {
  entityName: string;
  entityDescription: string;
  entityType: 'character' | 'creature';
  crimes?: string[];
  reward?: string;
  mythologyName: string;
  mythologyStyle?: string;
  onGenerated?: (imageUrl: string) => void;
}

const POSTER_THEMES = [
  { id: 'western', label: 'Wild West', emoji: '🤠', description: 'Classic Old West wanted poster style' },
  { id: 'pirate', label: 'Pirate', emoji: '🏴‍☠️', description: 'Seafaring bounty notice style' },
  { id: 'fantasy', label: 'Fantasy', emoji: '⚔️', description: 'Medieval fantasy bounty scroll' },
  { id: 'ancient', label: 'Ancient', emoji: '🏛️', description: 'Ancient civilization decree style' },
  { id: 'mystical', label: 'Mystical', emoji: '✨', description: 'Magical arcane warning poster' },
];

const DEFAULT_CRIMES = [
  'Disturbing the cosmic balance',
  'Terrorizing mortals',
  'Stealing sacred artifacts',
  'Defying the gods',
  'Unleashing chaos',
  'Breaking divine laws',
  'Cursing innocent villages',
  'Hoarding treasure',
];

const DEFAULT_REWARDS = [
  '1000 gold coins',
  'A divine blessing',
  'Eternal glory',
  'A seat among the heroes',
  'Favor of the gods',
  'A magical artifact',
];

export default function WantedPosterGenerator({
  entityName,
  entityDescription,
  entityType,
  crimes = [],
  reward,
  mythologyName,
  mythologyStyle,
  onGenerated
}: WantedPosterGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState('fantasy');
  const [customCrimes, setCustomCrimes] = useState<string[]>(crimes.length > 0 ? crimes : [DEFAULT_CRIMES[0]]);
  const [customReward, setCustomReward] = useState(reward || DEFAULT_REWARDS[0]);
  const [dangerLevel, setDangerLevel] = useState<'Dangerous' | 'Very Dangerous' | 'Extremely Dangerous' | 'Mythically Dangerous'>('Very Dangerous');
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

  const addCrime = () => {
    if (customCrimes.length < 4) {
      const unusedCrimes = DEFAULT_CRIMES.filter(c => !customCrimes.includes(c));
      if (unusedCrimes.length > 0) {
        setCustomCrimes([...customCrimes, unusedCrimes[0]]);
      }
    }
  };

  const removeCrime = (index: number) => {
    if (customCrimes.length > 1) {
      setCustomCrimes(customCrimes.filter((_, i) => i !== index));
    }
  };

  const updateCrime = (index: number, value: string) => {
    const updated = [...customCrimes];
    updated[index] = value;
    setCustomCrimes(updated);
  };

  const generatePoster = async () => {
    setIsGenerating(true);
    setError(null);

    const themeConfig = POSTER_THEMES.find(t => t.id === selectedTheme) || POSTER_THEMES[0];

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const posterPrompt = `Create a dramatic portrait illustration of the mythological ${entityType} "${entityName}" for a wanted poster.

Character description: ${entityDescription}
From: ${mythologyName} mythology
${mythologyStyle ? `Cultural style: ${mythologyStyle}` : ''}

Portrait requirements:
- Head and shoulders portrait, facing forward or slightly angled
- Menacing, intimidating, or powerful expression
- Dramatic lighting with shadows
- Theme style: ${themeConfig.description}
- Background should be simple/dark to focus on the subject
- Style: vintage illustration, hand-drawn look, dramatic shadows
- NO TEXT in the image - just the portrait

Make them look like a dangerous ${entityType} worthy of a bounty!`;

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType: 'wanted_poster',
          entityId: `wanted-${entityName}`,
          entityName: `WANTED: ${entityName}`,
          entityDescription: posterPrompt,
          mythologyName,
          mythologyStyle,
          stylePreset: 'vintage_poster',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate wanted poster');
      }

      setGeneratedImage({ url: data.imageUrl, provider: data.provider });
      if (onGenerated) {
        onGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating poster:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate poster');
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
    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-700/50">
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
            {cheatModeEnabled ? '🔧' : '🎯'}
          </span>
          Wanted Poster
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
              Create a dramatic wanted poster for this {entityType}!
            </p>

            {/* Theme Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Poster Theme</label>
              <div className="grid grid-cols-5 gap-2">
                {POSTER_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-2 rounded-lg transition-all text-center ${
                      selectedTheme === theme.id 
                        ? 'bg-red-600 text-white ring-2 ring-red-400' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    title={theme.description}
                  >
                    <span className="text-xl block">{theme.emoji}</span>
                    <span className="text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Danger Level</label>
              <select
                value={dangerLevel}
                onChange={(e) => setDangerLevel(e.target.value as typeof dangerLevel)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100"
              >
                <option value="Dangerous">⚠️ Dangerous</option>
                <option value="Very Dangerous">⚠️⚠️ Very Dangerous</option>
                <option value="Extremely Dangerous">🔥 Extremely Dangerous</option>
                <option value="Mythically Dangerous">💀 Mythically Dangerous</option>
              </select>
            </div>

            {/* Crimes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Crimes ({customCrimes.length}/4)
              </label>
              <div className="space-y-2">
                {customCrimes.map((crime, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={crime}
                      onChange={(e) => updateCrime(idx, e.target.value)}
                      className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100"
                      placeholder="Enter a crime..."
                    />
                    {customCrimes.length > 1 && (
                      <button
                        onClick={() => removeCrime(idx)}
                        className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {customCrimes.length < 4 && (
                  <button
                    onClick={addCrime}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    + Add another crime
                  </button>
                )}
              </div>
            </div>

            {/* Reward */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reward</label>
              <input
                type="text"
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100"
                placeholder="Enter the reward..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {DEFAULT_REWARDS.map(r => (
                  <button
                    key={r}
                    onClick={() => setCustomReward(r)}
                    className={`px-2 py-1 text-xs rounded-full transition-all ${
                      customReward === r 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {!generatedImage && (
              <button
                onClick={generatePoster}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating Wanted Poster...
                  </span>
                ) : (
                  '🎯 Generate Wanted Poster'
                )}
              </button>
            )}

            {/* Generated Poster */}
            {generatedImage && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✅ Wanted Poster Created!</span>
                  {providerBadge(generatedImage.provider)}
                </div>

                {/* Composite Wanted Poster with Text Overlay */}
                <div 
                  id="wanted-poster-composite"
                  className="relative rounded-lg overflow-hidden shadow-2xl mx-auto"
                  style={{ 
                    maxWidth: '400px',
                    background: 'linear-gradient(135deg, #d4a574 0%, #c4956a 25%, #b8865a 50%, #a8764a 75%, #8b5e3c 100%)',
                    padding: '12px',
                    border: '4px solid #5d4037',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 30px rgba(139,69,19,0.3)'
                  }}
                >
                  {/* Aged paper texture overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }} />
                  
                  {/* WANTED Header */}
                  <div className="relative text-center mb-2">
                    <h2 
                      className="text-3xl font-black tracking-widest"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        color: '#2d1810',
                        textShadow: '2px 2px 0 #8b5e3c, -1px -1px 0 #d4a574',
                        letterSpacing: '0.2em'
                      }}
                    >
                      WANTED
                    </h2>
                    <div className="text-xs text-amber-900 font-semibold tracking-wide">DEAD OR ALIVE</div>
                  </div>

                  {/* Portrait Frame */}
                  <div 
                    className="relative mx-auto mb-2"
                    style={{
                      border: '3px solid #5d4037',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
                      background: '#1a1a1a'
                    }}
                  >
                    <Image
                      src={generatedImage.url}
                      alt={`WANTED: ${entityName}`}
                      width={512}
                      height={512}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Name */}
                  <div className="text-center mb-2">
                    <h3 
                      className="text-xl font-bold uppercase"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        color: '#2d1810',
                        textShadow: '1px 1px 0 #d4a574'
                      }}
                    >
                      {entityName}
                    </h3>
                    <div 
                      className="text-sm font-semibold"
                      style={{ color: '#8b0000' }}
                    >
                      ⚠️ {dangerLevel} ⚠️
                    </div>
                  </div>

                  {/* Crimes Section */}
                  <div 
                    className="mb-2 p-2 rounded"
                    style={{ 
                      background: 'rgba(93, 64, 55, 0.2)',
                      border: '1px solid #8b5e3c'
                    }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#5d4037' }}>
                      CRIMES:
                    </div>
                    <ul className="text-sm space-y-0.5" style={{ color: '#2d1810', fontFamily: 'Georgia, serif' }}>
                      {customCrimes.map((crime, idx) => (
                        <li key={idx}>• {crime}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Reward Section */}
                  <div 
                    className="text-center p-2 rounded"
                    style={{ 
                      background: 'rgba(139, 69, 19, 0.3)',
                      border: '2px solid #5d4037'
                    }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#5d4037' }}>
                      REWARD
                    </div>
                    <div 
                      className="text-lg font-bold"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        color: '#8b4513',
                        textShadow: '1px 1px 0 #d4a574'
                      }}
                    >
                      💰 {customReward} 💰
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-2 text-xs" style={{ color: '#5d4037', fontFamily: 'Georgia, serif' }}>
                    By order of {mythologyName}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={generatedImage.url}
                    download={`wanted-${entityName}.png`}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white text-center"
                  >
                    📥 Download Image
                  </a>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    🔄 New Poster
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
