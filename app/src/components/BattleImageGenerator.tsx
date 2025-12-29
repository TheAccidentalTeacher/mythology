'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Combatant {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface BattleImageGeneratorProps {
  combatant1: Combatant;
  combatant2: Combatant;
  winner?: Combatant | null;
  mythologyName: string;
  battleType: string;
  narrationStyle: string;
  onImageGenerated?: (imageUrl: string, imageType: 'battle' | 'victory') => void;
}

type ImageType = 'battle' | 'victory';

export default function BattleImageGenerator({
  combatant1,
  combatant2,
  winner,
  mythologyName,
  battleType,
  narrationStyle,
  onImageGenerated
}: BattleImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{
    battle?: { url: string; provider: string };
    victory?: { url: string; provider: string };
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ImageType>('battle');

  // Cheat code state (click 🎨 5 times quickly)
  const [cheatModeEnabled, setCheatModeEnabled] = useState(false);
  const [cheatClickCount, setCheatClickCount] = useState(0);
  const [lastCheatClick, setLastCheatClick] = useState(0);

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

  const generateImage = async (type: ImageType) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Build the prompt based on type
      let prompt: string;
      let entityType: string;

      if (type === 'battle') {
        prompt = `Epic ${battleType} battle scene between ${combatant1.name} (${combatant1.type}) and ${combatant2.name} (${combatant2.type}) from ${mythologyName}. 
        
${combatant1.description ? `${combatant1.name}: ${combatant1.description}` : ''}
${combatant2.description ? `${combatant2.name}: ${combatant2.description}` : ''}

Dynamic action scene with both combatants clashing, magical energy, dramatic lighting. ${narrationStyle} style narrative feeling.`;
        entityType = 'battle_scene';
      } else {
        // Victory image
        if (!winner) {
          setError('No winner to generate victory image for');
          setIsGenerating(false);
          return;
        }
        prompt = `Triumphant victory scene for ${winner.name}, the ${winner.type} from ${mythologyName}.

${winner.description || ''}

Show ${winner.name} in a heroic victory pose, bathed in golden light, ${narrationStyle} style. Celebration and triumph, epic and awe-inspiring.`;
        entityType = 'victory_card';
      }

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
          entityId: type === 'battle' ? `battle-${combatant1.id}-${combatant2.id}` : winner?.id,
          entityName: type === 'battle' ? `${combatant1.name} vs ${combatant2.name}` : winner?.name,
          entityDescription: prompt,
          mythologyName,
          stylePreset: 'epic_fantasy',
          studentAddition: '',
          isBattleImage: true, // Flag to indicate this is a battle image (no token cost for teacher)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.success && data.imageUrl) {
        setGeneratedImages(prev => ({
          ...prev,
          [type]: { url: data.imageUrl, provider: data.provider }
        }));
        
        if (onImageGenerated) {
          onImageGenerated(data.imageUrl, type);
        }
      } else {
        throw new Error(data.error || 'No image returned');
      }
    } catch (err) {
      console.error('Battle image generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
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
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span 
          onClick={handleCheatClick} 
          className="cursor-pointer select-none hover:scale-110 transition-transform"
          title={cheatClickCount > 0 ? `${5 - cheatClickCount} more clicks...` : undefined}
        >
          {cheatModeEnabled ? '🔧' : '🎨'}
        </span>
        Generate Battle Art
        {cheatModeEnabled && (
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded ml-2">
            Dev Mode
          </span>
        )}
      </h3>

      {/* Tab Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('battle')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'battle'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          ⚔️ Battle Scene
        </button>
        <button
          onClick={() => setActiveTab('victory')}
          disabled={!winner}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'victory'
              ? 'bg-yellow-600 text-white'
              : winner
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          🏆 Victory Card
        </button>
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {activeTab === 'battle' ? (
            <div className="text-sm text-gray-400 mb-4">
              <p>Generate an epic scene showing <strong className="text-white">{combatant1.name}</strong> and <strong className="text-white">{combatant2.name}</strong> in combat!</p>
            </div>
          ) : (
            <div className="text-sm text-gray-400 mb-4">
              {winner ? (
                <p>Celebrate <strong className="text-yellow-400">{winner.name}</strong>&apos;s glorious victory!</p>
              ) : (
                <p className="text-gray-500">Complete the battle first to generate a victory card.</p>
              )}
            </div>
          )}

          {/* Generated Image Display */}
          {generatedImages[activeTab] && (
            <div className="relative">
              <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-gray-600">
                <Image
                  src={generatedImages[activeTab]!.url}
                  alt={activeTab === 'battle' ? 'Battle Scene' : 'Victory Card'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                {providerBadge(generatedImages[activeTab]!.provider)}
                <a
                  href={generatedImages[activeTab]!.url}
                  download={`${activeTab}-${combatant1.name}-vs-${combatant2.name}.png`}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={() => generateImage(activeTab)}
            disabled={isGenerating || (activeTab === 'victory' && !winner)}
            className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all ${
              isGenerating
                ? 'bg-gray-600 cursor-wait'
                : activeTab === 'battle'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg hover:shadow-red-500/25'
                  : winner
                    ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg hover:shadow-yellow-500/25'
                    : 'bg-gray-700 cursor-not-allowed text-gray-500'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🎨</span>
                Generating...
              </span>
            ) : generatedImages[activeTab] ? (
              <span>🔄 Regenerate {activeTab === 'battle' ? 'Battle Scene' : 'Victory Card'}</span>
            ) : (
              <span>
                {activeTab === 'battle' ? '⚔️ Generate Battle Scene' : '🏆 Generate Victory Card'}
              </span>
            )}
          </button>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center">
            {activeTab === 'battle' 
              ? 'Creates an epic action scene of the battle'
              : 'Creates a triumphant victory illustration'
            }
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
