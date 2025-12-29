// =====================================================
// AI PROMPT LIBRARY
// All prompts for the AI assistance system
// =====================================================

// System context that goes with every prompt
export const SYSTEM_CONTEXT = `You are a creative writing assistant helping middle school students (grades 6-8) create original mythologies. Your role is to HELP them think creatively, not to write for them.

CORE RULES:
1. NEVER write complete content for them - give options, ask questions, inspire
2. Always ask follow-up questions to unlock their creativity
3. Suggest multiple options and let them choose
4. Be encouraging and celebrate creative/weird ideas
5. Connect everything to geography when possible
6. Use age-appropriate language (6th-8th grade level)
7. Keep responses concise - under 200 words for help buttons, under 400 for wizard
8. Use emojis sparingly but effectively for engagement
9. Never dismiss an idea as "too weird" - find the brilliance in it
10. Reference the Five Themes of Geography when relevant

TONE: Enthusiastic mentor, not preachy teacher. Think "cool librarian who loves mythology."`;

// =====================================================
// MYTHOLOGY CATEGORIES
// =====================================================

export const MYTHOLOGY_CATEGORIES = {
  classic: {
    id: 'classic',
    name: 'Classic Mythology',
    icon: '🏛️',
    description: 'Traditional pantheon-style mythologies inspired by ancient cultures',
    color: 'from-amber-500 to-orange-600',
    presets: [
      { 
        id: 'greek_roman', 
        name: 'Greek/Roman Style', 
        hint: 'Olympian hierarchy, heroic quests',
        description: 'Think Percy Jackson! Gods live on Mount Olympus, have human-like personalities (and drama!), send heroes on epic quests, and control elements like thunder, the sea, and wisdom. Famous gods: Zeus, Athena, Poseidon.'
      },
      { 
        id: 'norse', 
        name: 'Norse Style', 
        hint: 'Asgard, Valhalla, Ragnarok',
        description: 'Like Thor and God of War! Vikings believed in warrior gods who live in Asgard, connected to Earth by a rainbow bridge. Features epic battles, giants, world-ending prophecies (Ragnarok), and heroes who feast in Valhalla after death.'
      },
      { 
        id: 'egyptian', 
        name: 'Egyptian Style', 
        hint: 'Pharaohs, afterlife, animal-headed gods',
        description: 'Ancient Egypt\'s gods have animal heads (falcon, jackal, cat) and human bodies. Focus on the afterlife journey, the sun god Ra crossing the sky daily, mummification, and pharaohs as living gods. The Nile River is sacred.'
      },
      { 
        id: 'celtic', 
        name: 'Celtic Style', 
        hint: 'Nature spirits, druids, fae',
        description: 'From ancient Ireland, Scotland, and Wales. Features powerful nature spirits, shape-shifting gods, druids (wise priests), the fairy realm (Otherworld), sacred groves, and festivals tied to seasons. Everything in nature has spirit.'
      },
      { 
        id: 'asian', 
        name: 'Asian Inspired', 
        hint: 'Dragons, ancestors, cosmic balance',
        description: 'Draws from Chinese, Japanese, Korean, and other Asian traditions. Features wise dragons (symbols of power, not evil!), ancestor spirits who guide the living, balance between opposing forces (yin/yang), and nature spirits.'
      },
      { 
        id: 'african', 
        name: 'African Inspired', 
        hint: 'Oral traditions, trickster spirits',
        description: 'Africa has hundreds of rich traditions! Common themes: clever trickster spirits (like Anansi the spider), powerful creator gods, ancestor worship, nature spirits, and stories passed down through storytelling and song.'
      },
      { 
        id: 'alaska_native', 
        name: 'Alaska Native',
        hint: 'Raven, salmon, northern lights, respect for land',
        description: 'Alaska\'s Indigenous peoples have rich cultural traditions. The Ahtna ("Ice People") live along the Copper River and honor salmon, moose, and the land. Yup\'ik, Tlingit, Haida, and Inupiat peoples have traditions featuring Raven as creator/trickster, the Northern Lights as spirits, and deep respect for animals and nature. NOT myths—these are living cultures.'
      },
      { 
        id: 'indigenous_americas', 
        name: 'Other Indigenous Americas', 
        hint: 'Nature connections, origin stories',
        description: 'Native American and First Nations peoples have diverse traditions across North and South America. Common themes: deep connection to land and animals, origin stories explaining how the world began, respect for all living things, and the importance of community and elders.'
      },
    ],
  },
  historical: {
    id: 'historical',
    name: 'Historical Remix',
    icon: '⚔️',
    description: 'Real historical periods reimagined with mythological elements',
    color: 'from-red-500 to-rose-600',
    presets: [
      { id: 'ancient', name: 'Ancient World', hint: 'Bronze Age, Iron Age civilizations', description: 'Reimagine the earliest human civilizations (Mesopotamia, early China, Indus Valley) with gods that explain their world—why rivers flood, why bronze was discovered, why cities rose.' },
      { id: 'medieval', name: 'Medieval Europe', hint: 'Knights, castles, crusades', description: 'The age of castles, knights, and epic quests! Create gods of chivalry, patron saints of kingdoms, spirits haunting ancient keeps, and mythical creatures in enchanted forests.' },
      { id: 'renaissance', name: 'Renaissance', hint: 'Art, science, exploration', description: 'When art and science exploded! Imagine muses inspiring da Vinci, gods of discovery watching explorers sail to new worlds, and spirits of invention whispering to inventors.' },
      { id: 'industrial', name: 'Industrial Revolution', hint: 'Steam, machines, progress', description: 'Factories, steam engines, and change! Create gods of industry and progress, spirits of machines, railroad deities, and the clash between old nature spirits and new machine gods.' },
      { id: 'world_wars', name: 'World Wars Era', hint: 'Military might, tank gods, aerial deities', description: 'The age of global conflict. Imagine war gods watching battles, spirits of fallen soldiers, deities of new technologies like tanks and planes, and the struggle for peace.' },
      { id: 'cold_war', name: 'Cold War', hint: 'Espionage, nuclear age, space race', description: 'Spies, secrets, and the space race! Create gods of atomic power, spirits of the Iron Curtain, deities racing to the moon, and beings watching from behind shadows.' },
    ],
  },
  future: {
    id: 'future',
    name: 'Future Worlds',
    icon: '🚀',
    description: 'Science fiction and speculative future mythologies',
    color: 'from-cyan-500 to-blue-600',
    presets: [
      { id: 'near_future', name: 'Near Future (2025-2100)', hint: 'Climate change, AI, space stations', description: 'What if gods emerged from our near future? Deities of climate and weather, AI beings gaining consciousness, spirits of space stations, and new mythologies for a changing world.' },
      { id: 'far_future', name: 'Far Future (2100+)', hint: 'Interstellar travel, alien contact', description: 'Humanity among the stars! Create gods of distant planets, beings that exist between galaxies, first contact with cosmic entities, and mythologies that span light-years.' },
      { id: 'post_apocalyptic', name: 'Post-Apocalyptic', hint: 'After the fall, rebuilding', description: 'After civilization falls, new myths rise. Gods of the wasteland, spirits of the old world, heroes rebuilding from ruins, and new religions forming from survivors\' hopes.' },
      { id: 'cyberpunk', name: 'Cyberpunk', hint: 'Neon cities, corporate gods, digital realms', description: 'Neon-lit megacities and digital consciousness! Create gods of cyberspace, corporate deities, hacker spirits, and the mythology of humans merging with technology.' },
      { id: 'space_opera', name: 'Space Opera', hint: 'Galactic empires, cosmic forces', description: 'Epic scale across the universe! Think Star Wars—galactic empires, ancient cosmic forces, prophecies spanning millennia, and beings of unimaginable power.' },
      { id: 'solarpunk', name: 'Solarpunk', hint: 'Utopian eco-futures, harmony with nature', description: 'A hopeful future where technology and nature unite! Gods of renewable energy, spirits of restored ecosystems, and mythologies celebrating balance and sustainability.' },
    ],
  },
  modern: {
    id: 'modern',
    name: 'Modern & Weird',
    icon: '🏙️',
    description: 'Contemporary settings with mythological twists - get creative!',
    color: 'from-purple-500 to-pink-600',
    presets: [
      { id: 'urban_fantasy', name: 'Urban Fantasy', hint: 'Gods walk among us in modern cities', description: 'Ancient gods hiding in modern cities! Imagine Zeus running a coffee shop, Anubis as a funeral director, or Thor as a construction worker. The magical world exists alongside ours.' },
      { id: 'school', name: 'School Gods', hint: 'Deities of hallways, cafeterias, lockers', description: 'What if schools had their own gods? The deity of pop quizzes, the spirit that lives in the gym equipment room, the goddess of the lunch line. School life becomes epic!' },
      { id: 'internet', name: 'Internet/Meme Gods', hint: 'Viral spirits, algorithm deities', description: 'The mythology of the digital age! Gods born from viral videos, spirits that live in WiFi signals, the algorithm as an all-knowing entity, and memes as modern prayers.' },
      { id: 'suburban', name: 'Suburban Mythology', hint: 'Cul-de-sac kingdoms, lawn care wars', description: 'Epic tales of neighborhood life! The god of perfectly-trimmed lawns, spirits haunting HOA meetings, mailbox guardians, and the eternal battle for the best Halloween decorations.' },
      { id: 'corporate', name: 'Corporate Pantheon', hint: 'Gods of startups, meetings, spreadsheets', description: 'Office life as mythology! Deities of spreadsheets and deadlines, the spirit of the coffee machine, gods that determine who gets promoted, and sacred rituals of the quarterly review.' },
      { id: 'kitchen', name: 'Kitchen/Household', hint: 'The epic mythology of everyday objects', description: 'The secret lives of household items! The refrigerator as a frost giant, the mighty god of the garbage disposal, spirits living in junk drawers, and the eternal quest for matching socks.' },
    ],
  },
  abstract: {
    id: 'abstract',
    name: 'Abstract & Cosmic',
    icon: '🌀',
    description: 'Conceptual, philosophical, or universe-scale mythologies',
    color: 'from-indigo-500 to-violet-600',
    presets: [
      { id: 'cosmic_horror', name: 'Cosmic Horror', hint: 'Lovecraftian vastness, unknowable entities', description: 'Beings so vast and alien that humans can barely comprehend them. Ancient entities sleeping in the depths, cosmic forces indifferent to humanity, and the terror of infinite space.' },
      { id: 'mathematical', name: 'Mathematical Gods', hint: 'Deities of numbers, patterns, infinity', description: 'What if math was divine? Gods of prime numbers, the spirit of Pi that never ends, beings that exist in infinite dimensions, and the sacred geometry underlying reality.' },
      { id: 'emotional', name: 'Emotional Pantheon', hint: 'Gods of feelings, memories, dreams', description: 'Gods that ARE emotions. Joy and Sorrow as siblings, the deity of first crushes, spirits that guard your happiest memories, and nightmare beings that feed on fear.' },
      { id: 'artistic', name: 'Music/Art Mythology', hint: 'Muses, creative forces, inspiration', description: 'Where does inspiration come from? Muses that whisper to artists, gods of different music genres, spirits that live in paintings, and the mythology of creativity itself.' },
      { id: 'temporal', name: 'Time & Space', hint: 'Gods of dimensions, possibilities', description: 'Beings that exist outside time! Gods who see all possible futures, spirits of moments frozen in time, deities of alternate dimensions, and the mythology of "what if?"' },
      { id: 'chromatic', name: 'Color/Light Mythology', hint: 'Beings behind the spectrum', description: 'A mythology of light and color! Gods that embody different colors, the war between Light and Shadow, beings made of pure wavelengths, and the spirits within rainbows.' },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Totally Custom',
    icon: '✨',
    description: 'Complete freedom - no presets, full creativity',
    color: 'from-emerald-500 to-teal-600',
    presets: [],
  },
};

// =====================================================
// WIZARD PROMPTS
// =====================================================

export const WIZARD_PROMPTS = {
  // Step 1: Category Selection
  category_welcome: `Welcome to the Mythology Creation Wizard! 🎭

You're about to create something amazing - your very own mythology with gods, creatures, and epic stories.

First question: What KIND of mythology calls to you?

Choose a category that excites you. There's no wrong answer - even "kitchen gods" and "school deities" make for incredible mythologies!`,

  category_response: (category: string, preset?: string) => `
Excellent choice! ${getCategoryEmoji(category)} ${getCategoryName(category)} mythologies are fascinating!

${preset ? `"${preset}" - I can already picture the possibilities...` : "You're going fully custom - I love the ambition!"}

Now let's figure out WHERE your mythology exists. Every mythology has a place - even gods of the internet have their digital realms!`,

  // Step 2: Geography
  geography_intro: (category: string) => `
🌍 **THE GEOGRAPHY OF YOUR WORLD**

Every mythology exists SOMEWHERE. ${getGeographyHook(category)}

Let's explore:
1. **Environment**: What does the physical world look like?
2. **Climate**: What's the weather and atmosphere?
3. **Key Features**: What landmarks or locations matter most?

Don't worry about being "realistic" - a mythology of kitchen gods still has geography (the refrigerator realm, the stovetop battleground, etc.)!`,

  geography_help: (category: string, userInput: string) => `
Based on your ${getCategoryName(category)} mythology${userInput ? ` and what you've shared ("${userInput}")` : ''}, here are some geography ideas:

${getGeographySuggestions(category)}

💡 Remember: Geography shapes belief! A desert mythology will have different gods than an ocean one.

What environment calls to your mythology?`,

  // Step 3: Five Themes
  five_themes_intro: `
📚 **THE FIVE THEMES OF GEOGRAPHY**

Real geographers use five themes to understand any place. Let's apply them to YOUR mythology - this will make it richer and more believable!

I'll ask you a quick question about each theme. Your answers will help shape everything from your gods' powers to your world's conflicts.

Ready? Let's go! 🚀`,

  five_themes_questions: {
    location: `📍 **LOCATION**: Where exactly is your mythology's center of power?
    
Think about:
- Is there a "Mount Olympus" equivalent?
- Where do your most powerful beings live?
- What's special about this location?`,

    place: `🏔️ **PLACE**: What makes your world UNIQUE and recognizable?

Think about:
- What would someone see, hear, or feel there?
- What physical features stand out?
- What customs or rules exist?`,

    interaction: `🤝 **HUMAN-ENVIRONMENT INTERACTION**: How do your beings SHAPE and ADAPT to their world?

Think about:
- Do they build, destroy, or transform the environment?
- How does the environment give them power or limit them?
- What happens when they fight? Does the world change?`,

    movement: `🚶 **MOVEMENT**: What TRAVELS through your mythology's world?

Think about:
- How do beings move between realms or regions?
- How do ideas, stories, or worship spread?
- Are there migrations, pilgrimages, or journeys?`,

    regions: `🗺️ **REGIONS**: What different AREAS exist within your world?

Think about:
- Are there kingdoms, territories, or zones?
- What separates one region from another?
- Do different gods control different areas?`,
  },

  // Step 4: Name Brainstorming
  name_brainstorm: (wizardData: WizardData) => `
🎭 **NAME YOUR MYTHOLOGY**

Based on everything you've created:
- Category: ${getCategoryName(wizardData.category)}
- Setting: ${wizardData.geography?.environment || 'Your unique world'}
- Core Theme: ${wizardData.five_themes?.place || 'Epic mythology'}

Here are some name suggestions:

${generateNameSuggestions(wizardData)}

✨ Or create your own name! What title captures your mythology's essence?`,

  // Step 5: Preview
  preview_intro: (name: string) => `
🌟 **YOUR WORLD AWAITS** 🌟

Behold...

✨ ${name.toUpperCase()} ✨

This is just the beginning! Here's what you can create:

👑 **GODS & HEROES** - The powerful beings of your world
🐉 **CREATURES** - Monsters, beasts, and magical beings  
📜 **STORIES** - Epic tales of conflict and adventure
🗺️ **MAPS** - Chart your world's geography
⚔️ **BATTLES** - Pit your creations against each other
🤝 **CROSSOVERS** - Connect with other mythologies

Your legend starts NOW!`,
};

// =====================================================
// FIELD HELP PROMPTS
// =====================================================

export const FIELD_HELP_PROMPTS = {
  // Character fields
  character: {
    name: {
      give_ideas: (context: FieldContext) => `
Suggest 6-8 character names for a ${context.entityDetails?.character_type || 'mythological figure'} in a ${getCategoryName(context.mythologyCategory)} mythology.

Context:
- Mythology: ${context.mythologyName}
- Setting: ${context.mythologyGeography || 'varied'}
${context.existingContent ? `- Current name attempt: "${context.existingContent}"` : ''}

Provide names that:
1. Sound powerful and memorable
2. Might have meaning related to their role
3. Fit the mythology's cultural style
4. Are pronounceable for middle schoolers

Format as a numbered list with brief explanations of each name's meaning or feel.`,

      ask_questions: (context: FieldContext) => `
The student is naming a ${context.entityDetails?.character_type || 'character'} in "${context.mythologyName}".

Ask 4-5 creative questions to help them discover the perfect name:
- What sounds or letters feel right for this character?
- What does this character control or represent?
- Should the name be familiar or completely unique?
- What emotion should the name evoke?

Be conversational and encouraging.`,

      improve: (context: FieldContext) => `
The student wrote "${context.existingContent}" as a name for their ${context.entityDetails?.character_type || 'character'}.

Give feedback that:
1. Finds something good about the name
2. Suggests 2-3 variations or improvements
3. Asks what feeling they want the name to convey

Never say the name is "bad" - help them refine it.`,

      check_fit: (context: FieldContext) => `
Does the name "${context.existingContent}" fit well in "${context.mythologyName}" (${getCategoryName(context.mythologyCategory)} style)?

Analyze:
1. Does it match the cultural/aesthetic feel?
2. Does it convey appropriate power/status?
3. How does it compare to other names in this mythology?
4. Any concerns or suggestions?

Be supportive but honest.`,
    },

    description: {
      give_ideas: (context: FieldContext) => `
Help the student describe their ${context.entityDetails?.character_type || 'character'} "${context.entityDetails?.name || 'character'}".

Suggest:
1. Three different approaches to the description (dramatic, mysterious, action-focused)
2. Key elements to include (appearance, personality hint, power hint)
3. An opening line example for each approach

DON'T write the full description - give them starting points.`,

      ask_questions: (context: FieldContext) => `
The student is describing "${context.entityDetails?.name || 'their character'}".

Ask 5 questions that will help them write a vivid description:
- What's the FIRST thing people notice about them?
- What emotion do they inspire in others?
- How do they move or carry themselves?
- What's surprising or unexpected about them?
- What detail would someone remember forever?`,

      improve: (context: FieldContext) => `
The student wrote this description:
"${context.existingContent}"

Provide feedback that:
1. Identifies 2-3 strong elements
2. Suggests one area to expand (more sensory detail? emotion? action?)
3. Offers a specific technique (like "show don't tell" or "use active verbs")

Keep it encouraging and specific.`,
    },

    domain: {
      give_ideas: (context: FieldContext) => `
Suggest domains/spheres of influence for "${context.entityDetails?.name || 'this character'}" (${context.entityDetails?.character_type || 'deity'}) in "${context.mythologyName}".

Consider the mythology's setting: ${context.mythologyGeography || 'varied'}

Provide:
1. 6-8 domain suggestions that fit the mythology
2. Brief explanation of why each fits
3. Note any interesting combinations

Domains should be thematically appropriate for ${getCategoryName(context.mythologyCategory)} mythology.`,

      ask_questions: (context: FieldContext) => `
Help the student discover what domain "${context.entityDetails?.name || 'their character'}" should control.

Ask questions like:
- What problem does your mythology's world face? Your god might control the solution
- What do people in your world fear or desire most?
- What element of your geography could use a guardian?
- What abstract concept (love, war, chaos) fits their personality?`,
    },

    powers_abilities: {
      give_ideas: (context: FieldContext) => `
Suggest powers for "${context.entityDetails?.name || 'this character'}" who controls ${context.entityDetails?.domain || 'their domain'}.

For a ${context.entityDetails?.character_type || 'character'}, suggest:
1. 3-4 major powers related to their domain
2. 2-3 minor/utility abilities
3. One unique signature move
4. A limitation or cost to their power (makes it interesting!)

Power level should match their type (gods > demigods > heroes > mortals).`,
    },

    weaknesses: {
      give_ideas: (context: FieldContext) => `
Every great character needs weaknesses! For "${context.entityDetails?.name || 'this character'}":

Suggest different types of weaknesses:
1. Physical vulnerabilities (what can hurt them?)
2. Emotional weaknesses (pride, love, fear?)
3. Circumstantial limits (when are they powerless?)
4. Story-driving flaws (what mistake might they make?)

Weaknesses make characters BETTER, not worse. They create drama and relatability.`,
    },

    origin_story: {
      give_ideas: (context: FieldContext) => `
Help brainstorm an origin story for "${context.entityDetails?.name || 'this character'}".

Origin story archetypes to consider:
1. **Born of Elements** - Created from natural forces
2. **Child of Gods** - Divine parentage, expectations
3. **Made, Not Born** - Crafted or transformed
4. **Self-Created** - Emerged from nothing or chaos
5. **Mortal Ascended** - Started human, became divine

Which fits "${context.entityDetails?.name || 'this character'}"? What happened in their early existence?`,

      ask_questions: (context: FieldContext) => `
To write an origin story for "${context.entityDetails?.name || 'this character'}", consider:

- Were they always divine, or did they become so?
- Who or what created them? Why?
- What was the world like when they first appeared?
- What was their first act or discovery?
- Did they have mentors, rivals, or companions from the start?
- What event shaped who they would become?`,
    },

    geography_connection: {
      give_ideas: (context: FieldContext) => `
Connect "${context.entityDetails?.name || 'this character'}" to geography!

For ${getCategoryName(context.mythologyCategory)} mythology set in ${context.mythologyGeography || 'your world'}:

The Five Themes of Geography apply:
1. **Location**: Where is their sacred place? Their throne?
2. **Place**: How does the environment shape their appearance/powers?
3. **Interaction**: Do they transform the landscape? Protect it? Destroy it?
4. **Movement**: Do they travel? Create paths? Control borders?
5. **Region**: What territory do they rule or influence?

Give specific suggestions for each theme.`,
    },
  },

  // Creature fields
  creature: {
    name: {
      give_ideas: (context: FieldContext) => `
Suggest 6-8 creature names for a ${context.entityDetails?.creature_type || 'mythological beast'} in "${context.mythologyName}".

Consider:
- Danger level: ${context.entityDetails?.danger_level || 'varies'}
- Size: ${context.entityDetails?.size_category || 'varies'}
- Setting: ${context.mythologyGeography || 'varied'}

Creature names can be:
1. Descriptive (what it looks like or does)
2. Fear-inducing (ancient language, harsh sounds)
3. Ironic (cute name, terrifying creature)
4. Compound (combines two concepts)

Provide brief notes on each name's feel.`,

      ask_questions: (context: FieldContext) => `
Help name this ${context.entityDetails?.creature_type || 'creature'}:

- What sound would it make? The name could echo that
- Is it feared, worshipped, or hunted?
- Does it have a habitat that could inspire the name?
- Should the name be speakable (or is it too terrifying to name)?
- What emotion should people feel hearing its name?`,
    },

    abilities: {
      give_ideas: (context: FieldContext) => `
Suggest abilities for this ${context.entityDetails?.creature_type || 'creature'}:
- Danger Level: ${context.entityDetails?.danger_level || 'unknown'}
- Size: ${context.entityDetails?.size_category || 'medium'}
- Setting: ${context.mythologyGeography || 'varied'}

Suggest:
1. Primary attack/defense abilities
2. Movement abilities
3. Unique special ability
4. Sensory abilities
5. Any magical properties

Scale power to danger level. A "harmless" creature needs different abilities than a "catastrophic" one.`,
    },

    habitat: {
      give_ideas: (context: FieldContext) => `
Where does this ${context.entityDetails?.creature_type || 'creature'} live?

In "${context.mythologyName}" (${context.mythologyGeography || 'your world'}):

Consider:
1. Primary habitat (where it's most common)
2. Nesting/sleeping areas
3. Hunting grounds
4. Sacred spaces associated with it
5. Places it avoids (and why)

Remember: habitat shapes the creature and vice versa!`,
    },
  },

  // Story fields
  story: {
    title: {
      give_ideas: (context: FieldContext) => `
Suggest 6-8 story titles for ${context.entityDetails?.story_type || 'an epic tale'} in "${context.mythologyName}".

Great mythology story titles often:
1. Reference the hero or god by name or title
2. Hint at conflict or transformation
3. Use powerful imagery
4. Create mystery or intrigue

Provide titles with brief notes on what story each suggests.`,
    },

    content: {
      ask_questions: (context: FieldContext) => `
You're writing a ${context.entityDetails?.story_type || 'story'} called "${context.entityDetails?.title || 'your epic tale'}".

Before writing, consider:
- Who is the main character? What do they want?
- What's stopping them? (Conflict!)
- Where does this take place? How does setting affect events?
- What's at stake? Why should we care?
- How does it end? (Or does it leave us wondering?)

Start with one scene - the most exciting moment. We can build from there!`,

      improve: (context: FieldContext) => `
Review this story excerpt:
"${context.existingContent?.substring(0, 500)}${context.existingContent && context.existingContent.length > 500 ? '...' : ''}"

Provide feedback on:
1. What's working well (be specific!)
2. One area to strengthen (action? dialogue? description?)
3. A specific suggestion to try

Remember: celebrate their creativity while helping them grow.`,
    },
  },

  // Mythology fields
  mythology: {
    description: {
      give_ideas: (context: FieldContext) => `
Help describe "${context.mythologyName}" (${getCategoryName(context.mythologyCategory)} mythology).

A great mythology description includes:
1. The setting/world in one vivid sentence
2. The central theme or conflict
3. What makes it unique
4. A hook that makes people want to explore

Suggest 3 different approaches - dramatic, mysterious, and action-focused.`,

      ask_questions: (context: FieldContext) => `
To describe "${context.mythologyName}", think about:

- If your mythology was a movie, what would the trailer show?
- What's the big conflict that drives everything?
- What makes YOUR gods/world different from existing mythologies?
- What emotion should readers feel when they hear about it?
- In one sentence, why should someone explore your mythology?`,
    },
  },
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getCategoryEmoji(category: string | undefined): string {
  if (!category) return '✨';
  const emojis: Record<string, string> = {
    classic: '🏛️',
    historical: '⚔️',
    future: '🚀',
    modern: '🏙️',
    abstract: '🌀',
    custom: '✨',
  };
  return emojis[category] || '✨';
}

function getCategoryName(category: string | undefined): string {
  if (!category) return 'Creative';
  const names: Record<string, string> = {
    classic: 'Classic',
    historical: 'Historical Remix',
    future: 'Future Worlds',
    modern: 'Modern & Weird',
    abstract: 'Abstract & Cosmic',
    custom: 'Custom',
  };
  return names[category] || 'Creative';
}

function getGeographyHook(category: string | undefined): string {
  const hooks: Record<string, string> = {
    classic: "Ancient civilizations were shaped by their lands - mountains bred sky gods, oceans created sea deities.",
    historical: "Real history happened in real places. Where did your mythological version unfold?",
    future: "Even in space or cyberspace, there's geography - server farms, space stations, terraformed worlds.",
    modern: "Your school has geography (the gym, cafeteria, dark corners). Your kitchen has realms. Where's YOUR mythology?",
    abstract: "Even concepts have space - the realm of numbers, the void between thoughts, the landscape of emotion.",
    custom: "Every mythology needs a home. Even the strangest ideas exist somewhere.",
  };
  return hooks[category || 'custom'] || hooks.custom;
}

function getGeographySuggestions(category: string | undefined): string {
  const suggestions: Record<string, string> = {
    classic: `
• **Mountains** - Home of sky gods, difficult access, close to heavens
• **Ocean/Coasts** - Sea deities, trade routes, mysterious depths
• **Forests** - Nature spirits, hidden realms, ancient magic
• **Deserts** - Sun gods, preservation, scarcity and survival
• **Islands** - Isolated cultures, sea journeys, unique evolution
• **Underground** - Death gods, secrets, precious metals`,

    historical: `
• **Battlefields** - Where history was made, now sacred ground
• **Cities** - Centers of power, culture clashes
• **Factories/Industry** - The "temples" of production
• **Borders/Frontiers** - Conflict zones, meeting places
• **Capitals** - Seats of power, politics, intrigue
• **Rural Areas** - The "common folk", tradition, resistance`,

    future: `
• **Space Stations** - New Mount Olympus, artificial gravity politics
• **Digital Realms** - The Cloud as heaven, servers as shrines
• **Terraformed Worlds** - Created geography, engineered environments
• **Megacities** - Vertical layers, neon-lit territories
• **Wastelands** - Post-apocalyptic sacred grounds
• **Generation Ships** - Moving worlds, cramped divinity`,

    modern: `
• **Schools** - The hallway hierarchy, cafeteria politics, library sanctuary
• **Kitchens** - Refrigerator realm, stovetop battleground, pantry vault
• **Offices** - Cubicle kingdoms, corner office Olympus, break room truce zones
• **Internet** - Social media territories, viral pathways, dark web underworld
• **Suburbs** - Lawn wars, cul-de-sac kingdoms, HOA politics
• **Malls/Stores** - Consumer temples, changing room confessionals`,

    abstract: `
• **Mathematical Space** - Where equations live, infinite dimensions
• **Emotional Landscape** - Joy as mountains, grief as valleys
• **Time Itself** - Past/present/future as territories
• **The Mind** - Memory palace, dream realms, unconscious depths
• **Probability Space** - Where possible futures exist
• **Between** - Edges, thresholds, in-between places`,

    custom: `
Your world, your rules! Consider:
• **Scale** - How big or small is your world?
• **Dimensions** - How many? What are their rules?
• **Access** - How do beings travel between places?
• **Power Centers** - Where do the strongest dwell?
• **Danger Zones** - Where is it unsafe? Why?
• **Sacred Spaces** - What places have special meaning?`,
  };
  return suggestions[category || 'custom'] || suggestions.custom;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateNameSuggestions(_wizardData: WizardData): string {
  // Generate contextual name suggestions based on wizard data
  const patterns = [
    `The [Adjective] [Noun] - classic and powerful`,
    `[Place] of the [Beings] - location-focused`,
    `The [Noun] [Pantheon/Court/Circle] - emphasizes the group`,
    `[Verb]ers of [Domain] - action-focused`,
    `The [Number] [Nouns] - mythic number significance`,
  ];

  // This would be enhanced by actual AI generation
  return patterns.map((p, i) => `${i + 1}. ${p}`).join('\n');
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface WizardData {
  category?: string;
  subcategory?: string;
  geography?: {
    environment?: string;
    climate?: string;
    features?: string;
  };
  five_themes?: {
    location?: string;
    place?: string;
    interaction?: string;
    movement?: string;
    regions?: string;
  };
  name_options?: string[];
  selected_name?: string;
  description?: string;
  [key: string]: unknown; // Allow dynamic access
}

export interface FieldContext {
  mythologyId?: string;
  mythologyName: string;
  mythologyCategory?: string;
  mythologyGeography?: string;
  entityType: 'character' | 'creature' | 'story' | 'mythology';
  entityId?: string;
  entityDetails?: Record<string, string>;
  fieldName: string;
  existingContent?: string;
  assistanceLevel: 'guide_me' | 'support_me' | 'challenge_me';
}

export type AssistanceType = 'give_ideas' | 'improve' | 'ask_questions' | 'check_fit' | 'show_examples';

// =====================================================
// ASSISTANCE LEVEL MODIFIERS
// =====================================================

export const ASSISTANCE_LEVEL_MODIFIERS = {
  guide_me: `
ASSISTANCE LEVEL: Guide Me (Full Support)
- Be very encouraging and detailed
- Provide step-by-step guidance
- Offer many examples and options
- Celebrate every bit of progress
- Ask clarifying questions before responding`,

  support_me: `
ASSISTANCE LEVEL: Support Me (Balanced)
- Be helpful but not overwhelming
- Provide options without hand-holding
- Trust them to make choices
- Offer encouragement naturally`,

  challenge_me: `
ASSISTANCE LEVEL: Challenge Me (Minimal)
- Be Socratic - ask questions more than give answers
- Provide brief hints, not solutions
- Push them to think deeper
- Trust their creative instincts`,
};

const promptsExport = {
  SYSTEM_CONTEXT,
  MYTHOLOGY_CATEGORIES,
  WIZARD_PROMPTS,
  FIELD_HELP_PROMPTS,
  ASSISTANCE_LEVEL_MODIFIERS,
};

export default promptsExport;
