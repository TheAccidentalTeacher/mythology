// Relationship type definitions for character connections

export type RelationshipType = 
  | 'parent'
  | 'child'
  | 'sibling'
  | 'spouse'
  | 'rival'
  | 'ally'
  | 'enemy'
  | 'mentor'
  | 'student'
  | 'creator'
  | 'creation'
  | 'friend'
  | 'romantic';

export interface Relationship {
  id: string;
  mythology_id: string;
  character_1_id: string;
  character_2_id: string;
  relationship_type: RelationshipType;
  description?: string;
  strength: number; // 1-10 scale
  is_mutual: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RelationshipTypeConfig {
  type: RelationshipType;
  label: string;
  emoji: string;
  color: string; // Hex color for edge in graph
  description: string;
  isMutual: boolean; // Is this relationship automatically mutual?
}

export const RELATIONSHIP_TYPES: Record<RelationshipType, RelationshipTypeConfig> = {
  parent: {
    type: 'parent',
    label: 'Parent',
    emoji: '👨‍👧',
    color: '#10b981', // Green
    description: 'Parent-child relationship',
    isMutual: false
  },
  child: {
    type: 'child',
    label: 'Child',
    emoji: '👶',
    color: '#10b981', // Green
    description: 'Child of parent',
    isMutual: false
  },
  sibling: {
    type: 'sibling',
    label: 'Sibling',
    emoji: '👫',
    color: '#3b82f6', // Blue
    description: 'Brother or sister',
    isMutual: true
  },
  spouse: {
    type: 'spouse',
    label: 'Spouse',
    emoji: '💑',
    color: '#ec4899', // Pink
    description: 'Married or partnered',
    isMutual: true
  },
  rival: {
    type: 'rival',
    label: 'Rival',
    emoji: '⚔️',
    color: '#f59e0b', // Orange
    description: 'Competitive adversary',
    isMutual: true
  },
  ally: {
    type: 'ally',
    label: 'Ally',
    emoji: '🤝',
    color: '#06b6d4', // Cyan
    description: 'Allied or cooperative',
    isMutual: true
  },
  enemy: {
    type: 'enemy',
    label: 'Enemy',
    emoji: '⚡',
    color: '#ef4444', // Red
    description: 'Hostile or antagonistic',
    isMutual: true
  },
  mentor: {
    type: 'mentor',
    label: 'Mentor',
    emoji: '🎓',
    color: '#8b5cf6', // Purple
    description: 'Teacher or guide',
    isMutual: false
  },
  student: {
    type: 'student',
    label: 'Student',
    emoji: '📚',
    color: '#8b5cf6', // Purple
    description: 'Learner or apprentice',
    isMutual: false
  },
  creator: {
    type: 'creator',
    label: 'Creator',
    emoji: '🎨',
    color: '#a855f7', // Violet
    description: 'Created or made this entity',
    isMutual: false
  },
  creation: {
    type: 'creation',
    label: 'Creation',
    emoji: '✨',
    color: '#a855f7', // Violet
    description: 'Was created by this entity',
    isMutual: false
  },
  friend: {
    type: 'friend',
    label: 'Friend',
    emoji: '💙',
    color: '#0ea5e9', // Sky blue
    description: 'Friendly relationship',
    isMutual: true
  },
  romantic: {
    type: 'romantic',
    label: 'Romantic',
    emoji: '❤️',
    color: '#f43f5e', // Rose
    description: 'Romantic interest or love',
    isMutual: false
  }
};

// Get relationship config by type
export function getRelationshipConfig(type: RelationshipType): RelationshipTypeConfig {
  return RELATIONSHIP_TYPES[type];
}

// Get all relationship types as array
export function getAllRelationshipTypes(): RelationshipTypeConfig[] {
  return Object.values(RELATIONSHIP_TYPES);
}

// Get color for relationship type
export function getRelationshipColor(type: RelationshipType): string {
  return RELATIONSHIP_TYPES[type]?.color || '#6b7280'; // Gray default
}

// Check if relationship type is mutual by default
export function isRelationshipMutual(type: RelationshipType): boolean {
  return RELATIONSHIP_TYPES[type]?.isMutual || false;
}

// Get inverse relationship type (parent → child, mentor → student, etc.)
export function getInverseRelationshipType(type: RelationshipType): RelationshipType | null {
  const inverses: Record<string, RelationshipType> = {
    'parent': 'child',
    'child': 'parent',
    'mentor': 'student',
    'student': 'mentor',
    'creator': 'creation',
    'creation': 'creator'
  };
  return inverses[type] || null;
}
