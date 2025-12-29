'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type EntityType = 'character' | 'creature';

interface CharacterStatCardProps {
  entityName: string;
  entityDescription: string;
  entityType: EntityType;
  mythologyName: string;
  imageUrl?: string;
  characterType?: string;  // god, hero, demigod, etc.
  creatureType?: string;   // beast, monster, spirit, etc.
  domain?: string;         // what they rule over
  abilities?: string;      // powers/abilities
  dangerLevel?: string;    // for creatures
}

// Calculate stats based on entity properties
function calculateStats(props: CharacterStatCardProps): {
  power: number;
  defense: number;
  speed: number;
  magic: number;
  wisdom: number;
  charisma: number;
} {
  const { entityType, characterType, creatureType, dangerLevel, abilities } = props;
  
  // Base stats by type
  const baseStats: Record<string, { power: number; defense: number; speed: number; magic: number; wisdom: number; charisma: number }> = {
    // Character types
    god: { power: 90, defense: 80, speed: 75, magic: 95, wisdom: 85, charisma: 80 },
    demigod: { power: 75, defense: 65, speed: 70, magic: 70, wisdom: 60, charisma: 70 },
    hero: { power: 70, defense: 60, speed: 65, magic: 40, wisdom: 55, charisma: 75 },
    mortal: { power: 40, defense: 35, speed: 50, magic: 20, wisdom: 50, charisma: 60 },
    spirit: { power: 50, defense: 30, speed: 80, magic: 85, wisdom: 70, charisma: 50 },
    titan: { power: 95, defense: 90, speed: 40, magic: 75, wisdom: 60, charisma: 40 },
    // Creature types
    dragon: { power: 95, defense: 85, speed: 70, magic: 80, wisdom: 60, charisma: 30 },
    beast: { power: 70, defense: 60, speed: 75, magic: 20, wisdom: 30, charisma: 20 },
    monster: { power: 80, defense: 70, speed: 50, magic: 40, wisdom: 25, charisma: 15 },
    guardian: { power: 60, defense: 90, speed: 40, magic: 50, wisdom: 70, charisma: 40 },
    elemental: { power: 65, defense: 50, speed: 70, magic: 90, wisdom: 50, charisma: 30 },
    hybrid: { power: 70, defense: 60, speed: 65, magic: 55, wisdom: 45, charisma: 35 },
  };

  const typeKey = entityType === 'character' 
    ? (characterType?.toLowerCase() || 'mortal')
    : (creatureType?.toLowerCase() || 'beast');
  
  let stats = baseStats[typeKey] || baseStats.mortal;

  // Add variance
  const addVariance = (base: number) => {
    const variance = Math.floor(Math.random() * 20) - 10;
    return Math.max(10, Math.min(100, base + variance));
  };

  // Boost based on danger level for creatures
  const dangerMultiplier: Record<string, number> = {
    harmless: 0.7,
    low: 0.85,
    moderate: 1,
    high: 1.15,
    extreme: 1.3,
    mythical: 1.5,
  };
  
  const multiplier = entityType === 'creature' && dangerLevel 
    ? (dangerMultiplier[dangerLevel.toLowerCase()] || 1) 
    : 1;

  // Boost magic if abilities mention magical things
  const magicBoost = abilities?.toLowerCase().includes('magic') || 
                     abilities?.toLowerCase().includes('spell') ||
                     abilities?.toLowerCase().includes('elemental') ? 15 : 0;

  return {
    power: Math.min(100, addVariance(Math.floor(stats.power * multiplier))),
    defense: Math.min(100, addVariance(Math.floor(stats.defense * multiplier))),
    speed: Math.min(100, addVariance(Math.floor(stats.speed * multiplier))),
    magic: Math.min(100, addVariance(Math.floor((stats.magic + magicBoost) * multiplier))),
    wisdom: Math.min(100, addVariance(stats.wisdom)),
    charisma: Math.min(100, addVariance(stats.charisma)),
  };
}

// Get tier based on total stats
function getTier(totalStats: number): { tier: string; color: string; emoji: string } {
  if (totalStats >= 500) return { tier: 'S', color: 'text-yellow-400', emoji: '👑' };
  if (totalStats >= 450) return { tier: 'A', color: 'text-purple-400', emoji: '⭐' };
  if (totalStats >= 380) return { tier: 'B', color: 'text-blue-400', emoji: '💎' };
  if (totalStats >= 300) return { tier: 'C', color: 'text-green-400', emoji: '🔷' };
  if (totalStats >= 220) return { tier: 'D', color: 'text-gray-400', emoji: '🔹' };
  return { tier: 'E', color: 'text-gray-500', emoji: '○' };
}

export default function CharacterStatCard({
  entityName,
  entityDescription,
  entityType,
  mythologyName,
  imageUrl,
  characterType,
  creatureType,
  domain,
  abilities,
  dangerLevel,
}: CharacterStatCardProps) {
  const [stats] = useState(() => calculateStats({
    entityName,
    entityDescription,
    entityType,
    mythologyName,
    characterType,
    creatureType,
    dangerLevel,
    abilities,
  }));

  const totalStats = stats.power + stats.defense + stats.speed + stats.magic + stats.wisdom + stats.charisma;
  const { tier, color, emoji } = getTier(totalStats);

  const StatRow = ({ label, value, icon, barColor }: { label: string; value: number; icon: string; barColor: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-white/70 w-16">{label}</span>
      <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>
      <span className="text-sm font-bold text-white w-8 text-right">{value}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-600 shadow-xl max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{entityName}</h3>
            <p className="text-sm text-slate-400">
              {entityType === 'character' ? characterType : creatureType} • {mythologyName}
            </p>
          </div>
          <div className={`text-3xl font-black ${color} flex items-center gap-1`}>
            {emoji}
            <span>{tier}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative h-48 bg-black/30">
          <Image
            src={imageUrl}
            alt={entityName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>
      )}

      {/* Domain/Danger Level Badge */}
      {(domain || dangerLevel) && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {domain && (
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              👑 {domain}
            </span>
          )}
          {dangerLevel && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              dangerLevel.toLowerCase() === 'extreme' || dangerLevel.toLowerCase() === 'mythical'
                ? 'bg-red-500/20 text-red-300'
                : dangerLevel.toLowerCase() === 'high'
                ? 'bg-orange-500/20 text-orange-300'
                : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              ⚠️ {dangerLevel}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="p-4 space-y-2">
        <StatRow label="Power" value={stats.power} icon="⚔️" barColor="bg-red-500" />
        <StatRow label="Defense" value={stats.defense} icon="🛡️" barColor="bg-blue-500" />
        <StatRow label="Speed" value={stats.speed} icon="💨" barColor="bg-green-500" />
        <StatRow label="Magic" value={stats.magic} icon="✨" barColor="bg-purple-500" />
        <StatRow label="Wisdom" value={stats.wisdom} icon="📚" barColor="bg-cyan-500" />
        <StatRow label="Charisma" value={stats.charisma} icon="💫" barColor="bg-pink-500" />
      </div>

      {/* Total Stats */}
      <div className="px-4 pb-4">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Power</span>
            <span className={`text-xl font-bold ${color}`}>{totalStats}</span>
          </div>
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(totalStats / 600) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                tier === 'S' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                tier === 'A' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                tier === 'B' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Abilities Preview */}
      {abilities && (
        <div className="px-4 pb-4">
          <div className="bg-black/20 rounded-lg p-3">
            <h4 className="text-xs text-slate-400 mb-1">⚡ Abilities</h4>
            <p className="text-sm text-slate-300 line-clamp-2">{abilities}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-black/30 px-4 py-2 flex justify-between items-center text-xs text-slate-500">
        <span>📊 Stat Card</span>
        <span>{entityType === 'character' ? '🎭' : '🐉'} {entityType}</span>
      </div>
    </div>
  );
}
