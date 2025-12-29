// Battle Simulation Engine for Phase 2D
// Handles turn-based combat between characters and creatures

export interface CombatStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAbility?: string;
  specialDamage: number;
}

export interface Combatant {
  id: string;
  name: string;
  type: 'character' | 'creature';
  entityType: string; // character_type or creature_type
  stats: CombatStats;
  domain?: string;
  abilities?: string;
  description?: string;
}

export interface BattleAction {
  round: number;
  attackerId: string;
  attackerName: string;
  defenderId: string;
  defenderName: string;
  actionType: 'attack' | 'special' | 'dodge' | 'critical';
  damage: number;
  attackerHpAfter: number;
  defenderHpAfter: number;
  description: string;
}

export interface BattleResult {
  winnerId: string | null;
  winnerName: string | null;
  winnerType: 'character' | 'creature' | 'draw';
  totalRounds: number;
  combatLog: BattleAction[];
  combatant1FinalHp: number;
  combatant2FinalHp: number;
}

export type BattleType = 'duel' | 'honor_combat' | 'ambush' | 'divine_contest' | 'tournament';
export type NarrationStyle = 'epic' | 'comedic' | 'tragic' | 'dramatic' | 'poetic';

// Combat constants
const CRITICAL_HIT_CHANCE = 0.15; // 15% chance
const CRITICAL_HIT_MULTIPLIER = 2.0;
const SPECIAL_ABILITY_CHANCE = 0.25; // 25% chance to use special
const DODGE_CHANCE_BASE = 0.10; // 10% base, increases with speed difference
const MAX_ROUNDS = 50; // Prevent infinite battles
const MINIMUM_DAMAGE = 1; // Always deal at least 1 damage

/**
 * Calculate damage dealt based on attack vs defense
 * Formula: damage = attack * (100 / (100 + defense)) * variance
 */
function calculateDamage(attack: number, defense: number, isCritical: boolean): number {
  const baseMultiplier = 100 / (100 + defense);
  const variance = 0.8 + Math.random() * 0.4; // 80% to 120% variance
  let damage = Math.floor(attack * baseMultiplier * variance);
  
  if (isCritical) {
    damage = Math.floor(damage * CRITICAL_HIT_MULTIPLIER);
  }
  
  return Math.max(MINIMUM_DAMAGE, damage);
}

/**
 * Calculate dodge chance based on speed difference
 */
function calculateDodgeChance(defenderSpeed: number, attackerSpeed: number): number {
  const speedDiff = defenderSpeed - attackerSpeed;
  const bonusChance = Math.max(0, speedDiff * 0.02); // 2% per speed point difference
  return Math.min(0.35, DODGE_CHANCE_BASE + bonusChance); // Cap at 35%
}

/**
 * Generate action description for combat log
 */
function generateActionDescription(
  attacker: Combatant,
  defender: Combatant,
  actionType: BattleAction['actionType'],
  damage: number
): string {
  const attackerName = attacker.name;
  const defenderName = defender.name;
  
  switch (actionType) {
    case 'critical':
      return `${attackerName} lands a devastating critical hit on ${defenderName} for ${damage} damage!`;
    case 'special':
      const ability = attacker.stats.specialAbility || 'special ability';
      return `${attackerName} unleashes ${ability} against ${defenderName} for ${damage} damage!`;
    case 'dodge':
      return `${defenderName} swiftly dodges ${attackerName}'s attack!`;
    case 'attack':
    default:
      return `${attackerName} strikes ${defenderName} for ${damage} damage.`;
  }
}

/**
 * Execute a single combat round
 */
function executeRound(
  attacker: Combatant,
  defender: Combatant,
  round: number,
  attackerCurrentHp: number,
  defenderCurrentHp: number
): { action: BattleAction; newAttackerHp: number; newDefenderHp: number } {
  
  // Check for dodge
  const dodgeChance = calculateDodgeChance(defender.stats.speed, attacker.stats.speed);
  if (Math.random() < dodgeChance) {
    const action: BattleAction = {
      round,
      attackerId: attacker.id,
      attackerName: attacker.name,
      defenderId: defender.id,
      defenderName: defender.name,
      actionType: 'dodge',
      damage: 0,
      attackerHpAfter: attackerCurrentHp,
      defenderHpAfter: defenderCurrentHp,
      description: generateActionDescription(attacker, defender, 'dodge', 0)
    };
    return { action, newAttackerHp: attackerCurrentHp, newDefenderHp: defenderCurrentHp };
  }
  
  // Determine attack type
  const isCritical = Math.random() < CRITICAL_HIT_CHANCE;
  const useSpecial = Math.random() < SPECIAL_ABILITY_CHANCE && attacker.stats.specialAbility;
  
  let actionType: BattleAction['actionType'] = 'attack';
  let attackPower = attacker.stats.attack;
  
  if (useSpecial) {
    actionType = 'special';
    attackPower = attacker.stats.specialDamage;
  } else if (isCritical) {
    actionType = 'critical';
  }
  
  // Calculate damage
  const damage = calculateDamage(attackPower, defender.stats.defense, isCritical && !useSpecial);
  const newDefenderHp = Math.max(0, defenderCurrentHp - damage);
  
  const action: BattleAction = {
    round,
    attackerId: attacker.id,
    attackerName: attacker.name,
    defenderId: defender.id,
    defenderName: defender.name,
    actionType,
    damage,
    attackerHpAfter: attackerCurrentHp,
    defenderHpAfter: newDefenderHp,
    description: generateActionDescription(attacker, defender, actionType, damage)
  };
  
  return { action, newAttackerHp: attackerCurrentHp, newDefenderHp };
}

/**
 * Run a full battle simulation between two combatants
 */
export function simulateBattle(
  combatant1: Combatant,
  combatant2: Combatant,
  battleType: BattleType = 'duel'
): BattleResult {
  const combatLog: BattleAction[] = [];
  
  // Initialize HP
  let hp1 = combatant1.stats.maxHp;
  let hp2 = combatant2.stats.maxHp;
  
  // Apply battle type modifiers
  if (battleType === 'ambush') {
    // Ambusher (combatant1) gets a free attack
    const { action, newDefenderHp } = executeRound(combatant1, combatant2, 0, hp1, hp2);
    action.description = `AMBUSH! ${action.description}`;
    combatLog.push(action);
    hp2 = newDefenderHp;
  } else if (battleType === 'divine_contest') {
    // Gods get 25% stat boost in divine contests
    if (combatant1.entityType === 'god') {
      hp1 = Math.floor(hp1 * 1.25);
      combatant1.stats.attack = Math.floor(combatant1.stats.attack * 1.25);
    }
    if (combatant2.entityType === 'god') {
      hp2 = Math.floor(hp2 * 1.25);
      combatant2.stats.attack = Math.floor(combatant2.stats.attack * 1.25);
    }
  }
  
  // Determine turn order by speed (higher goes first)
  const firstAttacker = combatant1.stats.speed >= combatant2.stats.speed ? combatant1 : combatant2;
  const secondAttacker = firstAttacker === combatant1 ? combatant2 : combatant1;
  let firstHp = firstAttacker === combatant1 ? hp1 : hp2;
  let secondHp = secondAttacker === combatant1 ? hp1 : hp2;
  
  let round = battleType === 'ambush' ? 1 : 1;
  
  // Battle loop
  while (firstHp > 0 && secondHp > 0 && round <= MAX_ROUNDS) {
    // First attacker's turn
    const result1 = executeRound(firstAttacker, secondAttacker, round, firstHp, secondHp);
    combatLog.push(result1.action);
    secondHp = result1.newDefenderHp;
    
    // Check if second attacker is defeated
    if (secondHp <= 0) break;
    
    // Second attacker's turn
    const result2 = executeRound(secondAttacker, firstAttacker, round, secondHp, firstHp);
    combatLog.push(result2.action);
    firstHp = result2.newDefenderHp;
    
    round++;
  }
  
  // Determine winner
  let winnerId: string | null = null;
  let winnerName: string | null = null;
  let winnerType: 'character' | 'creature' | 'draw' = 'draw';
  
  // Map back to original combatants
  const finalHp1 = firstAttacker === combatant1 ? firstHp : secondHp;
  const finalHp2 = firstAttacker === combatant1 ? secondHp : firstHp;
  
  if (finalHp1 > 0 && finalHp2 <= 0) {
    winnerId = combatant1.id;
    winnerName = combatant1.name;
    winnerType = combatant1.type;
  } else if (finalHp2 > 0 && finalHp1 <= 0) {
    winnerId = combatant2.id;
    winnerName = combatant2.name;
    winnerType = combatant2.type;
  } else if (finalHp1 > finalHp2) {
    // Tiebreaker: whoever has more HP wins
    winnerId = combatant1.id;
    winnerName = combatant1.name;
    winnerType = combatant1.type;
  } else if (finalHp2 > finalHp1) {
    winnerId = combatant2.id;
    winnerName = combatant2.name;
    winnerType = combatant2.type;
  }
  // If still tied, it's a draw
  
  return {
    winnerId,
    winnerName,
    winnerType,
    totalRounds: round,
    combatLog,
    combatant1FinalHp: finalHp1,
    combatant2FinalHp: finalHp2
  };
}

/**
 * Create combatant from character data
 * Calculates combat stats based on character_type if not already set
 */
export function createCombatantFromCharacter(character: {
  id: string;
  name: string;
  character_type: string;
  domain?: string;
  powers_abilities?: string;
  powers?: string[];
  description?: string;
  combat_hp?: number;
  combat_attack?: number;
  combat_defense?: number;
  combat_speed?: number;
  combat_special_ability?: string;
  combat_special_damage?: number;
}): Combatant {
  // Use stored stats or calculate based on character type
  const typeStats = getCharacterTypeStatBonus(character.character_type?.toLowerCase() || 'mortal');
  const hp = character.combat_hp || typeStats.hp;
  const attack = character.combat_attack || typeStats.attack;
  const defense = character.combat_defense || typeStats.defense;
  const speed = character.combat_speed || typeStats.speed;
  
  // Get special ability from powers array or powers_abilities string
  let specialAbility = character.combat_special_ability;
  if (!specialAbility) {
    if (character.powers && character.powers.length > 0) {
      specialAbility = character.powers[0];
    } else if (character.powers_abilities) {
      specialAbility = character.powers_abilities.split(',')[0]?.trim();
    } else {
      specialAbility = `${character.character_type || 'Mortal'} Strike`;
    }
  }
  
  return {
    id: character.id,
    name: character.name,
    type: 'character',
    entityType: character.character_type,
    domain: character.domain,
    abilities: character.powers_abilities,
    description: character.description,
    stats: {
      hp,
      maxHp: hp,
      attack,
      defense,
      speed,
      specialAbility,
      specialDamage: character.combat_special_damage || Math.floor(attack * 1.5)
    }
  };
}

/**
 * Create combatant from creature data
 * Calculates combat stats based on danger_level if not already set
 */
export function createCombatantFromCreature(creature: {
  id: string;
  name: string;
  creature_type: string;
  danger_level?: string | number;
  abilities?: string | string[];
  description?: string;
  combat_hp?: number;
  combat_attack?: number;
  combat_defense?: number;
  combat_speed?: number;
  combat_special_ability?: string;
  combat_special_damage?: number;
}): Combatant {
  // Use stored stats or calculate based on danger level
  const dangerLevelStr = typeof creature.danger_level === 'number' 
    ? String(creature.danger_level) 
    : creature.danger_level?.toLowerCase() || 'dangerous';
  const dangerStats = getCreatureDangerStatBonus(dangerLevelStr);
  const hp = creature.combat_hp || dangerStats.hp;
  const attack = creature.combat_attack || dangerStats.attack;
  const defense = creature.combat_defense || dangerStats.defense;
  const speed = creature.combat_speed || dangerStats.speed;
  
  // Get special ability from abilities array or string
  let specialAbility = creature.combat_special_ability;
  if (!specialAbility) {
    if (Array.isArray(creature.abilities) && creature.abilities.length > 0) {
      specialAbility = creature.abilities[0];
    } else if (typeof creature.abilities === 'string') {
      specialAbility = creature.abilities.split(',')[0]?.trim();
    } else {
      specialAbility = `${creature.creature_type || 'Creature'} Attack`;
    }
  }
  
  return {
    id: creature.id,
    name: creature.name,
    type: 'creature',
    entityType: creature.creature_type,
    abilities: Array.isArray(creature.abilities) ? creature.abilities.join(', ') : creature.abilities,
    description: creature.description,
    stats: {
      hp,
      maxHp: hp,
      attack,
      defense,
      speed,
      specialAbility,
      specialDamage: creature.combat_special_damage || Math.floor(attack * 1.5)
    }
  };
}

/**
 * Get stat scaling based on character type
 */
export function getCharacterTypeStatBonus(characterType: string): {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
} {
  const bonuses: Record<string, { hp: number; attack: number; defense: number; speed: number }> = {
    god: { hp: 200, attack: 25, defense: 20, speed: 15 },
    demigod: { hp: 150, attack: 18, defense: 15, speed: 14 },
    hero: { hp: 120, attack: 15, defense: 12, speed: 12 },
    spirit: { hp: 100, attack: 12, defense: 8, speed: 18 },
    legendary_figure: { hp: 110, attack: 14, defense: 11, speed: 11 },
    founder: { hp: 100, attack: 12, defense: 14, speed: 10 },
    mortal: { hp: 80, attack: 8, defense: 8, speed: 10 },
    other: { hp: 100, attack: 10, defense: 10, speed: 10 }
  };
  
  return bonuses[characterType] || bonuses.other;
}

/**
 * Get stat scaling based on creature danger level
 */
export function getCreatureDangerStatBonus(dangerLevel: string): {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
} {
  const bonuses: Record<string, { hp: number; attack: number; defense: number; speed: number }> = {
    harmless: { hp: 50, attack: 5, defense: 5, speed: 8 },
    minor_threat: { hp: 80, attack: 10, defense: 8, speed: 10 },
    dangerous: { hp: 120, attack: 15, defense: 12, speed: 12 },
    deadly: { hp: 160, attack: 20, defense: 16, speed: 14 },
    catastrophic: { hp: 250, attack: 30, defense: 25, speed: 12 }
  };
  
  return bonuses[dangerLevel] || bonuses.dangerous;
}
