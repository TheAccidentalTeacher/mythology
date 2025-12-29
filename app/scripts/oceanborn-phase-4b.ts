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

async function createPhase4BCreatures() {
  console.log('🌊 PHASE 4B: Creating Creatures (Part 2 of 3)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const creatures = [
    {
      name: 'Ice Serpents',
      creature_type: 'dragon',
      alignment: 'lawful',
      intelligence_level: 'sentient',
      size_category: 'huge',
      danger_level: 'deadly',
      description: `Ice Serpents are Glacius's enforcers, serpentine dragons made of living ice that patrol the polar seas. Their scales are sheets of glacial ice so cold they burn on contact, and their breath is a blizzard that can freeze a ship solid in seconds. They are beautiful in their terrible way—translucent bodies that refract light into rainbows, movements that produce tinkling sounds like wind chimes of ice.

These serpents are fiercely loyal to Glacius, sharing his belief that ice is order and warmth is chaos. They attack anything attempting to drill, fish, or establish infrastructure in polar waters. They're becoming more aggressive as their habitat shrinks from climate change, driven to desperation alongside their creator.

Ice Serpents are sentient and capable of speech, though they rarely bother with mortals. When they do speak, their voices sound like creaking glaciers and cracking ice. They view themselves as the last defenders of a dying world, making them simultaneously tragic and dangerous.

Unlike fire dragons that hoard treasure, Ice Serpents hoard memories—they preserve creatures and objects in ice, creating galleries of frozen history. Each serpent maintains its own collection, and the loss of these galleries to melting ice drives them to rage.`,
      habitat: 'Arctic and Antarctic waters, beneath ice shelves, glacial zones',
      abilities: 'Made of living ice, freezing breath attacks, immune to cold, vulnerable to warmth, can preserve things in ice indefinitely, speak all languages',
      cultural_significance: 'Glacius\'s enforcers, symbols of polar protection, increasingly aggressive due to habitat loss, guardians of frozen history',
      origin_story: 'When Glacius claimed the polar regions, he realized he needed guardians who shared his dedication. He breathed life into glacier ice, creating serpents that embodied his ideals of preservation through freezing. They emerged already ancient, already committed to defending the frozen seas.',
      weaknesses: 'Vulnerable to warmth (melts their bodies), losing habitat to climate change drives them to desperation, ice-preserved collections melting causes psychological trauma',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Shell Golems',
      creature_type: 'construct',
      alignment: 'good',
      intelligence_level: 'sentient',
      size_category: 'large',
      danger_level: 'dangerous',
      description: `Shell Golems are Shellar's creations—animated suits of armor made entirely from interlocking shells. They serve as guardians at her sanctuaries, protecting refugees who seek her aid. Each golem is unique, assembled from the shells of hundreds of mollusks, creating a patchwork body that clatters and clicks as it moves.

These constructs are not mindless—Shellar imbued each with fragments of consciousness from the mollusks whose shells compose them. This creates a collective intelligence, hundreds of small minds working as one. They're protective, patient, and remarkably compassionate for beings made of armor.

Shell Golems excel at defense. Their bodies can absorb tremendous impact, their shells regenerating slowly over time. They fight by grappling and restraining rather than killing, embodying Shellar's philosophy that protection doesn't require violence. They've been known to shield enemies from collapsing structures, protecting even those who moments before attacked them.

The golems are bound to Shellar's sanctuaries—they cannot travel far from these sacred places. This limitation frustrates them, as they hear of injustices beyond their reach but cannot intervene. They compensate by making their sanctuaries impenetrable fortresses where the weak are always safe.`,
      habitat: 'Shellar\'s sanctuaries, reef areas with high mollusk populations',
      abilities: 'Armor made of regenerating shells, grappling and restraining combat style, collective consciousness, bound to sanctuaries, will protect even enemies from greater harm',
      cultural_significance: 'Guardians of Shellar\'s refugees, symbols of defensive strength, compassionate protectors, cannot be corrupted',
      origin_story: 'After creating Shell Knight Toren, Shellar realized one champion wasn\'t enough to protect all who needed sanctuary. She collected shells from mollusks that died protecting their colonies and animated them with collective consciousness, creating guardians who would never abandon the defenseless.',
      weaknesses: 'Bound to sanctuaries (cannot leave), shell regeneration is slow (sustained damage overwhelms them), compassionate nature can be exploited',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Singing Sirens',
      creature_type: 'magical_being',
      alignment: 'ambiguous',
      intelligence_level: 'highly_intelligent',
      size_category: 'medium',
      danger_level: 'dangerous',
      description: `Singing Sirens are not the malevolent ship-luring monsters of surface legends—they're Marineth's daughters, semi-divine beings blessed with voices that can manipulate emotions through song. They appear as beautiful humanoids with fish-like lower bodies, their scales shimmering like moonlight on water.

Sirens use their songs for many purposes—calming storms, guiding lost sailors, communicating across vast distances, and yes, occasionally luring ships. But the luring is rarely malicious—they draw ships to safety during storms, guide them around hazards, and only rarely use their power for darker purposes.

Each siren has her own personality and moral code. Some are genuinely benevolent, spending their lives guiding sailors. Others are tricksters who find human confusion entertaining. A few are genuinely malevolent, using their power to cause shipwrecks for Abyssor's amusement. Marineth loves them all equally, viewing their moral diversity as natural.

Sirens are prophetic like their mother, their songs sometimes containing glimpses of future events. Wise sailors learn to listen to the meaning beneath the melody, understanding that a siren's song is rarely just entertainment—it's usually a warning, prophecy, or message from Marineth herself.`,
      habitat: 'Rocky islands, dangerous straits, anywhere ships pass regularly',
      abilities: 'Songs that manipulate emotions, guide ships with sound, prophetic visions, communicate across vast distances, semi-divine (age slowly), daughters of Marineth',
      cultural_significance: 'Marineth\'s daughters, both feared and respected by sailors, subject of many legends (most incorrect), each has unique moral code',
      origin_story: 'Marineth, lonely in the early days of creation, sang to the ocean. Her song took physical form, and from the foam emerged the first sirens—her daughters, each one embodying a different aspect of her complex nature. They spread across the oceans, singing their mother\'s truths.',
      weaknesses: 'Vulnerable on land (lose tail mobility), songs can be resisted by those who understand them, dependent on water for survival, moral diversity means they can\'t organize effectively',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Brine Hydra',
      creature_type: 'monster',
      alignment: 'evil',
      intelligence_level: 'animal_intelligence',
      size_category: 'gargantuan',
      danger_level: 'catastrophic',
      description: `The Brine Hydra is a monstrous aberration that dwells in hypersaline brine pools where nothing else can survive. It has seven heads, each one adapted to detect prey through different senses—sight, smell, heat, electrical impulses, vibration, taste, and magnetic fields. Nothing can approach its pool without all seven heads knowing immediately.

This creature is ancient, possibly as old as Salinar himself. Some scholars believe it's a failed experiment—the god's attempt to create a guardian for salt deposits that became too aggressive and uncontrollable. Salinar neither confirms nor denies this, but he doesn't stop the hydra either.

The Brine Hydra attacks anything that enters its brine pools, dragging victims down to drown in water so salty it's more mineral than liquid. It's nearly impossible to kill—cutting off one head causes two to grow back, and its flesh is so saturated with salt that wounds crystallize and heal rapidly.

The creature's lair contains treasures from every civilization that tried to harvest its brine pool. Ancient weapons, lost artifacts, the bones of heroes—all preserved perfectly in the hypersaline water. Many have tried to claim these treasures. All have failed.`,
      habitat: 'Hypersaline brine pools, salt-saturated zones, the Dead Sea zones',
      abilities: 'Seven heads with different sensory detection, regenerate two heads for each one severed, salt-saturated flesh heals rapidly, immune to poison, breathes water of any salinity',
      cultural_significance: 'Guardian (or prisoner) of hypersaline zones, feared by treasure hunters, possibly Salinar\'s failed experiment',
      origin_story: 'The Brine Hydra\'s origins are unclear. Some say Salinar created it to guard salt deposits. Others claim it mutated from drinking from a cursed brine pool. A few believe it\'s punishment for a hero who angered the salt god. Salinar keeps its true origin secret, letting legends multiply.',
      weaknesses: 'Bound to its brine pool (cannot leave), vulnerable to fresh water (dilutes its flesh), predictable territorial behavior, heads regenerate slower with each iteration',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Scavenger Eels',
      creature_type: 'beast',
      alignment: 'neutral',
      intelligence_level: 'animal_intelligence',
      size_category: 'medium',
      danger_level: 'minor_threat',
      description: `Scavenger Eels are Scavenor's most successful creation—eels perfectly adapted to feed on decay without spreading disease. They have powerful digestive systems capable of breaking down even toxic materials, converting death into harmless nutrients. They swarm on corpses and waste, cleaning the ocean floor with ruthless efficiency.

These eels are not aggressive hunters—they're opportunistic scavengers that prefer dead or dying prey. They have sensory organs that detect decomposition chemicals from miles away, allowing them to arrive at death sites within hours. They work in massive swarms, thousands of eels stripping a whale carcass to bones in days.

Despite their grotesque feeding habits, Scavenger Eels are ecologically essential. Without them, the ocean floor would be covered in rotting matter, disease would spread unchecked, and nutrient cycles would break down. They're the ocean's cleanup crew, performing a necessary if unpleasant service.

Scavenor is proud of his eels—they embody his philosophy that death serves life, that nothing should be wasted. He's been breeding variants adapted to eat human pollution, creating eels that can digest plastics and toxins, attempting to heal the damage mortals cause.`,
      habitat: 'Ocean floor, around whale falls, scavenger sites, increasingly near pollution zones',
      abilities: 'Detect decay from miles away, digest anything organic (including toxins), swarm feeding behavior, some variants can digest plastics, immune to most diseases',
      cultural_significance: 'Scavenor\'s cleanup crew, ecologically essential, symbol of death serving life, new variants targeting pollution',
      origin_story: 'When Scavenor first claimed his domain, he found the ocean floor cluttered with decay. He created eels adapted to consume all waste efficiently, giving them powerful digestion and death-seeking senses. They spread rapidly, becoming the ocean\'s most efficient recyclers.',
      weaknesses: 'Non-aggressive (easily killed if caught), prefer dead prey (vulnerable to traps), pollution-eating variants still experimental (some fail catastrophically)',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Undertow Beast',
      creature_type: 'spirit',
      alignment: 'evil',
      intelligence_level: 'sentient',
      size_category: 'huge',
      danger_level: 'deadly',
      description: `The Undertow Beast is Surgus's physical manifestation—a spirit creature made of pure current and drowning panic. It has no fixed form, appearing as a writhing mass of water that moves against natural flow, creating rip currents and undertows wherever it travels. Its "face" is formed by drowning victims' last expressions, constantly shifting through hundreds of terrified visages.

This creature hunts swimmers actively, seeking those who show disrespect to the ocean—bathers who ignore warning signs, surfers who taunt waves, swimmers who mock drowning victims. It appears beneath them, wrapping tendrils of current around their legs, dragging them down with inexorable strength.

The Beast is sentient and cruel, feeding not on flesh but on panic and despair. It prolongs drownings, letting victims surface briefly for air before dragging them back down, maximizing terror. Those it kills join the faces on its form, their expressions of final horror becoming part of the creature.

Even gods avoid the Undertow Beast. It's not powerful enough to threaten deities, but its nature is so fundamentally disturbing that even Abyssor finds it unpleasant. Only Surgus controls it, and even he sometimes seems unsure whether he created the Beast or the Beast created him.`,
      habitat: 'Rip current zones, dangerous beaches, anywhere undertows form',
      abilities: 'Made of living current, drags swimmers with unstoppable strength, feeds on panic and despair, incorporates victims\' death masks into form, immune to physical attacks',
      cultural_significance: 'Surgus\'s manifestation, symbol of drowning horror, hunts disrespectful swimmers, even gods find it disturbing',
      origin_story: 'When Surgus was born from Tideus\'s grief, part of that grief solidified into the Undertow Beast—a creature embodying the terror of drowning. It may be Surgus\'s shadow self, the darkest part of his nature given independent form. Neither god nor beast will say which came first.',
      weaknesses: 'Bound to rip currents (can\'t function in still water), vulnerable to Marineth\'s tidal control, disturbing nature means even allies avoid it, may be dependent on Surgus for existence',
      is_unique: true,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Bloom Jellies',
      creature_type: 'magical_being',
      alignment: 'neutral',
      intelligence_level: 'non_sentient',
      size_category: 'small',
      danger_level: 'minor_threat',
      description: `Bloom Jellies are Brinara's creation—jellyfish that serve as indicators of ocean health by changing color based on water salinity and chemical balance. They bloom in massive numbers when conditions are right, creating spectacular displays of bioluminescence that can be seen from space.

Each jelly glows a different color based on what it detects—blue for optimal salinity, green for fresh water intrusion, red for high salinity, purple for acidification, yellow for pollution. A healthy ocean filled with blue-glowing jellies is a beautiful sight. An ocean filled with red and purple warnings is terrifying.

Bloom Jellies have become essential to Brinara's monitoring of ocean health. She can sense what they sense, using them as a distributed sensor network that spans the entire world. When jellies die or change colors in concerning patterns, she investigates and often intervenes.

The jellies are non-sentient but seem to respond to Brinara's will, blooming where she needs information, dying off when surveillance is no longer needed. Some scholars believe the entire species is actually one organism—Brinara herself, watching the ocean through thousands of distributed eyes.`,
      habitat: 'All ocean zones, bloom in response to conditions Brinara needs to monitor',
      abilities: 'Color-change indicates water conditions, bioluminescent displays visible from space, bloom in massive numbers, connected to Brinara\'s consciousness, non-sentient but responsive',
      cultural_significance: 'Brinara\'s sensor network, ocean health indicators, warnings to mortals about environmental damage, beautiful displays when ocean is healthy',
      origin_story: 'Brinara needed a way to monitor ocean chemistry beyond what her own senses could achieve. She created jellies that would act as extensions of herself, each one a tiny monitoring station that reports back through color and bioluminescence. They bloomed first in perfectly balanced waters, glowing pure blue.',
      weaknesses: 'Non-sentient (vulnerable to predators), die off in toxic conditions they\'re meant to warn about, beautiful displays attract collectors (threatening population)',
      is_unique: false,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Migration King',
      creature_type: 'spirit',
      alignment: 'good',
      intelligence_level: 'highly_intelligent',
      size_category: 'gargantuan',
      danger_level: 'minor_threat',
      description: `The Migration King is Migratus's champion—a spirit creature that appears as a constantly-shifting form combining features of all migratory species. Sometimes it has salmon's determination, sometimes turtle's ancient wisdom, sometimes whale's grandeur. It is journey incarnate, never staying in one form or place for long.

This creature leads migrations, appearing at the front of massive fish runs, turtle nestings, or whale pods. Its presence ensures migrations succeed—predators are deterred, currents are favorable, routes are clear. It is believed that if the Migration King leads a journey, all will arrive safely at their destination.

The King is not aggressive, but it is fiercely protective of migrants under its care. It has been known to battle sharks, redirect ships, and even temporarily alter currents to protect its charges. Those who interfere with migrations it leads do so at great peril.

The creature is timeless, having led migrations since before recorded history. It is one of the oldest spirits, perhaps even predating Migratus himself. Some believe it's what taught the first gods about the concept of journey and homecoming, making it not a creation but a teacher.`,
      habitat: 'Wherever migrations occur, never in one place long, always at the front of journeys',
      abilities: 'Shapeshifts to combine features of migratory species, ensures safe migrations, deters predators, alters currents slightly, ancient wisdom, protective of all migrants',
      cultural_significance: 'Migratus\'s champion, leader of great migrations, symbol that all journeys can succeed, possibly predates the gods',
      origin_story: 'The Migration King\'s true origin is unknown. Some say it taught Migratus about migration when the god was young. Others claim Migratus created it from the collective instinct of all migratory species. The King itself doesn\'t speak of its past—it\'s too busy leading the next journey.',
      weaknesses: 'Non-combatant by nature (protects but doesn\'t kill), bound to migratory routes (predictable), weakening as human disruption makes migrations harder',
      is_unique: true,
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
  console.log('✅ Phase 4B Complete!\n');
  console.log('Creatures Created (Part 2):');
  console.log('  • Ice Serpents - Glacial Enforcers');
  console.log('  • Shell Golems - Protective Constructs');
  console.log('  • Singing Sirens - Marineth\'s Daughters');
  console.log('  • The Brine Hydra - Salt Pool Terror');
  console.log('  • Scavenger Eels - Ocean Cleanup Crew');
  console.log('  • The Undertow Beast - Drowning Spirit');
  console.log('  • Bloom Jellies - Salinity Indicators');
  console.log('  • The Migration King - Journey Leader');
  console.log('\nTotal creatures: 16');
  console.log('\nNext: Phase 4C - Create final 9 creatures');
}

createPhase4BCreatures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
