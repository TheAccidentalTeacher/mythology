// Map Type System - Constants and Configuration
// Based on MAP_TYPE_DIFFERENTIATION.md research

export type MapType = 'world' | 'regional' | 'city' | 'mystical' | 'other';

export interface MapTypeConfig {
  label: string;
  description: string;
  emoji: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  gridType: 'hex' | 'square' | 'none' | 'any';
  minMarkers: number;
  allowedMarkerStyles: string[];
  detailLevel: 'low' | 'medium' | 'high' | 'surreal' | 'variable';
  suggestedPathWidth: number;
}

export const MAP_TYPE_CONFIGS: Record<MapType, MapTypeConfig> = {
  world: {
    label: 'World Map',
    description: 'Continental scale - continents, oceans, major terrain features',
    emoji: '🌍',
    minWidth: 2000,
    maxWidth: 2400,
    minHeight: 1500,
    maxHeight: 1800,
    gridType: 'hex',
    minMarkers: 3,
    allowedMarkerStyles: ['circle', 'hex'], // Abstract shapes for large features
    detailLevel: 'low',
    suggestedPathWidth: 8,
  },
  regional: {
    label: 'Regional Map',
    description: 'Kingdom/province scale - settlements, strategic locations, borders',
    emoji: '🗺️',
    minWidth: 1600,
    maxWidth: 2000,
    minHeight: 1200,
    maxHeight: 1500,
    gridType: 'square',
    minMarkers: 5,
    allowedMarkerStyles: ['circle', 'hex', 'star'], // More variety for settlements
    detailLevel: 'medium',
    suggestedPathWidth: 4,
  },
  city: {
    label: 'City/Settlement',
    description: 'Urban scale - buildings, streets, districts, points of interest',
    emoji: '🏘️',
    minWidth: 800,
    maxWidth: 1200,
    minHeight: 600,
    maxHeight: 900,
    gridType: 'square',
    minMarkers: 10,
    allowedMarkerStyles: ['pin', 'circle', 'star'], // Pin perfect for POIs
    detailLevel: 'high',
    suggestedPathWidth: 2,
  },
  mystical: {
    label: 'Mystical Realm',
    description: 'Otherworldly - non-Euclidean, magical, surreal spaces',
    emoji: '✨',
    minWidth: 1000,
    maxWidth: 1600,
    minHeight: 800,
    maxHeight: 1200,
    gridType: 'none',
    minMarkers: 3,
    allowedMarkerStyles: ['star', 'hex', 'circle', 'pin'], // All styles for variety
    detailLevel: 'surreal',
    suggestedPathWidth: 3,
  },
  other: {
    label: 'Other/Custom',
    description: 'Flexible - dungeons, underwater, aerial, abstract concepts',
    emoji: '📋',
    minWidth: 800,
    maxWidth: 2400,
    minHeight: 600,
    maxHeight: 1800,
    gridType: 'any',
    minMarkers: 1,
    allowedMarkerStyles: ['circle', 'pin', 'hex', 'star'], // All styles available
    detailLevel: 'variable',
    suggestedPathWidth: 3,
  },
};

// Marker icon library - categorized by map type
export interface MarkerIcon {
  id: string;
  emoji: string;
  label: string;
  category: string;
}

export const WORLD_MAP_MARKERS: MarkerIcon[] = [
  // Terrain Features
  { id: 'mountain', emoji: '🏔️', label: 'Mountain Range', category: 'terrain' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean/Sea', category: 'terrain' },
  { id: 'forest', emoji: '🌲', label: 'Forest Region', category: 'terrain' },
  { id: 'desert', emoji: '🏜️', label: 'Desert Region', category: 'terrain' },
  { id: 'tundra', emoji: '❄️', label: 'Tundra/Ice Cap', category: 'terrain' },
  { id: 'volcano', emoji: '🌋', label: 'Volcano', category: 'terrain' },
  { id: 'island', emoji: '🏝️', label: 'Island Chain', category: 'terrain' },
  { id: 'plains', emoji: '🌾', label: 'Plains/Grassland', category: 'terrain' },
  // Major Features
  { id: 'capital', emoji: '👑', label: 'Capital/Major City', category: 'settlement' },
  { id: 'continent', emoji: '🗺️', label: 'Continent Label', category: 'geographic' },
];

export const REGIONAL_MAP_MARKERS: MarkerIcon[] = [
  // Political/Strategic
  { id: 'castle', emoji: '🏰', label: 'Castle/Fortress', category: 'strategic' },
  { id: 'town', emoji: '🏘️', label: 'Town', category: 'settlement' },
  { id: 'village', emoji: '⛺', label: 'Village', category: 'settlement' },
  { id: 'watchtower', emoji: '🗼', label: 'Watchtower', category: 'strategic' },
  { id: 'battlefield', emoji: '⚔️', label: 'Battlefield', category: 'historic' },
  { id: 'road', emoji: '🛣️', label: 'Road/Highway', category: 'infrastructure' },
  { id: 'bridge', emoji: '🌉', label: 'Bridge', category: 'infrastructure' },
  { id: 'pass', emoji: '⛰️', label: 'Mountain Pass', category: 'strategic' },
  { id: 'forest_named', emoji: '🌳', label: 'Named Forest', category: 'geographic' },
  { id: 'river', emoji: '💧', label: 'River/Lake', category: 'geographic' },
  { id: 'mine', emoji: '⛏️', label: 'Mine/Quarry', category: 'economic' },
  { id: 'port', emoji: '⚓', label: 'Port', category: 'economic' },
];

export const CITY_MAP_MARKERS: MarkerIcon[] = [
  // Government & Civic
  { id: 'town_hall', emoji: '🏛️', label: 'Town Hall/Government', category: 'civic' },
  { id: 'courthouse', emoji: '⚖️', label: 'Courthouse', category: 'civic' },
  // Craftsmen & Trade
  { id: 'blacksmith', emoji: '⚒️', label: 'Blacksmith', category: 'trade' },
  { id: 'carpenter', emoji: '🪚', label: 'Carpenter', category: 'trade' },
  { id: 'tailor', emoji: '🧵', label: 'Tailor', category: 'trade' },
  { id: 'market', emoji: '🏪', label: 'Market/Shop', category: 'trade' },
  { id: 'bank', emoji: '💰', label: 'Bank', category: 'trade' },
  // Establishments
  { id: 'tavern', emoji: '🍺', label: 'Tavern', category: 'establishment' },
  { id: 'inn', emoji: '🏨', label: 'Inn', category: 'establishment' },
  // Religious
  { id: 'temple', emoji: '⛪', label: 'Temple/Church', category: 'religious' },
  { id: 'shrine', emoji: '🕯️', label: 'Shrine', category: 'religious' },
  // Entertainment & Culture
  { id: 'theater', emoji: '🎭', label: 'Theater', category: 'entertainment' },
  { id: 'arena', emoji: '🏟️', label: 'Arena', category: 'entertainment' },
  { id: 'library', emoji: '📚', label: 'Library', category: 'education' },
  // Residential & Infrastructure
  { id: 'house', emoji: '🏠', label: 'House/Residence', category: 'residential' },
  { id: 'apartment', emoji: '🏢', label: 'Apartment', category: 'residential' },
  { id: 'gate', emoji: '🚪', label: 'Gate/Entrance', category: 'infrastructure' },
  { id: 'park', emoji: '🌳', label: 'Park/Garden', category: 'recreation' },
  { id: 'fountain', emoji: '⛲', label: 'Fountain', category: 'landmark' },
  { id: 'statue', emoji: '🗿', label: 'Statue/Monument', category: 'landmark' },
  // Guilds & Organizations
  { id: 'guildhall', emoji: '🏰', label: 'Guild Hall', category: 'organization' },
];

export const MYSTICAL_MAP_MARKERS: MarkerIcon[] = [
  // Magical Features
  { id: 'portal', emoji: '🌀', label: 'Portal', category: 'magical' },
  { id: 'nexus', emoji: '🔮', label: 'Nexus Point', category: 'magical' },
  { id: 'floating_island', emoji: '🏝️', label: 'Floating Island', category: 'ethereal' },
  { id: 'celestial', emoji: '🌙', label: 'Celestial Body', category: 'celestial' },
  { id: 'ley_line', emoji: '💫', label: 'Ley Line Node', category: 'magical' },
  { id: 'void', emoji: '🕳️', label: 'Void/Rift', category: 'dangerous' },
  { id: 'ethereal_structure', emoji: '🏛️', label: 'Ethereal Structure', category: 'ethereal' },
  { id: 'shifting_landmark', emoji: '🎭', label: 'Shifting Landmark', category: 'unstable' },
  { id: 'elemental', emoji: '🌊', label: 'Elemental Manifestation', category: 'elemental' },
  { id: 'fey_grove', emoji: '🦋', label: 'Fey Grove', category: 'fey' },
  { id: 'crystal', emoji: '💎', label: 'Crystal Formation', category: 'magical' },
  { id: 'aurora', emoji: '🌌', label: 'Aurora/Energy Field', category: 'magical' },
];

// Combined marker library based on map type
export const getMarkersForType = (mapType: MapType): MarkerIcon[] => {
  switch (mapType) {
    case 'world':
      return WORLD_MAP_MARKERS;
    case 'regional':
      return REGIONAL_MAP_MARKERS;
    case 'city':
      return CITY_MAP_MARKERS;
    case 'mystical':
      return MYSTICAL_MAP_MARKERS;
    case 'other':
      // 'other' gets all markers
      return [
        ...WORLD_MAP_MARKERS,
        ...REGIONAL_MAP_MARKERS,
        ...CITY_MAP_MARKERS,
        ...MYSTICAL_MAP_MARKERS,
      ];
    default:
      return [];
  }
};

// Instructions text for each map type
export const getInstructionsForType = (mapType: MapType): string => {
  switch (mapType) {
    case 'world':
      return '🌍 World Map: Focus on large-scale geography. Place 3-10 major features like continents, oceans, and mountain ranges. Keep detail low - think big picture.';
    case 'regional':
      return '🗺️ Regional Map: Show kingdoms and settlements. Add 5-15 strategic locations like towns, castles, and roads. Medium detail for political geography.';
    case 'city':
      return '🏘️ City Map: High detail! Place 10+ points of interest like taverns, shops, temples, and landmarks. Show streets and districts.';
    case 'mystical':
      return '✨ Mystical Realm: Be creative! Add portals, floating islands, and magical nexus points. Non-Euclidean geometry welcome. 3+ features required.';
    case 'other':
      return '📋 Custom Map: All tools available! Use for dungeons, underwater, aerial views, or any unique concept. Minimum 1 marker.';
    default:
      return 'Add locations to your map by clicking "Add Location" and clicking on the canvas.';
  }
};

// Validation messages for each map type
export const getValidationMessageForType = (mapType: MapType, locationCount: number): string | null => {
  const config = MAP_TYPE_CONFIGS[mapType];
  
  if (locationCount < config.minMarkers) {
    switch (mapType) {
      case 'world':
        return `World maps typically include at least ${config.minMarkers} major continents or landmasses. Consider adding more large-scale geographic features.`;
      case 'regional':
        return `Regional maps work best with ${config.minMarkers}-15 settlements and strategic locations. Add more towns, castles, or landmarks.`;
      case 'city':
        return `City maps shine with detail! Add at least ${config.minMarkers} points of interest for players to explore - taverns, shops, temples, etc.`;
      case 'mystical':
        return `Mystical realms need at least ${config.minMarkers} key features like portals, nexus points, or magical landmarks.`;
      case 'other':
        return `Add at least ${config.minMarkers} marker to create your map.`;
      default:
        return `Add at least ${config.minMarkers} markers to complete your map.`;
    }
  }
  
  return null; // No validation error
};

// Get suggested marker style based on map type
export const getSuggestedMarkerStyle = (mapType: MapType): 'circle' | 'pin' | 'hex' | 'star' => {
  switch (mapType) {
    case 'world':
      return 'circle'; // Abstract for large features
    case 'regional':
      return 'hex'; // Distinct settlements
    case 'city':
      return 'pin'; // Perfect for POIs
    case 'mystical':
      return 'star'; // Ethereal/magical feel
    case 'other':
      return 'circle'; // Neutral default
    default:
      return 'circle';
  }
};

// Check if a marker style is allowed for a map type
export const isMarkerStyleAllowed = (mapType: MapType, markerStyle: string): boolean => {
  const config = MAP_TYPE_CONFIGS[mapType];
  return config.allowedMarkerStyles.includes(markerStyle);
};

// Get default canvas dimensions for a map type
export const getDefaultCanvasDimensions = (mapType: MapType): { width: number; height: number } => {
  const config = MAP_TYPE_CONFIGS[mapType];
  // Use midpoint of min/max range
  const width = Math.round((config.minWidth + config.maxWidth) / 2);
  const height = Math.round((config.minHeight + config.maxHeight) / 2);
  return { width, height };
};
