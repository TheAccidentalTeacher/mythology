// =====================================================
// MYTHOLOGY CREATION WIZARD
// Epic guided experience for creating new mythologies
// =====================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Map, 
  Compass, 
  Crown, 
  Wand2,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  X,
  Mic,
  MicOff
} from 'lucide-react';
import { useWizardProgress, type WizardStep } from '@/hooks/useWizardProgress';
import { MYTHOLOGY_CATEGORIES, type WizardData } from '@/lib/ai/prompts';
import { useAIAssistance } from '@/hooks/useAIAssistance';
import { soundManager } from '@/lib/soundManager';

// =====================================================
// WEB SPEECH API TYPES FOR VOICE INPUT
// =====================================================

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Minimum characters required for each theme
const MIN_THEME_CHARS = 30;

// Five themes constant (defined outside component to prevent recreation on each render)
const THEMES = ['location', 'place', 'interaction', 'movement', 'regions'] as const;

// =====================================================
// STEP COMPONENTS
// =====================================================

// Step 1: Category Selection
function CategoryStep({ 
  data, 
  onUpdate 
}: { 
  data: WizardData; 
  onUpdate: (updates: Partial<WizardData>) => void;
}) {
  const categories = Object.values(MYTHOLOGY_CATEGORIES);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          What Kind of Mythology Will You Create?
        </h2>
        <p className="text-gray-400">
          Choose the foundation for your mythological world
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUpdate({ category: category.id, subcategory: undefined })}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${data.category === category.id 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              }
            `}
          >
            <div className={`
              text-3xl mb-2 w-12 h-12 rounded-lg flex items-center justify-center
              bg-linear-to-br ${category.color}
            `}>
              {category.icon}
            </div>
            <h3 className="font-bold text-white">{category.name}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {category.description}
            </p>
            {data.category === category.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Subcategory selection if category has presets */}
      {data.category && MYTHOLOGY_CATEGORIES[data.category as keyof typeof MYTHOLOGY_CATEGORIES]?.presets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
        >
          <h3 className="font-medium text-white mb-3">Choose a Style (Optional)</h3>
          <p className="text-sm text-gray-400 mb-4">
            Pick a cultural inspiration for your mythology. Click any style to see what it means!
          </p>
          <div className="grid gap-3">
            {MYTHOLOGY_CATEGORIES[data.category as keyof typeof MYTHOLOGY_CATEGORIES].presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onUpdate({ subcategory: data.subcategory === preset.id ? undefined : preset.id })}
                className={`
                  text-left p-3 rounded-xl transition-all border
                  ${data.subcategory === preset.id
                    ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <span className={`font-medium ${data.subcategory === preset.id ? 'text-amber-300' : 'text-white'}`}>
                    {preset.name}
                  </span>
                  {data.subcategory === preset.id && (
                    <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">Selected</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 block mt-1">{preset.hint}</span>
                {data.subcategory === preset.id && 'description' in preset && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-gray-300 mt-3 pt-3 border-t border-gray-600"
                  >
                    {(preset as { description?: string }).description}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Quick suggestion data for geography - ENHANCED with descriptions for kids
const ENVIRONMENT_SUGGESTIONS = [
  { 
    emoji: '🏔️', 
    text: 'Mountains & Valleys',
    description: 'Tall peaks reaching into the clouds, deep valleys between them. Think of places where mountain goats live and rivers begin!'
  },
  { 
    emoji: '🌊', 
    text: 'Oceans & Islands',
    description: 'Endless blue water with islands scattered around. Some islands might be tiny, others could hold entire kingdoms!'
  },
  { 
    emoji: '🌲', 
    text: 'Ancient Forest',
    description: 'Dark, mysterious woods where the trees are so old they might have seen dinosaurs. Full of hidden creatures and secret paths.'
  },
  { 
    emoji: '🏜️', 
    text: 'Desert Sands',
    description: 'Hot, dry lands with sand dunes that shift in the wind. Oases (water spots) are precious and rare here.'
  },
  { 
    emoji: '🌌', 
    text: 'Space & Stars',
    description: 'Your mythology happens among the stars! Planets, moons, asteroids, and the darkness between them.'
  },
  { 
    emoji: '💻', 
    text: 'Digital World',
    description: 'Inside the internet or a video game! Landscapes made of code, data streams, and digital beings.'
  },
  { 
    emoji: '🏫', 
    text: 'School Campus',
    description: 'Hallways become kingdoms, the gym is an arena, the library holds ancient secrets, and the cafeteria is where alliances form.'
  },
  { 
    emoji: '🏙️', 
    text: 'Modern City',
    description: 'Skyscrapers, busy streets, subways underground. Gods might live in penthouses or hide in back alleys.'
  },
  { 
    emoji: '☁️', 
    text: 'Sky Kingdom',
    description: 'A world above the clouds! Floating islands, cloud castles, and beings who never touch the ground.'
  },
  { 
    emoji: '🌋', 
    text: 'Volcanic Lands',
    description: 'Fire, lava, and ash! A dangerous place where the earth itself is alive and angry. Very dramatic for powerful gods.'
  },
  { 
    emoji: '❄️', 
    text: 'Frozen Tundra',
    description: 'Like Alaska in winter! Snow and ice everywhere, northern lights in the sky, and animals adapted to the cold.'
  },
  { 
    emoji: '🌊', 
    text: 'Rivers & Lakes',
    description: 'Water that flows through the land, connecting places. Great for stories about journeys and the life water brings.'
  },
];

const CLIMATE_SUGGESTIONS = [
  { 
    emoji: '☀️', 
    text: 'Eternal Sunshine',
    description: 'The sun always shines here! It never gets dark. How does that change how people live?'
  },
  { 
    emoji: '🌧️', 
    text: 'Constant Rain',
    description: 'It always rains, from gentle drizzles to massive storms. Everything is wet and green grows everywhere.'
  },
  { 
    emoji: '❄️', 
    text: 'Frozen Tundra',
    description: 'Always cold! Snow covers everything, rivers are ice, and only the toughest survive. Like Alaska in deep winter.'
  },
  { 
    emoji: '🌈', 
    text: 'Magical Weather',
    description: 'Weather that makes no sense! Maybe it rains candy, snows upward, or rainbows appear at night.'
  },
  { 
    emoji: '⚡', 
    text: 'Storm-filled Skies',
    description: 'Thunder and lightning are constant. The sky is always dramatic, dark clouds swirling with power.'
  },
  { 
    emoji: '🌫️', 
    text: 'Mysterious Fog',
    description: 'Thick fog makes it hard to see far. Things appear and disappear in the mist. Very spooky!'
  },
  { 
    emoji: '✨', 
    text: 'Glowing Atmosphere',
    description: 'The air itself glows! Maybe with magic, bioluminescence, or energy. Nighttime is never truly dark.'
  },
  { 
    emoji: '🔥', 
    text: 'Hot & Volcanic',
    description: 'Heat everywhere! The ground might be warm, lava flows nearby, and fire is a constant presence.'
  },
  { 
    emoji: '🌀', 
    text: 'Changing Seasons',
    description: 'Dramatic season changes - maybe they shift suddenly, or each region is stuck in one season forever.'
  },
  { 
    emoji: '🌙', 
    text: 'Eternal Night',
    description: 'The sun never rises! How do people see? What grows without sunlight? Perfect for mysterious beings.'
  },
];

const LANDMARK_SUGGESTIONS = [
  { 
    emoji: '🏛️', 
    text: 'Sacred Temple',
    description: 'A holy building where people worship or where gods live. Could be beautiful, ruined, or hidden.'
  },
  { 
    emoji: '🗻', 
    text: 'Holy Mountain',
    description: 'A mountain that\'s sacred - maybe gods live on top, or climbing it is a spiritual journey.'
  },
  { 
    emoji: '🌳', 
    text: 'World Tree',
    description: 'A tree so huge it connects different realms! Norse mythology has Yggdrasil. Your tree could connect heaven and earth.'
  },
  { 
    emoji: '💎', 
    text: 'Crystal Cave',
    description: 'A cave filled with glowing crystals. Maybe they\'re magical, hold memories, or are worth fighting over.'
  },
  { 
    emoji: '🌀', 
    text: 'Portal Gateway',
    description: 'A doorway to another world or dimension! Who controls it? Is it always open or needs a key?'
  },
  { 
    emoji: '👑', 
    text: 'Throne Room',
    description: 'Where the ruler (god, king, or powerful being) sits and makes decisions. The center of power.'
  },
  { 
    emoji: '📚', 
    text: 'Library of Secrets',
    description: 'A place holding all knowledge - forbidden books, ancient scrolls, dangerous information.'
  },
  { 
    emoji: '🔮', 
    text: 'Oracle\'s Chamber',
    description: 'Where people go to learn the future or get answers to impossible questions. Truth lives here.'
  },
  { 
    emoji: '⚔️', 
    text: 'Ancient Battlefield',
    description: 'Where a great war was fought long ago. Haunted? Cursed? Full of buried treasures?'
  },
  { 
    emoji: '🌊', 
    text: 'Sacred River/Lake',
    description: 'Water that has special power - heals, grants wishes, shows visions, or guards something beneath.'
  },
  { 
    emoji: '🏰', 
    text: 'Fortress/Castle',
    description: 'A stronghold - protected, hard to reach, full of defenders. Who lives inside and what do they guard?'
  },
  { 
    emoji: '🕳️', 
    text: 'Underworld Entrance',
    description: 'A way down to the land of the dead or a hidden underground realm. Dark and mysterious.'
  },
];

// Step 2: Geography - Now with sub-steps for easier navigation
type GeoSubStep = 'environment' | 'climate' | 'landmarks';

function GeographyStep({ 
  data, 
  onUpdate 
}: { 
  data: WizardData; 
  onUpdate: (updates: Partial<WizardData>) => void;
}) {
  const [geoSubStep, setGeoSubStep] = useState<GeoSubStep>('environment');
  const [environment, setEnvironment] = useState(data.geography?.environment || '');
  const [climate, setClimate] = useState(data.geography?.climate || '');
  const [features, setFeatures] = useState(data.geography?.features || '');
  
  // Multi-select for all categories
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [selectedClimates, setSelectedClimates] = useState<string[]>([]);
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);

  const { getWizardHelp, response, isLoading, clearResponse, error } = useAIAssistance();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState<GeoSubStep | null>(null);

  // Different AI prompts for each sub-step
  const getAIHelpForStep = async (step: GeoSubStep) => {
    setAiContext(step);
    clearResponse();
    setAiResponse(null);
    
    const currentSelections = step === 'environment' ? selectedEnvironments : step === 'climate' ? selectedClimates : selectedLandmarks;
    
    const prompts: Record<GeoSubStep, string> = {
      environment: `Help me brainstorm WHERE my mythology takes place. I'm creating a ${data.category || 'custom'} style mythology${data.subcategory ? ` inspired by ${data.subcategory}` : ''}. ${currentSelections.length > 0 ? `I've already picked: ${currentSelections.join(', ')}. What else might work with these?` : 'Give me 2-3 creative setting ideas!'} Don't write my mythology for me - just spark my imagination! Keep it short and fun.`,
      climate: `Help me think about WEATHER for my ${environment || 'mythology'} world. ${currentSelections.length > 0 ? `I've picked: ${currentSelections.join(', ')}. What else might fit?` : 'What interesting weather patterns might exist?'} Give me 2-3 quick, creative ideas. Just nudge my thinking!`,
      landmarks: `Help me brainstorm SPECIAL PLACES for my world with ${environment || 'this setting'} and ${climate || 'this climate'}. ${currentSelections.length > 0 ? `I have: ${currentSelections.join(', ')}. What else?` : 'What important locations might exist?'} Give me 2-3 landmark ideas. Just spark ideas - I decide what to use!`
    };
    
    await getWizardHelp('geography', data, prompts[step]);
  };
  
  useEffect(() => {
    if (response) {
      setAiResponse(response); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [response]);

  // Update parent when values change
  useEffect(() => {
    onUpdate({
      geography: { environment, climate, features }
    });
  }, [environment, climate, features]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle environment selection (multi-select!)
  const toggleEnvironment = (item: typeof ENVIRONMENT_SUGGESTIONS[0]) => {
    let newSelection: string[];
    if (selectedEnvironments.includes(item.text)) {
      newSelection = selectedEnvironments.filter(e => e !== item.text);
    } else {
      newSelection = [...selectedEnvironments, item.text];
    }
    setSelectedEnvironments(newSelection);
    setEnvironment(newSelection.join(' + '));
  };

  // Toggle climate selection (multi-select!)
  const toggleClimate = (item: typeof CLIMATE_SUGGESTIONS[0]) => {
    let newSelection: string[];
    if (selectedClimates.includes(item.text)) {
      newSelection = selectedClimates.filter(c => c !== item.text);
    } else {
      newSelection = [...selectedClimates, item.text];
    }
    setSelectedClimates(newSelection);
    setClimate(newSelection.join(' + '));
  };

  // Toggle landmark selection (multi-select!)
  const toggleLandmark = (item: typeof LANDMARK_SUGGESTIONS[0]) => {
    let newSelection: string[];
    if (selectedLandmarks.includes(item.text)) {
      newSelection = selectedLandmarks.filter(l => l !== item.text);
    } else {
      newSelection = [...selectedLandmarks, item.text];
    }
    setSelectedLandmarks(newSelection);
    setFeatures(newSelection.join(', '));
  };

  const goToNextGeoStep = () => {
    setAiResponse(null);
    setAiContext(null);
    if (geoSubStep === 'environment') setGeoSubStep('climate');
    else if (geoSubStep === 'climate') setGeoSubStep('landmarks');
  };

  const goToPrevGeoStep = () => {
    setAiResponse(null);
    setAiContext(null);
    if (geoSubStep === 'climate') setGeoSubStep('environment');
    else if (geoSubStep === 'landmarks') setGeoSubStep('climate');
  };

  // Progress indicator
  const geoStepNumber = geoSubStep === 'environment' ? 1 : geoSubStep === 'climate' ? 2 : 3;

  return (
    <div className="space-y-6">
      {/* Progress bar for geography sub-steps */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {['environment', 'climate', 'landmarks'].map((step, idx) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                geoSubStep === step 
                  ? 'bg-amber-500 text-white' 
                  : idx < geoStepNumber - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
              }`}
            >
              {idx < geoStepNumber - 1 ? '✓' : idx + 1}
            </div>
            {idx < 2 && (
              <div className={`w-8 h-1 mx-1 ${idx < geoStepNumber - 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-400 mb-4">
        Step {geoStepNumber} of 3: {geoSubStep === 'environment' ? 'Where is your world?' : geoSubStep === 'climate' ? 'What&apos;s the weather like?' : 'What special places exist?'}
      </div>

      {/* ENVIRONMENT SUB-STEP */}
      {geoSubStep === 'environment' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              🗺️ Where Is Your World?
            </h2>
            <p className="text-gray-400 text-lg">
              Pick the places where your mythology happens.
              <span className="block text-sm mt-1 text-amber-400 font-medium">You can pick MORE THAN ONE! Maybe your world has mountains AND forests.</span>
            </p>
          </div>

          {/* Show selections */}
          {selectedEnvironments.length > 0 && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
              <span className="text-amber-400">✓ Selected ({selectedEnvironments.length}):</span>
              <span className="text-gray-300 ml-2">{selectedEnvironments.join(' + ')}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2">
            {ENVIRONMENT_SUGGESTIONS.map((item) => (
              <button
                key={item.text}
                onClick={() => toggleEnvironment(item)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedEnvironments.includes(item.text)
                    ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`font-medium ${selectedEnvironments.includes(item.text) ? 'text-amber-300' : 'text-white'}`}>
                    {item.text}
                  </span>
                  {selectedEnvironments.includes(item.text) && (
                    <span className="ml-auto text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Custom input option */}
          <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              💡 Want to add your own ideas too?
            </label>
            <textarea
              value={selectedEnvironments.length > 0 ? '' : environment}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedEnvironments([]);
                  setEnvironment(e.target.value);
                }
              }}
              placeholder="Type your own setting ideas..."
              className="w-full h-16 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* AI Help for Environment */}
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Need Ideas?</span>
              </div>
              <button
                onClick={() => getAIHelpForStep('environment')}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {isLoading && aiContext === 'environment' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</>
                ) : (
                  <>✨ Give Me Ideas</>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Stuck? Click and I&apos;ll suggest some ideas. <span className="text-purple-400">You decide what fits!</span>
            </p>
            
            {aiResponse && aiContext === 'environment' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-purple-500/20">
                <div className="flex justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">💡 Ideas:</span>
                  <button onClick={() => setAiResponse(null)} className="text-gray-500 hover:text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{aiResponse}</p>
                <p className="text-xs text-gray-500 mt-2 italic">These are just suggestions to spark YOUR creativity!</p>
              </motion.div>
            )}
            {error && aiContext === 'environment' && !aiResponse && (
              <p className="text-xs text-gray-500 mt-2">💡 AI isn&apos;t available right now. Use the cards above!</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={goToNextGeoStep}
              disabled={!environment}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                environment
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Weather & Climate
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* CLIMATE SUB-STEP */}
      {geoSubStep === 'climate' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              🌤️ What&apos;s The Weather Like?
            </h2>
            <p className="text-gray-400 text-lg">
              Weather affects everything! It changes how people live, what they wear, and what grows.
              <span className="block text-sm mt-1 text-amber-400 font-medium">Pick MORE THAN ONE! Your world might have different seasons.</span>
            </p>
          </div>

          {/* Show what they picked for environment */}
          {environment && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm">
              <span className="text-green-400">✓ Your setting:</span>
              <span className="text-gray-300 ml-2">{environment}</span>
            </div>
          )}

          {/* Show climate selections */}
          {selectedClimates.length > 0 && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
              <span className="text-amber-400">✓ Climate ({selectedClimates.length}):</span>
              <span className="text-gray-300 ml-2">{selectedClimates.join(' + ')}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {CLIMATE_SUGGESTIONS.map((item) => (
              <button
                key={item.text}
                onClick={() => toggleClimate(item)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedClimates.includes(item.text)
                    ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`font-medium ${selectedClimates.includes(item.text) ? 'text-amber-300' : 'text-white'}`}>
                    {item.text}
                  </span>
                  {selectedClimates.includes(item.text) && (
                    <span className="ml-auto text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              💡 Want to add your own ideas too?
            </label>
            <textarea
              value={selectedClimates.length > 0 ? '' : climate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedClimates([]);
                  setClimate(e.target.value);
                }
              }}
              placeholder="Type your own climate ideas..."
              className="w-full h-16 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* AI Help for Climate */}
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Need Ideas?</span>
              </div>
              <button
                onClick={() => getAIHelpForStep('climate')}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {isLoading && aiContext === 'climate' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</>
                ) : (
                  <>✨ Give Me Ideas</>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              What weather would make your world interesting? <span className="text-purple-400">Click for suggestions!</span>
            </p>
            
            {aiResponse && aiContext === 'climate' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-purple-500/20">
                <div className="flex justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">💡 Ideas:</span>
                  <button onClick={() => setAiResponse(null)} className="text-gray-500 hover:text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{aiResponse}</p>
                <p className="text-xs text-gray-500 mt-2 italic">These are just suggestions to spark YOUR creativity!</p>
              </motion.div>
            )}
            {error && aiContext === 'climate' && !aiResponse && (
              <p className="text-xs text-gray-500 mt-2">💡 AI isn&apos;t available right now. Use the cards above!</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevGeoStep}
              className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={goToNextGeoStep}
              disabled={!climate}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                climate
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Special Places
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* LANDMARKS SUB-STEP */}
      {geoSubStep === 'landmarks' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              🏛️ What Special Places Exist?
            </h2>
            <p className="text-gray-400 text-lg">
              Every mythology has important locations where big things happen.
              <span className="block text-sm mt-1 text-amber-400 font-medium">Pick MORE THAN ONE! Every world needs cool places to explore.</span>
            </p>
          </div>

          {/* Show what they picked so far */}
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm space-y-1">
            <div><span className="text-green-400">✓ Setting:</span> <span className="text-gray-300">{environment}</span></div>
            <div><span className="text-green-400">✓ Climate:</span> <span className="text-gray-300">{climate}</span></div>
          </div>

          {/* Show landmark selections */}
          {selectedLandmarks.length > 0 && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
              <span className="text-amber-400">✓ Special Places ({selectedLandmarks.length}):</span>
              <span className="text-gray-300 ml-2">{selectedLandmarks.join(' + ')}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {LANDMARK_SUGGESTIONS.map((item) => (
              <button
                key={item.text}
                onClick={() => toggleLandmark(item)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedLandmarks.includes(item.text)
                    ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`font-medium ${selectedLandmarks.includes(item.text) ? 'text-amber-300' : 'text-white'}`}>
                    {item.text}
                  </span>
                  {selectedLandmarks.includes(item.text) && (
                    <span className="ml-auto text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              💡 Want to add your own special places too?
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="The Great Library, The Forbidden Cave, etc..."
              className="w-full h-16 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* AI Help for Landmarks */}
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Need Ideas?</span>
              </div>
              <button
                onClick={() => getAIHelpForStep('landmarks')}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {isLoading && aiContext === 'landmarks' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</>
                ) : (
                  <>✨ Give Me Ideas</>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              What cool places would exist in your world? <span className="text-purple-400">Click for suggestions!</span>
            </p>
            
            {aiResponse && aiContext === 'landmarks' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-purple-500/20">
                <div className="flex justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">💡 Ideas:</span>
                  <button onClick={() => setAiResponse(null)} className="text-gray-500 hover:text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{aiResponse}</p>
                <p className="text-xs text-gray-500 mt-2 italic">These are just suggestions to spark YOUR creativity!</p>
              </motion.div>
            )}
            {error && aiContext === 'landmarks' && !aiResponse && (
              <p className="text-xs text-gray-500 mt-2">💡 AI isn&apos;t available right now. Use the cards above!</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevGeoStep}
              className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="text-sm text-gray-400 flex items-center">
              {features ? (
                <span className="text-green-400">✓ Ready to continue! Use the Next button below.</span>
              ) : (
                <span>Pick at least one landmark to continue</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// =====================================================
// FIVE THEMES DATA - Detailed guidance for each theme
// =====================================================

const FIVE_THEMES_DATA = {
  location: {
    emoji: '📍',
    title: 'Location',
    subtitle: 'Where is your mythology\'s center of power?',
    explanation: `In real geography, LOCATION answers "Where is it?" using coordinates or descriptions. For your mythology, this is WHERE the most important events happen.`,
    realWorldExample: '🌍 Real World: Greece\'s Mount Olympus was where the gods lived. It was a real mountain people could see!',
    mythologyExamples: [
      'Norse: Asgard floats above Midgard, connected by the rainbow bridge Bifrost',
      'Egyptian: The Nile River was sacred - gods emerged from its waters',
      'Japanese: Mount Fuji is where heaven and earth meet',
    ],
    thinkAbout: [
      'Is it a mountain, ocean, sky, underground, or another dimension?',
      'Can regular people see or reach this place?',
      'Why did the gods/powers choose THIS spot?',
    ],
    stuckPrompts: [
      'What if your center of power is somewhere unexpected, like inside a volcano or floating in space?',
      'Could your location be something that moves, like a traveling island or wandering castle?',
      'What if the center of power is hidden in plain sight - like under a normal-looking lake?',
    ],
    quickStarters: [
      { emoji: '🏔️', text: 'On top of the highest mountain' },
      { emoji: '🌊', text: 'Deep beneath the ocean waves' },
      { emoji: '☁️', text: 'Floating in the clouds above' },
      { emoji: '🌋', text: 'Inside an ancient volcano' },
      { emoji: '🌲', text: 'Hidden in the oldest forest' },
      { emoji: '❄️', text: 'In the frozen north, under the lights' },
      { emoji: '⭐', text: 'Among the stars in space' },
      { emoji: '🕳️', text: 'Underground in crystal caves' },
    ],
  },
  place: {
    emoji: '🏔️',
    title: 'Place',
    subtitle: 'What makes your world unique and recognizable?',
    explanation: `PLACE is about the character of your world - what makes it special. This includes what you see (physical features) AND what you experience (culture, rules, mood).`,
    realWorldExample: '🌍 Real World: Paris is known for the Eiffel Tower, cafes, art, and romance. That\'s its "place" identity!',
    mythologyExamples: [
      'Greek: Olympus had golden palaces, nectar fountains, and eternal daylight',
      'Norse: Niflheim was a realm of ice, fog, and eternal cold',
      'Hindu: Svarga is a paradise with wish-fulfilling trees and flying vehicles',
    ],
    thinkAbout: [
      'What would someone SEE when they arrive? (colors, landmarks, sky)',
      'What would they HEAR? (silence, storms, music, voices)',
      'What would they FEEL? (temperature, magic, emotions)',
    ],
    stuckPrompts: [
      'Pick a color that represents your world - now what would make everything that color?',
      'What\'s the weather always doing? Storms? Sunshine? Glowing mist?',
      'What\'s one rule that works differently there? (gravity, time, sound)',
    ],
    quickStarters: [
      { emoji: '✨', text: 'Everything glows with magic light' },
      { emoji: '🎵', text: 'Music always plays in the air' },
      { emoji: '🌈', text: 'Colors are brighter than normal' },
      { emoji: '🌙', text: 'Always night, lit by moons and stars' },
      { emoji: '🔥', text: 'Fire and warmth everywhere' },
      { emoji: '❄️', text: 'Ice and snow cover everything' },
      { emoji: '🌸', text: 'Plants and flowers grow everywhere' },
      { emoji: '⚡', text: 'Energy crackles through the air' },
    ],
  },
  interaction: {
    emoji: '🤝',
    title: 'Human-Environment Interaction',
    subtitle: 'How do beings and their world affect each other?',
    explanation: `This theme is about the relationship between characters and their environment. Do they shape the land? Does the land shape them? Both?`,
    realWorldExample: '🌍 Real World: The Netherlands built dikes to hold back the sea - humans changing their environment to survive!',
    mythologyExamples: [
      'Greek: Poseidon\'s anger caused earthquakes and storms',
      'Norse: Thor\'s hammer strikes created thunder',
      'Polynesian: Maui pulled islands up from the ocean floor',
    ],
    thinkAbout: [
      'When your gods fight, does the landscape change?',
      'Do beings get their power FROM the environment?',
      'Have characters built, destroyed, or transformed parts of the world?',
    ],
    stuckPrompts: [
      'What if every strong emotion changes the weather or landscape?',
      'How did your world look BEFORE the gods arrived vs. after?',
      'What would happen to the world if all the gods disappeared?',
    ],
    quickStarters: [
      { emoji: '⚡', text: 'Gods control the weather with their moods' },
      { emoji: '🌱', text: 'Beings plant magic seeds that change the land' },
      { emoji: '🔨', text: 'Ancient beings carved mountains and rivers' },
      { emoji: '💔', text: 'When gods fight, earthquakes happen' },
      { emoji: '🙏', text: 'People build temples that give power to gods' },
      { emoji: '🌊', text: 'Creatures shape the seas and coastlines' },
      { emoji: '🔥', text: 'Volcanoes erupt when the fire god is angry' },
      { emoji: '❄️', text: 'Winter comes when a god sleeps' },
    ],
  },
  movement: {
    emoji: '🚶',
    title: 'Movement',
    subtitle: 'What travels through your mythology\'s world?',
    explanation: `MOVEMENT tracks how things get from one place to another - beings, ideas, goods, even stories. How does information and power flow?`,
    realWorldExample: '🌍 Real World: The Silk Road moved goods, ideas, AND religions across continents for thousands of years!',
    mythologyExamples: [
      'Greek: Hermes carried messages between gods and mortals on winged sandals',
      'Egyptian: Ra traveled the sky by day and underworld by night in his sun boat',
      'Celtic: Druids traveled between sacred groves spreading wisdom',
    ],
    thinkAbout: [
      'How do beings travel between realms or regions? (portals, flying, walking)',
      'How do mortals learn about the gods? (priests, dreams, signs)',
      'Are there important journeys, quests, or migrations in your world?',
    ],
    stuckPrompts: [
      'What\'s the "Silk Road" of your mythology - the main route things travel?',
      'Can thoughts, dreams, or prayers physically travel somewhere?',
      'Is there a special vehicle only gods can use? (chariot, ship, creature)',
    ],
    quickStarters: [
      { emoji: '🌈', text: 'Rainbow bridges connect different realms' },
      { emoji: '🦅', text: 'Giant birds carry messages and travelers' },
      { emoji: '🌀', text: 'Magic portals link sacred places' },
      { emoji: '💭', text: 'Dreams let people visit other realms' },
      { emoji: '🚣', text: 'Sacred rivers flow between worlds' },
      { emoji: '🐺', text: 'Spirit animals guide travelers' },
      { emoji: '⭐', text: 'Stars are a map to other places' },
      { emoji: '🎶', text: 'Songs carry prayers to the gods' },
    ],
  },
  regions: {
    emoji: '🗺️',
    title: 'Regions',
    subtitle: 'What different areas exist within your world?',
    explanation: `REGIONS divides your world into areas with different characteristics. Each region might have its own rulers, rules, creatures, or purpose.`,
    realWorldExample: '🌍 Real World: Earth has climate regions (tropical, arctic), political regions (countries), and cultural regions (language areas)!',
    mythologyExamples: [
      'Norse: Nine Realms - Asgard (gods), Midgard (humans), Hel (dead), etc.',
      'Greek: Olympus (gods), Earth (mortals), Underworld (Hades), Sea (Poseidon)',
      'Dante\'s Inferno: Nine circles of Hell, each for different sins',
    ],
    thinkAbout: [
      'How many major regions exist? What separates them?',
      'Does each region have its own ruler, creatures, or rules?',
      'Can you travel between regions? Who controls access?',
    ],
    stuckPrompts: [
      'Try starting with 3 regions: one for the powerful, one for regular beings, one for outcasts',
      'What if regions are based on emotions, seasons, or elements instead of geography?',
      'Is there a forbidden region no one talks about? Why?',
    ],
    quickStarters: [
      { emoji: '👑', text: 'A realm for gods, a realm for mortals, a realm for spirits' },
      { emoji: '🔥', text: 'Fire lands, ice lands, water lands, earth lands' },
      { emoji: '☀️', text: 'Day realm and night realm, always separate' },
      { emoji: '🌳', text: 'Above ground, on ground, below ground' },
      { emoji: '😊', text: 'Regions based on emotions (joy, anger, sorrow)' },
      { emoji: '🎭', text: 'Living realm, realm of dreams, realm of the dead' },
      { emoji: '⚖️', text: 'Realm of order and realm of chaos' },
      { emoji: '🏔️', text: 'Each mountain or valley is its own kingdom' },
    ],
  },
};

// Step 3: Five Themes - Enhanced with detailed guidance
function FiveThemesStep({ 
  data, 
  onUpdate 
}: { 
  data: WizardData; 
  onUpdate: (updates: Partial<WizardData>) => void;
}) {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  // Use THEMES constant from module scope

  const [answers, setAnswers] = useState<Record<string, string>>(data.five_themes || {});
  
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [interimText, setInterimText] = useState(''); // Show text as user speaks
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const currentThemeData = FIVE_THEMES_DATA[THEMES[currentTheme]];

  // Check for voice support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognitionAPI);
  }, []);

  const handleAnswerChange = useCallback((theme: string, value: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [theme]: value };
      // Schedule parent update outside of state setter to avoid "setState during render" error
      setTimeout(() => onUpdate({ five_themes: newAnswers }), 0);
      return newAnswers;
    });
  }, [onUpdate]);

  // Voice input handlers
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Show interim results as user speaks
      setInterimText(interimTranscript);

      if (finalTranscript) {
        const currentThemeKey = THEMES[currentTheme];
        setAnswers(prev => {
          const currentValue = prev[currentThemeKey] || '';
          const newValue = currentValue ? `${currentValue} ${finalTranscript}` : finalTranscript;
          const newAnswers = { ...prev, [currentThemeKey]: newValue };
          // Schedule parent update outside of state setter to avoid "setState during render" error
          setTimeout(() => onUpdate({ five_themes: newAnswers }), 0);
          return newAnswers;
        });
        // Clear interim text once finalized
        setInterimText('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Try again.');
      } else {
        setVoiceError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [currentTheme, onUpdate]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // AI cleanup for voice input
  const handleAICleanup = async () => {
    const currentThemeKey = THEMES[currentTheme];
    const text = answers[currentThemeKey];
    if (!text?.trim()) return;
    
    setIsCleaningUp(true);
    try {
      const res = await fetch('/api/ai/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: 'cleanup' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.cleaned) {
          handleAnswerChange(currentThemeKey, data.cleaned);
        }
      }
    } catch (err) {
      console.error('AI cleanup error:', err);
    } finally {
      setIsCleaningUp(false);
    }
  };

  const getRandomHint = () => {
    const hints = currentThemeData.stuckPrompts;
    const nextIndex = (currentHintIndex + 1) % hints.length;
    setCurrentHintIndex(nextIndex);
    setShowHint(true);
  };

  // Helper to check if a theme is complete
  const isThemeComplete = (theme: string) => {
    return answers[theme] && answers[theme].trim().length >= MIN_THEME_CHARS;
  };

  // Count completed themes
  const completedCount = THEMES.filter(t => isThemeComplete(t)).length;

  // Reset hint when changing themes
  useEffect(() => {
    setShowHint(false);
    setCurrentHintIndex(0);
    // Stop voice when changing themes
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      setInterimText('');
    }
  }, [currentTheme]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          📚 The Five Themes of Geography
        </h2>
        <p className="text-gray-400 text-sm">
          Real geographers use these themes to understand places. Let&apos;s use them to build your mythology!
        </p>
        {/* Required Notice */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs">
          <span>⭐</span>
          <span>All 5 themes are required (minimum {MIN_THEME_CHARS} characters each)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden border border-gray-700">
        <div 
          className="h-full bg-linear-to-r from-amber-500 to-green-500 transition-all duration-500"
          style={{ width: `${(completedCount / 5) * 100}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-400">
        {completedCount}/5 themes completed
        {completedCount === 5 && <span className="text-green-400 ml-2">🎉 All done!</span>}
      </p>

      {/* Theme Navigation Pills */}
      <div className="flex justify-center gap-2 flex-wrap">
        {THEMES.map((theme, index) => (
          <button
            key={theme}
            onClick={() => setCurrentTheme(index)}
            className={`
              px-3 py-2 rounded-full flex items-center gap-2 text-sm transition-all
              ${currentTheme === index 
                ? 'bg-amber-500 text-white scale-105' 
                : isThemeComplete(theme) 
                  ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-red-500/30'
              }
            `}
          >
            <span>{FIVE_THEMES_DATA[theme].emoji}</span>
            <span className="hidden sm:inline">{FIVE_THEMES_DATA[theme].title}</span>
            {isThemeComplete(theme) ? (
              <span className="text-green-400">✓</span>
            ) : (
              <span className="text-red-400/60 text-xs">*</span>
            )}
          </button>
        ))}
      </div>

      {/* Current Theme Card */}
      <motion.div
        key={currentTheme}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-gray-800/50 rounded-xl border overflow-hidden ${
          isThemeComplete(THEMES[currentTheme]) ? 'border-green-500/50' : 'border-gray-700'
        }`}
      >
        {/* Theme Header */}
        <div className={`p-4 border-b border-gray-700 ${
          isThemeComplete(THEMES[currentTheme]) 
            ? 'bg-linear-to-r from-green-500/20 to-emerald-500/20' 
            : 'bg-linear-to-r from-amber-500/20 to-orange-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <span className="text-2xl">{currentThemeData.emoji}</span>
              {currentThemeData.title}
              {isThemeComplete(THEMES[currentTheme]) && (
                <span className="text-green-400 text-sm ml-2">✓ Complete</span>
              )}
            </h3>
            {/* Voice Input Button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                }`}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="text-sm">{isListening ? 'Stop' : 'Voice Input'}</span>
              </button>
            )}
          </div>
          <p className="text-gray-300 mt-1">{currentThemeData.subtitle}</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Voice Recording Indicator */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
            >
              <p className="text-red-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                🎤 Recording... speak clearly. Click &quot;Stop&quot; when done.
              </p>
            </motion.div>
          )}

          {/* Voice Error */}
          {voiceError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <p className="text-red-400 text-xs">⚠️ {voiceError}</p>
            </div>
          )}

          {/* What is this theme? */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <h4 className="text-blue-400 font-medium text-sm mb-1">💡 What is this theme?</h4>
            <p className="text-gray-300 text-sm">{currentThemeData.explanation}</p>
          </div>

          {/* Real World Connection */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-300 text-sm">{currentThemeData.realWorldExample}</p>
          </div>

          {/* Mythology Examples - Collapsible */}
          <details className="group">
            <summary className="cursor-pointer text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-2">
              <span>📖 See how other mythologies do this</span>
              <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-purple-500/30 space-y-1">
              {currentThemeData.mythologyExamples.map((ex, i) => (
                <p key={i} className="text-gray-400 text-sm">• {ex}</p>
              ))}
            </div>
          </details>

          {/* Think About These Questions */}
          <div className="bg-gray-700/50 rounded-lg p-3">
            <h4 className="text-gray-300 font-medium text-sm mb-2">🤔 Think about:</h4>
            <ul className="space-y-1">
              {currentThemeData.thinkAbout.map((q, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Starters - Clickable Ideas */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              ⚡ Quick ideas (click to add):
            </label>
            <div className="flex flex-wrap gap-2">
              {currentThemeData.quickStarters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const current = answers[THEMES[currentTheme]] || '';
                    const newValue = current 
                      ? `${current}${current.endsWith('.') || current.endsWith('!') ? ' ' : '. '}${starter.text}`
                      : starter.text;
                    handleAnswerChange(THEMES[currentTheme], newValue);
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-sm border border-gray-600 hover:border-amber-500/50"
                >
                  <span>{starter.emoji}</span>
                  <span>{starter.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Answer Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                ✍️ Your answer for {currentThemeData.title}:
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                {voiceSupported && (
                  <span className="text-green-400/60 text-xs flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Voice available
                  </span>
                )}
                <span className={`text-xs ${
                  (answers[THEMES[currentTheme]]?.length || 0) >= MIN_THEME_CHARS 
                    ? 'text-green-400' 
                    : 'text-amber-400'
                }`}>
                  {answers[THEMES[currentTheme]]?.length || 0}/{MIN_THEME_CHARS}+ chars
                </span>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={answers[THEMES[currentTheme]] || ''}
                onChange={(e) => handleAnswerChange(THEMES[currentTheme], e.target.value)}
                placeholder={isListening 
                  ? '🎤 Listening... speak now!' 
                  : `Describe the ${currentThemeData.title.toLowerCase()} in your mythology... (Tip: Click Voice Input above or the microphone!)`
                }
                className={`w-full h-28 bg-gray-900 border rounded-lg p-3 pr-12 text-white placeholder-gray-500 focus:ring-1 resize-none ${
                  isListening 
                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500' 
                    : isThemeComplete(THEMES[currentTheme])
                      ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-600 focus:border-amber-500 focus:ring-amber-500'
                }`}
              />
              {/* Inline Voice Button */}
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            {/* Live speech preview - shows what user is saying in real-time */}
            {isListening && interimText && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mt-2">
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <span className="animate-pulse">🎤</span>
                  <span className="italic">{interimText}</span>
                  <span className="text-red-400/50 text-xs">(listening...)</span>
                </p>
              </div>
            )}
            
            {/* Character requirement indicator */}
            {(answers[THEMES[currentTheme]]?.length || 0) > 0 && 
             (answers[THEMES[currentTheme]]?.length || 0) < MIN_THEME_CHARS && (
              <p className="text-amber-400 text-xs mt-1">
                ✏️ Need {MIN_THEME_CHARS - (answers[THEMES[currentTheme]]?.length || 0)} more characters
              </p>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Stuck? Button */}
            <button
              onClick={getRandomHint}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors text-sm border border-amber-500/30"
            >
              <Sparkles className="w-4 h-4" />
              {showHint ? 'Another Hint?' : 'Stuck? Get a Hint!'}
            </button>
            
            {/* AI Cleanup Button */}
            {(answers[THEMES[currentTheme]]?.length || 0) > 20 && (
              <button
                onClick={handleAICleanup}
                disabled={isCleaningUp}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm border border-green-500/30 disabled:opacity-50"
              >
                {isCleaningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ✏️ Fix Spelling
                  </>
                )}
              </button>
            )}
            
            {isThemeComplete(THEMES[currentTheme]) && (
              <span className="text-green-400 text-sm">✓ Complete!</span>
            )}
          </div>

          {/* Hint Display */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
            >
              <p className="text-amber-300 text-sm">
                💭 <strong>Try this:</strong> {currentThemeData.stuckPrompts[currentHintIndex]}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Theme Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentTheme(Math.max(0, currentTheme - 1))}
          disabled={currentTheme === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <span className="text-gray-500 text-sm">
          {currentTheme + 1} of {THEMES.length}
        </span>

        <button
          onClick={() => setCurrentTheme(Math.min(THEMES.length - 1, currentTheme + 1))}
          disabled={currentTheme === THEMES.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Summary - Updated to show actual completion status */}
      <div className="text-center">
        {completedCount < 5 ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm">
            <p className="text-amber-300">
              ⭐ <strong>{completedCount}/5 themes complete.</strong> Complete all 5 themes to continue.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Each theme needs at least {MIN_THEME_CHARS} characters.
            </p>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm">
            <p className="text-green-300">
              🎉 <strong>All 5 themes complete!</strong> Great work! Click &quot;Next&quot; to name your mythology.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: Name
function NameStep({ 
  data, 
  onUpdate 
}: { 
  data: WizardData; 
  onUpdate: (updates: Partial<WizardData>) => void;
}) {
  const [customName, setCustomName] = useState(data.selected_name || '');
  const { getWizardHelp, response, isLoading, clearResponse } = useAIAssistance();

  const handleGetSuggestions = async () => {
    await getWizardHelp('name', data);
  };

  const handleNameSelect = (_name: string) => {
    setCustomName(_name);
    onUpdate({ selected_name: _name });
  };

  // Keep handleNameSelect available for future use
  void handleNameSelect;

  useEffect(() => {
    if (customName) {
      onUpdate({ selected_name: customName });
    }
  }, [customName]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🎭 Name Your Mythology
        </h2>
        <p className="text-gray-400">
          Every great mythology needs an epic name!
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Enter your mythology's name..."
          className="w-full text-xl bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white text-center placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* AI Name Suggestions */}
      <div className="flex justify-center">
        <button
          onClick={handleGetSuggestions}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors border border-amber-500/30"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Get Name Suggestions
        </button>
      </div>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-amber-400 font-medium text-sm">💡 Name Ideas</span>
            <button onClick={clearResponse} className="text-gray-500 hover:text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{response}</p>
        </motion.div>
      )}
    </div>
  );
}

// Step 5: Preview
function PreviewStep({ 
  data,
  onComplete,
  isLoading
}: { 
  data: WizardData;
  onComplete: () => void;
  isLoading: boolean;
}) {
  const categoryInfo = data.category 
    ? MYTHOLOGY_CATEGORIES[data.category as keyof typeof MYTHOLOGY_CATEGORIES] 
    : null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center"
      >
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 mb-2">
          {data.selected_name || 'Your Mythology'}
        </h2>
        <p className="text-gray-400">
          Your legendary world awaits!
        </p>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto p-6 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
      >
        <div className="space-y-4">
          {categoryInfo && (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-linear-to-br ${categoryInfo.color}`}>
                {categoryInfo.icon}
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Category</div>
                <div className="text-white font-medium">{categoryInfo.name}</div>
              </div>
            </div>
          )}

          {data.geography?.environment && (
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Setting</div>
              <div className="text-gray-300 text-sm">{data.geography.environment}</div>
            </div>
          )}

          {data.five_themes?.place && (
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">What Makes It Unique</div>
              <div className="text-gray-300 text-sm">{data.five_themes.place}</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Create Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={onComplete}
          disabled={isLoading || !data.selected_name}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
            transition-all duration-300 transform hover:scale-105
            ${data.selected_name
              ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Your Legend...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Create My Mythology
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

// =====================================================
// MAIN WIZARD COMPONENT
// =====================================================

interface MythologyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (mythologyId: string) => void;
}

export function MythologyWizard({ isOpen, onClose, onComplete }: MythologyWizardProps) {
  const router = useRouter();
  const {
    currentStep,
    data,
    isLoading,
    error,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    saveProgress,
    completeWizard,
  } = useWizardProgress();

  const stepOrder: WizardStep[] = ['category', 'geography', 'five_themes', 'name', 'preview'];
  const currentStepIndex = stepOrder.indexOf(currentStep as WizardStep);

  const stepIcons: Record<WizardStep, React.ReactNode> = {
    category: <Compass className="w-5 h-5" />,
    geography: <Map className="w-5 h-5" />,
    five_themes: <Sparkles className="w-5 h-5" />,
    name: <Crown className="w-5 h-5" />,
    preview: <Wand2 className="w-5 h-5" />,
    complete: <Sparkles className="w-5 h-5" />, // Won't be shown, but needed for type safety
  };

  const handleNext = async () => {
    await saveProgress();
    
    // Play step completion sound
    soundManager.play('stepComplete', { volume: 0.4 });
    
    nextStep();
  };

  const handleComplete = async () => {
    // Play wizard completion celebration
    soundManager.play('wizardComplete', { volume: 0.6 });
    
    const result = await completeWizard();
    if (result?.mythologyId) {
      onComplete?.(result.mythologyId);
      onClose();
      router.push(`/student/mythology/${result.mythologyId}`);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'category':
        return !!data.category;
      case 'geography':
        return !!data.geography?.environment;
      case 'five_themes': {
        // ALL 5 themes are REQUIRED with minimum content
        if (!data.five_themes) return false;
        return THEMES.every(theme => {
          const value = data.five_themes?.[theme];
          return value && value.trim().length >= MIN_THEME_CHARS;
        });
      }
      case 'name':
        return !!data.selected_name;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-linear-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Mythology Creation Wizard</h1>
              <p className="text-xs text-gray-400">Step {currentStepIndex + 1} of {stepOrder.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 p-4 border-b border-gray-800">
          {stepOrder.map((step, index) => (
            <button
              key={step}
              onClick={() => index <= currentStepIndex && goToStep(step)}
              disabled={index > currentStepIndex}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                ${currentStep === step 
                  ? 'bg-amber-500 text-white' 
                  : index < currentStepIndex
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-gray-800 text-gray-500'
                }
              `}
            >
              {stepIcons[step]}
              <span className="hidden sm:inline capitalize">{step.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentStep === 'category' && (
                <CategoryStep data={data} onUpdate={updateData} />
              )}
              {currentStep === 'geography' && (
                <GeographyStep data={data} onUpdate={updateData} />
              )}
              {currentStep === 'five_themes' && (
                <FiveThemesStep data={data} onUpdate={updateData} />
              )}
              {currentStep === 'name' && (
                <NameStep data={data} onUpdate={updateData} />
              )}
              {currentStep === 'preview' && (
                <PreviewStep data={data} onComplete={handleComplete} isLoading={isLoading} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Progress Meter */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          {/* Progress Bar */}
          <div className="relative mb-3">
            {/* Background Track */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              {/* Animated Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStepIndex + 1) / stepOrder.length) * 100}%` 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 20,
                  duration: 0.8 
                }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </motion.div>
            </div>
            
            {/* Step Markers */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-1">
              {stepOrder.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const progress = (index / (stepOrder.length - 1)) * 100;
                
                return (
                  <motion.div
                    key={step}
                    className="relative"
                    style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Step Dot */}
                    <motion.div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 relative
                        ${isCompleted 
                          ? 'bg-green-500 border-green-400' 
                          : isCurrent
                            ? 'bg-amber-500 border-amber-300'
                            : 'bg-gray-700 border-gray-600'
                        }
                      `}
                      animate={isCurrent ? {
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(251, 191, 36, 0.4)',
                          '0 0 0 8px rgba(251, 191, 36, 0)',
                          '0 0 0 0 rgba(251, 191, 36, 0)'
                        ]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : isCurrent ? (
                        <Sparkles className="w-3 h-3 text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                      )}
                    </motion.div>
                    
                    {/* Celebration particles when completing a step */}
                    {isCompleted && (
                      <motion.div
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ 
                          opacity: 0, 
                          y: -20,
                          scale: 0.5 
                        }}
                        transition={{ 
                          duration: 1.5,
                          delay: 0.3 
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Progress Text and Milestone Labels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                key={currentStepIndex}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-amber-400 font-bold text-lg"
              >
                {Math.round(((currentStepIndex + 1) / stepOrder.length) * 100)}%
              </motion.div>
              <div className="text-gray-400 text-sm">
                Complete
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all
                ${currentStepIndex >= stepOrder.length - 1
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-amber-500/20 text-amber-400'
                }
              `}>
                {stepIcons[currentStep as WizardStep]}
                <span className="ml-2 capitalize hidden sm:inline">
                  {(currentStep as string).replace('_', ' ')}
                </span>
              </div>
              
              {currentStepIndex < stepOrder.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-gray-500 text-xs hidden md:block"
                >
                  {stepOrder.length - currentStepIndex - 1} step{stepOrder.length - currentStepIndex - 1 !== 1 ? 's' : ''} remaining
                </motion.div>
              )}
              
              {currentStepIndex === stepOrder.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-green-400 text-xs font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Almost there!
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        {currentStep !== 'preview' && (
          <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                ${canProceed()
                  ? 'bg-amber-500 text-white hover:bg-amber-400'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default MythologyWizard;
