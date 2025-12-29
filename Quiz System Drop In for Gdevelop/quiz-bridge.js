// ===================================================================
// QUIZ BRIDGE - Connects Your Existing Quiz System to GDevelop
// ===================================================================
// This file IMPORTS your existing mathTypes.js without changing it
// Then provides GDevelop-friendly wrapper functions

// ========== STEP 1: LOAD YOUR EXISTING MATHTYPES.JS ==========
// When you add this to GDevelop, you'll need to include BOTH files:
// 1. mathTypes.js (your existing file - UNCHANGED)
// 2. quiz-bridge.js (this file)

// Your mathTypes.js should already be loaded at this point
// It exports: MATH_TYPES, getMathType, generateProblem, checkAnswer

// ========== STEP 2: GDEVELOP BRIDGE WRAPPER ==========
// These functions wrap YOUR existing functions for GDevelop

window.QuizBridge = {
    currentProblem: null,
    currentMathType: 'mult-1-12', // Default
    streak: 0,
    
    /**
     * Initialize the quiz system
     */
    init: function() {
        console.log('🎯 Quiz Bridge initialized!');
        if (typeof MATH_TYPES === 'undefined') {
            console.error('❌ ERROR: mathTypes.js not loaded! Make sure to include it BEFORE quiz-bridge.js');
            return false;
        }
        console.log(`📚 Available math types: ${Object.keys(MATH_TYPES).length}`);
        return true;
    },
    
    /**
     * Set the current math type
     */
    setMathType: function(mathTypeId) {
        if (typeof getMathType === 'undefined') {
            console.error('❌ getMathType function not found!');
            return false;
        }
        
        const mathType = getMathType(mathTypeId);
        if (mathType) {
            this.currentMathType = mathTypeId;
            console.log(`📝 Math type changed to: ${mathTypeId}`);
            return true;
        }
        console.warn(`⚠️ Math type not found: ${mathTypeId}`);
        return false;
    },
    
    /**
     * Generate a new problem using YOUR existing generateProblem function
     */
    generateProblem: function() {
        if (typeof generateProblem === 'undefined') {
            console.error('❌ generateProblem function not found!');
            return null;
        }
        
        // Call YOUR existing function - no changes!
        this.currentProblem = generateProblem(this.currentMathType);
        
        console.log(`📝 New problem: ${this.currentProblem.problem}`);
        return this.currentProblem;
    },
    
    /**
     * Check user's answer using YOUR existing checkAnswer function
     */
    checkAnswer: function(userAnswer) {
        if (!this.currentProblem) {
            console.warn('⚠️ No current problem to check!');
            return false;
        }
        
        if (typeof checkAnswer === 'undefined') {
            console.error('❌ checkAnswer function not found!');
            return false;
        }
        
        // Call YOUR existing function - no changes!
        const isCorrect = checkAnswer(
            userAnswer, 
            this.currentProblem.answer, 
            this.currentMathType
        );
        
        // Track streak here (since GDevelop will use this)
        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
        }
        
        console.log(`${isCorrect ? '✅' : '❌'} Answer: ${userAnswer} (Correct: ${this.currentProblem.answer})`);
        return isCorrect;
    },
    
    /**
     * Get the current problem text
     */
    getProblemText: function() {
        return this.currentProblem ? this.currentProblem.problem : 'No problem loaded';
    },
    
    /**
     * Get the hint text
     */
    getHint: function() {
        return this.currentProblem ? this.currentProblem.hint : 'No hint available';
    },
    
    /**
     * Get the correct answer
     */
    getCorrectAnswer: function() {
        return this.currentProblem ? this.currentProblem.answer : '';
    },
    
    /**
     * Get coin reward for current problem
     */
    getReward: function() {
        return this.currentProblem ? this.currentProblem.reward : 0;
    },
    
    /**
     * Get XP reward for current problem
     */
    getXPReward: function() {
        return this.currentProblem ? this.currentProblem.xpReward : 0;
    },
    
    /**
     * Get current streak
     */
    getStreak: function() {
        return this.streak;
    },
    
    /**
     * Reset streak (useful for quiz close)
     */
    resetStreak: function() {
        this.streak = 0;
    },
    
    /**
     * Get list of all available math types
     */
    getAvailableMathTypes: function() {
        if (typeof MATH_TYPES === 'undefined') {
            return [];
        }
        
        return Object.keys(MATH_TYPES).map(id => {
            const mt = MATH_TYPES[id];
            return {
                id: mt.id,
                name: mt.name,
                description: mt.description,
                difficulty: mt.difficulty,
                stars: mt.stars,
                gradeLevel: mt.gradeLevel,
                category: mt.category
            };
        });
    }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    window.QuizBridge.init();
}

console.log('🚀 Quiz Bridge loaded and ready!');
