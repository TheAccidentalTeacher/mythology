-- Seed curiosity-driven assignment templates
-- Run this after 014_assignments.sql

-- Template 1: Create Your First Deity (Beginner)
INSERT INTO assignment_templates (
  title,
  description,
  instructions,
  category,
  grade_level_range,
  difficulty,
  template_data
) VALUES (
  'Create Your First Deity',
  'Design a god or goddess who controls an aspect of nature or human life. This is your introduction to mythology creation!',
  E'Create your first deity by thinking about:\n\n1. What do they control? (water, storms, love, wisdom, etc.)\n2. What do they look like?\n3. What''s their personality?\n4. Do they have any special powers?\n5. What symbols represent them?\n\nWrite at least 3 paragraphs describing your deity. Include:\n- Their name and domain (what they rule over)\n- Physical description\n- Personality traits\n- At least one story showing how they use their powers',
  'mythology_basics',
  'elementary',
  'beginner',
  jsonb_build_object(
    'subject_area', 'mythology',
    'points_possible', 50,
    'min_grade_level', 3,
    'max_grade_level', 6,
    'scaffolding_hints', ARRAY[
      'Start by choosing what your god controls - think about things in nature (sun, moon, ocean, storms) or human life (love, war, wisdom, music)',
      'Give them a memorable name! You can combine words (like "Wavecaller" for a water god) or make up something that sounds mythological',
      'Think about their personality - are they kind or fierce? Playful or serious? Wise or mischievous?',
      'Describe at least 3 physical features - what do they wear? What colors are associated with them? Do they have any special features?'
    ],
    'extension_challenges', ARRAY[
      'Create a family tree - who are their parents? Do they have siblings? Children?',
      'Write about their sacred animal or symbol and explain why it represents them',
      'Describe their home or realm - where do they live? What does it look like?',
      'Create a holiday or festival that mortals celebrate in their honor'
    ],
    'learning_objectives', ARRAY[
      'Understand the role of deities in mythology',
      'Practice descriptive writing',
      'Make connections between a deity''s domain and their characteristics',
      'Develop creative storytelling skills'
    ],
    'ai_accuracy_check', false,
    'allow_revisions', true
  )
);

-- Template 2: The Hero's Journey (Intermediate)
INSERT INTO assignment_templates (
  title,
  description,
  instructions,
  category,
  grade_level_range,
  difficulty,
  template_data
) VALUES (
  'The Hero''s Journey',
  'Create an epic hero and send them on a classic quest following the stages of the Hero''s Journey',
  E'Write a hero''s journey story with these stages:\n\n1. **Ordinary World**: Introduce your hero in their normal life\n2. **Call to Adventure**: What challenge or quest appears?\n3. **Meeting the Mentor**: Who helps prepare them?\n4. **Crossing the Threshold**: Leaving home, entering the adventure\n5. **Tests and Trials**: What obstacles do they face?\n6. **The Ordeal**: The biggest challenge\n7. **The Return**: Coming home changed\n\nYour story should be at least 5 paragraphs (one for each major stage).\n\nInclude:\n- A hero with clear strengths and weaknesses\n- A meaningful quest (not just "get treasure")\n- At least 3 challenges they overcome\n- How they grow and change by the end',
  'mythology_basics',
  'middle',
  'intermediate',
  jsonb_build_object(
    'subject_area', 'mythology',
    'points_possible', 100,
    'min_grade_level', 6,
    'max_grade_level', 9,
    'scaffolding_hints', ARRAY[
      'Start with an ordinary hero - maybe a farmer, a student, or a young warrior. What makes them special isn''t magic powers, but their character',
      'The call to adventure should be personal - maybe they need to save their village, prove themselves, or right a wrong',
      'Mentors can be wise elders, magical creatures, or even former heroes. Think Gandalf, Yoda, or Mr. Miyagi',
      'Each test should teach them something - courage, wisdom, compassion, sacrifice, etc.',
      'The ordeal is where they face their deepest fear or greatest challenge. This is the climax!'
    ],
    'extension_challenges', ARRAY[
      'Connect your hero''s journey to one of your existing deities or creatures',
      'Include a prophecy or oracle that sets the hero on their path',
      'Create a "hero''s toolkit" - describe 3 items they acquire during their journey and how each helps them',
      'Write an epilogue showing how the hero''s journey affected their world',
      'Compare your hero''s journey to a classic myth like Odysseus, Gilgamesh, or King Arthur'
    ],
    'learning_objectives', ARRAY[
      'Understand the stages of the Hero''s Journey (monomyth)',
      'Practice plot structure and story pacing',
      'Develop character growth and transformation',
      'Connect personal stories to universal themes'
    ],
    'ai_accuracy_check', false,
    'allow_revisions', true
  )
);

-- Template 3: Creation Myth (Advanced)
INSERT INTO assignment_templates (
  title,
  description,
  instructions,
  category,
  grade_level_range,
  difficulty,
  template_data
) VALUES (
  'Write a Creation Myth',
  'Explain how your world came into being through an original creation myth',
  E'Every culture has a story about how the world began. Now it''s your turn to create one!\n\nYour creation myth should explain:\n1. What existed before the world (chaos, void, cosmic egg, primordial waters, etc.)\n2. What force or being created the world\n3. How major features formed (earth, sky, seas, mountains, life)\n4. Why things are the way they are (why the sky is blue, why we have seasons, why humans are mortal, etc.)\n\nWrite at least 6 paragraphs covering the progression from nothing to a complete world.\n\nRequired elements:\n- A unique "before-time" state\n- At least 3 primordial beings or forces\n- An explanation for at least 5 natural phenomena\n- A reason why humans exist and what role they play\n- Internal logic (your explanations should make sense within your world''s rules)',
  'mythology_basics',
  'high',
  'advanced',
  jsonb_build_object(
    'subject_area', 'mythology',
    'points_possible', 150,
    'min_grade_level', 8,
    'max_grade_level', 12,
    'scaffolding_hints', ARRAY[
      'Look at real creation myths for inspiration: Norse (Ymir''s body becomes the world), Greek (Chaos to Cosmos), Egyptian (Atum emerging from Nu), Māori (Sky Father and Earth Mother)',
      'Start with a "before state" - was there endless ocean? Swirling chaos? A cosmic egg? Empty void?',
      'Consider what creates - did primordial beings sacrifice themselves? Did a deity speak things into existence? Did opposing forces collide?',
      'Make each creation stage build on the previous one logically',
      'The "why" explanations (aetiologies) are key - connect natural phenomena to your myth'
    ],
    'extension_challenges', ARRAY[
      'Create multiple versions - how different cultures in your world tell the creation story differently',
      'Include a scientific connection - explain how your creation myth parallels real cosmology (Big Bang, planetary formation, evolution)',
      'Write a "counter-myth" - a story explaining what almost went wrong during creation',
      'Develop a cosmological diagram showing the structure of your universe',
      'Compare your creation myth to 3 real-world myths and analyze common themes'
    ],
    'learning_objectives', ARRAY[
      'Understand the purpose and structure of creation myths',
      'Practice complex narrative writing with multiple stages',
      'Develop cause-and-effect reasoning',
      'Make connections between story and worldview'
    ],
    'ai_accuracy_check', false,
    'allow_revisions', true
  )
);

-- Template 4: Mythology to Science - Water Cycle (Cross-curricular)
INSERT INTO assignment_templates (
  title,
  description,
  instructions,
  category,
  grade_level_range,
  difficulty,
  template_data
) VALUES (
  'From Myth to Science: The Water Cycle',
  'Use your water god/goddess to explain the real water cycle scientifically',
  E'Ancient people used gods to explain natural phenomena. Now you''ll connect mythology to science!\n\nPart 1: Mythology (2 paragraphs)\nDescribe your water deity and how ancient people might have explained rain, rivers, and oceans through their stories.\n\nPart 2: Science (3 paragraphs)\nExplain the REAL water cycle:\n- Evaporation: How water turns into water vapor\n- Condensation: How clouds form\n- Precipitation: How rain/snow falls\n- Collection: Where water goes and how it returns to bodies of water\n\nPart 3: Connection (1 paragraph)\nExplain how the mythological story and scientific explanation both try to answer the same questions about water.\n\nInclude:\n- At least 5 scientific vocabulary terms (evaporation, condensation, precipitation, collection, water vapor)\n- Accurate scientific facts (use reliable sources)\n- A comparison showing what myths got right conceptually',
  'science',
  'multi-age',
  'intermediate',
  jsonb_build_object(
    'subject_area', 'science',
    'points_possible', 100,
    'min_grade_level', 5,
    'max_grade_level', 8,
    'scaffolding_hints', ARRAY[
      'For the myth: Think about Poseidon (Greek), Tlaloc (Aztec), or create your own. How would ancient people explain where rain comes from?',
      'For science: Start with the ocean - the sun heats water, it evaporates into the air...',
      'Draw a simple diagram of the water cycle to help organize your thoughts',
      'Connect the two: Maybe your water god "carrying water to the sky" is like evaporation?'
    ],
    'extension_challenges', ARRAY[
      'Research a real ancient water myth (Norse, Egyptian, Native American, etc.) and compare it to your creation',
      'Explain what happens to water when it freezes or melts (state changes)',
      'Describe the role of the sun and energy in the water cycle',
      'Calculate: If a cloud holds 1 million pounds of water, how many gallons is that?'
    ],
    'learning_objectives', ARRAY[
      'Understand the complete water cycle',
      'Use scientific vocabulary accurately',
      'Compare mythological and scientific explanations',
      'Practice informational writing with evidence'
    ],
    'ai_accuracy_check', true,
    'allow_revisions', true
  )
);

-- Template 5: Mythology to Civics - Creating a Constitution
INSERT INTO assignment_templates (
  title,
  description,
  instructions,
  category,
  grade_level_range,
  difficulty,
  template_data
) VALUES (
  'Divine Government: Creating a Constitution for Your Mythology',
  'Use your pantheon to explore principles of government and create a constitution',
  E'Your mythology has gods and mortals. How do they govern themselves?\n\nPart 1: Divine Government (2 paragraphs)\nDescribe how your gods are organized:\n- Is there a king/queen of the gods? How did they get that position?\n- Do gods vote on decisions or does one ruler decide everything?\n- What happens when gods disagree?\n- What powers do different gods have?\n\nPart 2: Mortal Government (2 paragraphs)\nDescribe how mortals in your world govern themselves:\n- What type of government do they have? (democracy, monarchy, republic, etc.)\n- How are leaders chosen?\n- What rights do citizens have?\n- How do laws get made?\n\nPart 3: Constitution (Write 6-8 articles)\nCreate a constitution for your world''s mortals that includes:\n- Article I: Structure of government and powers\n- Article II: Rights and freedoms of citizens\n- Article III: How laws are made\n- Article IV: System of justice\n- Article V: Relationship between mortals and gods\n- Article VI: How the constitution can be amended\n\nPart 4: Comparison (1 paragraph)\nCompare your constitution to the U.S. Constitution. What''s similar? What''s different? Why did you make different choices?',
  'civics',
  'high',
  'advanced',
  jsonb_build_object(
    'subject_area', 'civics',
    'points_possible', 150,
    'min_grade_level', 7,
    'max_grade_level', 12,
    'scaffolding_hints', ARRAY[
      'Look at Greek mythology: Zeus was king of gods, but even he couldn''t always override the Fates or other gods completely',
      'Think about real government types: Democracy (citizens vote), Monarchy (king/queen), Republic (elected representatives), Theocracy (gods/priests rule)',
      'The U.S. Constitution has 7 articles covering similar topics - use it as a model but make it fit YOUR world',
      'Consider: What role do gods play in mortal affairs? Do they interfere? Do mortals worship them in exchange for protection?'
    ],
    'extension_challenges', ARRAY[
      'Create a Bill of Rights with 10 fundamental freedoms',
      'Design a system of checks and balances between different parts of government',
      'Write about a constitutional crisis - what happens when someone breaks the constitution?',
      'Compare your government to 3 historical governments (Greek democracy, Roman Republic, Medieval monarchy, etc.)',
      'Include philosophical influences - research Locke, Montesquieu, or the Founding Fathers'
    ],
    'learning_objectives', ARRAY[
      'Understand the purpose and structure of a constitution',
      'Explore different forms of government',
      'Practice civic reasoning and argumentation',
      'Connect government structure to cultural values',
      'Compare constitutional principles across systems'
    ],
    'ai_accuracy_check', true,
    'allow_revisions', true
  )
);

COMMENT ON TABLE assignment_templates IS 'Pre-built curiosity-driven assignments that teachers can use as starting points';
