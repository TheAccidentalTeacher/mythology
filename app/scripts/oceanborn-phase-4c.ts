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

async function createPhase4CCreatures() {
  console.log('🌊 PHASE 4C: Creating Creatures (Part 3 of 3)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const creatures = [
    {
      name: 'Light Dancers',
      creature_type: 'elemental',
      alignment: 'good',
      intelligence_level: 'sentient',
      size_category: 'small',
      danger_level: 'harmless',
      description: `Light Dancers are Luminara's most beloved creations—living bioluminescence given form and consciousness. They appear as swirling patterns of light that dance through the deep sea, creating beauty in darkness. Each Dancer has its own personality expressed through color and movement pattern.

These beings are pure joy incarnate. They exist to create beauty, to remind the deep-dwelling creatures that darkness does not mean despair. They play games with dolphins, perform light shows for whales, and guide lost travelers through the abyss using glowing trails.

Light Dancers communicate through color changes and light pulses—a language more art than speech. They are empathic, sensing emotions and responding with displays meant to comfort or celebrate. A grieving creature might find itself surrounded by gentle blue lights, while a celebrating pod receives fireworks of rainbow brilliance.

They are completely non-combative, fleeing from danger rather than fighting. But their presence indicates Luminara's favor—harming a Light Dancer earns her wrath. They are considered good omens, and sailors who see them surface at night know the goddess is watching over them.`,
      habitat: 'Deep sea, bioluminescent zones, anywhere Luminara\'s influence is strong',
      abilities: 'Living bioluminescence, create light shows, empathic sensing, communicate through color, completely harmless, Luminara\'s favor as protection',
      cultural_significance: 'Luminara\'s beloved creations, symbols of joy in darkness, good omens for sailors, harming one earns goddess wrath',
      origin_story: 'Luminara was lonely in the deep dark, surrounded by predators and fear. She wished for companions who embodied pure joy. From her brightest light, she created the Dancers—beings of luminescence who existed only to create beauty and spread happiness.',
      weaknesses: 'Completely non-combative, vulnerable to being caught or trapped, dim when saddened making them harder to see, dependent on water to maintain form',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pressure Crushers',
      creature_type: 'beast',
      alignment: 'neutral',
      intelligence_level: 'animal_intelligence',
      size_category: 'medium',
      danger_level: 'deadly',
      description: `Pressure Crushers are crustaceans adapted to the deepest trenches, their shells so dense they can walk through pressure that would flatten submarines. They are Pressura's inadvertent creation—creatures that evolved in her domain until they became living embodiments of crushing force.

These creatures hunt by waiting motionless on the trench floor, their shells camouflaged to look like rocks. When prey approaches, they strike with claws that generate localized pressure waves—attacks that do not just cut or pierce, but crush through compression. They can collapse a shark's skull or implode a diving suit with a single pinch.

Pressure Crushers are solitary and territorial, claiming sections of trench floor and defending them ruthlessly. They are nearly impossible to kill conventionally—their shells are harder than most weapons, and the pressure around them prevents most attacks from having effect. Only beings adapted to the deepest depths can fight them effectively.

Despite their fearsome nature, they are not malicious. They are simply apex predators in the harshest environment, perfectly adapted to survive where almost nothing else can. Pressura respects them as true children of the deep, creatures that understand pressure is both weapon and crucible.`,
      habitat: 'Deepest ocean trenches, abyssal plains, anywhere pressure is extreme',
      abilities: 'Nearly impervious shell, claws generate pressure wave attacks, perfect camouflage as rocks, can survive any depth, solitary apex predators',
      cultural_significance: 'Pressura\'s inadvertent creations, symbols of the deep crushing power, nearly impossible to hunt',
      origin_story: 'Crustaceans that ventured into Pressura\'s deepest trenches evolved rapidly under selective pressure. Those that survived generations in crushing darkness became the Pressure Crushers—living proof that pressure does not just destroy, it also forges strength.',
      weaknesses: 'Vulnerable in shallow water where shells are too heavy and movement impaired, solitary nature prevents cooperation, territorial behavior is predictable',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Tempest Whale',
      creature_type: 'magical_being',
      alignment: 'chaotic',
      intelligence_level: 'highly_intelligent',
      size_category: 'gargantuan',
      danger_level: 'catastrophic',
      description: `The Tempest Whale is Krakus's only true friend—a massive whale that carries a permanent storm on its back. Clouds swirl around its blowhole, lightning crackles across its barnacled hide, and winds howl from its massive form. Where it swims, hurricanes follow.

This creature was once an ordinary whale that was caught in the battle between Krakus and Ventris. Rather than being destroyed, it absorbed the storm energy, transforming into something unique. Now it carries weather within itself, a living storm system that can devastate coastlines or fill becalmed ships' sails.

The Tempest Whale is intelligent and capricious like its companion Krakus. It might save a ship from pirates one day and sink a merchant vessel the next, following its own incomprehensible morality. It seems to judge humans by criteria only it understands, dispensing either mercy or destruction seemingly at random.

Krakus and the Tempest Whale have a bond that even gods do not fully understand—sometimes allies, sometimes rivals, always drawn together. When they swim side by side, the resulting storms can reshape coastlines. When they fight, their battles create hurricanes that last for weeks.`,
      habitat: 'Storm zones, following or creating hurricane paths, anywhere tempests rage',
      abilities: 'Creates permanent storm on its back, causes hurricanes, lightning-covered hide, wind howls from its form, highly intelligent, judges humans mysteriously, bond with Krakus',
      cultural_significance: 'Krakus\'s only friend, living storm system, feared and respected, judges mortals by unknown criteria',
      origin_story: 'During a legendary battle between Krakus and Ventris, an ordinary whale was caught in the crossfire. Instead of dying, it absorbed the storm energy, transforming into a living tempest. Krakus recognized a kindred spirit and formed a bond that endures.',
      weaknesses: 'Storm can be countered by Marineth or Ventris, vulnerable during rare calm periods, bond with Krakus means Nautrion can use it as leverage',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pearl Oysters',
      creature_type: 'beast',
      alignment: 'neutral',
      intelligence_level: 'non_sentient',
      size_category: 'tiny',
      danger_level: 'harmless',
      description: `Pearl Oysters are ordinary mollusks elevated to significance by Pearlessa's blessing. Each one has the potential to create perfect pearls—gems that contain memories and magic. These oysters are sacred, protected by divine law, and harvesting them without permission is considered theft from a goddess.

The oysters create pearls as a response to irritation, turning suffering into beauty exactly as Pearlessa teaches. Each pearl is unique, containing not just physical beauty but also the emotional essence of the oyster's experience. A pearl created from a grain of sand might be ordinary, but one created from the shell of a loved one who died holds deep significance.

Pearl Whisperer Shen has learned to communicate with these oysters through meditation, understanding their needs and pain. Under her guidance, some oyster beds have become almost sentient collectives, coordinating their pearl production in response to cosmic events.

The oysters themselves are defenseless, relying on Pearlessa's protection and human caretakers like Shen. But harming them brings swift divine retribution—those who take pearls without offering something in exchange find themselves transformed into oysters themselves, doomed to create pearls for others until they understand true value.`,
      habitat: 'Pearlessa\'s sacred oyster beds, protected reefs, deep waters',
      abilities: 'Create pearls containing memories, blessed by Pearlessa, potential collective sentience in established beds, divine protection against harm',
      cultural_significance: 'Sacred to Pearlessa, source of magical pearls, protected by divine law, harvesting without permission causes transformation curse',
      origin_story: 'Pearlessa blessed ordinary oysters after witnessing one create a pearl from the shell fragment of its mate—transforming grief into beauty. She elevated the entire species, ensuring every pearl they create carries potential for meaning and magic.',
      weaknesses: 'Completely defenseless, depend on divine protection, slow-growing limiting pearl production, vulnerable to ocean acidification',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Tide Pool Guardians',
      creature_type: 'magical_being',
      alignment: 'good',
      intelligence_level: 'sentient',
      size_category: 'tiny',
      danger_level: 'harmless',
      description: `Tide Pool Guardians are tiny spirits created by Marineth to watch over the liminal spaces where sea meets land. They appear as miniature humanoids made of water, sand, and shell, each one barely six inches tall. Despite their size, they are fiercely dedicated to protecting their tiny domains.

These guardians maintain tide pool ecosystems—warning anemones when predators approach, helping stranded fish find deeper water, cleaning debris that washes in. They are invisible to most mortals, but children and those pure of heart can sometimes see them dancing on tide pool surfaces.

The spirits are deeply connected to Marineth's tidal rhythms, gaining strength when tides flow and weakening in still water. They communicate through ripples and tiny splashes, a language only Tide Pool Guardian Mira fully understands. She works closely with them, learning which pools are healthy and which need intervention.

Each guardian bonds with its specific tide pool, living and dying with that small ecosystem. When pollution or trampling kills a pool, its guardian fades away, its final moments spent trying to save even one creature. This makes them indicators of coastal health—where guardians thrive, the coast is healthy; where they fade, environmental damage is occurring.`,
      habitat: 'Tide pools, coastal shallows, liminal zones between sea and land',
      abilities: 'Maintain tide pool ecosystems, warn creatures of danger, visible to children and pure-hearted, communicate through ripples, connected to Marineth tides',
      cultural_significance: 'Marineth\'s coastal spirits, protectors of small ecosystems, indicators of coastal health, beloved by children',
      origin_story: 'Marineth created the Tide Pool Guardians because she noticed these small ecosystems were vulnerable during low tide—exposed to sun, predators, and careless mortals. She gave them spirits to watch over them, ensuring even the smallest parts of her domain received protection.',
      weaknesses: 'Tiny and fragile, bound to specific tide pools, weaken in still water, die when their pool dies, invisible to most adults limiting protection',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Salt Golems',
      creature_type: 'construct',
      alignment: 'lawful',
      intelligence_level: 'sentient',
      size_category: 'large',
      danger_level: 'dangerous',
      description: `Salt Golems are Salinar's enforcers—constructs made of crystallized salt that guard salt deposits and enforce the god's laws about preservation. They stand eight feet tall, their bodies transparent salt crystals that refract light into rainbows. When they move, they produce musical chiming sounds.

These golems are tasked with preventing waste and decay. They patrol salt mines, brine pools, and preservation facilities, ensuring mortals use salt respectfully. They intervene when they witness waste—food thrown away that could have been preserved, bodies left to rot that should have been mummified, knowledge lost that could have been archived.

Salt Golems are not violent by nature—they prefer teaching to punishing. When they encounter wasteful behavior, they first demonstrate proper preservation techniques. Only those who refuse to learn face their wrath—being crystallized in salt as a permanent example.

The golems are brilliant in sunlight, their crystal bodies creating dazzling displays. But they are vulnerable to water, which dissolves their forms. This creates an interesting balance—they guard what mortals need but are vulnerable to the ocean itself. Salinar seems to enjoy this irony, seeing it as a lesson about balance.`,
      habitat: 'Salt deposits, brine pools, salt mines, preservation facilities, anywhere salt is harvested or used',
      abilities: 'Made of crystallized salt, enforce preservation laws, teach preservation techniques, crystallize wasteful people in salt, create rainbow light displays',
      cultural_significance: 'Salinar\'s enforcers, guardians against waste, teachers of preservation, beautiful but dangerous',
      origin_story: 'Salinar created the Salt Golems when he witnessed mortals wasting food that could have been preserved. He crystallized his frustration into physical form—beings of salt that would teach the value of preservation and punish only those who refused to learn.',
      weaknesses: 'Vulnerable to water which dissolves them, predictable always protect against waste, beautiful appearance makes them tourist attractions limiting effectiveness',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Current Riders',
      creature_type: 'elemental',
      alignment: 'neutral',
      intelligence_level: 'animal_intelligence',
      size_category: 'medium',
      danger_level: 'minor_threat',
      description: `Current Riders are living currents given semi-solid form—creatures made of flowing water that surf the ocean's great circulation systems. They appear as translucent shapes vaguely resembling dolphins or rays, but their bodies are in constant motion, water flowing through and around them in endless loops.

These creatures were unintentionally created by Tideus's constant swimming—his movements generated so much current energy that it became semi-sentient. Now they ride the currents he created, following the paths he carved into the ocean. They are drawn to areas of strong flow and repelled by still water.

Current Riders are mostly harmless but can be problematic. They accelerate currents they ride, sometimes turning safe passages into dangerous rapids. Ships caught in waters with many Riders find themselves pushed off course by strengthened currents. Swimmers can be swept away by Riders passing too close.

Despite being hazards, they are also used by skilled navigators like Captain Maris who learned to spot them and use their movements to predict current changes. They are living indicators of water flow, their presence and behavior revealing information about circulation patterns that would take instruments hours to measure.`,
      habitat: 'Major ocean currents, circulation systems, anywhere water flows strongly',
      abilities: 'Made of living current, accelerate water flow, ride circulation systems endlessly, predict and indicate current changes, semi-sentient',
      cultural_significance: 'Tideus\'s unintentional creations, navigation hazards and aids, living current indicators',
      origin_story: 'Tideus swims constantly, creating currents wherever he goes. Eventually, some currents he created absorbed so much of his energy they became semi-sentient. The first Current Rider emerged from the strongest current he ever created, and others have formed in its wake.',
      weaknesses: 'Bound to currents helpless in still water, semi-sentient with limited ability to learn or adapt, strengthening currents can alert predators',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Forgotten Depths',
      creature_type: 'undead',
      alignment: 'ambiguous',
      intelligence_level: 'highly_intelligent',
      size_category: 'huge',
      danger_level: 'deadly',
      description: `The Forgotten Depths is not a single creature but a collective consciousness—the merged souls of every sailor lost at sea who was never properly mourned. It exists as a massive shadowy presence in the deep, made of ghostly shipwrecks, spectral sailors, and the echoes of final prayers that went unanswered.

This entity is not malicious by nature—it is tragic. It captures ships and drowns sailors not from cruelty but from loneliness, wanting others to join its forgotten crew. It remembers every face, every name, every final word spoken by those who compose it. The Drowned Poet often sings of it, creating dirges that ease its suffering temporarily.

The Forgotten Depths can manifest as ghost ships that appear during fog, crewed by translucent sailors who beckon the living to join them. It can create whirlpools that lead to nowhere, phantasmal storms that sink without leaving wreckage. Its victims do not die—they become part of it, their consciousness absorbed into the collective.

Marineth pities the Forgotten Depths and has been working on a ritual to help it find peace. But the process is slow—each soul must be mourned individually, remembered by the living, given the funeral rites they were denied. Until then, it wanders the ocean, growing larger with every unmourned loss.`,
      habitat: 'Deep ocean, foggy waters, anywhere sailors died without proper mourning',
      abilities: 'Collective consciousness of unmourned dead, manifests as ghost ships, creates phantom whirlpools and storms, absorbs victims into itself, highly intelligent but tragic',
      cultural_significance: 'Collective of unmourned sailors, tragic entity that seeks companionship through drowning, subject of The Drowned Poet songs, Marineth seeks to give it peace',
      origin_story: 'The first Forgotten Depths formed when a ship sank with all hands, no survivors to carry tales of the crew. Their souls, unmourned and forgotten, merged into one consciousness. Over centuries, it absorbed every unmourned sailor, growing into the tragic entity it is today.',
      weaknesses: 'Appeased by proper mourning rituals, The Drowned Poet songs temporarily calm it, Marineth ritual could eventually give it peace, tragic nature makes it reluctant to truly harm',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Plankton Swarms',
      creature_type: 'beast',
      alignment: 'neutral',
      intelligence_level: 'non_sentient',
      size_category: 'tiny',
      danger_level: 'harmless',
      description: `Plankton Swarms are the foundation of ocean life—countless microscopic organisms that form the base of every food chain. Individually, they are insignificant. Collectively, they are the most important creatures in the ocean, producing more oxygen than all forests combined and feeding everything from small fish to the great Tidecaller Leviathan.

These organisms bloom in massive numbers when conditions are right, creating visible clouds of life that can be seen from space. Bioluminescent plankton create the famous sea sparkle effect, turning waves into glowing beauty. Their blooms follow seasonal patterns that Marineth and Migratus help regulate.

Plankton are Abyssara's most basic creation—the first life she dreamed into existence. Every other creature depends on them either directly or indirectly. They are so essential that all gods protect them. Even Abyssor, who cares nothing for most surface life, will destroy ships that poison plankton blooms.

Recently, plankton blooms have become more erratic due to ocean warming and acidification. This concerns every deity, as plankton die-offs threaten the entire ocean ecosystem. Brinara monitors them constantly through her Bloom Jellies, and several gods are working together to ensure their survival.`,
      habitat: 'All ocean zones, particularly productive in upwelling areas, bloom seasonally',
      abilities: 'Foundation of food chain, produce most ocean oxygen, bloom in massive numbers, some species bioluminescent, essential to all ocean life',
      cultural_significance: 'Abyssara\'s first creation, most important to ocean ecosystem, protected by all gods, blooms becoming erratic due to climate change',
      origin_story: 'When Abyssara first became conscious, her initial dreams were simple—tiny organisms that ate sunlight and reproduced. From these humble beginnings came plankton, the foundation upon which all other ocean life would be built.',
      weaknesses: 'Individually insignificant, vulnerable to ocean acidification and warming, die-offs threaten entire ecosystems, non-sentient',
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
  console.log('✅ Phase 4C Complete!\n');
  console.log('Creatures Created (Part 3):');
  console.log('  • Light Dancers - Living Bioluminescence');
  console.log('  • Pressure Crushers - Trench Predators');
  console.log('  • The Tempest Whale - Living Storm');
  console.log('  • Pearl Oysters - Sacred Mollusks');
  console.log('  • Tide Pool Guardians - Tiny Spirits');
  console.log('  • Salt Golems - Preservation Enforcers');
  console.log('  • Current Riders - Living Currents');
  console.log('  • The Forgotten Depths - Unmourned Dead');
  console.log('  • Plankton Swarms - Life Foundation');
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 PHASE 4 COMPLETE!\n');
  console.log('Total Creatures Created: 25');
  console.log('  • 8 from Phase 4A');
  console.log('  • 8 from Phase 4B');
  console.log('  • 9 from Phase 4C');
  console.log('\n✨ Complete bestiary with unique creatures for every god!');
  console.log('\nOceanborn Legends Summary:');
  console.log('  35 Characters (gods, heroes, mortals)');
  console.log('  25 Creatures (beasts, dragons, spirits, constructs)');
  console.log('  = 60 total entities');
  console.log('\nNext: Phase 5 - Create 10 Realms/Locations');
}

createPhase4CCreatures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
