// Math Quiz Types
// TypeScript interfaces for the math quiz system

export interface MathProblem {
  problem: string;
  answer: number | string;
  hint: string;
  diagram?: string; // SVG diagram for visual problems
}

export interface MathTypeConfig {
  id: string;
  name: string;
  description: string;
  difficulty: number; // 1-10
  stars: string; // e.g., '⭐⭐⭐'
  reward: number; // coins (not used in our system, but kept for compatibility)
  xpReward: number; // not used, but kept for compatibility
  gradeLevel: GradeLevel;
  category: MathCategory;
  generate: () => MathProblem;
  check: (userAnswer: string, correctAnswer: number | string) => boolean;
}

export type GradeLevel = 
  | 'Elementary'
  | 'Middle School'
  | '6th Grade'
  | 'High School'
  | 'Advanced High School';

export type MathCategory = 
  | 'arithmetic'
  | 'fractions'
  | 'algebra'
  | 'geometry'
  | 'ratios'
  | 'percents'
  | 'statistics';

export interface QuizSession {
  userId: string;
  mathType: string;
  currentProblem: MathProblem | null;
  correctAnswers: number;
  streak: number;
  tokensEarned: number;
  questionsAnswered: number;
}

export interface QuizAttempt {
  id?: string;
  userId: string;
  mathType: string;
  problem: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  tokensEarned: number;
  streakAtTime: number;
  createdAt?: string;
}

export interface UserQuizProgress {
  userId: string;
  imageTokens: number;
  totalImagesGenerated: number;
  quizStreak: number;
  disabledMathTopics: string[];
  imagesGeneratedToday: number;
  lastImageGenerationDate: string | null;
}

export interface ClassImageSettings {
  classId: string;
  imageGenEnabled: boolean;
  requireApproval: boolean;
  freeImageCount: number;
  questionsPerToken: number;
  allowedMathTopics: string[];
  blockedMathTopics: string[];
  dailyLimitPerStudent: number;
}

// Streak bonus configuration
export const STREAK_BONUSES = {
  5: 2,   // 5 correct in a row = 2 tokens instead of 1
  10: 3,  // 10 correct in a row = 3 tokens
  15: 4,  // 15+ correct in a row = 4 tokens
} as const;

// Default settings
export const DEFAULT_FREE_IMAGES = 5;
export const DEFAULT_QUESTIONS_PER_TOKEN = 3;
export const DEFAULT_DAILY_LIMIT = 3;
