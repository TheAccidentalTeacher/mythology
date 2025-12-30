// ============================================================================
// STANDARDS MODULE
// Central export for all educational standards data and utilities
// ============================================================================

// Types
export * from './types';

// Standards Data
export { ALASKA_CULTURAL_STANDARDS } from './alaskaCulturalStandards';
export { ALASKA_ELA_STANDARDS } from './alaskaElaStandards';
export { ALASKA_MATH_STANDARDS } from './alaskaMathStandards';

// Activity Mappings
export {
  ACTIVITY_STANDARD_MAPPINGS,
  getMappingsForActivity,
  getActivitiesForSubject,
  getActivitiesForGrade,
  getAllUsedStandardIds,
} from './activityMappings';

// Import for internal use
import { Standard, StandardFramework, SubjectArea, GradeLevel, StandardsFilter, ActivityType } from './types';
import { ALASKA_CULTURAL_STANDARDS } from './alaskaCulturalStandards';
import { ALASKA_ELA_STANDARDS } from './alaskaElaStandards';
import { ALASKA_MATH_STANDARDS } from './alaskaMathStandards';
import { ACTIVITY_STANDARD_MAPPINGS, getMappingsForActivity } from './activityMappings';

// ============================================================================
// COMBINED STANDARDS
// ============================================================================

/**
 * All standards combined into a single array
 */
export const ALL_STANDARDS: Standard[] = [
  ...ALASKA_CULTURAL_STANDARDS,
  ...ALASKA_ELA_STANDARDS,
  ...ALASKA_MATH_STANDARDS,
];

/**
 * Standards organized by framework
 */
export const STANDARDS_BY_FRAMEWORK: Record<StandardFramework, Standard[]> = {
  'alaska-ela': ALASKA_ELA_STANDARDS,
  'alaska-math': ALASKA_MATH_STANDARDS,
  'alaska-cultural': ALASKA_CULTURAL_STANDARDS,
  'alaska-social-studies': [], // TODO: Add when available
  'ccss-ela': [], // TODO: Add Common Core standards
  'ccss-math': [], // TODO: Add Common Core standards
  'iste': [], // TODO: Add ISTE technology standards
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a standard by its ID
 */
export function getStandardById(id: string): Standard | undefined {
  return ALL_STANDARDS.find(s => s.id === id);
}

/**
 * Get multiple standards by their IDs
 */
export function getStandardsByIds(ids: string[]): Standard[] {
  return ids.map(id => getStandardById(id)).filter((s): s is Standard => s !== undefined);
}

/**
 * Filter standards by various criteria
 */
export function filterStandards(filter: StandardsFilter): Standard[] {
  return ALL_STANDARDS.filter(standard => {
    if (filter.frameworks && !filter.frameworks.includes(standard.framework)) {
      return false;
    }
    if (filter.subjects && !filter.subjects.includes(standard.subject)) {
      return false;
    }
    if (filter.gradeLevels && !filter.gradeLevels.includes(standard.gradeLevel as GradeLevel)) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = standard.title.toLowerCase().includes(query);
      const matchesDescription = standard.description.toLowerCase().includes(query);
      const matchesCode = standard.code.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesCode) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Get standards for a specific activity type
 */
export function getStandardsForActivity(activityType: ActivityType): Standard[] {
  const mapping = getMappingsForActivity(activityType);
  if (!mapping) return [];
  return getStandardsByIds(mapping.standardIds);
}

/**
 * Get standards grouped by subject
 */
export function getStandardsBySubject(): Record<SubjectArea, Standard[]> {
  const result: Record<SubjectArea, Standard[]> = {
    'ela': [],
    'math': [],
    'social-studies': [],
    'geography': [],
    'cultural': [],
    'technology': [],
  };
  
  ALL_STANDARDS.forEach(standard => {
    result[standard.subject].push(standard);
  });
  
  return result;
}

/**
 * Get standards grouped by grade level
 */
export function getStandardsByGrade(): Record<GradeLevel, Standard[]> {
  const result: Record<GradeLevel, Standard[]> = {
    '6': [],
    '7': [],
    '8': [],
    '6-8': [],
  };
  
  ALL_STANDARDS.forEach(standard => {
    const grade = standard.gradeLevel as GradeLevel;
    if (grade in result) {
      result[grade].push(standard);
    }
  });
  
  return result;
}

/**
 * Get all unique frameworks in use
 */
export function getAvailableFrameworks(): StandardFramework[] {
  const frameworks = new Set(ALL_STANDARDS.map(s => s.framework));
  return Array.from(frameworks);
}

/**
 * Get all unique subjects in use
 */
export function getAvailableSubjects(): SubjectArea[] {
  const subjects = new Set(ALL_STANDARDS.map(s => s.subject));
  return Array.from(subjects);
}

/**
 * Get framework display name
 */
export function getFrameworkDisplayName(framework: StandardFramework): string {
  const names: Record<StandardFramework, string> = {
    'alaska-ela': 'Alaska ELA Standards',
    'alaska-math': 'Alaska Math Standards',
    'alaska-cultural': 'Alaska Cultural Standards',
    'alaska-social-studies': 'Alaska Social Studies Standards',
    'ccss-ela': 'Common Core ELA',
    'ccss-math': 'Common Core Math',
    'iste': 'ISTE Technology Standards',
  };
  return names[framework] || framework;
}

/**
 * Get subject display name
 */
export function getSubjectDisplayName(subject: SubjectArea): string {
  const names: Record<SubjectArea, string> = {
    'ela': 'English Language Arts',
    'math': 'Mathematics',
    'social-studies': 'Social Studies',
    'geography': 'Geography',
    'cultural': 'Cultural Studies',
    'technology': 'Technology',
  };
  return names[subject] || subject;
}

/**
 * Get summary statistics about standards coverage
 */
export function getStandardsSummary() {
  return {
    totalStandards: ALL_STANDARDS.length,
    byFramework: {
      'alaska-ela': ALASKA_ELA_STANDARDS.length,
      'alaska-math': ALASKA_MATH_STANDARDS.length,
      'alaska-cultural': ALASKA_CULTURAL_STANDARDS.length,
    },
    bySubject: {
      ela: ALL_STANDARDS.filter(s => s.subject === 'ela').length,
      math: ALL_STANDARDS.filter(s => s.subject === 'math').length,
      cultural: ALL_STANDARDS.filter(s => s.subject === 'cultural').length,
    },
    totalActivities: ACTIVITY_STANDARD_MAPPINGS.length,
  };
}
