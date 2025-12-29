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

async function createPhase4ACreatures() {
  console.log('🌊 PHASE 4A: Creating Creatures (Part 1 of 3)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const creatures = [
    {
      name: 'The Tidecaller Leviathan',
      creature_type: 'dragon',
      alignment: 'neutral',
      intelligence_level: 'highly_intelligent',
      size_category: 'gargantuan',
      danger_level: 'catastrophic',
      description: `The Tidecaller is an ancient leviathan older than most gods, a creature so vast that when it surfaces, sailors mistake it for an island. Its body stretches for miles, covered in barnacles and coral that have grown for millennia. Entire ecosystems exist on its back—forests of kelp, schools of fish, even merfolk settlements that travel with the beast.

It is one of the primordial creatures that existed before Abyssara gained consciousness, a living remnant of the ocean's earliest form. The Tidecaller doesn't hunt—it feeds by opening its massive mouth and filtering entire currents through its baleen-like teeth, consuming plankton and nutrients on a scale incomprehensible to smaller beings.

The leviathan's movements create tides and currents that affect entire regions. When it dives, whirlpools form. When it surfaces, tsunamis ripple outward. Nautrion himself treats the Tidecaller with respect, viewing it as a force of nature rather than a subject. The creature appears in ancient prophecies as both creator and destroyer, its migrations marking eras.

It is intelligent in an alien way—communicating through deep, resonant calls that Echolus can barely interpret. It remembers the world before the gods and sometimes shares fragments of that knowledge with those it deems worthy. Marineth occasionally consults with it about the deep past, and even Abyssara acknowledges it as her equal in age.`,
      habitat: 'The deepest ocean trenches and abyssal plains, migrates across all oceans',
      abilities: 'Creates tides and currents through movement, filter-feeds on massive scale, immune to pressure and temperature, ancient knowledge, communication through deep calls, its back supports entire ecosystems',
      cultural_significance: 'Revered as a living relic of the primordial ocean, appears in prophecies, respected by gods and mortals alike, its migrations mark historical eras',
      origin_story: 'The Tidecaller predates the gods—it was swimming in the primordial ocean before Abyssara became conscious. When the goddess awakened, she found the Tidecaller already ancient, and they established mutual respect. It has witnessed the birth of gods, the rise and fall of civilizations, and the changing of the world.',
      weaknesses: 'Too large to enter shallow waters, slow to react to small threats, its migration patterns are predictable, ancient age means it tires more easily',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Glassfin Sharks',
      creature_type: 'beast',
      alignment: 'neutral',
      intelligence_level: 'animal_intelligence',
      size_category: 'medium',
      danger_level: 'dangerous',
      description: `Glassfin Sharks are translucent predators created by Luminara to hunt in the twilight zone where light fades to darkness. Their skin and flesh are nearly transparent, making them almost invisible in water. Only their eyes—which glow with soft bioluminescence—and their skeletal structure are visible, creating an eerie x-ray effect as they swim.

These sharks hunt by ambush, drifting motionless in the current until prey passes, then striking with explosive speed. Their teeth are crystalline, harder than normal bone, capable of biting through shell and armor. They travel in small pods of 3-5 individuals, coordinating attacks with precision that suggests greater intelligence than ordinary sharks.

Glassfin Sharks are prized by hunters for their crystalline teeth and organs that refract light in beautiful patterns. This has made them endangered, and Luminara has begun actively protecting them, marking hunters who kill too many with a curse that makes them visible to all predators.

The sharks are attracted to bioluminescent lures, which makes them vulnerable to traps. But they're learning—younger generations avoid the old tricks, suggesting they may be evolving greater intelligence. Some scholars believe they're Luminara's attempt to create a species that can bridge the gap between beast and sentient being.`,
      habitat: 'Twilight zones where light fades, often found near bioluminescent zones',
      abilities: 'Near-total transparency (natural camouflage), crystalline teeth that never dull, coordinated pack hunting, attracted to bioluminescence',
      cultural_significance: 'Hunted for crystalline teeth and light-refracting organs, protected by Luminara, symbol of invisible danger',
      origin_story: 'Luminara created the Glassfin Sharks to prove that invisibility can be achieved without darkness—through light and transparency. They were her answer to Abyssor\'s shadow creatures, beings that hide not by blocking light but by letting it pass through.',
      weaknesses: 'Attracted to bioluminescent lures (can be trapped), eyes and skeleton remain visible, crystalline teeth brittle if struck precisely, endangered by overhunting',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Coral Wyrm',
      creature_type: 'dragon',
      alignment: 'good',
      intelligence_level: 'highly_intelligent',
      size_category: 'huge',
      danger_level: 'deadly',
      description: `The Coral Wyrm is Coralith's first creation—a serpentine dragon whose body is composed of living coral that constantly grows and changes color based on its emotions. It is the guardian of the Endless Reef, a fierce protector that attacks anything threatening coral ecosystems.

The Wyrm is fifty feet long, with a body that shifts through brilliant colors—reds when angry, blues when calm, purples when curious. Its scales are individual coral polyps that sting like fire. It doesn't breathe fire like land dragons—instead, it exhales clouds of stinging cells that create massive pain without killing, driving intruders away rather than destroying them.

It is ancient and wise, having served Coralith for thousands of years. It speaks all languages and often negotiates with surface dwellers, trying to teach them sustainable fishing practices. It has sunk dozens of ships that used dynamite or poison on reefs, but it has also guided lost sailors to safety when they showed respect.

The Coral Wyrm is unique—Coralith made only one, pouring so much of his essence into the creature that creating another would weaken him dangerously. The Wyrm knows this and feels the weight of being irreplaceable. If it dies, its death would devastate Coralith emotionally and weaken his power over reef growth.`,
      habitat: 'The Endless Reef, Coralith\'s domain, occasionally patrols other major reef systems',
      abilities: 'Living coral body that constantly grows, color-changing scales reflect emotions, exhales stinging cell clouds, speaks all languages, can accelerate coral growth nearby, telepathic communication with Coralith',
      cultural_significance: 'Guardian of all reefs, symbol of reef protection, negotiates with surface dwellers about conservation, feared by destructive fishermen',
      origin_story: 'When Coralith first created the Endless Reef, he realized it needed a guardian. He poured his essence into living coral and shaped it into a dragon, creating the Coral Wyrm. It awoke with Coralith\'s patience, wisdom, and fierce protectiveness, the god\'s ideals made flesh.',
      weaknesses: 'Unique (cannot be replaced if killed), vulnerable to acidification like all coral, death would weaken Coralith, must stay near reefs to maintain strength',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Abyss Crawlers',
      creature_type: 'monster',
      alignment: 'evil',
      intelligence_level: 'animal_intelligence',
      size_category: 'large',
      danger_level: 'deadly',
      description: `Abyss Crawlers are nightmarish creatures from the deepest trenches, created by Abyssor to patrol his domain and drag intruders into the darkness. They have too many legs—dozens of segmented limbs like a horrifying fusion of crab and centipede. Their bodies are covered in bony plates that creak and groan as they move, and their faces are blank except for a circular mouth filled with rotating teeth.

These creatures hunt by sound and vibration, being completely blind in the lightless depths. They can detect a fish's heartbeat from hundreds of yards away. They move with terrifying speed across the seafloor, their many legs creating a clicking, skittering sound that haunts the nightmares of deep-sea divers.

Abyss Crawlers drag their prey to underwater caves where they feed slowly, keeping victims alive for days. This cruelty isn't sadism—they're simply efficient predators adapted to an environment where food is scarce. They store living prey for later consumption.

Abyssor created them as deterrents, ensuring that only the bravest or most foolish venture into his depths. But the creatures have spread beyond his direct control, infesting trenches worldwide. Even Abyssor is occasionally surprised by where they turn up, suggesting they're becoming independent of their creator.`,
      habitat: 'Deepest ocean trenches, underwater caves, abyssal zones',
      abilities: 'Hunt by sound and vibration (blind), extreme speed across seafloor, armor-plated bodies, rotating circular mouths, store living prey in caves, withstand crushing pressure',
      cultural_significance: 'Symbol of the abyss\'s horror, nightmare fuel for divers, Abyssor\'s enforcers, spreading beyond creator\'s control',
      origin_story: 'Abyssor created the first Abyss Crawlers by taking the darkest parts of his essence—cruelty, hunger, the crushing weight of the deep—and giving them physical form. They emerged already hunting, already terrifying, perfect predators for the lightless depths.',
      weaknesses: 'Completely blind (vulnerable to silent stalking), armor plates have gaps at joints, vulnerable to light (causes confusion), reproduce slowly',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Storm Mantas',
      creature_type: 'magical_being',
      alignment: 'chaotic',
      intelligence_level: 'sentient',
      size_category: 'large',
      danger_level: 'dangerous',
      description: `Storm Mantas are rays that surf on the interface between ocean and sky, their bodies crackling with electrical charge. They were created by Ventris during a hurricane, born from wind, water, and lightning combining in a moment of perfect chaos. They are chaos incarnate—unpredictable, wild, and magnificent.

These creatures have wingspans of twenty feet, their bodies covered in patterns that shift like storm clouds. They generate electrical charges through specialized organs, capable of delivering shocks powerful enough to stun whales. They fly through the air during storms, gliding on wind currents while technically remaining aquatic.

Storm Mantas are playful and dangerous in equal measure. They'll race ships for fun, ride lightning bolts, and perform aerial acrobatics during thunderstorms. But they're also territorial and aggressive when provoked, coordinating electrical attacks that can disable vessels.

They're sentient enough to understand speech but too chaotic to have sustained conversations. They communicate through electrical pulses that only certain individuals—like Storm Caller Rhen—can interpret. Ventris loves them as his children but cannot control them, which he sees as perfect.`,
      habitat: 'Storm zones, the ocean surface during tempests, occasionally venture into clear skies',
      abilities: 'Generate powerful electrical charges, fly through air during storms, surf wind currents, electrical communication, naturally attracted to lightning, pack coordination',
      cultural_significance: 'Ventris\'s beloved children, symbols of storm chaos, both feared and admired by sailors, Storm Caller Rhen can communicate with them',
      origin_story: 'During a legendary hurricane where Ventris fought Krakus for dominance, their combined powers created a vortex where wind, water, and lightning became one. From this fusion emerged the first Storm Mantas, creatures that belonged to neither sea nor sky but both.',
      weaknesses: 'Grounded in calm weather (lose flight ability), vulnerable when wet from below (electrical charge dissipates), chaotic nature makes them unpredictable allies',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Pearled Kraken',
      creature_type: 'monster',
      alignment: 'ambiguous',
      intelligence_level: 'highly_intelligent',
      size_category: 'gargantuan',
      danger_level: 'catastrophic',
      description: `The Pearled Kraken is Pearlessa's most prized creation, a kraken whose every sucker contains a perfect pearl. It is both beautiful and terrifying—a massive cephalopod that sparkles with thousands of embedded gems, creating rainbow patterns as it moves through water.

This kraken is intelligent—far more than its mundane cousins. It collects treasures obsessively, not for value but for stories. It hoards shipwrecks, ancient artifacts, lost jewelry, arranged in its underwater lair by narrative importance. It will trade treasures for compelling stories, valuing tales of transformation over gold or jewels.

The creature serves Pearlessa as curator of her collection, guardian of sunken treasures, and occasionally as judge of mortals seeking pearls. Those who approach with greed it destroys. Those who approach with stories of personal transformation it rewards, sometimes granting pearls from its own body—each pearl containing the memory of a transformation it witnessed.

The Pearled Kraken is unique and irreplaceable. Pearlessa created it by transforming a ordinary kraken that survived tremendous pressure and pain, emerging with pearl-studded skin. It remembers its transformation and judges others by their ability to grow through suffering.`,
      habitat: 'Pearlessa\'s Nacre Halls, shipwreck graveyards, treasure caves',
      abilities: 'Each sucker contains a perfect pearl, gargantuan size and strength, highly intelligent, trades treasures for stories, pearls contain memories, shapeshifter (limited), telepathic communication',
      cultural_significance: 'Pearlessa\'s curator and guardian, judges pearl-seekers, symbol that beauty emerges from suffering, feared treasure hunter',
      origin_story: 'A ordinary kraken ventured into the deepest trench, where Pressura\'s crushing depths nearly killed it. It survived by creating pearls to cope with the pain—transforming suffering into beauty. Pearlessa witnessed this and blessed the creature, transforming it into her champion.',
      weaknesses: 'Unique (irreplaceable), obsessed with stories (can be distracted), each pearl contains part of its essence (damage to pearls hurts it), Pearlessa could revoke its intelligence',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Echo Whales',
      creature_type: 'magical_being',
      alignment: 'good',
      intelligence_level: 'highly_intelligent',
      size_category: 'gargantuan',
      danger_level: 'minor_threat',
      description: `Echo Whales are the largest sentient creatures in the ocean, gentle giants blessed by Echolus with the ability to hear and remember every sound that has ever traveled through water. Their songs are legendary—complex compositions that can last for hours, each one a story told in pure sound.

These whales are archivists of the ocean's history. They remember conversations from centuries ago, battles long forgotten, loves and losses that occurred before current civilizations existed. They sing these memories to each other and to those worthy of hearing, creating an oral history of the entire ocean.

Echo Whales are peaceful, feeding exclusively on krill and plankton despite their massive size. They're protected by Echolus and respected even by predatory gods. Attacking an Echo Whale is considered sacrilege—Echolus himself will hunt anyone who harms his record-keepers.

They're migratory, following patterns Migratus helped establish, singing the ocean's history as they travel. Young whales learn from elders, memorizing millennia of songs. The death of an Echo Whale is tragic—each one contains unique memories that die with them. This makes them invaluable to historians and scholars.`,
      habitat: 'All ocean depths, follow migratory routes, occasionally surface to breathe',
      abilities: 'Remember every sound ever made in the ocean, complex songs that tell stories, communicate across thousands of miles, gentle giants despite size, blessed by Echolus, protected by divine decree',
      cultural_significance: 'Living archives of ocean history, sacred to Echolus, attacking one is sacrilege, scholars seek their songs for knowledge',
      origin_story: 'When Echolus first awakened to consciousness, he heard the songs of whales and realized they already carried history in their songs. He blessed them with perfect memory and the ability to understand all sounds, transforming them into the ocean\'s librarians.',
      weaknesses: 'Peaceful nature makes them non-combatants, vulnerable to hunting despite protection, death means loss of unique memories, slow-breeding (endangered)',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Venom Blooms',
      creature_type: 'magical_being',
      alignment: 'ambiguous',
      intelligence_level: 'non_sentient',
      size_category: 'small',
      danger_level: 'deadly',
      description: `Venom Blooms are Toxira's most elegant creation—living flowers that grow on the ocean floor, their petals shimmering with bioluminescent warning colors. They appear beautiful and harmless, attracting curious creatures with their glow, then releasing clouds of paralytic toxin that kills within seconds.

Each Venom Bloom is unique, producing its own specific toxin. Some cause instant death, others induce hallucinations, some create euphoria before killing. Toxira experiments constantly, breeding new varieties to create the "perfect" poison—beautiful, deadly, and elegant.

These creatures spread through spore-like seeds that drift on currents, establishing new bloom patches in reef areas. They've become invasive in some regions, creating deadly gardens that even experienced divers cannot navigate safely. Only those blessed by Toxira or who have studied under Venom Dancer Zara can move through bloom fields safely.

Despite their danger, Venom Blooms are ecologically important. Their toxins break down into nutrients that feed the surrounding ecosystem. Death from one bloom creates life for hundreds of other organisms. This dual nature—beauty and death creating life—is why Toxira considers them her masterpiece.`,
      habitat: 'Reef areas, rocky seafloors, anywhere with stable substrate, spreading invasively',
      abilities: 'Bioluminescent attraction, release paralytic toxin clouds, each bloom produces unique toxin, spread via drifting spores, beautiful but deadly, toxins break down into nutrients',
      cultural_significance: 'Toxira\'s masterpiece, symbol of beautiful danger, invasive species problem, studied by toxicologists, dangerous to divers',
      origin_story: 'Toxira wanted to create something that embodied her philosophy—beauty and death in perfect balance. She took the most beautiful sea flowers and the deadliest toxins, fusing them into the Venom Blooms. They spread quickly, proving too successful at both beauty and killing.',
      weaknesses: 'Non-sentient (can\'t adapt tactics), require stable substrate (vulnerable to shifting seafloors), toxins are species-specific (some creatures immune), antidotes exist for most varieties',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating creatures...\n');

  for (let i = 0; i < creatures.length; i++) {
    const creature = creatures[i];
    console.log(`[${i + 1}/${creatures.length}] Creating ${creature.name} - ${creature.creature_type}`);

    try {
      const { data, error } = await supabase
        .from('creatures')
        .insert([creature])
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
  console.log('✅ Phase 4A Complete!\n');
  console.log('Creatures Created (Part 1):');
  console.log('  • The Tidecaller Leviathan - Ancient Primordial');
  console.log('  • Glassfin Sharks - Transparent Predators');
  console.log('  • The Coral Wyrm - Reef Guardian Dragon');
  console.log('  • Abyss Crawlers - Trench Nightmares');
  console.log('  • Storm Mantas - Electric Chaos Rays');
  console.log('  • The Pearled Kraken - Story Collector');
  console.log('  • Echo Whales - History Singers');
  console.log('  • Venom Blooms - Deadly Flowers');
  console.log('\nNext: Phase 4B - Create 8 more creatures');
}

createPhase4ACreatures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
