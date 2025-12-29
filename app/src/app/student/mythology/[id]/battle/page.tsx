'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import BattleImageGenerator from '@/components/BattleImageGenerator';

interface Character {
  id: string;
  name: string;
  character_type: string;
  domain: string;
  powers_abilities: string | null;
  // Combat stats (calculated if not in DB)
  combat_hp: number;
  combat_attack: number;
  combat_defense: number;
  combat_speed: number;
  combat_special_ability: string;
  battle_wins: number;
  battle_losses: number;
}

interface Creature {
  id: string;
  name: string;
  creature_type: string;
  danger_level: string;
  abilities: string | null;
  // Combat stats (calculated if not in DB)
  combat_hp: number;
  combat_attack: number;
  combat_defense: number;
  combat_speed: number;
  combat_special_ability: string;
  battle_wins: number;
  battle_losses: number;
}

// Calculate combat stats based on character type
function calculateCharacterStats(character: { character_type: string; powers_abilities?: string | null }) {
  const baseStats: Record<string, { hp: number; attack: number; defense: number; speed: number }> = {
    god: { hp: 200, attack: 25, defense: 20, speed: 15 },
    demigod: { hp: 150, attack: 18, defense: 15, speed: 14 },
    hero: { hp: 120, attack: 15, defense: 12, speed: 12 },
    spirit: { hp: 100, attack: 12, defense: 8, speed: 18 },
    mortal: { hp: 80, attack: 8, defense: 8, speed: 10 },
  };
  const stats = baseStats[character.character_type?.toLowerCase()] || baseStats.mortal;
  const specialAbility = character.powers_abilities?.split(',')[0]?.trim() || `${character.character_type} Strike`;
  return { ...stats, specialAbility };
}

// Calculate combat stats based on creature danger level
function calculateCreatureStats(creature: { danger_level: string; abilities?: string | null }) {
  const baseStats: Record<string, { hp: number; attack: number; defense: number; speed: number }> = {
    harmless: { hp: 50, attack: 5, defense: 5, speed: 8 },
    minor_threat: { hp: 80, attack: 10, defense: 8, speed: 10 },
    dangerous: { hp: 120, attack: 15, defense: 12, speed: 12 },
    deadly: { hp: 160, attack: 20, defense: 16, speed: 14 },
    catastrophic: { hp: 250, attack: 30, defense: 25, speed: 12 },
  };
  const stats = baseStats[creature.danger_level?.toLowerCase()] || baseStats.dangerous;
  const specialAbility = creature.abilities?.split(',')[0]?.trim() || `${creature.danger_level} Attack`;
  return { ...stats, specialAbility };
}

interface BattleResult {
  id?: string;
  combatant1: {
    id: string;
    name: string;
    type: string;
    finalHp: number;
    stats: { hp: number; maxHp: number; attack: number; defense: number; speed: number };
  };
  combatant2: {
    id: string;
    name: string;
    type: string;
    finalHp: number;
    stats: { hp: number; maxHp: number; attack: number; defense: number; speed: number };
  };
  winner: {
    id: string | null;
    name: string | null;
    type: string;
  };
  totalRounds: number;
  combatLog: Array<{
    round: number;
    attackerName: string;
    defenderName: string;
    actionType: string;
    damage: number;
    description: string;
  }>;
  narration: string;
  battleType: string;
  narrationStyle: string;
}

interface SavedBattle {
  id: string;
  title: string;
  combatant_1_name: string;
  combatant_2_name: string;
  winner_name: string | null;
  battle_type: string;
  narration_style: string;
  narration: string;
  created_at: string;
  is_favorite: boolean;
}

type BattleType = 'duel' | 'honor_combat' | 'ambush' | 'divine_contest' | 'tournament';
type NarrationStyle = 'epic' | 'comedic' | 'tragic' | 'dramatic' | 'poetic';

const BATTLE_TYPES: { value: BattleType; label: string; emoji: string; description: string }[] = [
  { value: 'duel', label: 'Duel', emoji: '⚔️', description: 'An honorable one-on-one combat' },
  { value: 'honor_combat', label: 'Honor Combat', emoji: '🛡️', description: 'Formal combat for reputation' },
  { value: 'ambush', label: 'Ambush', emoji: '🗡️', description: 'Surprise attack (combatant 1 strikes first)' },
  { value: 'divine_contest', label: 'Divine Contest', emoji: '⚡', description: 'Gods get +25% stats' },
  { value: 'tournament', label: 'Tournament', emoji: '🏆', description: 'Spectated arena match' },
];

const NARRATION_STYLES: { value: NarrationStyle; label: string; emoji: string }[] = [
  { value: 'epic', label: 'Epic', emoji: '📜' },
  { value: 'comedic', label: 'Comedic', emoji: '😄' },
  { value: 'tragic', label: 'Tragic', emoji: '😢' },
  { value: 'dramatic', label: 'Dramatic', emoji: '🎭' },
  { value: 'poetic', label: 'Poetic', emoji: '🎵' },
];

export default function BattleArenaPage() {
  const params = useParams();
  const mythologyId = params.id as string;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading] = useState(true);
  const [battling, setBattling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Selection state
  const [combatant1Type, setCombatant1Type] = useState<'character' | 'creature'>('character');
  const [combatant1Id, setCombatant1Id] = useState<string>('');
  const [combatant2Type, setCombatant2Type] = useState<'character' | 'creature'>('character');
  const [combatant2Id, setCombatant2Id] = useState<string>('');
  
  // Battle options
  const [battleType, setBattleType] = useState<BattleType>('duel');
  const [narrationStyle, setNarrationStyle] = useState<NarrationStyle>('epic');
  const [arenaDescription, setArenaDescription] = useState('');
  const [useAiNarration, setUseAiNarration] = useState(true);

  // Result state
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [savedBattles, setSavedBattles] = useState<SavedBattle[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewingStory, setViewingStory] = useState<SavedBattle | null>(null);
  const [mythologyName, setMythologyName] = useState<string>('');

  // Animated battle playback state
  const [isPlayingBattle, setIsPlayingBattle] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [combatant1CurrentHp, setCombatant1CurrentHp] = useState(0);
  const [combatant2CurrentHp, setCombatant2CurrentHp] = useState(0);
  const [showNarration, setShowNarration] = useState(false);
  const [lastAction, setLastAction] = useState<BattleResult['combatLog'][0] | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // Fetch mythology name
      const { data: mythologyData } = await supabase
        .from('mythologies')
        .select('name')
        .eq('id', mythologyId)
        .single();
      
      if (mythologyData) setMythologyName(mythologyData.name);

      // Fetch characters (only columns that exist in DB)
      const { data: charData } = await supabase
        .from('characters')
        .select('id, name, character_type, domain, powers_abilities')
        .eq('mythology_id', mythologyId)
        .order('name');

      // Fetch creatures (only columns that exist in DB)
      const { data: creatureData } = await supabase
        .from('creatures')
        .select('id, name, creature_type, danger_level, abilities')
        .eq('mythology_id', mythologyId)
        .order('name');

      // Fetch saved battle stories
      const { data: battleData } = await supabase
        .from('battle_stories')
        .select('*')
        .eq('mythology_id', mythologyId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (battleData) {
        setSavedBattles(battleData);
      }

      // Calculate combat stats for characters
      const charactersWithStats: Character[] = (charData || []).map(char => {
        const stats = calculateCharacterStats(char);
        return {
          ...char,
          combat_hp: stats.hp,
          combat_attack: stats.attack,
          combat_defense: stats.defense,
          combat_speed: stats.speed,
          combat_special_ability: stats.specialAbility,
          battle_wins: 0,
          battle_losses: 0,
        };
      });

      // Calculate combat stats for creatures
      const creaturesWithStats: Creature[] = (creatureData || []).map(creature => {
        const stats = calculateCreatureStats(creature);
        return {
          ...creature,
          combat_hp: stats.hp,
          combat_attack: stats.attack,
          combat_defense: stats.defense,
          combat_speed: stats.speed,
          combat_special_ability: stats.specialAbility,
          battle_wins: 0,
          battle_losses: 0,
        };
      });

      setCharacters(charactersWithStats);
      setCreatures(creaturesWithStats);
      setLoading(false);
    }

    loadData();
  }, [mythologyId]);

  // Save battle story to database
  const handleSaveBattle = async () => {
    if (!battleResult || !userId) return;
    
    setSaving(true);
    try {
      const supabase = createClient();
      const title = `${battleResult.combatant1.name} vs ${battleResult.combatant2.name}`;
      
      const { data, error } = await supabase
        .from('battle_stories')
        .insert({
          mythology_id: mythologyId,
          created_by: userId,
          title,
          combatant_1_name: battleResult.combatant1.name,
          combatant_1_type: battleResult.combatant1.type,
          combatant_2_name: battleResult.combatant2.name,
          combatant_2_type: battleResult.combatant2.type,
          winner_name: battleResult.winner.name,
          battle_type: battleResult.battleType,
          narration_style: battleResult.narrationStyle,
          narration: battleResult.narration,
          combat_summary: {
            totalRounds: battleResult.totalRounds,
            combatant1FinalHp: battleResult.combatant1.finalHp,
            combatant2FinalHp: battleResult.combatant2.finalHp,
            combatant1Stats: battleResult.combatant1.stats,
            combatant2Stats: battleResult.combatant2.stats
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Add to saved battles list
      if (data) {
        setSavedBattles(prev => [data, ...prev]);
      }
      setSaved(true);
    } catch (error) {
      console.error('Error saving battle:', error);
      alert('Failed to save battle. The battle_stories table may not exist yet.');
    } finally {
      setSaving(false);
    }
  };

  // Delete a saved battle
  const handleDeleteBattle = async (id: string) => {
    if (!confirm('Delete this saved battle?')) return;
    
    try {
      const supabase = createClient();
      await supabase.from('battle_stories').delete().eq('id', id);
      setSavedBattles(prev => prev.filter(b => b.id !== id));
      if (viewingStory?.id === id) setViewingStory(null);
    } catch (error) {
      console.error('Error deleting battle:', error);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      const supabase = createClient();
      await supabase
        .from('battle_stories')
        .update({ is_favorite: !currentFav })
        .eq('id', id);
      setSavedBattles(prev => 
        prev.map(b => b.id === id ? { ...b, is_favorite: !currentFav } : b)
      );
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const getCombatant1List = () => combatant1Type === 'character' ? characters : creatures;
  const getCombatant2List = () => combatant2Type === 'character' ? characters : creatures;

  const getSelectedCombatant1 = () => {
    const list = getCombatant1List();
    return list.find(c => c.id === combatant1Id);
  };

  const getSelectedCombatant2 = () => {
    const list = getCombatant2List();
    return list.find(c => c.id === combatant2Id);
  };

  const handleStartBattle = async () => {
    if (!combatant1Id || !combatant2Id || !userId) return;
    if (combatant1Id === combatant2Id && combatant1Type === combatant2Type) {
      alert('A combatant cannot fight themselves!');
      return;
    }

    setBattling(true);
    setBattleResult(null);

    try {
      const response = await fetch('/api/battles/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mythologyId,
          combatant1Type,
          combatant1Id,
          combatant2Type,
          combatant2Id,
          battleType,
          narrationStyle,
          arenaDescription: arenaDescription || undefined,
          useAiNarration,
          userId
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Start animated playback
      setBattleResult(data.battle);
      startBattlePlayback(data.battle);
    } catch (error) {
      console.error('Battle error:', error);
      alert('Battle failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setBattling(false);
    }
  };

  // Start the animated battle playback
  const startBattlePlayback = (result: BattleResult) => {
    setIsPlayingBattle(true);
    setCurrentActionIndex(0);
    setCombatant1CurrentHp(result.combatant1.stats.maxHp);
    setCombatant2CurrentHp(result.combatant2.stats.maxHp);
    setShowNarration(false);
    setLastAction(null);
    setIsPaused(false);
  };

  // Playback effect - advances through combat log
  useEffect(() => {
    if (!isPlayingBattle || !battleResult || isPaused) return;

    // Get playback delay based on speed
    const delay = playbackSpeed === 'slow' ? 2500 : playbackSpeed === 'fast' ? 800 : 1500;

    const combatLog = battleResult.combatLog;
    
    if (currentActionIndex >= combatLog.length) {
      // Battle finished - show winner announcement then narration
      const timer = setTimeout(() => {
        setShowNarration(true);
        setIsPlayingBattle(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const action = combatLog[currentActionIndex];
      setLastAction(action);
      
      // Update HP based on who got hit
      if (action.damage > 0) {
        if (action.defenderName === battleResult.combatant1.name) {
          setCombatant1CurrentHp(prev => Math.max(0, prev - action.damage));
        } else {
          setCombatant2CurrentHp(prev => Math.max(0, prev - action.damage));
        }
      }
      
      setCurrentActionIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlayingBattle, currentActionIndex, battleResult, isPaused, playbackSpeed]);

  // Skip to end of battle
  const skipToEnd = () => {
    if (!battleResult) return;
    setIsPlayingBattle(false);
    setCombatant1CurrentHp(battleResult.combatant1.finalHp);
    setCombatant2CurrentHp(battleResult.combatant2.finalHp);
    setCurrentActionIndex(battleResult.combatLog.length);
    setShowNarration(true);
  };

  // Replay battle
  const replayBattle = () => {
    if (battleResult) {
      startBattlePlayback(battleResult);
    }
  };

  const StatBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  const CombatantCard = ({ combatant, type, isWinner }: { 
    combatant: Character | Creature; 
    type: 'character' | 'creature';
    isWinner?: boolean;
  }) => (
    <div className={`p-4 rounded-lg border-2 ${isWinner ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-600 bg-gray-800'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isWinner && <span className="text-2xl">👑</span>}
        <h3 className="font-bold text-lg">{combatant.name}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">
        {type === 'character' 
          ? `${(combatant as Character).character_type} • ${(combatant as Character).domain || 'No domain'}`
          : `${(combatant as Creature).creature_type} • ${(combatant as Creature).danger_level}`
        }
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span>❤️</span>
          <span>{combatant.combat_hp || 100} HP</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⚔️</span>
          <span>{combatant.combat_attack || 10} ATK</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🛡️</span>
          <span>{combatant.combat_defense || 10} DEF</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💨</span>
          <span>{combatant.combat_speed || 10} SPD</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Record: {combatant.battle_wins || 0}W - {combatant.battle_losses || 0}L
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">⚔️ Loading Battle Arena...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/student/mythology/${mythologyId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Mythology
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ⚔️ Battle Arena
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showHistory ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            📚 Saved Battles ({savedBattles.length})
          </button>
        </div>
      </header>

      {/* Viewing Story Modal */}
      {viewingStory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">{viewingStory.title}</h2>
              <button
                onClick={() => setViewingStory(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                <span className="px-2 py-1 bg-purple-900/50 rounded">{viewingStory.battle_type}</span>
                <span className="px-2 py-1 bg-green-900/50 rounded">{viewingStory.narration_style} style</span>
                {viewingStory.winner_name && (
                  <span className="px-2 py-1 bg-yellow-900/50 rounded">🏆 {viewingStory.winner_name}</span>
                )}
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {viewingStory.narration}
                </p>
              </div>
              <div className="mt-6 text-xs text-gray-500">
                Saved on {new Date(viewingStory.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle History Sidebar */}
      {showHistory && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 border-l border-gray-700 z-40 shadow-2xl overflow-y-auto">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
            <h2 className="text-lg font-bold">📚 Saved Battles</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {savedBattles.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">📜</p>
              <p>No saved battles yet.</p>
              <p className="text-sm mt-2">Run a battle and click &quot;Save to Collection&quot;!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {savedBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{battle.title}</h3>
                    <button
                      onClick={() => handleToggleFavorite(battle.id, battle.is_favorite)}
                      className="text-lg"
                    >
                      {battle.is_favorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-purple-900/50 rounded">{battle.battle_type}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-900/50 rounded">{battle.narration_style}</span>
                  </div>
                  {battle.winner_name && (
                    <p className="text-xs text-yellow-400 mb-2">🏆 {battle.winner_name} won</p>
                  )}
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {battle.narration.substring(0, 100)}...
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingStory(battle)}
                      className="flex-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                    >
                      📖 Read
                    </button>
                    <button
                      onClick={() => handleDeleteBattle(battle.id)}
                      className="text-xs px-3 py-1.5 bg-red-600/50 hover:bg-red-500 rounded transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!battleResult ? (
          /* SETUP PHASE */
          <div className="space-y-8">
            {/* Combatant Selection */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Combatant 1 */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">1</span>
                  Combatant 1
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCombatant1Type('character'); setCombatant1Id(''); }}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        combatant1Type === 'character' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      👤 Characters ({characters.length})
                    </button>
                    <button
                      onClick={() => { setCombatant1Type('creature'); setCombatant1Id(''); }}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        combatant1Type === 'creature' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      🐉 Creatures ({creatures.length})
                    </button>
                  </div>

                  <select
                    value={combatant1Id}
                    onChange={(e) => setCombatant1Id(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  >
                    <option value="">Select {combatant1Type}...</option>
                    {getCombatant1List().map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({combatant1Type === 'character' 
                          ? (c as Character).character_type 
                          : (c as Creature).danger_level})
                      </option>
                    ))}
                  </select>

                  {getSelectedCombatant1() && (
                    <CombatantCard combatant={getSelectedCombatant1()!} type={combatant1Type} />
                  )}
                </div>
              </div>

              {/* Combatant 2 */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">2</span>
                  Combatant 2
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCombatant2Type('character'); setCombatant2Id(''); }}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        combatant2Type === 'character' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      👤 Characters ({characters.length})
                    </button>
                    <button
                      onClick={() => { setCombatant2Type('creature'); setCombatant2Id(''); }}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        combatant2Type === 'creature' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      🐉 Creatures ({creatures.length})
                    </button>
                  </div>

                  <select
                    value={combatant2Id}
                    onChange={(e) => setCombatant2Id(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  >
                    <option value="">Select {combatant2Type}...</option>
                    {getCombatant2List().map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({combatant2Type === 'character' 
                          ? (c as Character).character_type 
                          : (c as Creature).danger_level})
                      </option>
                    ))}
                  </select>

                  {getSelectedCombatant2() && (
                    <CombatantCard combatant={getSelectedCombatant2()!} type={combatant2Type} />
                  )}
                </div>
              </div>
            </div>

            {/* Battle Options */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">⚙️ Battle Options</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Battle Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Battle Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {BATTLE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setBattleType(type.value)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          battleType === type.value
                            ? 'bg-purple-600 border-2 border-purple-400'
                            : 'bg-gray-700 border-2 border-transparent hover:border-gray-500'
                        }`}
                      >
                        <span className="text-lg mr-2">{type.emoji}</span>
                        <span className="font-medium">{type.label}</span>
                        <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narration Style */}
                <div>
                  <label className="block text-sm font-medium mb-2">Narration Style</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {NARRATION_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setNarrationStyle(style.value)}
                        className={`p-3 rounded-lg transition-colors ${
                          narrationStyle === style.value
                            ? 'bg-green-600 border-2 border-green-400'
                            : 'bg-gray-700 border-2 border-transparent hover:border-gray-500'
                        }`}
                      >
                        <span className="text-lg mr-2">{style.emoji}</span>
                        <span className="font-medium">{style.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Arena Description (Optional)</label>
                      <textarea
                        value={arenaDescription}
                        onChange={(e) => setArenaDescription(e.target.value)}
                        placeholder="Describe the battle arena... (e.g., 'A volcanic crater surrounded by lava')"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none"
                        rows={3}
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAiNarration}
                        onChange={(e) => setUseAiNarration(e.target.checked)}
                        className="w-5 h-5 rounded bg-gray-700 border-gray-600"
                      />
                      <span>🤖 Use AI Narration (GPT-4)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Battle Button */}
            <div className="text-center">
              <button
                onClick={handleStartBattle}
                disabled={!combatant1Id || !combatant2Id || battling}
                className={`px-12 py-4 text-xl font-bold rounded-xl transition-all transform ${
                  combatant1Id && combatant2Id && !battling
                    ? 'bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 hover:scale-105 cursor-pointer'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {battling ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚔️</span>
                    Battle in Progress...
                  </span>
                ) : (
                  <span>⚔️ START BATTLE ⚔️</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* BATTLE PLAYBACK & RESULTS PHASE */
          <div className="space-y-8">
            {/* Live Battle Arena */}
            {(isPlayingBattle || !showNarration) && (
              <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                {/* Battle Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">⚔️ BATTLE IN PROGRESS ⚔️</h2>
                  <p className="text-gray-400">
                    Round {Math.min(currentActionIndex + 1, battleResult.combatLog.length)} of {battleResult.totalRounds}
                  </p>
                </div>

                {/* VS Display with HP Bars */}
                <div className="grid grid-cols-3 gap-4 items-center mb-8">
                  {/* Combatant 1 */}
                  <div className={`text-center p-4 rounded-xl transition-all duration-300 ${
                    lastAction?.attackerName === battleResult.combatant1.name 
                      ? 'bg-blue-900/50 scale-105 ring-2 ring-blue-400' 
                      : lastAction?.defenderName === battleResult.combatant1.name && lastAction?.damage > 0
                      ? 'bg-red-900/50 animate-pulse'
                      : 'bg-gray-800'
                  }`}>
                    <div className="text-4xl mb-2">
                      {battleResult.combatant1.type === 'character' ? '👤' : '🐉'}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{battleResult.combatant1.name}</h3>
                    
                    {/* HP Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>HP</span>
                        <span className={`font-bold ${combatant1CurrentHp <= battleResult.combatant1.stats.maxHp * 0.25 ? 'text-red-400' : ''}`}>
                          {Math.max(0, combatant1CurrentHp)} / {battleResult.combatant1.stats.maxHp}
                        </span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            combatant1CurrentHp <= 0 ? 'bg-gray-600' :
                            combatant1CurrentHp <= battleResult.combatant1.stats.maxHp * 0.25 ? 'bg-red-500' :
                            combatant1CurrentHp <= battleResult.combatant1.stats.maxHp * 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.max(0, (combatant1CurrentHp / battleResult.combatant1.stats.maxHp) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-400">
                      <span>⚔️{battleResult.combatant1.stats.attack}</span>
                      <span>🛡️{battleResult.combatant1.stats.defense}</span>
                      <span>💨{battleResult.combatant1.stats.speed}</span>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-red-500">
                      VS
                    </div>
                    {lastAction && lastAction.damage > 0 && (
                      <div className={`mt-4 text-3xl font-bold animate-bounce ${
                        lastAction.actionType === 'critical' ? 'text-yellow-400' :
                        lastAction.actionType === 'special' ? 'text-purple-400' :
                        'text-red-400'
                      }`}>
                        -{lastAction.damage}
                        {lastAction.actionType === 'critical' && ' 💥'}
                        {lastAction.actionType === 'special' && ' ✨'}
                      </div>
                    )}
                    {lastAction && lastAction.actionType === 'dodge' && (
                      <div className="mt-4 text-2xl font-bold text-blue-400 animate-bounce">
                        DODGED! 💨
                      </div>
                    )}
                  </div>

                  {/* Combatant 2 */}
                  <div className={`text-center p-4 rounded-xl transition-all duration-300 ${
                    lastAction?.attackerName === battleResult.combatant2.name 
                      ? 'bg-red-900/50 scale-105 ring-2 ring-red-400' 
                      : lastAction?.defenderName === battleResult.combatant2.name && lastAction?.damage > 0
                      ? 'bg-red-900/50 animate-pulse'
                      : 'bg-gray-800'
                  }`}>
                    <div className="text-4xl mb-2">
                      {battleResult.combatant2.type === 'character' ? '👤' : '🐉'}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{battleResult.combatant2.name}</h3>
                    
                    {/* HP Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>HP</span>
                        <span className={`font-bold ${combatant2CurrentHp <= battleResult.combatant2.stats.maxHp * 0.25 ? 'text-red-400' : ''}`}>
                          {Math.max(0, combatant2CurrentHp)} / {battleResult.combatant2.stats.maxHp}
                        </span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            combatant2CurrentHp <= 0 ? 'bg-gray-600' :
                            combatant2CurrentHp <= battleResult.combatant2.stats.maxHp * 0.25 ? 'bg-red-500' :
                            combatant2CurrentHp <= battleResult.combatant2.stats.maxHp * 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.max(0, (combatant2CurrentHp / battleResult.combatant2.stats.maxHp) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-400">
                      <span>⚔️{battleResult.combatant2.stats.attack}</span>
                      <span>🛡️{battleResult.combatant2.stats.defense}</span>
                      <span>💨{battleResult.combatant2.stats.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Current Action Display */}
                {lastAction && (
                  <div className={`p-4 rounded-xl text-center text-lg mb-6 transition-all ${
                    lastAction.actionType === 'critical' ? 'bg-yellow-900/30 border-2 border-yellow-500' :
                    lastAction.actionType === 'special' ? 'bg-purple-900/30 border-2 border-purple-500' :
                    lastAction.actionType === 'dodge' ? 'bg-blue-900/30 border-2 border-blue-500' :
                    'bg-gray-700 border border-gray-600'
                  }`}>
                    <span className="text-xs text-gray-400 block mb-1">Round {lastAction.round}</span>
                    <span className="font-medium">{lastAction.description}</span>
                  </div>
                )}

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setPlaybackSpeed('slow')}
                      className={`px-3 py-1 rounded transition-colors ${playbackSpeed === 'slow' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    >
                      🐢 Slow
                    </button>
                    <button
                      onClick={() => setPlaybackSpeed('normal')}
                      className={`px-3 py-1 rounded transition-colors ${playbackSpeed === 'normal' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    >
                      ▶️ Normal
                    </button>
                    <button
                      onClick={() => setPlaybackSpeed('fast')}
                      className={`px-3 py-1 rounded transition-colors ${playbackSpeed === 'fast' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    >
                      ⚡ Fast
                    </button>
                  </div>
                  
                  {isPlayingBattle && (
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                    </button>
                  )}
                  
                  <button
                    onClick={skipToEnd}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
                  >
                    ⏭️ Skip to End
                  </button>
                </div>

                {/* Action Log (scrolling) */}
                <div className="mt-6 max-h-40 overflow-y-auto bg-gray-900 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Battle Log</h4>
                  <div className="space-y-1">
                    {battleResult.combatLog.slice(0, currentActionIndex).map((action, index) => (
                      <div key={index} className={`text-xs p-2 rounded ${
                        action.actionType === 'critical' ? 'bg-yellow-900/20 text-yellow-300' :
                        action.actionType === 'special' ? 'bg-purple-900/20 text-purple-300' :
                        action.actionType === 'dodge' ? 'bg-blue-900/20 text-blue-300' :
                        'text-gray-400'
                      }`}>
                        <span className="text-gray-500">R{action.round}:</span> {action.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Winner Announcement (after playback) */}
            {!isPlayingBattle && currentActionIndex >= battleResult.combatLog.length && (
              <div className="text-center py-8 animate-fade-in">
                {battleResult.winner.type === 'draw' ? (
                  <div>
                    <h2 className="text-5xl font-bold mb-2 animate-pulse">🤝 DRAW! 🤝</h2>
                    <p className="text-xl text-gray-400">Neither combatant could claim victory</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-5xl font-bold mb-4">🏆 VICTORY! 🏆</h2>
                    <p className="text-4xl text-yellow-400 font-bold animate-pulse">{battleResult.winner.name}</p>
                    <p className="text-gray-400 mt-4 text-lg">
                      Won in {battleResult.totalRounds} rounds
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Battle Narration (after playback complete) */}
            {showNarration && (
              <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-xl p-8 border border-amber-900/50">
                <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3 text-amber-400">
                  <span className="text-3xl">📜</span>
                  The Tale of This Battle
                  <span className="text-sm font-normal text-gray-400">
                    ({narrationStyle} style)
                  </span>
                </h3>
                <div className="prose prose-invert max-w-none prose-lg">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg font-serif italic">
                    {battleResult.narration}
                  </p>
                </div>
              </div>
            )}

            {/* Final Stats (after playback) */}
            {showNarration && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`bg-gray-800 rounded-xl p-6 ${
                  battleResult.winner.id === battleResult.combatant1.id ? 'ring-2 ring-yellow-500' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {battleResult.winner.id === battleResult.combatant1.id && '👑'}
                      {battleResult.combatant1.name}
                    </h3>
                    <span className="text-sm text-gray-400">{battleResult.combatant1.type}</span>
                  </div>
                  <StatBar 
                    label="Final HP" 
                    value={Math.max(0, battleResult.combatant1.finalHp)} 
                    max={battleResult.combatant1.stats.maxHp}
                    color={battleResult.combatant1.finalHp > 0 ? 'bg-green-500' : 'bg-red-500'}
                  />
                </div>

                <div className={`bg-gray-800 rounded-xl p-6 ${
                  battleResult.winner.id === battleResult.combatant2.id ? 'ring-2 ring-yellow-500' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {battleResult.winner.id === battleResult.combatant2.id && '👑'}
                      {battleResult.combatant2.name}
                    </h3>
                    <span className="text-sm text-gray-400">{battleResult.combatant2.type}</span>
                  </div>
                  <StatBar 
                    label="Final HP" 
                    value={Math.max(0, battleResult.combatant2.finalHp)} 
                    max={battleResult.combatant2.stats.maxHp}
                    color={battleResult.combatant2.finalHp > 0 ? 'bg-green-500' : 'bg-red-500'}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              {showNarration && (
                <>
                  <button
                    onClick={replayBattle}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    🔄 Watch Again
                  </button>
                  <button
                    onClick={handleSaveBattle}
                    disabled={saving || saved}
                    className={`px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                      saved
                        ? 'bg-green-700 text-green-200 cursor-default'
                        : saving
                        ? 'bg-gray-600 cursor-wait'
                        : 'bg-green-600 hover:bg-green-500'
                    }`}
                  >
                    {saved ? (
                      <>✅ Saved to Collection</>
                    ) : saving ? (
                      <>💾 Saving...</>
                    ) : (
                      <>💾 Save to Collection</>
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setBattleResult(null);
                  setSaved(false);
                  setIsPlayingBattle(false);
                  setShowNarration(false);
                  setCurrentActionIndex(0);
                }}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                ⚔️ New Battle
              </button>
              <Link
                href={`/student/mythology/${mythologyId}`}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
              >
                ← Back to Mythology
              </Link>
            </div>

            {/* Battle Image Generator (after battle complete) */}
            {showNarration && (
              <BattleImageGenerator
                combatant1={{
                  id: battleResult.combatant1.id,
                  name: battleResult.combatant1.name,
                  type: battleResult.combatant1.type,
                  description: combatant1Type === 'character' 
                    ? (getSelectedCombatant1() as Character | undefined)?.powers_abilities || ''
                    : (getSelectedCombatant1() as Creature | undefined)?.abilities || ''
                }}
                combatant2={{
                  id: battleResult.combatant2.id,
                  name: battleResult.combatant2.name,
                  type: battleResult.combatant2.type,
                  description: combatant2Type === 'character' 
                    ? (getSelectedCombatant2() as Character | undefined)?.powers_abilities || ''
                    : (getSelectedCombatant2() as Creature | undefined)?.abilities || ''
                }}
                winner={battleResult.winner.id ? {
                  id: battleResult.winner.id,
                  name: battleResult.winner.name || '',
                  type: battleResult.winner.type,
                  description: battleResult.winner.id === battleResult.combatant1.id 
                    ? (combatant1Type === 'character' 
                        ? (getSelectedCombatant1() as Character | undefined)?.powers_abilities || ''
                        : (getSelectedCombatant1() as Creature | undefined)?.abilities || '')
                    : (combatant2Type === 'character' 
                        ? (getSelectedCombatant2() as Character | undefined)?.powers_abilities || ''
                        : (getSelectedCombatant2() as Creature | undefined)?.abilities || '')
                } : null}
                mythologyName={mythologyName || 'Unknown Mythology'}
                battleType={battleType}
                narrationStyle={narrationStyle}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
