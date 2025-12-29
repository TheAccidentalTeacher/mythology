'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface CollectedCard {
  id: string;
  image_url: string;
  entity_name: string;
  entity_type: string;
  rarity: Rarity;
  card_type: string;
  mythology_name: string;
  collected_at: string;
  stats?: {
    power: number;
    defense: number;
    speed: number;
    magic: number;
  };
}

interface CollectionGalleryProps {
  userId?: string;
  mythologyId?: string;
  showFilters?: boolean;
  maxCards?: number;
}

const RARITY_CONFIG: Record<Rarity, { 
  label: string; 
  color: string; 
  bgGradient: string;
  borderColor: string;
  emoji: string;
}> = {
  common: { 
    label: 'Common', 
    color: 'text-gray-400', 
    bgGradient: 'from-gray-700 to-gray-800',
    borderColor: 'border-gray-500',
    emoji: '⚪'
  },
  uncommon: { 
    label: 'Uncommon', 
    color: 'text-green-400', 
    bgGradient: 'from-green-800 to-green-900',
    borderColor: 'border-green-500',
    emoji: '🟢'
  },
  rare: { 
    label: 'Rare', 
    color: 'text-blue-400', 
    bgGradient: 'from-blue-800 to-blue-900',
    borderColor: 'border-blue-500',
    emoji: '🔵'
  },
  epic: { 
    label: 'Epic', 
    color: 'text-purple-400', 
    bgGradient: 'from-purple-800 to-purple-900',
    borderColor: 'border-purple-500',
    emoji: '🟣'
  },
  legendary: { 
    label: 'Legendary', 
    color: 'text-yellow-400', 
    bgGradient: 'from-yellow-700 to-amber-900',
    borderColor: 'border-yellow-500',
    emoji: '🌟'
  },
};

export default function CollectionGallery({
  userId,
  mythologyId,
  showFilters = true,
  maxCards = 50,
}: CollectionGalleryProps) {
  const [cards, setCards] = useState<CollectedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'character' | 'creature'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rarity' | 'name'>('newest');
  const [selectedCard, setSelectedCard] = useState<CollectedCard | null>(null);

  useEffect(() => {
    fetchCards();
  }, [userId, mythologyId]);

  const fetchCards = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // For now, fetch from generated_images with trading card entity type
      let query = supabase
        .from('generated_images')
        .select('*')
        .eq('entity_type', 'trading_card')
        .order('created_at', { ascending: false })
        .limit(maxCards);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to CollectedCard format
      const collectedCards: CollectedCard[] = (data || []).map(img => ({
        id: img.id,
        image_url: img.image_url,
        entity_name: img.entity_name || 'Unknown',
        entity_type: img.metadata?.originalEntityType || 'character',
        rarity: img.metadata?.rarity || 'common',
        card_type: img.metadata?.cardType || 'attack',
        mythology_name: img.mythology_name || 'Unknown',
        collected_at: img.created_at,
        stats: img.metadata?.stats,
      }));

      setCards(collectedCards);
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => selectedRarity === 'all' || card.rarity === selectedRarity)
    .filter(card => selectedType === 'all' || card.entity_type === selectedType)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime();
      }
      if (sortBy === 'rarity') {
        const rarityOrder: Record<Rarity, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      return a.entity_name.localeCompare(b.entity_name);
    });

  // Count cards by rarity
  const rarityCounts = cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<Rarity, number>);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-8 flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-2">
          <span className="animate-spin">🃏</span>
          Loading collection...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Collection Stats */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          🃏 Card Collection
          <span className="text-sm font-normal text-gray-400">({cards.length} cards)</span>
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
            <div 
              key={rarity}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 ${
                rarityCounts[rarity as Rarity] ? '' : 'opacity-50'
              }`}
            >
              <span>{config.emoji}</span>
              <span className={`font-bold ${config.color}`}>
                {rarityCounts[rarity as Rarity] || 0}
              </span>
              <span className="text-xs text-gray-500">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      {showFilters && cards.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value as Rarity | 'all')}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Rarities</option>
            {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
              <option key={rarity} value={rarity}>
                {config.emoji} {config.label}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'character' | 'creature')}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="character">🎭 Characters</option>
            <option value="creature">🐉 Creatures</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'rarity' | 'name')}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
          >
            <option value="newest">📅 Newest First</option>
            <option value="rarity">✨ By Rarity</option>
            <option value="name">🔤 By Name</option>
          </select>
        </div>
      )}

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🃏</div>
          <p className="text-gray-400">
            {cards.length === 0 
              ? 'No cards collected yet. Generate trading cards from character or creature pages!'
              : 'No cards match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map((card) => {
            const config = RARITY_CONFIG[card.rarity];
            return (
              <motion.div
                key={card.id}
                layoutId={card.id}
                onClick={() => setSelectedCard(card)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 ${config.borderColor} shadow-lg hover:scale-105 transition-transform`}
                whileHover={{ y: -5 }}
              >
                {/* Card Image */}
                <div className="relative aspect-[3/4] bg-black">
                  <Image
                    src={card.image_url}
                    alt={card.entity_name}
                    fill
                    className="object-cover"
                  />
                  {/* Rarity indicator */}
                  <div className={`absolute top-1 right-1 ${config.color} text-lg`}>
                    {config.emoji}
                  </div>
                </div>
                {/* Card Footer */}
                <div className={`bg-gradient-to-r ${config.bgGradient} px-2 py-1.5`}>
                  <p className="text-white text-xs font-medium truncate">{card.entity_name}</p>
                  <p className={`text-xs ${config.color}`}>{config.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              layoutId={selectedCard.id}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl overflow-hidden max-w-sm w-full"
            >
              {(() => {
                const config = RARITY_CONFIG[selectedCard.rarity];
                return (
                  <>
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${config.bgGradient} p-4 border-b-2 ${config.borderColor}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedCard.entity_name}</h3>
                          <p className="text-sm text-white/60">{selectedCard.mythology_name}</p>
                        </div>
                        <span className={`text-3xl`}>{config.emoji}</span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className={`relative aspect-square bg-black border-b-2 ${config.borderColor}`}>
                      <Image
                        src={selectedCard.image_url}
                        alt={selectedCard.entity_name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Stats */}
                    {selectedCard.stats && (
                      <div className={`bg-gradient-to-r ${config.bgGradient} p-4 space-y-2`}>
                        {Object.entries(selectedCard.stats).map(([stat, value]) => (
                          <div key={stat} className="flex items-center gap-2">
                            <span className="text-xs text-white/60 w-12 uppercase">{stat.slice(0, 3)}</span>
                            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  stat === 'power' ? 'bg-red-500' :
                                  stat === 'defense' ? 'bg-blue-500' :
                                  stat === 'speed' ? 'bg-green-500' : 'bg-purple-500'
                                }`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-xs text-white font-bold w-6">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 flex gap-2">
                      <a
                        href={selectedCard.image_url}
                        download={`${selectedCard.entity_name}-card.png`}
                        className="flex-1 py-2 px-4 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white text-center text-sm"
                      >
                        📥 Download
                      </a>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="px-4 py-2 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white text-sm"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
