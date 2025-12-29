// Image Generation Types
// TypeScript interfaces for the AI image generation system

export type EntityType = 'character' | 'creature' | 'realm' | 'story' | 'mythology' | 'map';

export type ImageStyle = 
  | 'illustrated-storybook'
  | 'watercolor'
  | 'ancient-stone-carving'
  | 'comic-book'
  | 'pixel-art'
  | 'oil-painting'
  | 'cave-painting'
  | 'anime-manga';

export type ImageStatus = 'pending' | 'approved' | 'rejected' | 'generating' | 'failed';

export interface StylePreset {
  id: ImageStyle;
  name: string;
  description: string;
  promptSuffix: string;
  icon: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'illustrated-storybook',
    name: 'Storybook',
    description: 'Classic children\'s book illustration style',
    promptSuffix: 'in the style of a beautifully illustrated children\'s storybook, warm colors, whimsical',
    icon: '📚'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, flowing watercolor painting',
    promptSuffix: 'watercolor painting style, soft edges, flowing colors, artistic',
    icon: '🎨'
  },
  {
    id: 'ancient-stone-carving',
    name: 'Stone Carving',
    description: 'Ancient relief sculpture or carving',
    promptSuffix: 'in the style of ancient stone relief carving, classical mythology aesthetic',
    icon: '🗿'
  },
  {
    id: 'comic-book',
    name: 'Comic Book',
    description: 'Bold comic book style with dynamic poses',
    promptSuffix: 'comic book art style, bold lines, dynamic composition, vibrant colors',
    icon: '💥'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: 'Retro video game pixel art',
    promptSuffix: 'pixel art style, 16-bit retro video game aesthetic, detailed pixels',
    icon: '👾'
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classical oil painting style',
    promptSuffix: 'classical oil painting style, rich textures, dramatic lighting, museum quality',
    icon: '🖼️'
  },
  {
    id: 'cave-painting',
    name: 'Cave Art',
    description: 'Prehistoric cave painting style',
    promptSuffix: 'prehistoric cave painting style, primitive, ochre and earth tones, ancient',
    icon: '🦣'
  },
  {
    id: 'anime-manga',
    name: 'Anime',
    description: 'Japanese anime/manga illustration',
    promptSuffix: 'anime manga illustration style, expressive, detailed, Japanese animation aesthetic',
    icon: '✨'
  }
];

export interface GeneratedImage {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  prompt: string;
  studentAddition?: string;
  stylePreset: ImageStyle;
  imageUrl: string;
  thumbnailUrl?: string;
  status: ImageStatus;
  flaggedReason?: string;
  isFeatured: boolean;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ImageGenerationRequest {
  userId: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  entityDescription: string;
  mythologyName?: string;
  mythologyStyle?: string;
  stylePreset: ImageStyle;
  studentAddition?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageId?: string;
  imageUrl?: string;
  status?: ImageStatus;
  tokensRemaining?: number;
  imagesRemainingToday?: number;
  error?: string;
  flaggedReason?: string;
}

export interface UserImageStats {
  userId: string;
  imageTokens: number;
  totalImagesGenerated: number;
  imagesGeneratedToday: number;
  dailyLimit: number;
  freeImagesUsed: number;
  freeImageLimit: number;
}

export interface ClassImageSettings {
  classId: string;
  imageGenEnabled: boolean;
  requireApproval: boolean;
  freeImageCount: number;
  questionsPerToken: number;
  dailyLimitPerStudent: number;
  allowedStyles: ImageStyle[];
  blockedMathTopics: string[];
}

// Safety filter types
export interface SafetyCheckResult {
  safe: boolean;
  flaggedTerms: string[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

// Blocked words and patterns for input filtering
export const BLOCKED_TERMS = [
  // Explicit content
  'nude', 'naked', 'nudity', 'nsfw', 'porn', 'pornographic', 'sexual', 'erotic',
  'genitals', 'breasts', 'butt', 'buttocks', 'nipple',
  // Violence (extreme)
  'gore', 'gory', 'dismember', 'decapitate', 'mutilate', 'torture', 'execution',
  'disembowel', 'impale', 'crucify', 'hang', 'hanging',
  // Drugs
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'marijuana', 'weed', 'smoking',
  'injection', 'needle', 'overdose', 'high on',
  // Hate
  'nazi', 'swastika', 'kkk', 'confederate', 'racist', 'slur',
  // Self-harm
  'suicide', 'self-harm', 'cutting', 'kill myself',
  // Other inappropriate
  'sexy', 'seductive', 'provocative', 'revealing', 'lingerie', 'bikini',
  'drunk', 'alcohol', 'beer', 'wine', 'vodka', 'whiskey',
];

// Allowed violence terms (mythology-appropriate)
export const ALLOWED_VIOLENCE_TERMS = [
  'battle', 'fight', 'warrior', 'sword', 'spear', 'bow', 'arrow', 'shield',
  'armor', 'weapon', 'weapon', 'fangs', 'claws', 'monster', 'beast', 'dragon',
  'fire', 'flame', 'lightning', 'thunder', 'storm', 'danger', 'scary', 'fierce',
  'powerful', 'mighty', 'epic', 'legendary', 'gun', 'bomb', 'explosive',
  'skeleton', 'skull', 'undead', 'zombie', 'ghost', 'demon', 'dark', 'evil',
];

export const DEFAULT_IMAGE_SETTINGS: ClassImageSettings = {
  classId: '',
  imageGenEnabled: true,
  requireApproval: false,
  freeImageCount: 5,
  questionsPerToken: 3,
  dailyLimitPerStudent: 3,
  allowedStyles: STYLE_PRESETS.map(s => s.id),
  blockedMathTopics: [],
};
