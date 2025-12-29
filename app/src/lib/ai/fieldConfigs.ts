// =====================================================
// FIELD HELPER CONFIGURATIONS
// Suggestions, hints, and guidance for all creation forms
// =====================================================

import { FieldHelperConfig } from '@/components/ai/AIFieldHelper';

// =====================================================
// CHARACTER FIELD CONFIGS
// =====================================================

export const CHARACTER_FIELD_CONFIGS: Record<string, FieldHelperConfig> = {
  name: {
    fieldName: 'name',
    fieldLabel: 'Character Name',
    explanation: 'Names in mythology often have meaning! Greek names often described traits (Athena = wisdom), Norse names told stories (Thor = thunder).',
    suggestions: [
      { emoji: '⚡', text: 'Storm-related' },
      { emoji: '🌙', text: 'Moon/Night' },
      { emoji: '🔥', text: 'Fire/Sun' },
      { emoji: '💎', text: 'Earth/Stone' },
      { emoji: '🌊', text: 'Water/Sea' },
      { emoji: '🍃', text: 'Nature/Forest' },
    ],
    thinkAbout: [
      'What does this name MEAN? What would it translate to?',
      'Is it easy to say? Heroes need memorable names!',
      'Does it fit your mythology\'s culture?',
    ],
    stuckHints: [
      'Try combining two words: "Storm" + "bringer" = Stormbringer',
      'Use sounds that feel powerful: names with K, TH, or Z often sound strong',
      'Look at names from cultures that inspired your mythology',
      'What if the name describes what they DO or LOOK LIKE?',
    ],
  },

  archetype: {
    fieldName: 'archetype',
    fieldLabel: 'Archetype',
    explanation: 'An archetype is the "type" of character - the role they play in stories. Every mythology has warriors, tricksters, wise elders, etc.',
    realWorldExample: 'Loki is a Trickster. Odin is a Wise Elder. Achilles is a Warrior Hero.',
    suggestions: [
      { emoji: '⚔️', text: 'Warrior' },
      { emoji: '🎭', text: 'Trickster' },
      { emoji: '📚', text: 'Wise Elder' },
      { emoji: '🌿', text: 'Nature Spirit' },
      { emoji: '👑', text: 'Ruler' },
      { emoji: '💀', text: 'Death Guide' },
      { emoji: '🛡️', text: 'Protector' },
      { emoji: '🎨', text: 'Creator' },
      { emoji: '⚖️', text: 'Judge' },
      { emoji: '❤️', text: 'Lover' },
    ],
    thinkAbout: [
      'What role do they play in your mythology\'s stories?',
      'Are they someone people pray TO or someone people tell stories ABOUT?',
    ],
    stuckHints: [
      'Think about characters you love from movies/books - what archetype are they?',
      'Combine two archetypes: a "Warrior-Trickster" or "Creator-Destroyer"',
      'What archetype is MISSING from your mythology?',
    ],
  },

  domain: {
    fieldName: 'domain',
    fieldLabel: 'Domain / Sphere of Influence',
    explanation: 'A domain is what a god or figure has power over. Zeus had lightning, Poseidon had the sea, Hades had the underworld.',
    realWorldExample: 'Athena ruled Wisdom AND War Strategy - one god can have multiple connected domains!',
    suggestions: [
      { emoji: '⚡', text: 'Thunder & Lightning' },
      { emoji: '🌊', text: 'Oceans & Seas' },
      { emoji: '☀️', text: 'Sun & Light' },
      { emoji: '🌙', text: 'Moon & Night' },
      { emoji: '⚔️', text: 'War & Battle' },
      { emoji: '💕', text: 'Love & Beauty' },
      { emoji: '📚', text: 'Wisdom & Knowledge' },
      { emoji: '🌾', text: 'Agriculture & Harvest' },
      { emoji: '🔥', text: 'Fire & Forge' },
      { emoji: '💀', text: 'Death & Afterlife' },
      { emoji: '🎭', text: 'Chaos & Mischief' },
      { emoji: '⏰', text: 'Time & Fate' },
    ],
    thinkAbout: [
      'What do people in your world NEED? (food, protection, guidance)',
      'What natural forces affect your world? (storms, seasons, tides)',
      'What human activities need divine blessing? (war, marriage, crafts)',
    ],
    stuckHints: [
      'Think about what scares or amazes people - that often becomes a god\'s domain',
      'Connect the domain to your world\'s geography - a desert world needs a sun god!',
      'What if they control something unusual, like dreams, echoes, or memories?',
    ],
  },

  description: {
    fieldName: 'description',
    fieldLabel: 'Description',
    explanation: 'This is the "elevator pitch" for your character - who they are in 2-3 sentences.',
    thinkAbout: [
      'If someone asked "Who is this?", what would you say first?',
      'What makes them INTERESTING or UNIQUE?',
      'How do mortals in your world view them?',
    ],
    stuckHints: [
      'Start with: "[Name] is the [title/role] of [mythology]. They are known for..."',
      'Include ONE surprising detail that makes them memorable',
      'Mention how they relate to other gods or mortals',
    ],
    aiPromptContext: 'Help write a brief character description',
  },

  origin_story: {
    fieldName: 'origin_story',
    fieldLabel: 'Origin Story',
    explanation: 'How did this character come to exist? Were they born, created, or did they emerge from something?',
    realWorldExample: 'Athena sprang fully grown from Zeus\'s head. Aphrodite rose from sea foam. Jesus was born to a mortal mother.',
    thinkAbout: [
      'Were they always divine, or did they earn/gain their power?',
      'Who are their parents (if any)?',
      'Was there a special event at their "birth"?',
    ],
    stuckHints: [
      'Born from a natural phenomenon: emerged from a volcano, born during an eclipse',
      'Created by another god: crafted, dreamed into existence, split off from',
      'Self-created: always existed, formed from chaos, willed themselves into being',
      'Transformed: was mortal but became divine through a deed or sacrifice',
    ],
    aiPromptContext: 'Help write an origin story for a mythological character',
  },

  personality: {
    fieldName: 'personality',
    fieldLabel: 'Personality & Traits',
    explanation: 'Gods and heroes have BIG personalities! Their traits often connect to their domain.',
    realWorldExample: 'Ares (war god) was aggressive and bloodthirsty. Athena (wisdom goddess) was calm and strategic. Both were war deities but had opposite personalities!',
    suggestions: [
      { emoji: '😤', text: 'Proud' },
      { emoji: '😊', text: 'Kind' },
      { emoji: '🤔', text: 'Wise' },
      { emoji: '😈', text: 'Cunning' },
      { emoji: '😡', text: 'Wrathful' },
      { emoji: '🥺', text: 'Compassionate' },
      { emoji: '😎', text: 'Confident' },
      { emoji: '🤫', text: 'Mysterious' },
      { emoji: '😂', text: 'Playful' },
      { emoji: '😰', text: 'Jealous' },
    ],
    thinkAbout: [
      'What makes them ANGRY? What makes them HAPPY?',
      'How do they treat mortals? Other gods?',
      'What is their fatal flaw?',
    ],
    stuckHints: [
      'Give them a contradiction: wise but impatient, kind but easily offended',
      'Their personality could be the OPPOSITE of their domain (death god who loves life)',
      'Think about how their domain would affect their mood and behavior',
    ],
  },

  geography_connection: {
    fieldName: 'geography_connection',
    fieldLabel: 'Geography Connection',
    explanation: 'This is where the Five Themes come in! How does this character connect to PLACES in your world?',
    realWorldExample: 'Poseidon was tied to the ocean. River gods lived IN their rivers. Mountain gods resided on peaks.',
    thinkAbout: [
      'Where do they LIVE? (Location)',
      'What makes that place SPECIAL because of them? (Place)',
      'How do they CHANGE the environment? (Human-Environment Interaction)',
    ],
    stuckHints: [
      'Their domain might determine their home: fire god in a volcano, sea god in ocean depths',
      'They could be TRAPPED in a location, or CHOOSE to stay there',
      'What happens to the land when they\'re angry vs. happy?',
    ],
  },

  powers_abilities: {
    fieldName: 'powers_abilities',
    fieldLabel: 'Powers & Abilities',
    explanation: 'What can this character DO that others cannot? Powers usually connect to their domain.',
    realWorldExample: 'Zeus could throw lightning bolts, shapeshift, and control weather. Hades could turn invisible and command the dead.',
    suggestions: [
      { emoji: '🌩️', text: 'Control weather' },
      { emoji: '🔮', text: 'See the future' },
      { emoji: '🦅', text: 'Shapeshift' },
      { emoji: '💨', text: 'Super speed' },
      { emoji: '💪', text: 'Super strength' },
      { emoji: '👻', text: 'Invisibility' },
      { emoji: '🗣️', text: 'Command others' },
      { emoji: '✨', text: 'Create things' },
      { emoji: '💀', text: 'Power over death' },
      { emoji: '🧠', text: 'Read minds' },
    ],
    thinkAbout: [
      'What THREE things can ONLY they do?',
      'How do their powers connect to their domain?',
      'Are there limits or costs to using their powers?',
    ],
    stuckHints: [
      'Connect powers to domain: sea god can breathe underwater, cause tsunamis, talk to fish',
      'Give them a UNIQUE power no one else has',
      'What if their power has an unexpected use? (fire god can also heal fevers)',
    ],
  },

  weaknesses: {
    fieldName: 'weaknesses',
    fieldLabel: 'Weaknesses',
    explanation: 'Even gods have weaknesses! This makes them interesting and creates dramatic stories.',
    realWorldExample: 'Achilles was nearly invincible - except his heel. Samson lost his strength when his hair was cut. Superman is weak to Kryptonite.',
    suggestions: [
      { emoji: '💔', text: 'Love/emotions' },
      { emoji: '😤', text: 'Pride/hubris' },
      { emoji: '🎯', text: 'Specific weakness' },
      { emoji: '⏰', text: 'Time-limited power' },
      { emoji: '🔗', text: 'Bound by rules' },
      { emoji: '😴', text: 'Must rest/sleep' },
      { emoji: '🌑', text: 'Powerless at certain times' },
      { emoji: '🤝', text: 'Dependent on worship' },
    ],
    thinkAbout: [
      'What could DEFEAT them?',
      'What do they FEAR?',
      'What personality flaw gets them in trouble?',
    ],
    stuckHints: [
      'Opposite of their power: fire god weak to water, sun god powerless at night',
      'Emotional weakness: easily tricked by flattery, blinded by love, consumed by vengeance',
      'Physical weakness: a specific object, location, or substance that harms them',
    ],
  },

  appearance_description: {
    fieldName: 'appearance_description',
    fieldLabel: 'Physical Appearance',
    explanation: 'What does this character LOOK like? Gods often have striking, memorable appearances.',
    realWorldExample: 'Anubis had a jackal head. Shiva has blue skin and multiple arms. Thor was described as red-bearded and muscular.',
    suggestions: [
      { emoji: '👁️', text: 'Unusual eyes' },
      { emoji: '🦁', text: 'Animal features' },
      { emoji: '✨', text: 'Glowing/radiant' },
      { emoji: '🌈', text: 'Unusual colors' },
      { emoji: '👑', text: 'Wears symbols of power' },
      { emoji: '📏', text: 'Giant-sized' },
      { emoji: '🌀', text: 'Part elemental' },
      { emoji: '👤', text: 'Perfectly human' },
    ],
    thinkAbout: [
      'How would an artist draw them?',
      'What would someone notice FIRST?',
      'Does their appearance connect to their domain?',
    ],
    stuckHints: [
      'Give them ONE striking feature that\'s instantly recognizable',
      'Their appearance could reflect their domain: storm god with lightning in their hair',
      'Do they look the same to everyone, or can they change appearance?',
    ],
  },
};

// =====================================================
// CREATURE FIELD CONFIGS
// =====================================================

export const CREATURE_FIELD_CONFIGS: Record<string, FieldHelperConfig> = {
  name: {
    fieldName: 'name',
    fieldLabel: 'Creature Name',
    explanation: 'Creature names often describe what they ARE or what they DO.',
    realWorldExample: 'Cerberus means "spotted" in Greek. Werewolf = were (man) + wolf. Chimera combined parts of multiple animals.',
    suggestions: [
      { emoji: '🐺', text: 'Beast-style' },
      { emoji: '🐉', text: 'Dragon-style' },
      { emoji: '👻', text: 'Spirit-style' },
      { emoji: '🌊', text: 'Sea creature' },
      { emoji: '🦅', text: 'Flying creature' },
      { emoji: '🌲', text: 'Forest creature' },
    ],
    thinkAbout: [
      'What sound does the name make? Scary? Majestic?',
      'Could the name describe what the creature DOES?',
      'Is there a legend behind the name?',
    ],
    stuckHints: [
      'Combine two animal names: Serpent + Eagle = Serpeagle',
      'Use descriptive words: Shadowstalker, Flamemaw, Frostfang',
      'Name it after where it lives: Cave Lurker, Reef Terror',
    ],
  },

  description: {
    fieldName: 'description',
    fieldLabel: 'Description',
    explanation: 'Describe what this creature IS - a monster, a helper, a guardian?',
    thinkAbout: [
      'Is it feared or revered? Or both?',
      'How common is it in your world?',
      'What role does it play in your mythology?',
    ],
    stuckHints: [
      'Start with: "The [name] is a [type] creature known for..."',
      'Mention whether mortals fear it, worship it, or hunt it',
      'Include ONE thing that makes it unique in your world',
    ],
  },

  habitat: {
    fieldName: 'habitat',
    fieldLabel: 'Habitat',
    explanation: 'Where does this creature live? Its home should make sense for what it is.',
    realWorldExample: 'Sea serpents live in oceans. Dragons often live in mountains or caves. Forest spirits dwell in ancient woods.',
    suggestions: [
      { emoji: '🏔️', text: 'Mountains' },
      { emoji: '🌊', text: 'Ocean depths' },
      { emoji: '🌲', text: 'Ancient forest' },
      { emoji: '🏜️', text: 'Desert' },
      { emoji: '❄️', text: 'Frozen wastes' },
      { emoji: '🌋', text: 'Volcanic regions' },
      { emoji: '☁️', text: 'Sky/clouds' },
      { emoji: '🕳️', text: 'Underground' },
      { emoji: '🏛️', text: 'Ruins' },
      { emoji: '🌀', text: 'Between worlds' },
    ],
    thinkAbout: [
      'What environment suits their abilities?',
      'Why do they live THERE specifically?',
      'Can they survive outside their habitat?',
    ],
    stuckHints: [
      'Match habitat to abilities: fire creatures near volcanoes, ice creatures in frozen lands',
      'Give them an unusual home: a creature that lives in dreams, in echoes, in shadows',
      'Consider why they STAY there: guarding something? Trapped? Prefer solitude?',
    ],
  },

  abilities: {
    fieldName: 'abilities',
    fieldLabel: 'Abilities',
    explanation: 'What special things can this creature do? What makes it dangerous or useful?',
    realWorldExample: 'Basilisks could kill with a look. Phoenixes could be reborn from ashes. Pegasus could fly and create springs.',
    suggestions: [
      { emoji: '🔥', text: 'Breathes fire' },
      { emoji: '❄️', text: 'Freezing touch' },
      { emoji: '👁️', text: 'Deadly gaze' },
      { emoji: '🎭', text: 'Shapeshifting' },
      { emoji: '💨', text: 'Incredible speed' },
      { emoji: '🛡️', text: 'Impenetrable hide' },
      { emoji: '🧪', text: 'Venomous' },
      { emoji: '🎵', text: 'Hypnotic voice' },
      { emoji: '👻', text: 'Intangible' },
      { emoji: '🔄', text: 'Regeneration' },
    ],
    thinkAbout: [
      'What makes this creature a threat?',
      'Could any abilities be HELPFUL to humans?',
      'How do its abilities connect to its habitat?',
    ],
    stuckHints: [
      'Give it ONE signature ability everyone knows about',
      'Consider passive abilities too: always surrounded by mist, causes nightmares nearby',
      'What if its ability has an unexpected twist? (breathes freezing fire)',
    ],
  },

  cultural_significance: {
    fieldName: 'cultural_significance',
    fieldLabel: 'Cultural Significance',
    explanation: 'What does this creature MEAN to people in your mythology? Is it a symbol? An omen?',
    realWorldExample: 'Dragons in Chinese mythology symbolize power and good fortune. In European myths, they represented chaos and evil.',
    thinkAbout: [
      'Do people fear it, worship it, or try to tame it?',
      'Are there stories or legends about it?',
      'Does seeing one mean something special?',
    ],
    stuckHints: [
      'Is it connected to a god or hero? (Apollo\'s sacred deer, Odin\'s ravens)',
      'Does it appear in prophecies or omens?',
      'Are there festivals, rituals, or taboos related to it?',
    ],
  },

  origin_story: {
    fieldName: 'origin_story',
    fieldLabel: 'Origin Story',
    explanation: 'Where did this creature come from? Was it created, born, or did it evolve?',
    realWorldExample: 'Medusa was transformed by a goddess as punishment. The Minotaur was born from a curse. Dragons were often primordial beings.',
    thinkAbout: [
      'Did a god create it? If so, why?',
      'Is it a natural part of your world or an aberration?',
      'Is there a first one, or have they always existed?',
    ],
    stuckHints: [
      'Created by a god: as a guardian, as a punishment, as a companion',
      'Cursed or transformed: was once something else (human, another creature)',
      'Natural: evolved in your world, born from elemental forces',
      'Accidental: created by magic gone wrong, emerged from a cosmic event',
    ],
  },

  weaknesses: {
    fieldName: 'weaknesses',
    fieldLabel: 'Weaknesses',
    explanation: 'Every creature should have weaknesses - this is how heroes defeat them!',
    realWorldExample: 'Vampires are weak to sunlight and garlic. Werewolves to silver. Trolls turn to stone in daylight.',
    suggestions: [
      { emoji: '☀️', text: 'Sunlight' },
      { emoji: '💧', text: 'Water' },
      { emoji: '🔥', text: 'Fire' },
      { emoji: '🎵', text: 'Music' },
      { emoji: '✝️', text: 'Sacred symbols' },
      { emoji: '🌿', text: 'Certain plants' },
      { emoji: '💎', text: 'Specific material' },
      { emoji: '🪞', text: 'Mirrors/reflection' },
      { emoji: '🔔', text: 'Bells/sound' },
      { emoji: '❤️', text: 'True love/kindness' },
    ],
    thinkAbout: [
      'What is the OPPOSITE of its power?',
      'How could a clever mortal defeat it?',
      'Is the weakness well-known or a secret?',
    ],
    stuckHints: [
      'Opposite element: fire creature weak to water, shadow creature weak to light',
      'Behavioral weakness: easily tricked, extremely territorial, can\'t resist challenges',
      'Specific item: a legendary weapon, a rare herb, a sacred artifact',
    ],
  },
};

// =====================================================
// RELATIONSHIP FIELD CONFIGS
// =====================================================

export const RELATIONSHIP_FIELD_CONFIGS: Record<string, FieldHelperConfig> = {
  relationship_type: {
    fieldName: 'relationship_type',
    fieldLabel: 'Relationship Type',
    explanation: 'How are these two connected? Family, love, rivalry, or something else?',
    realWorldExample: 'Zeus and Hera were married. Thor and Loki were adopted brothers. Athena and Poseidon were rivals for Athens.',
    suggestions: [
      { emoji: '👨‍👩‍👧', text: 'Parent/Child' },
      { emoji: '👫', text: 'Siblings' },
      { emoji: '💕', text: 'Romantic' },
      { emoji: '⚔️', text: 'Rivals' },
      { emoji: '🤝', text: 'Allies' },
      { emoji: '👑', text: 'Ruler/Subject' },
      { emoji: '📚', text: 'Mentor/Student' },
      { emoji: '😠', text: 'Enemies' },
      { emoji: '🤔', text: 'Creator/Creation' },
      { emoji: '⚖️', text: 'Opposites/Balance' },
    ],
    thinkAbout: [
      'How did this relationship BEGIN?',
      'Is it stable or does it change over time?',
      'How does each person FEEL about the other?',
    ],
    stuckHints: [
      'Mythology loves COMPLICATED relationships: allies who become enemies, enemies who fall in love',
      'Consider asymmetric relationships: one loves, one is indifferent',
      'Family relationships drive LOTS of mythology stories',
    ],
  },

  story: {
    fieldName: 'story',
    fieldLabel: 'Relationship Story',
    explanation: 'Every relationship has a story! How did it start? What happened?',
    thinkAbout: [
      'What\'s the ORIGIN of this relationship?',
      'Has it changed over time?',
      'What\'s the most dramatic moment between them?',
    ],
    stuckHints: [
      'Start with how they MET or first interacted',
      'Include a conflict or turning point',
      'Mention how their relationship affects others in your mythology',
    ],
    aiPromptContext: 'Help write the story of how two mythological figures are connected',
  },

  impact: {
    fieldName: 'impact',
    fieldLabel: 'Impact on Mythology',
    explanation: 'How does this relationship affect your world? Does it cause wars, create alliances, shape events?',
    realWorldExample: 'The rivalry between Athena and Poseidon determined which god protected Athens. The love of Orpheus and Eurydice created a story about death.',
    thinkAbout: [
      'What EVENTS happened because of this relationship?',
      'How do mortals view this relationship?',
      'Does it affect geography, seasons, or natural phenomena?',
    ],
    stuckHints: [
      'Their relationship could explain something: why seasons change, why a mountain exists',
      'Their conflicts could cause disasters: storms, plagues, wars',
      'Their cooperation could bring blessings: harvests, peace, knowledge',
    ],
  },
};

// =====================================================
// STORY FIELD CONFIGS
// =====================================================

export const STORY_FIELD_CONFIGS: Record<string, FieldHelperConfig> = {
  title: {
    fieldName: 'title',
    fieldLabel: 'Story Title',
    explanation: 'A good title hints at what the story is about while creating intrigue.',
    suggestions: [
      { emoji: '⚔️', text: 'The Battle of...' },
      { emoji: '📜', text: 'The Legend of...' },
      { emoji: '🌅', text: 'How ... Began' },
      { emoji: '💔', text: 'The Tragedy of...' },
      { emoji: '🎁', text: '...\'s Gift' },
      { emoji: '😤', text: 'The Wrath of...' },
      { emoji: '🔍', text: 'The Quest for...' },
      { emoji: '💀', text: 'The Fall of...' },
    ],
    stuckHints: [
      'Name the main character or location: "Thor\'s Journey to Jotunheim"',
      'Describe the main event: "The Theft of Fire"',
      'Ask a question: "Why the Sun Hides at Night"',
    ],
  },

  content: {
    fieldName: 'content',
    fieldLabel: 'Story Content',
    explanation: 'This is where you tell the actual myth! Include a beginning, conflict, and resolution.',
    thinkAbout: [
      'How does the story START? Set the scene.',
      'What PROBLEM or CONFLICT drives the story?',
      'How does it END? What\'s the lesson or result?',
    ],
    stuckHints: [
      'Start with "Long ago..." or "In the time before..."',
      'Include dialogue - let your characters speak!',
      'End with how this story affects the world TODAY',
    ],
    aiPromptContext: 'Help outline or improve a mythology story',
  },

  moral: {
    fieldName: 'moral',
    fieldLabel: 'Moral / Theme',
    explanation: 'Most myths teach a lesson or explain something about the world.',
    realWorldExample: 'Icarus taught: don\'t be too ambitious. Pandora\'s Box taught: curiosity has consequences but hope remains.',
    suggestions: [
      { emoji: '⚠️', text: 'Hubris brings downfall' },
      { emoji: '💪', text: 'Perseverance wins' },
      { emoji: '🤝', text: 'Unity is strength' },
      { emoji: '⚖️', text: 'Balance is key' },
      { emoji: '🌱', text: 'Growth through struggle' },
      { emoji: '❤️', text: 'Love conquers all' },
      { emoji: '🧠', text: 'Wisdom over strength' },
      { emoji: '🔄', text: 'Everything has cycles' },
    ],
    thinkAbout: [
      'What would ancient people LEARN from this story?',
      'Does it explain a natural phenomenon?',
      'Does it teach a value or warn against a behavior?',
    ],
    stuckHints: [
      'Think about what goes WRONG in the story - that often reveals the lesson',
      'Consider what the hero LEARNS by the end',
      'Myths often explain "why" - why we have seasons, death, fire, etc.',
    ],
  },
};
