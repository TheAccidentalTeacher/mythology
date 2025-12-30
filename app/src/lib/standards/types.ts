// Standards Framework Types

export type StandardFramework = 
  | 'alaska-ela'
  | 'alaska-math'
  | 'alaska-cultural'
  | 'alaska-social-studies'
  | 'ccss-ela'
  | 'ccss-math'
  | 'iste';

export type SubjectArea = 
  | 'ela'
  | 'math'
  | 'social-studies'
  | 'geography'
  | 'cultural'
  | 'technology';

export type GradeLevel = '6' | '7' | '8' | '6-8';

export type ActivityType = 
  | 'mythology-creation'
  | 'character-creation'
  | 'creature-creation'
  | 'story-writing'
  | 'story-presentation'
  | 'world-building'
  | 'cultural-comparison'
  | 'map-creation'
  | 'timeline-creation'
  | 'artifact-collection'
  | 'relationship-mapping'
  | 'battle-simulation'
  | 'math-quiz'
  | 'math-quiz-fractions'
  | 'math-quiz-decimals'
  | 'math-quiz-ratios'
  | 'math-quiz-algebra'
  | 'math-quiz-exponents'
  | 'math-quiz-geometry'
  | 'math-quiz-statistics'
  | 'math-quiz-functions'
  | 'image-generation'
  | 'presentation'
  | 'crossover-collaboration'
  | 'trading-cards'
  | 'realm-exploration';

export interface Standard {
  id: string;
  framework: StandardFramework;
  subject: SubjectArea;
  gradeLevel: GradeLevel;
  code: string;
  title: string;
  description: string;
  sourceUrl?: string;
}

export interface ActivityStandardMapping {
  activityType: ActivityType;
  activityName: string;
  activityDescription: string;
  primarySubjects: SubjectArea[];
  gradeLevels: GradeLevel[];
  standardIds: string[];
}

export interface StandardsFilter {
  frameworks?: StandardFramework[];
  subjects?: SubjectArea[];
  gradeLevels?: GradeLevel[];
  activities?: ActivityType[];
  searchQuery?: string;
}
