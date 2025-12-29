import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getMythologyId() {
  // Get the Oceanborn Legends mythology (it exists!)
  const { data: mythology, error: mythError } = await supabase
    .from('mythologies')
    .select('id, created_by')
    .eq('name', 'Oceanborn Legends')
    .single();

  if (mythError) throw mythError;
  if (!mythology) throw new Error('Oceanborn Legends mythology not found');

  return { mythologyId: mythology.id, userId: mythology.created_by };
}

async function createPhase1Characters() {
  console.log('🌊 PHASE 1: Creating Divine Hierarchy\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const characters = [
    // TIER 1: PRIMORDIAL FORCES
    {
      name: 'Abyssara',
      character_type: 'god',
      archetype: 'primordial_mother',
      domain: 'The Infinite Ocean, Creation, Destruction, Tides',
      description: `Abyssara is not a being but the ocean itself made manifest. She existed before time, before light, before even the concept of "above" and "below." Her form is unknowable—some say she is the water that fills every corner of the world, others claim she is the darkness between the drops. When she moves, tides shift across entire hemispheres. When she speaks, it is through the rhythm of waves against ancient shores.

She is creation and destruction in equal measure. From her depths, all life emerged, and to her depths, all life eventually returns. The gods themselves are merely her children, born from dreams she had in the first age of the world. She rarely intervenes in mortal or divine affairs, content to simply exist as the eternal ocean.

But when she does act, reality itself trembles. Mountains sink. New seas are born. Entire civilizations vanish beneath her waters, preserved forever in her cold embrace. She is mother, destroyer, and the infinite deep all at once.`,
      origin_story: 'Before the world had shape, there was only Abyssara. She dreamed, and in dreaming, created. Her first dreams became Tideus and Pressura, embodiments of her dual nature—change and permanence, freedom and confinement. Together they shaped the ocean into layers, depths, and currents. When she grew lonely, she dreamed again, and the gods were born.',
      personality: 'Ancient beyond comprehension, patient to the point of seeming indifferent, speaks in visions rather than words, values balance and the natural order above all. Mother to Tideus and Pressura, grandmother to all gods, neutral to mortal affairs unless the ocean itself is threatened.',
      geography_connection: 'The entire ocean—present in every drop of saltwater, every tide pool, every abyss',
      powers_abilities: 'Reality manipulation through water, creation of life, control over all tides, immortality, omnipresence in all water',
      weaknesses: 'Cannot act on land, power wanes when far from large bodies of water, indifference makes her slow to respond to threats',
      appearance_description: 'No true form—sometimes appears as a massive wave that never breaks, other times as an impossibly deep whirlpool, or as a beautiful woman made of living water who shifts between calm and storm',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Tideus',
      character_type: 'god',
      archetype: 'force_of_change',
      domain: 'Currents, Change, Flow of Time, Transformation, Chaos',
      description: `Tideus is movement incarnate, the very concept of flow and change given consciousness. He is the current that never ceases, the tide that never repeats the same pattern twice. Where Abyssara is the ocean's substance, Tideus is its motion. He spirals through the depths in patterns too complex for mortal minds to follow, dragging time itself along in his wake.

He embodies chaos not as disorder, but as infinite possibility. Under his influence, a peaceful bay can become a raging whirlpool in moments. A deadly maelstrom can transform into a tranquil pool. He is beloved by adventurers and feared by those who crave stability.

Tideus has no permanent form or location. He is everywhere water moves—in river rapids, in falling rain, in the blood pumping through mortal hearts. To encounter him is to be swept up in change whether you will it or not. Some emerge transformed for the better, others are broken by the experience. He cares not which—only that change occurred.`,
      origin_story: 'Tideus was Abyssara\'s first dream—a wish for the ocean to move and live rather than remain still. When he awoke, he immediately began to swim, and has never stopped. His swimming created the first currents, which carved patterns into the ocean floor and separated the waters into layers. The gods see him as both essential and dangerous, for while he brings life-giving motion, he also erodes all things given enough time.',
      personality: 'Restless, unpredictable, finds stagnation unbearable, speaks in riddles that change meaning over time, neither good nor evil but amoral force of nature. First-born of Abyssara, brother to Pressura, allies with no one permanently, father to several minor current deities.',
      geography_connection: 'All ocean currents, whirlpools, riptides, and flowing waters',
      powers_abilities: 'Control all ocean currents, accelerate or slow time in water, induce transformation, see all possible futures, teleport through any moving water',
      weaknesses: 'Cannot remain still, vulnerable during the rare moments he pauses, transformation magic can backfire',
      appearance_description: 'A constantly shifting form—sometimes a spiral of water with eyes, sometimes a humanoid figure made of flowing currents with hair that streams in all directions, colors shift from blue to green to silver',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pressura',
      character_type: 'god',
      archetype: 'judge_of_depths',
      domain: 'The Crushing Depths, Judgment, Darkness, Secrets, Weight of History',
      description: `Pressura is the weight of the ocean made sentient—the inexorable force that crushes all things beneath the waves. She dwells in the deepest trenches where light has never reached, in places where the pressure would flatten mountains. She is stillness, permanence, and the terrible patience of stone.

Where Tideus is chaos and change, Pressura is order and consequence. She remembers everything the ocean has ever witnessed. Every shipwreck, every drowned civilization, every secret whispered on a beach—all are archived in her domain. She is the keeper of history and the judge of those who defy the ocean's laws.

Mortals who descend too deep without respect often meet Pressura. She does not kill them—she simply allows the pressure to test them. Those who survive earn her grudging respect. Those who do not become part of her eternal collection, preserved in the darkness forever.`,
      origin_story: 'Pressura was born from Abyssara\'s second dream—a desire for permanence and memory to balance Tideus\'s endless change. She sank immediately to the deepest point in the ocean and has rarely left. From her throne of compressed darkness, she watches everything and remembers all. Some say she is secretly in love with the surface world\'s light, which is why she hoards the memories of those who knew it.',
      personality: 'Cold, calculating, values rules and consequences, speaks rarely but with absolute authority, respects strength and resilience. Second-born of Abyssara, sister to Tideus, rivals with surface gods, mother to several gods of darkness and secrets.',
      geography_connection: 'The deepest ocean trenches, abyssal zones, underwater caves',
      powers_abilities: 'Control pressure and gravity, access all oceanic memories, create zones of absolute darkness, see through any deception, compress matter',
      weaknesses: 'Cannot function in shallow water, becomes weaker in light, sentimentality for lost things makes her vulnerable',
      appearance_description: 'A towering figure of compressed water so dense it appears almost solid, surrounded by absolute darkness, eyes like bioluminescent fish that glow pale blue, voice sounds like stones grinding together',
      mythology_id: mythologyId,
      created_by: userId
    },

    // TIER 2: SUPREME GODS (Children of the Primordials)
    {
      name: 'Nautrion',
      character_type: 'god',
      archetype: 'warrior_king',
      domain: 'Ocean Dominion, War, Leadership, Coral Reefs, Pride',
      description: `Nautrion is the King of the Deep, ruler of the oceanic gods from his throne of living coral that spans an entire underwater mountain range. Born from the union of Tideus's motion and Pressura's permanence, he embodies the ocean's power made tangible. He is ten feet tall with skin like polished abalone that shifts colors with his mood—blue when calm, stormy gray when angry, deep crimson in battle.

He is a warrior without equal, having defeated sea monsters that threatened to devour the world. His trident, forged from a fallen star that plunged into the ocean, can summon tidal waves, split the seafloor, and command every creature beneath the waves. He rules with strength and decisive action, expecting absolute loyalty from those who serve him.

But Nautrion's pride is both his greatest strength and his fatal flaw. He cannot stand to be challenged, and his temper is legendary. He banished his own brother Abyssor to the trenches for questioning a single decision. He has warred with surface gods who dared claim authority over coastal waters. Yet despite his harshness, his subjects love him, for he protects the ocean with unmatched ferocity.`,
      origin_story: 'Nautrion was born when a rogue current from Tideus collided with a mass of pressurized water from Pressura\'s realm. The collision created an explosion of divine energy that coalesced into the first true god—not a primordial force, but a being with will and ambition. He immediately claimed the mid-waters as his domain and built his coral throne from the bones of ancient sea monsters he slew in his youth.',
      personality: 'Proud, decisive, short-tempered but deeply loyal, values strength and duty above all, loves his wife Marineth with passionate intensity, haunted by regret over banishing his brother. Son of Tideus and Pressura (spiritually), husband to Marineth, brother to Abyssor, father to multiple sea gods.',
      geography_connection: 'The Coral Throne (a vast coral reef city), territorial waters, continental shelves',
      powers_abilities: 'Supreme control over seawater, command all sea creatures, cause earthquakes and tsunamis, immortality, superhuman strength, master combatant',
      weaknesses: 'Pride can be manipulated, vulnerable on land, his love for Marineth can be exploited, haunted by his decision to banish Abyssor',
      appearance_description: 'Ten feet tall, muscular humanoid form with skin like polished abalone that shifts colors, eyes like whirlpools, wild hair of kelp and bioluminescent jellyfish tendrils, wears armor of shark teeth and ancient shipwreck metal, wields the Starcurrent Trident',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Marineth',
      character_type: 'god',
      archetype: 'moon_oracle',
      domain: 'Tides, Moon, Prophecy, Marriage, Tidal Pools',
      description: `Marineth is the Queen of Tides, the Moon's Daughter, and the Keeper of Destiny. She was born when moonlight first touched the ocean's surface, coalescing into a goddess of ethereal beauty and mysterious power. Unlike her husband Nautrion's brute strength, Marineth rules through prophecy, diplomacy, and the subtle manipulation of fate itself.

She controls the tides—not through force, but through whispered agreements with the moon. Twice a day, she raises and lowers the seas, exposing hidden paths and drowning others. She sees the future reflected in tide pools, reads destinies in the patterns of foam, and knows the secret names of every current and wave.

Marineth is beloved by fishermen, sailors, and coastal dwellers who leave offerings at high tide. She is the gentler face of the ocean's power, the goddess who might grant mercy where Nautrion would show only wrath. But she is not weak—her prophecies have toppled kingdoms, and those who displease her find the tides forever turned against them.`,
      origin_story: 'When the moon first appeared in the sky, its light touched the ocean and created Marineth from the silver reflection. She rose from the waves singing a song of tides and time. Nautrion heard her song and was captivated. Their courtship was legendary—he offered her the rarest pearls from the deepest trenches, slew monsters in her name, and finally built her a palace of moonstone that glows beneath the waves. She accepted him not for his strength, but because she had foreseen that together they would birth the next generation of gods.',
      personality: 'Wise, patient, compassionate but never weak, speaks in riddles and metaphors, sees all as part of a greater pattern, deeply in love with Nautrion despite his flaws. Daughter of moonlight and ocean, wife of Nautrion, mother to several gods, ally to mortal heroes.',
      geography_connection: 'Tidal zones, beaches, coastal waters, anywhere moonlight touches water',
      powers_abilities: 'Control tides, prophecy, manipulate fate, communicate with the moon, create protective barriers, heal with moonlight',
      weaknesses: 'Power wanes during new moons, cannot act during solar eclipses, bound by the prophecies she speaks',
      appearance_description: 'Slender and graceful, skin that glows with inner moonlight, hair of flowing silver water that floats even underwater, eyes that shift between silver and deep blue, wears robes woven from foam and moonbeams, crowned with a circlet of living coral and pearls',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Abyssor',
      character_type: 'god',
      archetype: 'banished_devourer',
      domain: 'The Trenches, Hunger, Exile, Darkness, Vengeance',
      description: `Abyssor is the Devourer Below, the Lord of the Trenches, and Nautrion's banished brother. Where Nautrion embodies the ocean's majesty, Abyssor represents its terror—the crushing depths that swallow ships whole, the darkness that hides ancient horrors, the hunger that devours all light.

Once, he was Nautrion's equal, his twin in power and ambition. But where Nautrion sought to rule the ocean, Abyssor sought to consume it. He devoured too many souls, collected too many secrets, grew too powerful too quickly. When he challenged Nautrion for the Coral Throne, their battle scarred the ocean floor with trenches that still bear his name. Nautrion won, barely, and cast Abyssor into the deepest trench, sealing him with Marineth's tidal magic.

But exile has not diminished Abyssor's power—it has focused it. He rules the abyssal realm like a dark king, commanding monsters too terrible to have names. He plots his return, whispers promises to mortals foolish enough to dive too deep, and waits for the day when the seal weakens. And it will weaken. Everything in the ocean does, eventually.`,
      origin_story: 'Abyssor and Nautrion were born from the same divine event—twin gods who represented the ocean\'s dual nature of beauty and horror. But while Nautrion claimed the sunlit waters, Abyssor was drawn to the darkness. He descended into the trenches and discovered ancient things—predators from before time, secrets the primordials had hidden, power that corrupted him. When he returned, he was changed, monstrous. The resulting civil war nearly destroyed the ocean pantheon. His banishment was the price of peace, but it left Nautrion forever haunted.',
      personality: 'Bitter, vengeful, patient to the point of madness, darkly charismatic, values power above all, sees himself as the rightful king. Brother to Nautrion, uncle to the younger gods, ally to monsters and dark things, father to creatures of nightmare.',
      geography_connection: 'The deepest oceanic trenches, abyssal zones, underwater volcanoes',
      powers_abilities: 'Command darkness, devour souls and magic, superhuman strength, create monsters, corrupt other beings, see through any depth',
      weaknesses: 'Sealed in the trenches by divine magic, weakened by bright light, his hunger can be turned against him, still loves his brother despite everything',
      appearance_description: 'Massive and hulking, twelve feet tall, skin like black volcanic glass covered in scars that glow with bioluminescent red, eyes are empty voids that consume light, voice like the grinding of tectonic plates, wears a crown made from the bones of leviathans he has devoured',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Luminara',
      character_type: 'god',
      archetype: 'light_bringer',
      domain: 'Bioluminescence, Hope, Deep-Sea Life, Adaptation, Beauty',
      description: `Luminara is the Lady of Bioluminescence, the Glowing One, the Light in the Darkness. She was born in the depths where no sunlight reaches, yet she is radiant—a goddess of living light that defies the crushing pressure and endless darkness of the abyss. She represents hope in hopeless places, beauty in barrenness, life adapting to impossibility.

She is covered in patterns of bioluminescent markings that pulse with her emotions—soft blue when calm, brilliant green when joyful, sharp white when angry. She is the patron of all deep-sea creatures that make their own light, and her realm is a wonderland of glowing jellyfish, anglerfish with lanterns, and underwater forests that shimmer with phosphorescence.

Luminara is the sworn enemy of Abyssor, for she refuses to let the darkness be synonymous with evil. She proves that even in the deepest trench, light can exist. She is beloved by explorers and those who journey into dangerous waters, for her light can guide the lost home. But she is also fierce in battle, her bioluminescence capable of blinding enemies or marking targets for her hunters.`,
      origin_story: 'Luminara was born when Pressura, dwelling in her realm of darkness, felt a moment of unexpected longing for light. She could not ascend to the surface, so instead, she dreamed of light that could exist in darkness. From that dream came Luminara, who emerged glowing like a constellation underwater. Pressura was both proud and resentful of her daughter—proud of her beauty, resentful that she represented something Pressura herself could never have. Luminara eventually left her mother\'s realm to establish her own kingdom of light in the depths.',
      personality: 'Optimistic but not naive, values courage and adaptation, protective of the weak, artistic and creative, somewhat vain about her beauty. Daughter of Pressura, rival of Abyssor, ally of Nautrion and Marineth, patron of deep-sea explorers.',
      geography_connection: 'Bioluminescent zones, deep-sea thermal vents, glowing underwater caves',
      powers_abilities: 'Generate and control bioluminescent light, see through all darkness, adapt to any depth or pressure, communicate with deep-sea creatures, blind enemies with light bursts',
      weaknesses: 'Her light makes her impossible to hide, vulnerable to being tracked, dimmed by extreme emotional pain',
      appearance_description: 'Humanoid but covered in intricate bioluminescent patterns that constantly shift colors, hair like flowing jellyfish tendrils that glow, eyes that shine like twin stars, translucent skin reveals glowing organs beneath, surrounded by a corona of living light',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Krakus',
      character_type: 'god',
      archetype: 'storm_incarnate',
      domain: 'Storms, Rage, Shipwrecks, Surface Chaos, Vengeance',
      description: `Krakus is the Storm Bringer, the Wrath of the Waves, the god who reaches from the depths to tear ships apart and drag sailors into the dark. He is the ocean's rage personified—the fury of hurricanes, the violence of rogue waves, the terror of whirlpools that appear without warning. Where other gods might show mercy, Krakus shows only the storm.

He was born from Tideus's wildest currents during a cataclysmic storm that lasted forty days and forty nights. When he emerged, his first act was to sink an entire fleet that had been dumping poison into the ocean. Since then, he has been both executioner and defender—destroying those who harm the sea, but also lashing out in blind rage at innocent sailors who happened to be in the wrong place.

Krakus is tentacled, massive, terrifying—more monster than god in appearance. But he is frighteningly intelligent, capable of strategy and long-term planning. He has allied with Nautrion against common enemies, but their alliance is always uneasy. Krakus bows to no one, not even the King of the Deep.`,
      origin_story: 'During the War of Depths when Nautrion fought Abyssor, Tideus created Krakus as a weapon—a being of pure destructive power to tip the scales. But Krakus could not be controlled. He turned on both sides, nearly destroying the coral throne itself. Nautrion was forced to make peace with him by granting him domain over all storms and the surface waters. Now Krakus dwells in a massive underwater canyon near the surface, where he summons tempests and collects the wreckage of ships he has destroyed.',
      personality: 'Wrathful, territorial, values the ocean above all else, despises surface dwellers, respects strength, has a twisted sense of honor. Son of Tideus (spiritually), rival-ally of Nautrion, enemy of surface gods, father to storm elementals.',
      geography_connection: 'Storm zones, hurricane paths, treacherous seas, the Shipwreck Canyon',
      powers_abilities: 'Summon and control storms, create massive waves and whirlpools, superhuman strength, regeneration, command sea monsters during storms',
      weaknesses: 'Blind rage makes him manipulable, weakened during calm weather, vulnerable to divine weapons forged from sunlight',
      appearance_description: 'Gigantic form with humanoid torso and multiple massive tentacles instead of legs, skin like storm-dark water with lightning crackling beneath, eyes like twin hurricanes, voice like thunder over waves, surrounded by a perpetual aura of wind and rain',
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
  console.log('✅ Phase 1 Complete!\n');
  console.log('Divine Hierarchy Summary:');
  console.log('  3 Primordial Forces: Abyssara, Tideus, Pressura');
  console.log('  5 Supreme Gods: Nautrion, Marineth, Abyssor, Luminara, Krakus');
  console.log('\nNext: Phase 2 - Create 12 Major Deities');
}

createPhase1Characters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
