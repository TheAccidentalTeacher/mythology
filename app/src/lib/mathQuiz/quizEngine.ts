// Quiz Engine - Handles quiz sessions, streaks, and token awards
import { 
  QuizSession, 
  QuizAttempt, 
  STREAK_BONUSES, 
  DEFAULT_QUESTIONS_PER_TOKEN 
} from './types';
import { 
  MATH_TYPES, 
  getMathType, 
  generateProblem, 
  checkAnswer,
  getAllMathTypes 
} from './mathTypes';

export class QuizEngine {
  private session: QuizSession;
  private questionsPerToken: number;
  private disabledTopics: string[];

  constructor(
    userId: string, 
    questionsPerToken: number = DEFAULT_QUESTIONS_PER_TOKEN,
    disabledTopics: string[] = []
  ) {
    this.session = {
      userId,
      mathType: 'mult-1-12', // Default
      currentProblem: null,
      correctAnswers: 0,
      streak: 0,
      tokensEarned: 0,
      questionsAnswered: 0,
    };
    this.questionsPerToken = questionsPerToken;
    this.disabledTopics = disabledTopics;
  }

  // Get available math types (excluding disabled ones)
  getAvailableMathTypes() {
    return getAllMathTypes().filter(mt => !this.disabledTopics.includes(mt.id));
  }

  // Set the current math type
  setMathType(mathTypeId: string): boolean {
    if (this.disabledTopics.includes(mathTypeId)) {
      console.warn(`Math type ${mathTypeId} is disabled for this user`);
      return false;
    }
    
    const mathType = getMathType(mathTypeId);
    if (!mathType) {
      console.warn(`Math type ${mathTypeId} not found`);
      return false;
    }
    
    this.session.mathType = mathTypeId;
    return true;
  }

  // Generate a new problem
  generateNewProblem() {
    const result = generateProblem(this.session.mathType);
    if (result) {
      this.session.currentProblem = result;
      return result;
    }
    return null;
  }

  // Generate a random problem from available types
  generateRandomProblem() {
    const availableTypes = this.getAvailableMathTypes();
    if (availableTypes.length === 0) {
      console.warn('No math types available');
      return null;
    }
    
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    this.session.mathType = randomType.id;
    return this.generateNewProblem();
  }

  // Submit an answer and get result
  submitAnswer(userAnswer: string): {
    isCorrect: boolean;
    correctAnswer: number | string;
    streak: number;
    tokensEarned: number;
    totalTokens: number;
    streakBonus: boolean;
    questionsUntilNextToken: number;
  } {
    if (!this.session.currentProblem) {
      throw new Error('No current problem to answer');
    }

    const isCorrect = checkAnswer(
      userAnswer, 
      this.session.currentProblem.answer, 
      this.session.mathType
    );

    this.session.questionsAnswered++;
    let tokensEarnedThisAnswer = 0;
    let streakBonus = false;

    if (isCorrect) {
      this.session.correctAnswers++;
      this.session.streak++;

      // Check if we've earned a token
      if (this.session.correctAnswers % this.questionsPerToken === 0) {
        // Calculate streak bonus
        let bonusMultiplier = 1;
        
        for (const [streakThreshold, bonus] of Object.entries(STREAK_BONUSES)) {
          if (this.session.streak >= parseInt(streakThreshold)) {
            bonusMultiplier = bonus;
            streakBonus = true;
          }
        }
        
        tokensEarnedThisAnswer = bonusMultiplier;
        this.session.tokensEarned += tokensEarnedThisAnswer;
      }
    } else {
      // Wrong answer breaks the streak
      this.session.streak = 0;
    }

    const questionsUntilNextToken = 
      this.questionsPerToken - (this.session.correctAnswers % this.questionsPerToken);

    return {
      isCorrect,
      correctAnswer: this.session.currentProblem.answer,
      streak: this.session.streak,
      tokensEarned: tokensEarnedThisAnswer,
      totalTokens: this.session.tokensEarned,
      streakBonus,
      questionsUntilNextToken: isCorrect && questionsUntilNextToken === this.questionsPerToken 
        ? 0 
        : questionsUntilNextToken,
    };
  }

  // Get current session state
  getSession(): QuizSession {
    return { ...this.session };
  }

  // Get current problem
  getCurrentProblem() {
    return this.session.currentProblem;
  }

  // Get streak
  getStreak(): number {
    return this.session.streak;
  }

  // Get total tokens earned this session
  getTotalTokens(): number {
    return this.session.tokensEarned;
  }

  // Reset session
  resetSession() {
    this.session = {
      ...this.session,
      currentProblem: null,
      correctAnswers: 0,
      streak: 0,
      tokensEarned: 0,
      questionsAnswered: 0,
    };
  }

  // Create a quiz attempt record for database
  createAttemptRecord(userAnswer: string, isCorrect: boolean, tokensEarned: number): QuizAttempt {
    if (!this.session.currentProblem) {
      throw new Error('No current problem');
    }

    return {
      userId: this.session.userId,
      mathType: this.session.mathType,
      problem: this.session.currentProblem.problem,
      userAnswer,
      correctAnswer: String(this.session.currentProblem.answer),
      isCorrect,
      tokensEarned,
      streakAtTime: this.session.streak,
    };
  }
}

// Utility function to calculate streak bonus
export function calculateStreakBonus(streak: number): number {
  let bonus = 1;
  for (const [threshold, multiplier] of Object.entries(STREAK_BONUSES)) {
    if (streak >= parseInt(threshold)) {
      bonus = multiplier;
    }
  }
  return bonus;
}

// Utility function to get streak bonus description
export function getStreakBonusDescription(streak: number): string | null {
  if (streak >= 15) return '🔥🔥🔥 LEGENDARY STREAK! 4x tokens!';
  if (streak >= 10) return '🔥🔥 AMAZING STREAK! 3x tokens!';
  if (streak >= 5) return '🔥 HOT STREAK! 2x tokens!';
  return null;
}

export default QuizEngine;
