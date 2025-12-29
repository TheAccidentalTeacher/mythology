// Battle Simulation API Route
// POST /api/battles/simulate - Run a battle simulation and get AI narration

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  simulateBattle, 
  createCombatantFromCharacter, 
  createCombatantFromCreature,
  BattleType,
  NarrationStyle
} from '@/lib/battleEngine';
import { generateBattleNarration, generateQuickNarration } from '@/lib/battleNarration';

// Use service role for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SimulateRequest {
  mythologyId: string;
  combatant1Type: 'character' | 'creature';
  combatant1Id: string;
  combatant2Type: 'character' | 'creature';
  combatant2Id: string;
  battleType?: BattleType;
  narrationStyle?: NarrationStyle;
  arenaDescription?: string;
  useAiNarration?: boolean;
  userId: string;
}

export async function POST(request: Request) {
  try {
    const body: SimulateRequest = await request.json();
    
    const {
      mythologyId,
      combatant1Type,
      combatant1Id,
      combatant2Type,
      combatant2Id,
      battleType = 'duel',
      narrationStyle = 'epic',
      arenaDescription,
      useAiNarration = true,
      userId
    } = body;

    // Validate required fields
    if (!mythologyId || !combatant1Id || !combatant2Id || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch combatant 1
    let combatant1Data;
    if (combatant1Type === 'character') {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', combatant1Id)
        .single();
      if (error) throw new Error(`Character 1 not found: ${error.message}`);
      combatant1Data = createCombatantFromCharacter(data);
    } else {
      const { data, error } = await supabase
        .from('creatures')
        .select('*')
        .eq('id', combatant1Id)
        .single();
      if (error) throw new Error(`Creature 1 not found: ${error.message}`);
      combatant1Data = createCombatantFromCreature(data);
    }

    // Fetch combatant 2
    let combatant2Data;
    if (combatant2Type === 'character') {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', combatant2Id)
        .single();
      if (error) throw new Error(`Character 2 not found: ${error.message}`);
      combatant2Data = createCombatantFromCharacter(data);
    } else {
      const { data, error } = await supabase
        .from('creatures')
        .select('*')
        .eq('id', combatant2Id)
        .single();
      if (error) throw new Error(`Creature 2 not found: ${error.message}`);
      combatant2Data = createCombatantFromCreature(data);
    }

    // Fetch mythology name for narration context
    const { data: mythology } = await supabase
      .from('mythologies')
      .select('name')
      .eq('id', mythologyId)
      .single();

    // Run battle simulation
    console.log(`⚔️ Starting battle: ${combatant1Data.name} vs ${combatant2Data.name}`);
    const battleResult = simulateBattle(combatant1Data, combatant2Data, battleType);
    console.log(`🏆 Winner: ${battleResult.winnerName || 'Draw'} after ${battleResult.totalRounds} rounds`);

    // Generate narration
    let narration: string;
    if (useAiNarration) {
      console.log('🤖 Generating AI narration...');
      narration = await generateBattleNarration({
        combatant1: combatant1Data,
        combatant2: combatant2Data,
        battleResult,
        battleType,
        narrationStyle,
        arenaDescription,
        mythologyName: mythology?.name
      });
    } else {
      narration = generateQuickNarration(combatant1Data, combatant2Data, battleResult);
    }

    // Save battle to database
    const { data: savedBattle, error: saveError } = await supabase
      .from('battles')
      .insert({
        mythology_id: mythologyId,
        combatant_1_type: combatant1Type,
        combatant_1_id: combatant1Id,
        combatant_2_type: combatant2Type,
        combatant_2_id: combatant2Id,
        battle_type: battleType,
        arena_description: arenaDescription,
        winner_type: battleResult.winnerType,
        winner_id: battleResult.winnerId,
        total_rounds: battleResult.totalRounds,
        combat_log: battleResult.combatLog,
        battle_narration: narration,
        narration_style: narrationStyle,
        combatant_1_stats: combatant1Data.stats,
        combatant_2_stats: combatant2Data.stats,
        created_by: userId
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving battle:', saveError);
      // Continue anyway, return result without save
    }

    // Award points for participating in battle
    const participationPoints = 50; // Base points for battle
    const winnerBonusPoints = 25; // Bonus for winning
    
    try {
      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
      
      let pointsToAward = participationPoints;
      if (battleResult.winnerId && (
        (battleResult.winnerType === combatant1Type && battleResult.winnerId === combatant1Id) ||
        (battleResult.winnerType === combatant2Type && battleResult.winnerId === combatant2Id)
      )) {
        // User's combatant won (in single-mythology battles, user owns both)
        pointsToAward += winnerBonusPoints;
      }
      
      // Update points
      await supabase
        .from('profiles')
        .update({ points: (profile?.points || 0) + pointsToAward })
        .eq('id', userId);
      
      console.log(`🏆 Awarded ${pointsToAward} battle points to user ${userId}`);
    } catch (pointsError) {
      console.error('Error awarding battle points:', pointsError);
    }

    // Update win/loss records (best effort - columns may not exist yet)
    if (battleResult.winnerId) {
      const winnerTable = battleResult.winnerType === 'character' ? 'characters' : 'creatures';
      const loserTable = battleResult.winnerId === combatant1Id 
        ? (combatant2Type === 'character' ? 'characters' : 'creatures')
        : (combatant1Type === 'character' ? 'characters' : 'creatures');
      const loserId = battleResult.winnerId === combatant1Id ? combatant2Id : combatant1Id;

      // Try to increment wins/losses - will fail silently if columns don't exist
      try {
        // Get current wins and increment
        const { data: winnerData } = await supabase
          .from(winnerTable)
          .select('battle_wins')
          .eq('id', battleResult.winnerId)
          .single();
        
        if (winnerData) {
          await supabase
            .from(winnerTable)
            .update({ battle_wins: (winnerData.battle_wins || 0) + 1 })
            .eq('id', battleResult.winnerId);
        }

        // Get current losses and increment
        const { data: loserData } = await supabase
          .from(loserTable)
          .select('battle_losses')
          .eq('id', loserId)
          .single();
        
        if (loserData) {
          await supabase
            .from(loserTable)
            .update({ battle_losses: (loserData.battle_losses || 0) + 1 })
            .eq('id', loserId);
        }
      } catch (e) {
        console.log('Could not update battle records:', e);
      }
    }

    return NextResponse.json({
      success: true,
      battle: {
        id: savedBattle?.id,
        combatant1: {
          id: combatant1Data.id,
          name: combatant1Data.name,
          type: combatant1Type,
          finalHp: battleResult.combatant1FinalHp,
          stats: combatant1Data.stats
        },
        combatant2: {
          id: combatant2Data.id,
          name: combatant2Data.name,
          type: combatant2Type,
          finalHp: battleResult.combatant2FinalHp,
          stats: combatant2Data.stats
        },
        winner: {
          id: battleResult.winnerId,
          name: battleResult.winnerName,
          type: battleResult.winnerType
        },
        totalRounds: battleResult.totalRounds,
        combatLog: battleResult.combatLog,
        narration,
        battleType,
        narrationStyle
      }
    });

  } catch (error) {
    console.error('Battle simulation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Battle simulation failed' },
      { status: 500 }
    );
  }
}
