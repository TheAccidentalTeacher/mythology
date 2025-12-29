// Gamification Configuration
// Points values, level requirements, and badge definitions

export const POINT_VALUES = {
  // Creation actions
  CHARACTER_CREATED: 50,
  CREATURE_CREATED: 75,
  STORY_COMPLETED: 100,
  MAP_CREATED: 100,
  REALM_CREATED: 75,
  
  // Battle actions
  BATTLE_PARTICIPATED: 50,
  BATTLE_WON: 25, // Bonus on top of participation
  
  // Crossover actions
  CROSSOVER_COMPLETED: 200,
  ALLIANCE_FORMED: 150,
  COLLABORATIVE_STORY: 150,
  
  // Engagement actions
  DAILY_LOGIN: 5,
  PEER_REVIEW: 25,
  
  // Bonus actions
  TEACHER_BONUS: 50, // Adjustable by teacher
  BADGE_EARNED: 0, // Badges give their own points
  STREAK_MILESTONE: 50,
  CHALLENGE_COMPLETED: 10,
  
  // Quality actions
  PEER_FAVORITE: 10, // When someone favorites your work
  FEATURED_WORK: 100, // Teacher features your work
};

export const LEVEL_THRESHOLDS = {
  // Points required to reach each level
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 3800,
  11: 4700,
  12: 5700,
  13: 6800,
  14: 8000,
  15: 9300,
  16: 10700,
  17: 12200,
  18: 13800,
  19: 15500,
  20: 17300,
  // Each level after 20 requires 2000 more points
};

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice Mythmaker',
  2: 'Novice Mythmaker',
  3: 'Novice Mythmaker',
  4: 'Novice Mythmaker',
  5: 'Novice Mythmaker',
  6: 'Apprentice Creator',
  7: 'Apprentice Creator',
  8: 'Apprentice Creator',
  9: 'Apprentice Creator',
  10: 'Apprentice Creator',
  11: 'Skilled Storyteller',
  12: 'Skilled Storyteller',
  13: 'Skilled Storyteller',
  14: 'Skilled Storyteller',
  15: 'Skilled Storyteller',
  16: 'Master Worldbuilder',
  17: 'Master Worldbuilder',
  18: 'Master Worldbuilder',
  19: 'Master Worldbuilder',
  20: 'Master Worldbuilder',
  21: 'Legendary Architect',
  25: 'Legendary Architect',
  30: 'Legendary Architect',
  31: 'God of Gods',
  50: 'God of Gods',
};

export function getLevelTitle(level: number): string {
  // Find the highest matching title
  const levels = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const l of levels) {
    if (level >= l) {
      return LEVEL_TITLES[l];
    }
  }
  return 'Novice Mythmaker';
}

export function calculateLevel(totalPoints: number): number {
  const thresholds = Object.entries(LEVEL_THRESHOLDS)
    .map(([level, points]) => ({ level: Number(level), points }))
    .sort((a, b) => b.points - a.points);
  
  for (const { level, points } of thresholds) {
    if (totalPoints >= points) {
      // For levels beyond 20
      if (level === 20 && totalPoints > LEVEL_THRESHOLDS[20]) {
        const extraPoints = totalPoints - LEVEL_THRESHOLDS[20];
        return 20 + Math.floor(extraPoints / 2000);
      }
      return level;
    }
  }
  return 1;
}

export function getXpToNextLevel(totalPoints: number): { current: number; needed: number; percentage: number } {
  const currentLevel = calculateLevel(totalPoints);
  const nextLevel = currentLevel + 1;
  
  let currentLevelPoints = LEVEL_THRESHOLDS[currentLevel as keyof typeof LEVEL_THRESHOLDS] || 0;
  let nextLevelPoints: number;
  
  if (currentLevel >= 20) {
    currentLevelPoints = LEVEL_THRESHOLDS[20] + (currentLevel - 20) * 2000;
    nextLevelPoints = currentLevelPoints + 2000;
  } else {
    nextLevelPoints = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS] || currentLevelPoints + 500;
  }
  
  const pointsIntoLevel = totalPoints - currentLevelPoints;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  const percentage = Math.min(100, Math.floor((pointsIntoLevel / pointsNeeded) * 100));
  
  return {
    current: pointsIntoLevel,
    needed: pointsNeeded,
    percentage,
  };
}

// Badge Categories
export const BADGE_CATEGORIES = [
  { id: 'creation', name: 'Creation', icon: '✨', description: 'Earned by creating content' },
  { id: 'battle', name: 'Battle', icon: '⚔️', description: 'Earned through combat' },
  { id: 'collaboration', name: 'Collaboration', icon: '🤝', description: 'Earned by working with others' },
  { id: 'streak', name: 'Dedication', icon: '🔥', description: 'Earned through consistency' },
  { id: 'quality', name: 'Quality', icon: '⭐', description: 'Earned by excellence' },
  { id: 'special', name: 'Special', icon: '🏆', description: 'Unique achievements' },
];

// Rarity colors
export const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  uncommon: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-400' },
  rare: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400' },
  epic: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-400' },
  legendary: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' },
};

// Streak milestones
export const STREAK_MILESTONES = [
  { days: 3, name: 'Getting Started', reward: 50 },
  { days: 7, name: 'Week Warrior', reward: 100 },
  { days: 14, name: 'Two Week Champion', reward: 200 },
  { days: 30, name: 'Monthly Master', reward: 500 },
  { days: 60, name: 'Unstoppable', reward: 1000 },
  { days: 100, name: 'Legendary Dedication', reward: 2000 },
];

// Action type descriptions (for points log display)
export const ACTION_DESCRIPTIONS: Record<string, string> = {
  character_created: 'Created a character',
  creature_created: 'Created a creature',
  story_completed: 'Completed a story',
  map_created: 'Created a map',
  realm_created: 'Created a realm',
  battle_participated: 'Participated in battle',
  battle_won: 'Won a battle (bonus)',
  crossover_completed: 'Completed a crossover',
  alliance_formed: 'Formed an alliance',
  collaborative_story: 'Wrote collaborative story',
  daily_login: 'Daily login',
  peer_review: 'Gave peer feedback',
  teacher_bonus: 'Teacher bonus',
  badge_earned: 'Earned a badge',
  streak_milestone: 'Streak milestone reached',
  challenge_completed: 'Completed daily challenge',
  peer_favorite: 'Content favorited by peer',
  featured_work: 'Work featured by teacher',
};
