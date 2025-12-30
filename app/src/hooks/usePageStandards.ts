'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  getStandardsForActivity,
  getMappingsForActivity,
  Standard,
  ActivityType,
  ActivityStandardMapping,
} from '@/lib/standards';

// Map routes to activity types
const ROUTE_ACTIVITY_MAP: Record<string, { activityType: ActivityType; activityName: string }> = {
  // Mythology creation pages
  '/mythology/create': { activityType: 'mythology-creation', activityName: 'Mythology Creation' },
  '/mythology/new': { activityType: 'mythology-creation', activityName: 'Create New Mythology' },
  
  // Character pages
  '/characters': { activityType: 'character-creation', activityName: 'Character Creation' },
  '/characters/create': { activityType: 'character-creation', activityName: 'Create Character' },
  '/characters/new': { activityType: 'character-creation', activityName: 'New Character' },
  
  // Story pages
  '/stories': { activityType: 'story-writing', activityName: 'Story Writing' },
  '/stories/create': { activityType: 'story-writing', activityName: 'Write a Story' },
  '/stories/new': { activityType: 'story-writing', activityName: 'New Story' },
  '/story-writer': { activityType: 'story-writing', activityName: 'Story Writer' },
  
  // Math Quiz - various routes
  '/math': { activityType: 'math-quiz', activityName: 'Math Quiz' },
  '/math-quiz': { activityType: 'math-quiz', activityName: 'Math Quiz' },
  '/quiz': { activityType: 'math-quiz', activityName: 'Math Quiz' },
  
  // World building
  '/world': { activityType: 'world-building', activityName: 'World Building' },
  '/world-building': { activityType: 'world-building', activityName: 'World Building' },
  '/realms': { activityType: 'world-building', activityName: 'Realm Creation' },
  
  // Map creation
  '/maps': { activityType: 'map-creation', activityName: 'Map Creation' },
  '/map-creator': { activityType: 'map-creation', activityName: 'Map Creator' },
  
  // Timeline
  '/timeline': { activityType: 'timeline-creation', activityName: 'Timeline Creation' },
  '/timelines': { activityType: 'timeline-creation', activityName: 'Timelines' },
  
  // Cultural comparison
  '/compare': { activityType: 'cultural-comparison', activityName: 'Cultural Comparison' },
  '/comparison': { activityType: 'cultural-comparison', activityName: 'Mythology Comparison' },
  
  // Artifacts
  '/artifacts': { activityType: 'artifact-collection', activityName: 'Artifact Collection' },
  '/collection': { activityType: 'artifact-collection', activityName: 'Collections' },
  
  // Presentations
  '/present': { activityType: 'story-presentation', activityName: 'Story Presentation' },
  '/presentation': { activityType: 'story-presentation', activityName: 'Presentation' },
};

// Additional patterns for dynamic routes
const DYNAMIC_ROUTE_PATTERNS: { pattern: RegExp; activity: { activityType: ActivityType; activityName: string } }[] = [
  { pattern: /^\/mythology\/[^/]+\/characters/, activity: { activityType: 'character-creation', activityName: 'Character Creation' } },
  { pattern: /^\/mythology\/[^/]+\/stories/, activity: { activityType: 'story-writing', activityName: 'Story Writing' } },
  { pattern: /^\/mythology\/[^/]+\/world/, activity: { activityType: 'world-building', activityName: 'World Building' } },
  { pattern: /^\/mythology\/[^/]+\/map/, activity: { activityType: 'map-creation', activityName: 'Map Creation' } },
  { pattern: /^\/mythology\/[^/]+$/, activity: { activityType: 'mythology-creation', activityName: 'Mythology Details' } },
  { pattern: /^\/character\//, activity: { activityType: 'character-creation', activityName: 'Character Details' } },
  { pattern: /^\/story\//, activity: { activityType: 'story-writing', activityName: 'Story Details' } },
];

interface UsePageStandardsResult {
  standards: Standard[];
  activityType: ActivityType | null;
  activityName: string | null;
  mapping: ActivityStandardMapping | null;
  hasStandards: boolean;
}

/**
 * Hook to get standards for the current page/route
 * Automatically detects the activity type based on the current route
 */
export function usePageStandards(overrideActivityType?: ActivityType): UsePageStandardsResult {
  const pathname = usePathname();

  return useMemo(() => {
    // If an override is provided, use it
    if (overrideActivityType) {
      const mapping = getMappingsForActivity(overrideActivityType);
      const standards = getStandardsForActivity(overrideActivityType);
      return {
        standards,
        activityType: overrideActivityType,
        activityName: mapping?.activityName || null,
        mapping: mapping || null,
        hasStandards: standards.length > 0,
      };
    }

    // Try exact match first
    const exactMatch = ROUTE_ACTIVITY_MAP[pathname];
    if (exactMatch) {
      const mapping = getMappingsForActivity(exactMatch.activityType);
      const standards = getStandardsForActivity(exactMatch.activityType);
      return {
        standards,
        activityType: exactMatch.activityType,
        activityName: exactMatch.activityName,
        mapping: mapping || null,
        hasStandards: standards.length > 0,
      };
    }

    // Try pattern matching for dynamic routes
    for (const { pattern, activity } of DYNAMIC_ROUTE_PATTERNS) {
      if (pattern.test(pathname)) {
        const mapping = getMappingsForActivity(activity.activityType);
        const standards = getStandardsForActivity(activity.activityType);
        return {
          standards,
          activityType: activity.activityType,
          activityName: activity.activityName,
          mapping: mapping || null,
          hasStandards: standards.length > 0,
        };
      }
    }

    // No match found
    return {
      standards: [],
      activityType: null,
      activityName: null,
      mapping: null,
      hasStandards: false,
    };
  }, [pathname, overrideActivityType]);
}

export default usePageStandards;
