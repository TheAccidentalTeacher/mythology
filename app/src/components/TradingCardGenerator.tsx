'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type EntityType = 'character' | 'creature' | 'story';

interface TradingCardGeneratorProps {
  entityName: string;
  entityDescription: string;
  entityType: EntityType;
  mythologyName: string;
  stats?: {
    power?: number;
    defense?: number;
    speed?: number;
    magic?: number;
  };
  onCardGenerated?: (imageUrl: string, rarity: Rarity) => void;
}

const RARITY_CONFIG: Record<Rarity, { 
  label: string; 
  color: string; 
  bgGradient: string;
  borderColor: string;
  chance: number;
  emoji: string;
}> = {
  common: { 
    label: 'Common', 
    color: 'text-gray-400', 
    bgGradient: 'from-gray-700 to-gray-800',
    borderColor: 'border-gray-500',
    chance: 40,
    emoji: '⚪'
  },
  uncommon: { 
    label: 'Uncommon', 
    color: 'text-green-400', 
    bgGradient: 'from-green-800 to-green-900',
    borderColor: 'border-green-500',
    chance: 30,
    emoji: '🟢'
  },
  rare: { 
    label: 'Rare', 
    color: 'text-blue-400', 
    bgGradient: 'from-blue-800 to-blue-900',
    borderColor: 'border-blue-500',
    chance: 18,
    emoji: '🔵'
  },
  epic: { 
    label: 'Epic', 
    color: 'text-purple-400', 
    bgGradient: 'from-purple-800 to-purple-900',
    borderColor: 'border-purple-500',
    chance: 10,
    emoji: '🟣'
  },
  legendary: { 
    label: 'Legendary', 
    color: 'text-yellow-400', 
    bgGradient: 'from-yellow-700 to-amber-900',
    borderColor: 'border-yellow-500',
    chance: 2,
    emoji: '🌟'
  },
};

const CARD_TYPES = [
  { id: 'attack', label: 'Attack', emoji: '⚔️' },
  { id: 'defense', label: 'Defense', emoji: '🛡️' },
  { id: 'magic', label: 'Magic', emoji: '✨' },
  { id: 'speed', label: 'Speed', emoji: '💨' },
];

export default function TradingCardGenerator({
  entityName,
  entityDescription,
  entityType,
  mythologyName,
  stats,
  onCardGenerated
}: TradingCardGeneratorProps) {
  const [selectedCardType, setSelectedCardType] = useState('attack');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<{
    imageUrl: string;
    rarity: Rarity;
    provider: string;
    cardType: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  // Cheat code state (bypasses token requirement only)
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

  // Random rarity based on weighted chances
  // MUST check in order from common → legendary (lowest to highest)
  const rollRarity = (): Rarity => {
    const roll = Math.random() * 100;
    console.log(`🎲 Rolling for rarity: ${roll.toFixed(2)}`);
    
    // Explicit order to ensure proper distribution
    const rarityOrder: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    let cumulative = 0;
    
    for (const rarity of rarityOrder) {
      cumulative += RARITY_CONFIG[rarity].chance;
      console.log(`  Checking ${rarity}: cumulative=${cumulative}, roll=${roll.toFixed(2)}, passes=${roll < cumulative}`);
      if (roll < cumulative) {
        console.log(`🎯 Result: ${rarity}!`);
        return rarity;
      }
    }
    return 'common';
  };

  // Generate random stats if not provided
  const generateStats = () => {
    return {
      power: stats?.power || Math.floor(Math.random() * 80) + 20,
      defense: stats?.defense || Math.floor(Math.random() * 80) + 20,
      speed: stats?.speed || Math.floor(Math.random() * 80) + 20,
      magic: stats?.magic || Math.floor(Math.random() * 80) + 20,
    };
  };

  const [cardStats, setCardStats] = useState(generateStats());

  const generateCard = async () => {
    setIsGenerating(true);
    setIsRevealing(false);
    setError(null);
    setIsFlipped(false);

    // Always roll randomly! Cheat mode only bypasses token requirement
    const rarity = rollRarity();
    const newStats = generateStats();
    setCardStats(newStats);

    // Boost stats based on rarity
    const rarityMultiplier: Record<Rarity, number> = {
      common: 1,
      uncommon: 1.1,
      rare: 1.25,
      epic: 1.5,
      legendary: 2,
    };
    
    const boostedStats = {
      power: Math.min(100, Math.floor(newStats.power * rarityMultiplier[rarity])),
      defense: Math.min(100, Math.floor(newStats.defense * rarityMultiplier[rarity])),
      speed: Math.min(100, Math.floor(newStats.speed * rarityMultiplier[rarity])),
      magic: Math.min(100, Math.floor(newStats.magic * rarityMultiplier[rarity])),
    };
    setCardStats(boostedStats);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const cardPrompt = `Create trading card art for ${entityName}, a ${entityType} from ${mythologyName}.

${entityDescription}

This is a ${rarity.toUpperCase()} rarity ${selectedCardType} card.

Card art requirements:
- Vertical portrait format, centered composition
- ${entityType === 'character' ? 'Character shown from waist up or full body' : 'Creature in dynamic pose'}
- ${rarity === 'legendary' ? 'Golden glow, ethereal energy, majestic and powerful' : 
   rarity === 'epic' ? 'Dramatic lighting, powerful aura effects' :
   rarity === 'rare' ? 'Magical sparkles, vibrant colors' :
   rarity === 'uncommon' ? 'Soft glow effects, enhanced lighting' :
   'Clean illustration, simple lighting'}
- Style: Digital trading card game art like Magic: The Gathering or Pokemon
- Focus on the ${selectedCardType} aspect of this ${entityType}

Make it look like a collectible trading card illustration.`;

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType: 'trading_card',
          entityId: `card-${entityName}-${rarity}-${Date.now()}`,
          entityName: `${entityName} Trading Card`,
          entityDescription: cardPrompt,
          mythologyName,
          stylePreset: 'trading_card',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate card');
      }

      setGeneratedCard({
        imageUrl: data.imageUrl,
        rarity,
        provider: data.provider,
        cardType: selectedCardType,
      });

      // Trigger reveal animation
      setIsRevealing(true);
      
      if (onCardGenerated) {
        onCardGenerated(data.imageUrl, rarity);
      }
    } catch (err) {
      console.error('Error generating card:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate card');
    } finally {
      setIsGenerating(false);
    }
  };

  const rarityConfig = generatedCard ? RARITY_CONFIG[generatedCard.rarity] : null;

  const providerBadge = (provider: string) => {
    if (provider === 'gemini') {
      return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">🍌 Nano Banana</span>;
    }
    return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">🎨 DALL-E</span>;
  };

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/60 w-12">{label}</span>
      <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <span className="text-xs text-white font-bold w-8 text-right">{value}</span>
    </div>
  );

  return (
    <div className="bg-linear-to-br from-indigo-900/30 to-violet-900/30 rounded-xl p-6 border border-indigo-700/50">
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
            {cheatModeEnabled ? '🔧' : '🃏'}
          </span>
          Trading Card Generator
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
              Open a card pack and see what rarity you get! 🎲
            </p>

            {/* Drop Rates Display */}
            <div className="mb-4 p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-sm font-medium mb-3 text-white/80">📊 Drop Rates</div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
                  <div key={rarity} className="space-y-1">
                    <div className={`text-lg`}>{config.emoji}</div>
                    <div className={`font-medium ${config.color}`}>{config.label}</div>
                    <div className="text-white/50">{config.chance}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cheat Mode Indicator (DEV ONLY) */}
            {cheatModeEnabled && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-sm font-medium text-amber-400">
                  🔧 Dev Mode: Token requirement bypassed, random rolls still apply
                </div>
              </div>
            )}

            {/* Card Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Card Type</label>
              <div className="grid grid-cols-4 gap-2">
                {CARD_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCardType(type.id)}
                    className={`p-2 rounded-lg transition-all text-center ${
                      selectedCardType === type.id 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-xl block">{type.emoji}</span>
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {!generatedCard && (
              <button
                onClick={generateCard}
                disabled={isGenerating}
                className="w-full py-4 px-4 rounded-lg font-bold text-lg transition-all bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      🎴
                    </motion.span>
                    Opening Card Pack...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🎁</span>
                    Open Card Pack!
                    <span className="text-sm opacity-75">(Test Your Luck!)</span>
                  </span>
                )}
              </button>
            )}

            {/* Generated Card Display with Reveal Animation */}
            {generatedCard && rarityConfig && (
              <div className="mt-4 space-y-4">
                {/* Rarity Reveal */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={isRevealing ? { 
                      scale: [1, 1.3, 1],
                      rotate: [0, -5, 5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className={`text-4xl font-bold ${rarityConfig.color} mb-2`}
                  >
                    {rarityConfig.emoji} {rarityConfig.label.toUpperCase()}! {rarityConfig.emoji}
                  </motion.div>
                  <div className="flex items-center justify-center gap-2">
                    {providerBadge(generatedCard.provider)}
                    {generatedCard.rarity === 'legendary' && (
                      <span className="text-yellow-400 text-sm animate-pulse">✨ JACKPOT! ✨</span>
                    )}
                    {generatedCard.rarity === 'epic' && (
                      <span className="text-purple-400 text-sm">🔥 Nice pull!</span>
                    )}
                  </div>
                </motion.div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {isFlipped ? '👁️ Show Front' : '🔄 Flip Card'}
                  </button>
                </div>

                {/* Card Container */}
                <div className="flex justify-center perspective-1000">
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-64"
                  >
                    {/* Front of Card */}
                    <div 
                      className={`rounded-xl overflow-hidden border-4 ${rarityConfig.borderColor} shadow-2xl`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {/* Card Header */}
                      <div className={`bg-linear-to-r ${rarityConfig.bgGradient} p-2`}>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-sm truncate">{entityName}</span>
                          <span className="text-xs px-2 py-0.5 bg-black/30 rounded">
                            {CARD_TYPES.find(t => t.id === generatedCard.cardType)?.emoji}
                          </span>
                        </div>
                      </div>

                      {/* Card Image */}
                      <div className="relative aspect-3/4 bg-black">
                        <Image
                          src={generatedCard.imageUrl}
                          alt={`${entityName} Trading Card`}
                          fill
                          className="object-cover"
                        />
                        {/* Rarity Glow Effect */}
                        {(generatedCard.rarity === 'legendary' || generatedCard.rarity === 'epic') && (
                          <div className={`absolute inset-0 ${
                            generatedCard.rarity === 'legendary' 
                              ? 'bg-linear-to-t from-yellow-500/20 to-transparent' 
                              : 'bg-linear-to-t from-purple-500/20 to-transparent'
                          }`} />
                        )}
                      </div>

                      {/* Card Stats */}
                      <div className={`bg-linear-to-r ${rarityConfig.bgGradient} p-3 space-y-1`}>
                        <StatBar label="PWR" value={cardStats.power} color="bg-red-500" />
                        <StatBar label="DEF" value={cardStats.defense} color="bg-blue-500" />
                        <StatBar label="SPD" value={cardStats.speed} color="bg-green-500" />
                        <StatBar label="MAG" value={cardStats.magic} color="bg-purple-500" />
                      </div>

                      {/* Card Footer */}
                      <div className={`bg-linear-to-r ${rarityConfig.bgGradient} px-2 py-1 border-t border-white/10`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/60">{mythologyName}</span>
                          <span className={rarityConfig.color}>{rarityConfig.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div 
                      className={`absolute inset-0 rounded-xl overflow-hidden border-4 ${rarityConfig.borderColor} shadow-2xl bg-linear-to-br ${rarityConfig.bgGradient}`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="text-6xl mb-4">🏛️</div>
                        <div className="text-white font-bold text-lg text-center">{mythologyName}</div>
                        <div className="text-white/60 text-sm text-center mt-2">Mythology Collection</div>
                        <div className="mt-4 text-4xl">{rarityConfig.emoji}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={generatedCard.imageUrl}
                    download={`${entityName}-${generatedCard.rarity}-card.png`}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white text-center"
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => {
                      setGeneratedCard(null);
                      setIsRevealing(false);
                    }}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                  >
                    🎁 Open Another Pack!
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
