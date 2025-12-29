import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getMythologyId() {
  const { data: mythology, error: mythError } = await supabase
    .from('mythologies')
    .select('id, created_by')
    .eq('name', 'Oceanborn Legends')
    .single();

  if (mythError) throw mythError;
  if (!mythology) throw new Error('Oceanborn Legends mythology not found');

  return { mythologyId: mythology.id, userId: mythology.created_by };
}

async function createPhase3BCharacters() {
  console.log('🌊 PHASE 3B: Creating Heroes & Mortals (Part 2 of 2)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const characters = [
    {
      name: 'Venom Dancer Zara',
      character_type: 'hero',
      archetype: 'toxin_master',
      domain: null,
      description: `Zara is Toxira's most gifted student, a mortal who has achieved immunity to nearly every marine toxin through years of careful exposure. She is both scientist and artist, studying venomous creatures to create antidotes while also appreciating their deadly beauty.

She is slender and graceful, moving like the jellyfish she studies. Her arms are covered in faint scars from controlled stings, a map of her journey toward immunity. She wears clothes dyed in warning colors—blues, purples, greens—and keeps vials of various toxins and antidotes on her belt.

Zara runs a clinic in a coastal city where she treats sting and bite victims that others have given up on. She has saved hundreds of lives by understanding that most venomous creatures don't want to hurt humans—they're defending themselves. She teaches respect for dangerous beauty rather than fear.

Her relationship with Toxira is complex. The goddess values Zara's appreciation for venom as art, but Zara frustrates her by using toxins to heal rather than kill. They have an ongoing philosophical debate about whether venom's purpose is beauty through death or knowledge through survival.`,
      origin_story: 'As a child, Zara watched her brother die from a box jellyfish sting while healers stood helpless. She swore to never be helpless again. She began studying venomous creatures obsessively, teaching herself immunity through micro-doses. Toxira appeared when Zara survived her first cone snail sting, impressed by mortal audacity.',
      personality: 'Graceful, intellectual, appreciates dangerous beauty, values life but respects death, philosophical about toxins, debates ethics with Toxira.',
      geography_connection: 'Coastal clinic, Toxira\'s Venom Gardens (studies there)',
      powers_abilities: 'Immunity to most marine toxins, create antidotes, handle venomous creatures safely, limited toxin manipulation (learned from Toxira)',
      weaknesses: 'Not immune to everything (new toxins can harm her), mortal fragility, Toxira could revoke her immunity',
      appearance_description: 'Slender graceful woman with scar-map arms, wears warning-color clothes (electric blue, vivid purple, neon green), carries vials of toxins and antidotes, moves like jellyfish, analytical eyes',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Navigator Prince Tal',
      character_type: 'hero',
      archetype: 'migratory_guide',
      domain: null,
      description: `Prince Tal was born to a nomadic sea tribe that follows whale migrations across the ocean. He is blessed by Migratus to understand migratory patterns instinctively, able to predict where species will travel seasons in advance. He serves as guide not just for his people, but for all who must journey across the sea.

He is young, barely twenty, with skin darkened by endless sun and eyes that always look toward the horizon. He wears a cloak of woven seaweed that changes color with water temperature, helping him read the ocean. Around his neck hangs a tooth from a whale that taught him its song before it died.

Tal can communicate with migratory species—whales, turtles, salmon—not through magic but through deep understanding of their behavior. He reads the ocean like Captain Maris reads stars, but where she masters navigation tools, he masters instinct. Migratus favors him because Tal understands that migration is about homecoming, not just travel.

He is leading a campaign to protect migratory routes from human disruption, working with Captain Maris and even some corporations who are starting to listen. His youth is his weakness—he believes everyone can be convinced by good arguments, not yet understanding that some people choose profit over preservation.`,
      origin_story: 'Born during a whale migration, Tal\'s first memory is of whale song vibrating through the ship. He grew up following migrations, learning patterns, reading signs. During his coming-of-age journey, he got lost in a storm, and Migratus appeared, teaching him that being lost is part of finding home. He emerged knowing every migratory route in the ocean.',
      personality: 'Young and idealistic, values journey and homecoming, protective of migratory species, believes in education and persuasion, naive about human greed.',
      geography_connection: 'No home port—follows migrations constantly, the journey is his home',
      powers_abilities: 'Instinctive understanding of migratory patterns, communicate with migratory species (behavioral, not magical), predict seasonal movements, Migratus\'s blessing',
      weaknesses: 'Mortal limitations, idealism makes him vulnerable to manipulation, cannot stop migrations from being disrupted',
      appearance_description: 'Young man with sun-darkened skin, eyes always on horizon, wears color-changing seaweed cloak, whale tooth necklace, moves with restless energy, never truly still',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Abyss Walker Nox',
      character_type: 'hero',
      archetype: 'darkness_scout',
      domain: null,
      description: `Nox is a deep-sea explorer who has descended deeper than any mortal should survive. He wears a suit blessed by Pressura that allows him to withstand the crushing pressure of the deepest trenches. He has seen things in the abyss that even the gods don't fully understand—ancient ruins, impossible creatures, doorways to other realms.

He is gaunt, pale from lack of sunlight, with eyes adapted to darkness that glow faintly in low light. He moves like a deep-sea creature, conserving energy, every motion deliberate. He speaks rarely and softly, as if afraid loud sounds will attract something from the depths.

Nox originally descended seeking treasure, but what he found was knowledge—and terror. He has made an uneasy alliance with Abyssor, serving as the god's eyes in places even Abyssor doesn't venture often. In exchange, Abyssor protects him from the things that dwell in darkness.

His journals describe incomprehensible creatures, cities that predate the gods, currents that lead to nowhere. He is slowly going mad from what he has seen, but he cannot stop descending. Something in the deepest trench is calling him, and he fears he will eventually answer.`,
      origin_story: 'A treasure hunter who descended to a shipwreck in Abyssor\'s domain, Nox should have died when his equipment failed. Instead, Abyssor appeared, amused by mortal audacity. The god offered a bargain: survive the abyss and report what you find, and I will let you live. Nox accepted, not understanding the psychological cost.',
      personality: 'Haunted, paranoid from isolation, speaks softly, fears loud sounds, obsessed with mapping the abyss, slowly going mad, loyal to Abyssor out of fear and respect.',
      geography_connection: 'The deepest trenches, Abyssor\'s domain, places light never reaches',
      powers_abilities: 'Pressure-resistant suit (Pressura\'s blessing), see in total darkness, withstand psychological effects of the abyss (barely), Abyssor\'s protection',
      weaknesses: 'Slowly going insane, physically weak from prolonged pressure exposure, light-sensitive eyes, knows too much',
      appearance_description: 'Gaunt pale man from lack of sunlight, eyes that glow faintly and adapted to darkness, wears pressure-resistant suit, moves like deep-sea creature, speaks softly, haunted expression',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Storm Caller Rhen',
      character_type: 'hero',
      archetype: 'weather_witch',
      domain: null,
      description: `Rhen is a weather mage who learned to predict and influence storms through a combination of science and intuition. She serves aboard a rescue fleet, using her abilities to guide ships to safety during tempests. She has earned Ventris's respect and Krakus's grudging tolerance.

She is in her thirties, with silver-white hair despite her youth—a mark of the first time she called lightning. Her eyes change color with weather patterns: gray for storms, blue for calm, green for unpredictable conditions. She wears a coat sewn with copper threads that crackle with static electricity.

Rhen can sense approaching storms hours before they form, predict their paths with uncanny accuracy, and even nudge them slightly off course—not stopping them, but buying ships time to reach harbor. She cannot create or destroy storms (only gods can do that), but she can work with them, like a sailor works with wind.

Her greatest achievement was negotiating with Krakus during a hurricane to spare a refugee fleet. She didn't beg or demand—she challenged him to prove his storms were about justice, not rage. Impressed, Krakus diverted the storm just enough. Now he occasionally listens to her, though he still views mortals as beneath him.`,
      origin_story: 'Daughter of fisherfolk lost to a storm, Rhen studied meteorology obsessively, trying to understand what killed her family. During a hurricane, she stood on a cliff and screamed at Krakus, demanding to know why. Lightning struck her, and she should have died, but Ventris saved her. She woke with white hair and storm-sense.',
      personality: 'Brave, scientific yet intuitive, respects storms but stands up to them, protects sailors and refugees, has earned divine respect through audacity.',
      geography_connection: 'Rescue fleet ship, storm zones, anywhere tempests threaten',
      powers_abilities: 'Storm prediction (hours in advance), sense weather patterns, nudge storm paths slightly, lightning resistance, divine favor from Ventris',
      weaknesses: 'Cannot create or stop storms (only influence slightly), mortal fragility, silver hair marks her as storm-touched making her recognizable',
      appearance_description: 'Woman in her 30s with prematurely silver-white hair, eyes that change color with weather (gray/blue/green), wears copper-thread coat that crackles with static, confident stance',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Brine Alchemist Kosmos',
      character_type: 'mortal',
      archetype: 'salt_scholar',
      domain: null,
      description: `Kosmos is a scholar who studies salt—not just as a mineral, but as a fundamental property of the ocean. He is Salinar's student, learning the philosophy of preservation, the chemistry of crystallization, and the memory stored in salt. His laboratory is filled with thousands of salt samples from every ocean on Earth.

He is elderly, with a long white beard often dusted with salt crystals. His fingers are stained from handling brines of every concentration. He wears spectacles with lenses ground from salt crystals that allow him to see things others cannot—the structure of memories, the geometry of time, the patterns of preservation.

Kosmos believes salt is the ocean's memory storage—every grain contains information about where it came from, what dissolved to create it, what was preserved by it. He has developed techniques to read these salt memories, extracting information about ancient oceans, extinct creatures, and lost civilizations.

He is Brinara's informal advisor on chemical balance, helping her understand the human impact on ocean salinity. His research on desalination, salt harvesting, and brine disposal has influenced policy in several nations. He argues that salt is not just a resource to extract, but a record to preserve.`,
      origin_story: 'A chemist studying ancient salt deposits, Kosmos accidentally dissolved a crystal that contained a memory from before the gods—a vision of the primordial ocean. Salinar appeared, impressed that a mortal had learned to read salt\'s history. The god offered to teach Kosmos the deeper mysteries of preservation.',
      personality: 'Scholarly, philosophical, values knowledge and memory, patient teacher, believes understanding the past prevents repeating mistakes, allied with both Salinar and Brinara.',
      geography_connection: 'Salt crystal laboratory in a coastal university, salt flats, brine pools',
      powers_abilities: 'Read memories stored in salt, create preservation solutions, salt-crystal lenses show hidden structures, blessed by Salinar',
      weaknesses: 'Elderly and frail, lost without his laboratory, salt-crystal lenses work only for him',
      appearance_description: 'Elderly man with long white beard dusted with salt, stained fingers, wears salt-crystal spectacles, surrounded by salt samples, moves slowly but thinks quickly',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Tide Pool Guardian Mira',
      character_type: 'mortal',
      archetype: 'small_world_keeper',
      domain: null,
      description: `Mira is a marine biologist who specializes in tide pool ecosystems. She believes that protecting the small, overlooked places is as important as protecting coral reefs or whale populations. She is Coralith's student in patience, Marineth's follower in tidal understanding, and increasingly aligned with environmental preservation.

She is young, barely out of university, with hands scarred from handling tide pool creatures and knees permanently stained from kneeling on rocks. She carries a field guide so worn the pages fall out, filled with her own observations and sketches. She knows every tide pool on her stretch of coast like others know their homes.

Mira runs a small sanctuary where she rehabilitates injured tide pool creatures—sea stars, anemones, crabs—that most people would consider too insignificant to save. She argues that every life in the tide pool is connected to the larger ocean, that you cannot protect the deep without protecting the shallows.

She has begun documenting human impact on tide pools—pollution, trampling tourists, climate change—creating a record that even gods have taken notice of. Brinara particularly values Mira's salinity measurements, and Scavenor respects her understanding of tiny ecosystem cycles.`,
      origin_story: 'As a child, Mira spent hours in tide pools, finding them more interesting than any playground. A tourist trampled an anemone she had been observing for weeks, and she wept. Marineth, watching from the tide, blessed the child with deeper understanding. Mira has been protecting tide pools ever since.',
      personality: 'Passionate, believes small things matter, patient observer, scientific but reverent, advocates for overlooked ecosystems.',
      geography_connection: 'Tide pools along her coastal stretch, small rehabilitation sanctuary',
      powers_abilities: 'Innate understanding of tide pool ecosystems, blessed by Marineth to know tide timing, communicate with small marine creatures (behavioral understanding)',
      weaknesses: 'Mortal fragility, limited resources to protect all tide pools, can be overwhelmed by scale of environmental damage',
      appearance_description: 'Young woman with scarred hands and stained knees, carries worn field guide, often wet from kneeling in tide pools, earnest expression, sees beauty in small things',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Drowned Poet',
      character_type: 'legendary_figure',
      archetype: 'tragic_voice',
      domain: null,
      description: `The Drowned Poet is a ghost, a legendary figure whose songs are said to predict great changes in the ocean. No one remembers his true name—he is simply the Poet, a spirit who appears during major events to sing prophetic songs that only certain people can hear.

He appears as a translucent figure made of water and moonlight, wearing clothes from centuries past that billow in non-existent currents. His face is beautiful but mournful, and his voice carries the weight of all the ocean's sorrows. When he sings, those who hear it are changed—some inspired, some driven mad, all moved to action.

The Poet drowned during a storm hundreds of years ago while singing to calm the waves. Marineth was so moved by his sacrifice that she preserved his spirit, transforming him into a prophet of the ocean. He is neither alive nor fully dead, existing in the liminal space between states.

He appears at pivotal moments—before great storms, during environmental disasters, when the balance of the ocean shifts. His songs warn, inspire, or mourn, but never explicitly tell people what to do. He is interpretation, not instruction. Echolus values his songs for their beauty, Marineth treasures him as her prophet, and most mortals fear him as an omen.`,
      origin_story: 'A wandering poet who sang songs of the sea, he was caught in a storm while sailing to his wedding. As the ship sank, he sang to calm his fellow passengers, his voice ringing out even as water filled his lungs. Marineth heard the song and was moved to tears. She preserved his spirit so his voice would never be silenced.',
      personality: 'Mournful, prophetic, speaks through song rather than speech, exists between life and death, values beauty and sacrifice, appears during pivotal moments.',
      geography_connection: 'Appears anywhere during significant ocean events, particularly during full moons',
      powers_abilities: 'Prophetic songs, intangibility (is a ghost), appears across distances instantly, songs affect listener\'s emotions, blessed by Marineth',
      weaknesses: 'Cannot directly intervene (only inspire), cannot appear during new moons, songs can drive sensitive listeners mad',
      appearance_description: 'Translucent figure of water and moonlight, wears centuries-old billowing clothes, beautiful mournful face, voice carries all ocean sorrows, appears and disappears like mist',
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating characters...\n');

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    console.log(`[${i + 1}/${characters.length}] Creating ${char.name} - ${char.archetype}`);

    try {
      const { data, error } = await supabase
        .from('characters')
        .insert([char])
        .select()
        .single();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Created successfully (ID: ${data.id.substring(0, 8)}...)`);
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err}`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('✅ Phase 3B Complete!\n');
  console.log('Heroes & Mortals Created (Part 2):');
  console.log('  • Venom Dancer Zara - Toxin Master');
  console.log('  • Navigator Prince Tal - Migratory Guide');
  console.log('  • Abyss Walker Nox - Darkness Scout');
  console.log('  • Storm Caller Rhen - Weather Witch');
  console.log('  • Brine Alchemist Kosmos - Salt Scholar');
  console.log('  • Tide Pool Guardian Mira - Small World Keeper');
  console.log('  • The Drowned Poet - Tragic Prophet');
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 PHASE 3 COMPLETE!\n');
  console.log('Total Characters Created: 35');
  console.log('  • 3 Primordial Forces');
  console.log('  • 5 Supreme Gods');
  console.log('  • 12 Major Deities');
  console.log('  • 15 Heroes & Mortals');
  console.log('\n✨ Oceanborn Legends now rivals Greek and Norse mythology!');
  console.log('\nNext Steps:');
  console.log('  - Phase 4: Create 25 Creatures');
  console.log('  - Phase 5: Create 10 Realms/Locations');
  console.log('  - Phase 6: Create 12 Stories/Myths');
  console.log('  - Phase 7: Create 5 Maps');
}

createPhase3BCharacters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
