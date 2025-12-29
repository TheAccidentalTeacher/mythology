import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { simulateBattle, createCombatantFromCharacter, createCombatantFromCreature, BattleType } from '@/lib/battleEngine';
import { generateBattleNarration, NarrationStyle } from '@/lib/battleNarration';

// POST /api/crossovers/battles - Simulate a cross-mythology battle
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      mythology1Id,
      mythology2Id,
      combatant1Type, // 'character' or 'creature'
      combatant1Id,
      combatant2Type,
      combatant2Id,
      battleType = 'crossover_duel',
      narrationStyle = 'epic',
      eventId // Optional - if part of a tournament
    } = body;

    // Validate required fields
    if (!mythology1Id || !mythology2Id || !combatant1Id || !combatant2Id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify both mythologies exist
    const { data: mythologies, error: mythError } = await supabase
      .from('mythologies')
      .select('id, name')
      .in('id', [mythology1Id, mythology2Id]);

    if (mythError || !mythologies || mythologies.length !== 2) {
      return NextResponse.json({ error: 'One or both mythologies not found' }, { status: 404 });
    }

    const mythology1 = mythologies.find(m => m.id === mythology1Id);
    const mythology2 = mythologies.find(m => m.id === mythology2Id);

    // Fetch combatant 1
    let combatant1Data;
    if (combatant1Type === 'character') {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, character_type, archetype, domain, powers_abilities')
        .eq('id', combatant1Id)
        .eq('mythology_id', mythology1Id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Combatant 1 not found' }, { status: 404 });
      }
      combatant1Data = { ...data, source: 'character' as const };
    } else {
      const { data, error } = await supabase
        .from('creatures')
        .select('id, name, creature_type, danger_level, powers_abilities')
        .eq('id', combatant1Id)
        .eq('mythology_id', mythology1Id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Combatant 1 not found' }, { status: 404 });
      }
      combatant1Data = { ...data, source: 'creature' as const };
    }

    // Fetch combatant 2
    let combatant2Data;
    if (combatant2Type === 'character') {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, character_type, archetype, domain, powers_abilities')
        .eq('id', combatant2Id)
        .eq('mythology_id', mythology2Id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Combatant 2 not found' }, { status: 404 });
      }
      combatant2Data = { ...data, source: 'character' as const };
    } else {
      const { data, error } = await supabase
        .from('creatures')
        .select('id, name, creature_type, danger_level, powers_abilities')
        .eq('id', combatant2Id)
        .eq('mythology_id', mythology2Id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Combatant 2 not found' }, { status: 404 });
      }
      combatant2Data = { ...data, source: 'creature' as const };
    }

    // Create combatants for battle
    const combatant1 = combatant1Data.source === 'character'
      ? createCombatantFromCharacter(combatant1Data as {
          id: string;
          name: string;
          character_type: string;
          archetype?: string;
          domain?: string;
          powers_abilities?: string;
        })
      : createCombatantFromCreature(combatant1Data as {
          id: string;
          name: string;
          creature_type: string;
          danger_level?: number;
          powers_abilities?: string;
        });

    const combatant2 = combatant2Data.source === 'character'
      ? createCombatantFromCharacter(combatant2Data as {
          id: string;
          name: string;
          character_type: string;
          archetype?: string;
          domain?: string;
          powers_abilities?: string;
        })
      : createCombatantFromCreature(combatant2Data as {
          id: string;
          name: string;
          creature_type: string;
          danger_level?: number;
          powers_abilities?: string;
        });

    // Simulate the battle
    const battleResult = simulateBattle(
      combatant1, 
      combatant2, 
      battleType as BattleType
    );

    // Generate narration with crossover context
    const narration = await generateBattleNarration({
      combatant1,
      combatant2,
      battleResult,
      battleType: battleType as BattleType,
      narrationStyle: narrationStyle as NarrationStyle,
      arenaDescription: `This is a historic crossover battle between champions from two different mythologies: "${mythology1?.name}" and "${mythology2?.name}". Make the narration emphasize the clash of different mythological traditions and cultures.`
    });

    // Determine winner
    const winnerCombatantId = battleResult.winnerId || null;
    const winningMythologyId = winnerCombatantId === combatant1.id ? mythology1Id : 
                               winnerCombatantId === combatant2.id ? mythology2Id : null;

    // Save to crossover_battles table
    const { data: savedBattle, error: saveError } = await supabase
      .from('crossover_battles')
      .insert({
        mythology_1_id: mythology1Id,
        mythology_2_id: mythology2Id,
        combatant_1_type: combatant1Type || 'character',
        combatant_1_id: combatant1Id,
        combatant_2_type: combatant2Type || 'character',
        combatant_2_id: combatant2Id,
        battle_type: battleType,
        winner_combatant_id: winnerCombatantId,
        winning_mythology_id: winningMythologyId,
        combat_log: battleResult.combatLog,
        narration: narration,
        narration_style: narrationStyle,
        event_id: eventId || null,
        initiated_by: user.id
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving crossover battle:', saveError);
      // Continue anyway - battle still happened
    }

    // Award points for crossover battle (more than regular battles!)
    const crossoverPoints = 200; // Extra points for crossover battles
    
    try {
      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      // Update points
      await supabase
        .from('profiles')
        .update({ points: (profile?.points || 0) + crossoverPoints })
        .eq('id', user.id);
      
      console.log(`🏆 Awarded ${crossoverPoints} crossover battle points to user ${user.id}`);
    } catch (pointsError) {
      console.error('Error awarding crossover points:', pointsError);
    }

    // Get max HP for percentage calculations
    const maxHp1 = combatant1.stats.maxHp;
    const maxHp2 = combatant2.stats.maxHp;

    // Transform combatLog to rounds format expected by frontend
    // Track HP consistently for each combatant (not swapping based on attacker/defender)
    const rounds = battleResult.combatLog.map((action) => {
      // Determine which combatant is attacker in this action
      const isC1Attacker = action.attackerId === combatant1.id;
      
      // Calculate HP percentages - always relative to the same combatant
      const combatant1Hp = isC1Attacker 
        ? Math.round((action.attackerHpAfter / maxHp1) * 100)
        : Math.round((action.defenderHpAfter / maxHp1) * 100);
      const combatant2Hp = isC1Attacker 
        ? Math.round((action.defenderHpAfter / maxHp2) * 100)
        : Math.round((action.attackerHpAfter / maxHp2) * 100);
      
      return {
        round: action.round,
        attacker: action.attackerName,
        defender: action.defenderName,
        damage: action.damage,
        // Use consistent combatant HP tracking
        attackerHp: combatant1Hp,
        defenderHp: combatant2Hp,
        isSpecial: action.actionType === 'special',
        isCritical: action.actionType === 'critical',
        isDodged: action.actionType === 'dodge',
        description: action.description
      };
    });

    return NextResponse.json({
      battle: {
        id: savedBattle?.id,
        mythology1: mythology1,
        mythology2: mythology2,
        combatant1: {
          ...combatant1,
          mythologyName: mythology1?.name
        },
        combatant2: {
          ...combatant2,
          mythologyName: mythology2?.name
        },
        result: {
          rounds,
          winner: battleResult.winnerId ? { 
            id: battleResult.winnerId, 
            name: battleResult.winnerName 
          } : null,
          totalRounds: battleResult.totalRounds,
          combatant1FinalHp: battleResult.combatant1FinalHp,
          combatant2FinalHp: battleResult.combatant2FinalHp
        },
        narration,
        winningMythologyId
      }
    });
  } catch (error) {
    console.error('Error in POST /api/crossovers/battles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/crossovers/battles - Get crossover battle history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mythologyId = searchParams.get('mythologyId');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('crossover_battles')
      .select(`
        *,
        mythology_1:mythologies!crossover_battles_mythology_1_id_fkey(id, name),
        mythology_2:mythologies!crossover_battles_mythology_2_id_fkey(id, name),
        initiator:profiles!crossover_battles_initiated_by_fkey(id, display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (mythologyId) {
      query = query.or(`mythology_1_id.eq.${mythologyId},mythology_2_id.eq.${mythologyId}`);
    }

    const { data: battles, error } = await query;

    if (error) {
      console.error('Error fetching crossover battles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ battles });
  } catch (error) {
    console.error('Error in GET /api/crossovers/battles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
