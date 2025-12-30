import { ActivityStandardMapping, ActivityType, SubjectArea, GradeLevel } from './types';

// ============================================================================
// ACTIVITY-TO-STANDARDS MAPPINGS
// Maps each activity in the platform to relevant Alaska and Common Core standards
// ============================================================================

export const ACTIVITY_STANDARD_MAPPINGS: ActivityStandardMapping[] = [
  // ---------------------------------------------------------------------------
  // MYTHOLOGY CREATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'mythology-creation',
    activityName: 'Mythology Creation',
    activityDescription: 'Create custom mythologies with origin stories, deities, and cultural practices',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A2', 'AK-CULT-A6',  // Cultural traditions
      'AK-CULT-B1', 'AK-CULT-B3',  // Local knowledge
      'AK-CULT-E1', 'AK-CULT-E5',  // World connections
      // Alaska ELA Standards
      'AK-ELA-W6-3', 'AK-ELA-W6-3a', 'AK-ELA-W6-3b', 'AK-ELA-W6-3d',  // Narrative writing
      'AK-ELA-W6-4', 'AK-ELA-W6-5',  // Writing process
      'AK-ELA-L6-5',  // Figurative language
      'AK-ELA-RL6-2', 'AK-ELA-RL6-9',  // Theme and comparison
    ],
    primarySubjects: ['ela', 'cultural', 'social-studies'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // CHARACTER CREATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'character-creation',
    activityName: 'Character Creation',
    activityDescription: 'Design mythological characters including gods, heroes, and creatures',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A6',  // Cultural heroes and stories
      'AK-CULT-B1',  // Traditional knowledge
      // Alaska ELA Standards
      'AK-ELA-W6-3', 'AK-ELA-W6-3a', 'AK-ELA-W6-3b',  // Character development
      'AK-ELA-W6-3d',  // Descriptive details
      'AK-ELA-RL6-3',  // Character analysis
      'AK-ELA-L6-5',  // Figurative language
    ],
    primarySubjects: ['ela', 'cultural'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // CREATURE CREATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'creature-creation',
    activityName: 'Creature Creation',
    activityDescription: 'Design mythological creatures and beasts with unique characteristics',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A6',  // Cultural creatures and stories
      'AK-CULT-B1',  // Traditional knowledge
      'AK-CULT-E2',  // Ecological understanding
      // Alaska ELA Standards
      'AK-ELA-W6-3', 'AK-ELA-W6-3b',  // Narrative development
      'AK-ELA-W6-3d',  // Descriptive details
      'AK-ELA-L6-5',  // Figurative language
    ],
    primarySubjects: ['ela', 'cultural'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // STORY WRITING
  // ---------------------------------------------------------------------------
  {
    activityType: 'story-writing',
    activityName: 'Story Writing',
    activityDescription: 'Write original myths and stories within created mythologies',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A2',  // Storytelling traditions
      'AK-CULT-D1', 'AK-CULT-D5',  // Traditional learning methods
      // Alaska ELA Standards
      'AK-ELA-W6-3', 'AK-ELA-W6-3a', 'AK-ELA-W6-3b', 'AK-ELA-W6-3d',
      'AK-ELA-W7-3', 'AK-ELA-W8-3',  // All narrative writing standards
      'AK-ELA-W6-4', 'AK-ELA-W6-5', 'AK-ELA-W6-6',  // Writing process
      'AK-ELA-L6-1', 'AK-ELA-L6-2', 'AK-ELA-L6-3',  // Language conventions
      'AK-ELA-L6-5',  // Figurative language
    ],
    primarySubjects: ['ela', 'cultural'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // STORY PRESENTATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'story-presentation',
    activityName: 'Story Presentation',
    activityDescription: 'Present and share created stories with multimedia elements',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1',  // Oral storytelling
      'AK-CULT-D1',  // Traditional presentations
      // Alaska ELA Standards
      'AK-ELA-SL6-1',  // Collaborative discussions
      'AK-ELA-SL6-4',  // Present claims and findings
      'AK-ELA-SL6-5',  // Multimedia components
      'AK-ELA-W6-6',  // Technology use
    ],
    primarySubjects: ['ela', 'technology'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // WORLD BUILDING
  // ---------------------------------------------------------------------------
  {
    activityType: 'world-building',
    activityName: 'World Building',
    activityDescription: 'Create detailed mythological worlds with geography, climate, and cultures',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-B2', 'AK-CULT-B3',  // Regional knowledge
      'AK-CULT-E2', 'AK-CULT-E3',  // Ecological understanding
      'AK-CULT-E1', 'AK-CULT-E5',  // Cultural connections
      // Alaska ELA Standards
      'AK-ELA-W6-3d',  // Descriptive details
      'AK-ELA-W6-4',  // Clear writing
    ],
    primarySubjects: ['geography', 'social-studies', 'cultural'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // CULTURAL COMPARISON
  // ---------------------------------------------------------------------------
  {
    activityType: 'cultural-comparison',
    activityName: 'Cultural Comparison',
    activityDescription: 'Compare and analyze mythologies across different cultures',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A3', 'AK-CULT-A4',  // Cultural diversity
      'AK-CULT-E4', 'AK-CULT-E5',  // Cross-cultural understanding
      // Alaska ELA Standards
      'AK-ELA-RL6-9',  // Compare texts
      'AK-ELA-RL6-2',  // Theme analysis
      'AK-ELA-SL6-1',  // Collaborative discussions
    ],
    primarySubjects: ['cultural', 'social-studies', 'ela'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Basic Operations
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz',
    activityName: 'Math Quiz - Basic Operations',
    activityDescription: 'Practice addition, subtraction, multiplication, and division with mythological themes',
    standardIds: [
      // Alaska Math Standards - Number System
      'AK-MATH-6NS-2', 'AK-MATH-6NS-3',  // Multi-digit operations, decimals
      'AK-MATH-7NS-1', 'AK-MATH-7NS-2', 'AK-MATH-7NS-3',  // Rational number operations
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Fractions
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-fractions',
    activityName: 'Math Quiz - Fractions',
    activityDescription: 'Master fraction operations including addition, subtraction, multiplication, and division',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6NS-1',  // Division of fractions
      'AK-MATH-7NS-1', 'AK-MATH-7NS-2',  // Add/subtract/multiply/divide rationals
      'AK-MATH-7NS-3',  // Real-world fraction problems
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Decimals and Percents
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-decimals',
    activityName: 'Math Quiz - Decimals & Percents',
    activityDescription: 'Work with decimals, percentages, and their conversions',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6NS-3',  // Decimal operations
      'AK-MATH-6RP-3c',  // Percent problems
      'AK-MATH-7RP-3',  // Multi-step percent problems
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Ratios and Proportions
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-ratios',
    activityName: 'Math Quiz - Ratios & Proportions',
    activityDescription: 'Understand and apply ratios, rates, and proportional relationships',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6RP-1', 'AK-MATH-6RP-2', 'AK-MATH-6RP-3',  // Grade 6 ratios
      'AK-MATH-7RP-1', 'AK-MATH-7RP-2', 'AK-MATH-7RP-3',  // Grade 7 proportions
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Algebra/Equations
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-algebra',
    activityName: 'Math Quiz - Algebra & Equations',
    activityDescription: 'Solve algebraic expressions, equations, and inequalities',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6EE-1', 'AK-MATH-6EE-2', 'AK-MATH-6EE-3',  // Expressions
      'AK-MATH-6EE-5', 'AK-MATH-6EE-6', 'AK-MATH-6EE-7',  // Equations
      'AK-MATH-7EE-1', 'AK-MATH-7EE-3', 'AK-MATH-7EE-4',  // Linear expressions
      'AK-MATH-8EE-7', 'AK-MATH-8EE-8',  // Linear equations and systems
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Exponents
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-exponents',
    activityName: 'Math Quiz - Exponents',
    activityDescription: 'Work with exponents, powers, and scientific notation',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6EE-1',  // Whole-number exponents
      'AK-MATH-8EE-1',  // Integer exponents
      'AK-MATH-8EE-2',  // Square and cube roots
      'AK-MATH-8EE-3', 'AK-MATH-8EE-4',  // Scientific notation
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Geometry
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-geometry',
    activityName: 'Math Quiz - Geometry',
    activityDescription: 'Calculate area, perimeter, volume, and surface area of shapes',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6G-1', 'AK-MATH-6G-2', 'AK-MATH-6G-4',  // Area, volume, surface area
      'AK-MATH-7G-1', 'AK-MATH-7G-4', 'AK-MATH-7G-5', 'AK-MATH-7G-6',  // Circles, angles, 3D
      'AK-MATH-8G-6', 'AK-MATH-8G-7', 'AK-MATH-8G-8', 'AK-MATH-8G-9',  // Pythagorean theorem, volume
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Statistics
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-statistics',
    activityName: 'Math Quiz - Statistics & Probability',
    activityDescription: 'Analyze data with mean, median, mode, and probability',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-6SP-1', 'AK-MATH-6SP-3', 'AK-MATH-6SP-5',  // Statistics basics
      'AK-MATH-7SP-5', 'AK-MATH-7SP-6',  // Probability
      'AK-MATH-8SP-1', 'AK-MATH-8SP-4',  // Bivariate data
    ],
    primarySubjects: ['math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // MATH QUIZ - Functions
  // ---------------------------------------------------------------------------
  {
    activityType: 'math-quiz-functions',
    activityName: 'Math Quiz - Functions',
    activityDescription: 'Understand and work with linear functions and relationships',
    standardIds: [
      // Alaska Math Standards
      'AK-MATH-8F-1', 'AK-MATH-8F-2', 'AK-MATH-8F-3', 'AK-MATH-8F-4',  // Functions
    ],
    primarySubjects: ['math'],
    gradeLevels: ['8'],
  },
  
  // ---------------------------------------------------------------------------
  // MAP CREATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'map-creation',
    activityName: 'Map Creation',
    activityDescription: 'Create mythological world maps with geography and scale',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-B2', 'AK-CULT-B3',  // Regional knowledge
      'AK-CULT-E2',  // Ecological understanding
      // Alaska Math Standards
      'AK-MATH-7G-1',  // Scale drawings
      'AK-MATH-7RP-2',  // Proportional relationships
    ],
    primarySubjects: ['geography', 'math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // TIMELINE CREATION
  // ---------------------------------------------------------------------------
  {
    activityType: 'timeline-creation',
    activityName: 'Timeline Creation',
    activityDescription: 'Build chronological timelines of mythological events and eras',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A2',  // Historical traditions
      'AK-CULT-E5',  // Cultural change over time
      // Alaska Math Standards
      'AK-MATH-6NS-5', 'AK-MATH-6NS-6',  // Number lines, positive/negative
    ],
    primarySubjects: ['social-studies', 'math'],
    gradeLevels: ['6', '7', '8'],
  },
  
  // ---------------------------------------------------------------------------
  // ARTIFACT COLLECTION
  // ---------------------------------------------------------------------------
  {
    activityType: 'artifact-collection',
    activityName: 'Artifact Collection',
    activityDescription: 'Document and catalog mythological artifacts and sacred objects',
    standardIds: [
      // Alaska Cultural Standards
      'AK-CULT-A1', 'AK-CULT-A6',  // Cultural artifacts
      'AK-CULT-B1',  // Traditional knowledge
      'AK-CULT-D3',  // Observation skills
      // Alaska ELA Standards
      'AK-ELA-W6-3d',  // Descriptive writing
      'AK-ELA-W6-4',  // Clear writing
    ],
    primarySubjects: ['cultural', 'ela', 'social-studies'],
    gradeLevels: ['6', '7', '8'],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get mappings for a specific activity type
 */
export function getMappingsForActivity(activityType: ActivityType): ActivityStandardMapping | undefined {
  return ACTIVITY_STANDARD_MAPPINGS.find(m => m.activityType === activityType);
}

/**
 * Get all activities for a specific subject
 */
export function getActivitiesForSubject(subject: SubjectArea): ActivityStandardMapping[] {
  return ACTIVITY_STANDARD_MAPPINGS.filter(m => m.primarySubjects.includes(subject));
}

/**
 * Get all activities for a specific grade level
 */
export function getActivitiesForGrade(grade: GradeLevel): ActivityStandardMapping[] {
  return ACTIVITY_STANDARD_MAPPINGS.filter(m => m.gradeLevels.includes(grade));
}

/**
 * Get all unique standard IDs used across all activities
 */
export function getAllUsedStandardIds(): string[] {
  const allIds = ACTIVITY_STANDARD_MAPPINGS.flatMap(m => m.standardIds);
  return [...new Set(allIds)];
}

export default ACTIVITY_STANDARD_MAPPINGS;
