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

async function createPhase3ACharacters() {
  console.log('🌊 PHASE 3A: Creating Heroes & Mortals (Part 1 of 2)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const characters = [
    {
      name: 'Captain Maris Deepwater',
      character_type: 'hero',
      archetype: 'explorer_captain',
      domain: null,
      description: `Captain Maris Deepwater is the greatest mortal sailor to ever command a ship. She has sailed every known sea and charted waters that exist on no map. Her vessel, the Tidecaller, is said to be blessed by Marineth herself, able to weather any storm and find favorable currents even in the doldrums.

Maris was born in a coastal village that was destroyed by one of Krakus's rages when she was a child. She survived by clinging to driftwood for three days, during which she swore an oath to master the ocean rather than fear it. She spent her youth learning everything about the sea—navigation by stars, reading weather patterns, understanding currents, speaking the language of dolphins.

She is weathered and scarred, her skin bronzed by sun and salt, her hands calloused from rope work. She wears a coat made from sailcloth that has survived a hundred storms, and around her neck hangs a compass that always points toward the nearest safe harbor—a gift from Marineth for rescuing drowning sailors during a hurricane.

Maris has no divine powers, but her mortal skill rivals that of gods. She can read the ocean like others read books, predicting storms hours before they form, finding fish when nets come up empty, navigating through fog so thick even Echolus loses his way. She has earned the grudging respect of Nautrion and the active friendship of Ventris, who often provides wind for her sails.`,
      origin_story: 'Orphaned by Krakus\'s rage, young Maris swore vengeance but realized she could never defeat a god through force. Instead, she mastered the ocean itself, becoming such a skilled sailor that even the gods took notice. When she rescued a pod of Marineth\'s sacred dolphins from illegal hunters, the goddess blessed her ship and compass, marking her as worthy of divine favor.',
      personality: 'Brave, pragmatic, respectful of the ocean\'s power, mentors young sailors, harbors quiet grudge against Krakus, believes mortals can be equals to gods through skill and determination.',
      geography_connection: 'Sails all oceans but calls no port home, her ship is her kingdom',
      powers_abilities: 'Supreme navigation and sailing skill, weather prediction, animal communication (learned, not magical), blessed compass and ship, divine favor from Marineth',
      weaknesses: 'Purely mortal—can be killed, injured, ages normally; her grudge against Krakus makes her reckless in storms',
      appearance_description: 'Weathered woman in her 40s, sun-bronzed skin, calloused hands, wears sailcloth coat, blessed compass around neck, short practical hair streaked with grey, eyes like the sea—sometimes calm, sometimes stormy',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Ketos the Leviathan Slayer',
      character_type: 'hero',
      archetype: 'monster_hunter',
      domain: null,
      description: `Ketos is a legendary warrior who hunts the ocean's most dangerous monsters. Not creatures that merely exist, but actively malevolent beings that threaten coastal settlements and shipping lanes. He has slain three krakens, driven off two dragon turtles, and once fought Toxira's most venomous creation to a standstill.

He is massive—seven feet tall, built like a warship, covered in scars that form a map of every monster he's faced. He wears armor made from the scales and shells of his victims, carries a harpoon forged from a fallen star that Luminara guided to the surface, and owns a collection of trophies that would make museums weep with envy.

Despite his fearsome reputation, Ketos is thoughtful and philosophical about killing. He doesn't hunt for sport or glory—he hunts to protect. Before killing any creature, he asks whether it chose to be monstrous or was made that way. He has spared creatures others would kill, and killed creatures others would worship, judging each case individually.

His greatest achievement was negotiating a truce between Abyssor and a coastal nation by proving that the monster attacks were actually caused by pollution killing the god's sacred creatures. Abyssor, impressed by a mortal who sought understanding rather than violence, has since become Ketos's reluctant ally.`,
      origin_story: 'Born to fisherfolk, Ketos witnessed his entire village consumed by a corrupted sea monster that was once benevolent. He learned that Abyssor had twisted the creature as punishment for humans poisoning its waters. Rather than seek revenge, Ketos dedicated his life to understanding monsters, learning which were evil by nature and which were victims of circumstance.',
      personality: 'Stoic, philosophical, judges each situation individually, respects Scavenor\'s role in the ecosystem, allies with Abyssor (to everyone\'s shock), believes in understanding before killing.',
      geography_connection: 'Hunts in the deepest waters, maintains a fortress on an isolated island filled with monster trophies',
      powers_abilities: 'Superhuman strength and durability (earned through training), star-forged harpoon, armor from slain monsters, tactical genius, underwater breathing (gift from Abyssor)',
      weaknesses: 'Ages normally, can be killed, his moral code prevents him from hunting certain creatures even when hired to do so',
      appearance_description: 'Seven-foot-tall giant covered in scar-maps, wears armor of monster scales and shells, carries star-forged harpoon, face weathered but thoughtful, eyes that have seen too many deaths',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pearl Whisperer Shen',
      character_type: 'mortal',
      archetype: 'mystic_diver',
      domain: null,
      description: `Shen is a legendary pearl diver who can hold her breath for over fifteen minutes and dive deeper than any other mortal. She has descended to depths that would crush others, surviving through meditation techniques taught to her in dreams by Pearlessa herself. She is the only mortal allowed to harvest pearls from Pearlessa's sacred beds.

She is small and slight, seeming fragile on land but becoming graceful and powerful underwater. Her lungs are unusually large, her blood adapted to carry more oxygen through years of training. She wears necklaces of perfect pearls, each one a story—pearls of joy, pearls of sorrow, pearls of transformation.

Shen can read the stories contained within pearls, seeing the oyster's life, feeling the irritation that created the treasure, understanding the beauty born from pain. Pearlessa values Shen not just as a harvester, but as a student of transformation—someone who understands that suffering can be alchemized into beauty.

She runs a small shop in a coastal city where she sells pearls, but more importantly, she counsels those going through difficult times. She shows them pearls and tells them the stories of transformation, helping people see their own struggles as the irritation that will create their personal pearls of wisdom.`,
      origin_story: 'Born to poverty, Shen began diving for pearls as a child to support her family. One day she dove so deep in desperation that she passed out, and Pearlessa appeared in her oxygen-starved vision, teaching her to transform suffering into strength. She woke on the beach with a perfect black pearl in her hand and new knowledge in her mind.',
      personality: 'Serene, values transformation and growth through adversity, patient counselor, reverent toward Pearlessa, believes all suffering has purpose if we choose to learn from it.',
      geography_connection: 'Coastal city shop, but dives in Pearlessa\'s sacred oyster beds',
      powers_abilities: 'Extended breath-holding (15+ minutes), deep diving beyond normal human limits, pearl-reading (see stories within pearls), meditation mastery, Pearlessa\'s blessing',
      weaknesses: 'Mortal fragility, physically weak on land, devoted to Pearlessa which limits her freedom',
      appearance_description: 'Small, slight woman with unusually large lung capacity, wears necklaces of story-pearls, graceful underwater, moves like she\'s always swimming even on land, peaceful expression, eyes reflect rainbow colors like mother-of-pearl',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Riptide Kael',
      character_type: 'hero',
      archetype: 'cursed_hero',
      domain: null,
      description: `Kael is a tragic hero who was cursed by Surgus after arrogantly claiming he could swim any current. The Undertow God marked him, and now Kael is compelled to save drowning victims—feeling their distress like a fish hook in his soul, unable to rest until he rescues them. He has saved hundreds of lives but lost his own freedom in the process.

He is lean and muscular, with the build of a competitive swimmer. His skin is perpetually damp, and he leaves wet footprints wherever he goes. His eyes have the thousand-yard stare of someone who has seen too much death, and his hands shake when he's on land too long, as if the curse is pulling him back to the water.

Kael can sense drowning people from miles away, feeling their panic like a physical pain. He is compelled to swim to them regardless of personal cost—abandoning meals, relationships, sleep. He has ruined his own life to save others, and the tragedy is that he resents it even as he continues.

He is trying to break the curse by confronting Surgus, but the god refuses to meet with him, sending only stronger currents and more drowning victims. Marineth pities Kael and has been teaching him to find meaning in his curse rather than fighting it, but Kael struggles with accepting his fate.`,
      origin_story: 'A champion swimmer drunk on his own skill, Kael challenged Surgus during a beach festival, declaring no current could hold him. Surgus, amused and insulted, marked Kael with a curse: he would forever feel every drowning person\'s panic and be compelled to save them. The first rescue filled Kael with pride, but by the hundredth, he understood the horror of his eternal burden.',
      personality: 'Exhausted, bitter but heroic, resents his curse yet cannot stop saving people, desperate to break free, slowly learning acceptance from Marineth.',
      geography_connection: 'No home, wanders coastlines answering the call of drowning victims',
      powers_abilities: 'Sense drowning victims from miles away, superhuman swimming speed, tireless in water, cannot drown (curse prevents it), water breathing',
      weaknesses: 'Compelled to respond to drowning which can be exploited, emotionally broken, physically exhausted, ages normally',
      appearance_description: 'Lean muscular swimmer, perpetually damp skin, wet footprints follow him, thousand-yard stare, shaking hands on land, looks older than his years from exhaustion',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Coral Architect Dara',
      character_type: 'mortal',
      archetype: 'sacred_builder',
      domain: null,
      description: `Dara is Coralith's chosen mortal, a master architect who designs underwater cities for merfolk and coastal structures that work in harmony with coral reefs rather than destroying them. She has pioneered techniques for growing artificial reefs that become homes for countless species while also serving as foundations for buildings.

She is middle-aged, with hands stained by minerals from working with living stone. She carries sketches and plans constantly, her mind always designing, always building. She sees architecture not as domination of nature but as conversation with it—structures that coral wants to grow on, buildings that create habitats rather than destroy them.

Dara was training as a traditional architect when she witnessed dynamite fishing destroy a reef. The casual cruelty of it broke something in her, and she swore to learn how to build without destroying. Coralith appeared to her in a dream, teaching her the slow patience of coral growth, and she became his mortal voice in the world of humans.

Her greatest achievement is the city of Reef-Haven, a coastal metropolis where buildings are grown from coral over decades rather than built from concrete. It is a living city that breathes, that provides habitat, that grows stronger with time. Other gods have taken notice, and she is now considered divinely touched.`,
      origin_story: 'Witnessing the destruction of a reef by dynamite fishing, Dara wept for three days. Coralith heard her grief and appeared, showing her that humans could build with coral rather than on its bones. He taught her patience, symbiosis, and the architecture of growth. She became his first mortal architect.',
      personality: 'Patient, visionary, values symbiosis and sustainable building, speaks softly but with absolute conviction, devastated by environmental destruction, believes humanity can change.',
      geography_connection: 'Reef-Haven (the living city she designed), various coastal construction sites',
      powers_abilities: 'Coral growth acceleration (gift from Coralith), architectural genius, can sense reef health, breathing underwater for extended periods, divine favor',
      weaknesses: 'Mortal lifespan, her buildings take decades to complete, easily manipulated by those who fake environmental concern',
      appearance_description: 'Middle-aged woman with mineral-stained hands, always carries sketches, wears practical clothes covered in coral dust, speaks to coral like it can hear her (and maybe it can), serene expression',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Frost Walker Eira',
      character_type: 'hero',
      archetype: 'ice_maiden',
      domain: null,
      description: `Eira is a warrior from the frozen north who has been blessed by Glacius to walk on ice without slipping and survive in temperatures that would kill others. She serves as the Ice Tyrant's mortal champion, defending the polar regions from those who would exploit them.

She is tall and pale, with white-blonde hair and eyes the color of glacial ice. She wears furs from arctic seals and carries weapons carved from ancient ice that never melts. Her breath is visible even in warm weather, and frost forms on surfaces she touches.

Eira is conflicted—she believes in Glacius's mission to protect the frozen seas, but she is increasingly uncomfortable with his extremism as he lashes out at all humans due to climate change. She walks a tightrope between serving her god and protecting innocent people caught in his expanding rage.

She leads a small group of warriors who patrol the ice, rescuing lost explorers, driving off illegal whalers, and sabotaging oil drilling operations. She is becoming a folk hero among environmental activists and a terrorist in the eyes of Arctic corporations. She doesn't care about politics—she cares about the ice, and the ice is dying.`,
      origin_story: 'Eira\'s village was dependent on stable sea ice for hunting. As the ice retreated, her people starved. She walked alone onto the thinning ice, ready to die, when Glacius appeared. He offered her a choice: flee south and survive, or accept his blessing and fight for the ice. She chose to fight.',
      personality: 'Stoic, dedicated to preservation of polar regions, increasingly troubled by Glacius\'s extremism, protective of her people, pragmatic warrior.',
      geography_connection: 'Arctic and Antarctic regions, patrols sea ice, leads band of ice warriors',
      powers_abilities: 'Walk on ice without slipping, immunity to cold, weapons of eternal ice, summon freezing winds (limited), Glacius\'s blessing',
      weaknesses: 'Vulnerable to heat, weakening power as ice melts globally, conflicted loyalty may paralyze her at critical moments',
      appearance_description: 'Tall pale woman with white-blonde hair, glacial ice-blue eyes, wears arctic seal furs, carries eternal ice weapons, breath always visible, frost forms where she touches',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Echo Singer Lira',
      character_type: 'mortal',
      archetype: 'sonar_priestess',
      domain: null,
      description: `Lira is Echolus's oracle, a blind woman whose hearing is so acute she can echolocate like a dolphin. She serves in the Temple of Sound, a underwater grotto where pilgrims come to have their words heard by the gods. She translates prayers into sonar clicks that travel through the deep sound channel, ensuring every prayer reaches divine ears.

Blinded at birth, Lira developed extraordinary hearing. She can identify individuals by heartbeat, track conversations across a crowded room, and hear the difference between truth and lies in voice patterns. Echolus chose her because she understands that true perception comes from listening, not seeing.

She is young, with an otherworldly presence. She moves confidently despite her blindness, guided by reflected sound. She wears robes hung with shells that chime softly as she walks, helping her navigate. Her voice is hauntingly beautiful, able to produce clicks and calls that sound almost cetacean.

Lira's burden is that she hears too much—secrets, lies, confessions, prayers. Like her patron Echolus, she knows things she wishes she didn't. She maintains strict confidentiality about what she hears, but the weight of so many secrets ages her spirit.`,
      origin_story: 'Born blind to a family of fishermen who saw her as cursed, Lira was abandoned at a coastal temple. The priests raised her, and she developed echolocation through necessity. One day Echolus spoke to her in clicks and whistles, recognizing a kindred spirit. He taught her to be his voice, and she became his oracle.',
      personality: 'Serene but burdened, values truth and communication, maintains confidentiality, wise beyond her years, sometimes envies the deaf.',
      geography_connection: 'Temple of Sound (underwater grotto), deep sound channels',
      powers_abilities: 'Perfect echolocation, detect lies through voice analysis, enhanced hearing, translate between human speech and cetacean calls, blessed by Echolus',
      weaknesses: 'Blind, vulnerable to loud noises which can disable her echolocation, cannot unhear secrets',
      appearance_description: 'Young blind woman who moves confidently, wears shell-chime robes, produces dolphin-like clicks and calls, serene expression, seems to look at people despite sightless eyes',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Shell Knight Toren',
      character_type: 'hero',
      archetype: 'armored_defender',
      domain: null,
      description: `Toren is Shellar's champion, a warrior who has taken vows to defend the defenseless and never strike first. He wears divine armor made from interlocking shells that Shellar crafted personally, armor that cannot be pierced by mortal weapons and regenerates when damaged.

He was once a mercenary who killed for coin, but during a siege, he saw a mother and child caught in the crossfire. Something broke inside him, and he threw down his sword, using his shield to protect them instead. He took seventeen arrows meant for them, and as he lay dying, Shellar appeared. She offered him redemption: serve as her champion, live by her code, never kill unnecessarily.

Toren is massive, scarred, with hands that have taken many lives and eyes haunted by memories of those kills. He speaks little, preferring action to words. His armor is his penance—beautiful but heavy, a constant reminder of his vow. He wanders from place to place, appearing when innocents are threatened.

He is known as the Walking Fortress, the Shield of the Weak, and the Last Mercy. Criminals fear him because he is invincible in defense but refuses to kill even them. Instead, he incapacitates and delivers them to justice, which many find more frightening than death.`,
      origin_story: 'A mercenary who killed without question, Toren\'s moment of transformation came when he chose to protect rather than kill. Shellar saw his genuine desire for redemption and offered him divine armor in exchange for his sword. He hung his blade in her temple and has never killed since.',
      personality: 'Stoic, seeking redemption, values defense over offense, speaks little but acts decisively, haunted by past kills, finds peace in protecting others.',
      geography_connection: 'Wanders constantly, appears wherever the defenseless need protection',
      powers_abilities: 'Divine shell armor (impenetrable, regenerating), superhuman defensive skills, shield mastery, vow-power (stronger when defending innocents)',
      weaknesses: 'Code prevents killing even when tactically wise, armor is heavy and slow, haunted by guilt which can be weaponized',
      appearance_description: 'Massive scarred warrior in beautiful interlocking shell armor, carries giant shield, moves slowly but inexorably, haunted eyes, never smiles, presence radiates protection',
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
  console.log('✅ Phase 3A Complete!\n');
  console.log('Heroes & Mortals Created (Part 1):');
  console.log('  • Captain Maris Deepwater - Greatest Sailor');
  console.log('  • Ketos the Leviathan Slayer - Monster Hunter');
  console.log('  • Pearl Whisperer Shen - Mystic Diver');
  console.log('  • Riptide Kael - Cursed Lifesaver');
  console.log('  • Coral Architect Dara - Sacred Builder');
  console.log('  • Frost Walker Eira - Ice Champion');
  console.log('  • Echo Singer Lira - Sonar Oracle');
  console.log('  • Shell Knight Toren - Armored Defender');
  console.log('\nTotal Characters: 28 (20 divine + 8 mortal)');
  console.log('\nNext: Phase 3B - Create remaining 7 heroes & mortals');
}

createPhase3ACharacters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
