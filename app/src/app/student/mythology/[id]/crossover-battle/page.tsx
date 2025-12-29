'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Mythology {
  id: string;
  name: string;
  description?: string;
}

interface Combatant {
  id: string;
  name: string;
  type: 'character' | 'creature';
  subtype: string; // character_type or creature_type
  mythologyId: string;
  mythologyName: string;
}

interface BattleResult {
  rounds: {
    round: number;
    attacker: string;
    defender: string;
    damage: number;
    attackerHp: number;
    defenderHp: number;
    isSpecial: boolean;
    isCritical: boolean;
    isDodged: boolean;
    description: string;
  }[];
  winner: { id: string; name: string } | null;
  totalRounds: number;
  combatant1FinalHp: number;
  combatant2FinalHp: number;
}

const BATTLE_TYPES = [
  { value: 'crossover_duel', label: '⚔️ Crossover Duel', description: 'Champions clash across mythologies' },
  { value: 'champion_battle', label: '🏆 Champion Battle', description: 'Official battle of champions' },
  { value: 'exhibition', label: '🎭 Exhibition Match', description: 'Friendly demonstration bout' },
  { value: 'grudge_match', label: '💢 Grudge Match', description: 'Settle a score between mythologies' },
];

const NARRATION_STYLES = [
  { value: 'epic', label: '⚡ Epic', description: 'Grand and heroic' },
  { value: 'dramatic', label: '🎭 Dramatic', description: 'Intense and emotional' },
  { value: 'comedic', label: '😄 Comedic', description: 'Light and humorous' },
  { value: 'poetic', label: '🎵 Poetic', description: 'Lyrical and beautiful' },
];

function CrossoverBattleContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const mythologyId = params.id as string;
  const partnerIdFromUrl = searchParams.get('partner');
  
  // State
  const [myMythology, setMyMythology] = useState<Mythology | null>(null);
  const [partnerMythology, setPartnerMythology] = useState<Mythology | null>(null);
  const [availablePartners, setAvailablePartners] = useState<Mythology[]>([]);
  const [myCombatants, setMyCombatants] = useState<Combatant[]>([]);
  const [partnerCombatants, setPartnerCombatants] = useState<Combatant[]>([]);
  
  const [selectedMyCombatant, setSelectedMyCombatant] = useState<Combatant | null>(null);
  const [selectedPartnerCombatant, setSelectedPartnerCombatant] = useState<Combatant | null>(null);
  const [battleType, setBattleType] = useState('crossover_duel');
  const [narrationStyle, setNarrationStyle] = useState('epic');
  
  const [loading, setLoading] = useState(true);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [narration, setNarration] = useState<string | null>(null);
  const [winningMythologyId, setWinningMythologyId] = useState<string | null>(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [combatant1CurrentHp, setCombatant1CurrentHp] = useState(100);
  const [combatant2CurrentHp, setCombatant2CurrentHp] = useState(100);

  // Fetch my mythology
  useEffect(() => {
    async function fetchMyMythology() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('mythologies')
        .select('id, name, description')
        .eq('id', mythologyId)
        .single();
      
      if (!error && data) {
        setMyMythology(data);
      }
    }
    fetchMyMythology();
  }, [mythologyId]);

  // Fetch available partner mythologies (from alliances)
  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch(`/api/crossovers/alliances?mythologyId=${mythologyId}`);
        const data = await response.json();
        
        if (response.ok && data.alliances) {
          const partners = data.alliances
            .filter((a: { is_active: boolean }) => a.is_active)
            .map((a: { partner_mythology: Mythology }) => a.partner_mythology)
            .filter(Boolean);
          setAvailablePartners(partners);
          
          // If partner specified in URL, select it
          if (partnerIdFromUrl) {
            const urlPartner = partners.find((p: Mythology) => p.id === partnerIdFromUrl);
            if (urlPartner) {
              setPartnerMythology(urlPartner);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, [mythologyId, partnerIdFromUrl]);

  // Fetch my combatants
  useEffect(() => {
    async function fetchMyCombatants() {
      const supabase = createClient();
      
      const [charactersRes, creaturesRes] = await Promise.all([
        supabase.from('characters').select('id, name, character_type').eq('mythology_id', mythologyId),
        supabase.from('creatures').select('id, name, creature_type').eq('mythology_id', mythologyId),
      ]);
      
      const combatants: Combatant[] = [
        ...(charactersRes.data || []).map(c => ({
          id: c.id,
          name: c.name,
          type: 'character' as const,
          subtype: c.character_type,
          mythologyId,
          mythologyName: myMythology?.name || '',
        })),
        ...(creaturesRes.data || []).map(c => ({
          id: c.id,
          name: c.name,
          type: 'creature' as const,
          subtype: c.creature_type,
          mythologyId,
          mythologyName: myMythology?.name || '',
        })),
      ];
      
      setMyCombatants(combatants);
    }
    
    if (myMythology) {
      fetchMyCombatants();
    }
  }, [mythologyId, myMythology]);

  // Fetch partner combatants when partner selected
  useEffect(() => {
    async function fetchPartnerCombatants() {
      if (!partnerMythology) {
        setPartnerCombatants([]);
        return;
      }
      
      const supabase = createClient();
      
      const [charactersRes, creaturesRes] = await Promise.all([
        supabase.from('characters').select('id, name, character_type').eq('mythology_id', partnerMythology.id),
        supabase.from('creatures').select('id, name, creature_type').eq('mythology_id', partnerMythology.id),
      ]);
      
      const combatants: Combatant[] = [
        ...(charactersRes.data || []).map(c => ({
          id: c.id,
          name: c.name,
          type: 'character' as const,
          subtype: c.character_type,
          mythologyId: partnerMythology.id,
          mythologyName: partnerMythology.name,
        })),
        ...(creaturesRes.data || []).map(c => ({
          id: c.id,
          name: c.name,
          type: 'creature' as const,
          subtype: c.creature_type,
          mythologyId: partnerMythology.id,
          mythologyName: partnerMythology.name,
        })),
      ];
      
      setPartnerCombatants(combatants);
    }
    
    fetchPartnerCombatants();
  }, [partnerMythology]);

  // Playback effect
  useEffect(() => {
    if (!isPlaying || !battleResult) return;
    
    const speeds = { slow: 2500, normal: 1500, fast: 800 };
    const interval = setInterval(() => {
      setCurrentRound(prev => {
        if (prev >= battleResult.rounds.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        
        const nextRound = battleResult.rounds[prev + 1];
        if (nextRound) {
          setCombatant1CurrentHp(nextRound.attackerHp);
          setCombatant2CurrentHp(nextRound.defenderHp);
        }
        
        return prev + 1;
      });
    }, speeds[playbackSpeed]);
    
    return () => clearInterval(interval);
  }, [isPlaying, battleResult, playbackSpeed]);

  // Start battle
  async function startBattle() {
    if (!selectedMyCombatant || !selectedPartnerCombatant || !partnerMythology) return;
    
    setBattling(true);
    setBattleResult(null);
    setNarration(null);
    setCurrentRound(0);
    
    try {
      const response = await fetch('/api/crossovers/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mythology1Id: mythologyId,
          mythology2Id: partnerMythology.id,
          combatant1Type: selectedMyCombatant.type,
          combatant1Id: selectedMyCombatant.id,
          combatant2Type: selectedPartnerCombatant.type,
          combatant2Id: selectedPartnerCombatant.id,
          battleType,
          narrationStyle,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.battle) {
        setBattleResult(data.battle.result);
        setNarration(data.battle.narration);
        setWinningMythologyId(data.battle.winningMythologyId);
        
        // Set initial HP
        if (data.battle.result.rounds.length > 0) {
          const firstRound = data.battle.result.rounds[0];
          setCombatant1CurrentHp(firstRound.attackerHp);
          setCombatant2CurrentHp(firstRound.defenderHp);
        }
      } else {
        alert(data.error || 'Failed to simulate battle');
      }
    } catch {
      alert('Failed to simulate battle');
    } finally {
      setBattling(false);
    }
  }

  // Start playback
  function startPlayback() {
    if (!battleResult) return;
    setCurrentRound(0);
    if (battleResult.rounds.length > 0) {
      setCombatant1CurrentHp(100);
      setCombatant2CurrentHp(100);
    }
    setIsPlaying(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Crossover Battle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href={`/student/mythology/${mythologyId}/crossover`}
              className="text-purple-300 hover:text-white mb-2 inline-flex items-center gap-2"
            >
              ← Back to Crossover Hub
            </Link>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              ⚔️ Crossover Battle
            </h1>
            <p className="text-purple-200 mt-2">
              Battle champions from allied or rival mythologies
            </p>
          </div>
        </div>

        {availablePartners.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur rounded-2xl">
            <p className="text-6xl mb-4">🤝</p>
            <p className="text-xl text-white mb-2">No battle partners available</p>
            <p className="text-purple-200 mb-6">
              Form alliances or declare rivalries in the Crossover Hub to unlock battles
            </p>
            <Link
              href={`/student/mythology/${mythologyId}/crossover`}
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
            >
              Go to Crossover Hub
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Setup Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Partner Selection */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">🎯 Opponent Mythology</h2>
                <select
                  value={partnerMythology?.id || ''}
                  onChange={(e) => {
                    const selected = availablePartners.find(p => p.id === e.target.value);
                    setPartnerMythology(selected || null);
                    setSelectedPartnerCombatant(null);
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select mythology...</option>
                  {availablePartners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* My Champion */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  🏆 Your Champion ({myMythology?.name})
                </h2>
                {myCombatants.length === 0 ? (
                  <p className="text-purple-200">No combatants available</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {myCombatants.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedMyCombatant(c)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedMyCombatant?.id === c.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm opacity-70 capitalize">
                          {c.type === 'character' ? '👤' : '🐉'} {c.subtype}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Opponent Champion */}
              {partnerMythology && (
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    🎭 Their Champion ({partnerMythology.name})
                  </h2>
                  {partnerCombatants.length === 0 ? (
                    <p className="text-purple-200">No combatants available</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {partnerCombatants.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedPartnerCombatant(c)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedPartnerCombatant?.id === c.id
                              ? 'bg-pink-600 text-white'
                              : 'bg-white/5 text-purple-200 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-medium">{c.name}</div>
                          <div className="text-sm opacity-70 capitalize">
                            {c.type === 'character' ? '👤' : '🐉'} {c.subtype}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Battle Options */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">⚙️ Battle Options</h2>
                
                <div className="mb-4">
                  <label className="text-purple-200 text-sm mb-2 block">Battle Type</label>
                  <select
                    value={battleType}
                    onChange={(e) => setBattleType(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                  >
                    {BATTLE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-purple-200 text-sm mb-2 block">Narration Style</label>
                  <select
                    value={narrationStyle}
                    onChange={(e) => setNarrationStyle(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                  >
                    {NARRATION_STYLES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Battle Button */}
              <button
                onClick={startBattle}
                disabled={!selectedMyCombatant || !selectedPartnerCombatant || battling}
                className="w-full py-4 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {battling ? '⚔️ Battling...' : '⚔️ START CROSSOVER BATTLE!'}
              </button>
            </div>

            {/* Battle Arena */}
            <div className="lg:col-span-2">
              {!battleResult ? (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                  <p className="text-6xl mb-4">⚔️</p>
                  <p className="text-xl text-white mb-2">Select combatants to begin</p>
                  <p className="text-purple-200">
                    {selectedMyCombatant && selectedPartnerCombatant
                      ? `${selectedMyCombatant.name} vs ${selectedPartnerCombatant.name}`
                      : 'Choose champions from both mythologies'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Combatant HP Bars */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* My Champion */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{selectedMyCombatant?.name}</span>
                          <span className="text-purple-200">{myMythology?.name}</span>
                        </div>
                        <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              combatant1CurrentHp > 50 ? 'bg-green-500' :
                              combatant1CurrentHp > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(0, combatant1CurrentHp)}%` }}
                          />
                        </div>
                        <div className="text-center text-white mt-1">{Math.round(combatant1CurrentHp)}%</div>
                      </div>
                      
                      {/* Opponent Champion */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{selectedPartnerCombatant?.name}</span>
                          <span className="text-purple-200">{partnerMythology?.name}</span>
                        </div>
                        <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              combatant2CurrentHp > 50 ? 'bg-green-500' :
                              combatant2CurrentHp > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(0, combatant2CurrentHp)}%` }}
                          />
                        </div>
                        <div className="text-center text-white mt-1">{Math.round(combatant2CurrentHp)}%</div>
                      </div>
                    </div>
                    
                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <div className="flex gap-2">
                        {(['slow', 'normal', 'fast'] as const).map(speed => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-3 py-1 rounded text-sm ${
                              playbackSpeed === speed
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-purple-200'
                            }`}
                          >
                            {speed === 'slow' ? '🐢' : speed === 'normal' ? '▶️' : '⚡'}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
                      >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                      </button>
                      
                      <button
                        onClick={startPlayback}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                      >
                        🔄 Replay
                      </button>
                    </div>
                    
                    <div className="text-center text-purple-200 mt-2">
                      Round {currentRound + 1} of {battleResult.rounds.length}
                    </div>
                  </div>

                  {/* Winner Banner */}
                  {battleResult.winner && (
                    <div className={`rounded-xl p-6 text-center ${
                      winningMythologyId === mythologyId
                        ? 'bg-linear-to-r from-green-600 to-emerald-600'
                        : 'bg-linear-to-r from-red-600 to-orange-600'
                    }`}>
                      <p className="text-4xl mb-2">
                        {winningMythologyId === mythologyId ? '🎉' : '😔'}
                      </p>
                      <p className="text-2xl font-bold text-white mb-1">
                        {battleResult.winner.name} Wins!
                      </p>
                      <p className="text-white/80">
                        {winningMythologyId === mythologyId
                          ? `${myMythology?.name} claims victory!`
                          : `${partnerMythology?.name} takes the win`}
                      </p>
                    </div>
                  )}

                  {/* Narration */}
                  {narration && (
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">📜 Battle Tale</h3>
                      <div className="prose prose-invert max-w-none">
                        {narration.split('\n').map((paragraph, i) => (
                          <p key={i} className="text-purple-100 mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Combat Log */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">📋 Combat Log</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {battleResult.rounds.slice(0, currentRound + 1).map((round, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded text-sm ${
                            round.isDodged ? 'bg-blue-500/20 text-blue-200' :
                            round.isCritical ? 'bg-red-500/20 text-red-200' :
                            round.isSpecial ? 'bg-yellow-500/20 text-yellow-200' :
                            'bg-white/5 text-purple-200'
                          }`}
                        >
                          <span className="font-medium">R{round.round}:</span> {round.description}
                          {round.isCritical && ' 💥'}
                          {round.isSpecial && ' ✨'}
                          {round.isDodged && ' 💨'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CrossoverBattlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <CrossoverBattleContent />
    </Suspense>
  );
}
