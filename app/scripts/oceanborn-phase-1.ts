import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get Oceanborn Legends mythology ID
async function getMythologyId() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('display_name', 'eastynsh')
    .single();

  if (!profiles) throw new Error('User not found');

  const { data: mythology } = await supabase
    .from('mythologies')
    .select('id')
    .eq('name', 'Oceanborn Legends')
    .eq('created_by', profiles.id)
    .single();

  if (!mythology) throw new Error('Oceanborn Legends mythology not found');

  return { mythologyId: mythology.id, userId: profiles.id };
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
      title: 'Primordial Ocean, The Deep Mother',
      description: `Abyssara is not a being but the ocean itself made manifest. She existed before time, before light, before even the concept of "above" and "below." Her form is unknowable—some say she is the water that fills every corner of the world, others claim she is the darkness between the drops. When she moves, tides shift across entire hemispheres. When she speaks, it is through the rhythm of waves against ancient shores.

She is creation and destruction in equal measure. From her depths, all life emerged, and to her depths, all life eventually returns. The gods themselves are merely her children, born from dreams she had in the first age of the world. She rarely intervenes in mortal or divine affairs, content to simply exist as the eternal ocean.

But when she does act, reality itself trembles. Mountains sink. New seas are born. Entire civilizations vanish beneath her waters, preserved forever in her cold embrace. She is mother, destroyer, and the infinite deep all at once.`,
      domain: 'The Infinite Ocean, Creation, Destruction, Tides',
      powers: 'Reality manipulation through water, creation of life, control over all tides, immortality, omnipresence in all water',
      personality: 'Ancient beyond comprehension, patient to the point of seeming indifferent, speaks in visions rather than words, values balance and the natural order above all',
      appearance: 'No true form—sometimes appears as a massive wave that never breaks, other times as an impossibly deep whirlpool, or as a beautiful woman made of living water who shifts between calm and storm',
      relationships: 'Mother to Tideus and Pressura, grandmother to all gods, neutral to mortal affairs unless the ocean itself is threatened',
      backstory: 'Before the world had shape, there was only Abyssara. She dreamed, and in dreaming, created. Her first dreams became Tideus and Pressura, embodiments of her dual nature—change and permanence, freedom and confinement. Together they shaped the ocean into layers, depths, and currents. When she grew lonely, she dreamed again, and the gods were born.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Tideus',
      character_type: 'god',
      title: 'The First Current, Lord of Change',
      description: `Tideus is movement incarnate, the very concept of flow and change given consciousness. He is the current that never ceases, the tide that never repeats the same pattern twice. Where Abyssara is the ocean's substance, Tideus is its motion. He spirals through the depths in patterns too complex for mortal minds to follow, dragging time itself along in his wake.

He embodies chaos not as disorder, but as infinite possibility. Under his influence, a peaceful bay can become a raging whirlpool in moments. A deadly maelstrom can transform into a tranquil pool. He is beloved by adventurers and feared by those who crave stability.

Tideus has no permanent form or location. He is everywhere water moves—in river rapids, in falling rain, in the blood pumping through mortal hearts. To encounter him is to be swept up in change whether you will it or not. Some emerge transformed for the better, others are broken by the experience. He cares not which—only that change occurred.`,
      domain: 'Currents, Change, Flow of Time, Transformation, Chaos',
      powers: 'Control all ocean currents, accelerate or slow time in water, induce transformation, see all possible futures, teleport through any moving water',
      personality: 'Restless, unpredictable, finds stagnation unbearable, speaks in riddles that change meaning over time, neither good nor evil but amoral force of nature',
      appearance: 'A constantly shifting form—sometimes a spiral of water with eyes, sometimes a humanoid figure made of flowing currents with hair that streams in all directions, colors shift from blue to green to silver',
      relationships: 'First-born of Abyssara, brother to Pressura, allies with no one permanently, father to several minor current deities',
      backstory: 'Tideus was Abyssara\'s first dream—a wish for the ocean to move and live rather than remain still. When he awoke, he immediately began to swim, and has never stopped. His swimming created the first currents, which carved patterns into the ocean floor and separated the waters into layers. The gods see him as both essential and dangerous, for while he brings life-giving motion, he also erodes all things given enough time.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pressura',
      character_type: 'god',
      title: 'The Crushing Depth, Judge of the Abyss',
      description: `Where her brother Tideus is endless change, Pressura is absolute permanence. She is the weight of the entire ocean pressing down, the darkness that exists beyond all light, the cold that stops all motion. She dwells in the deepest trenches where even gods fear to venture, embodying the ocean's power to contain, compress, and judge.

Pressura is not cruel, but she is utterly without mercy. She represents the natural law that all things have limits—dive too deep and you will be crushed, venture too far into darkness and you will be lost forever. She is the ocean's immune system, destroying anything that threatens the balance of the depths.

Mortals who encounter her rarely survive to tell the tale. Those who do speak of an overwhelming presence that makes them feel infinitely small, a voice that echoes from every direction at once, and eyes that see through to the core of one's being. She knows every secret you've ever kept, every weakness you hide. To face Pressura is to face the truth of your own limitations.`,
      domain: 'Pressure, Darkness, Weight, Judgment, Fear, Limits',
      powers: 'Manifest crushing pressure anywhere, control darkness completely, induce existential dread, see through all lies, judge the worthiness of souls, prison creation',
      personality: 'Stern, impassive, utterly fair but completely without compassion, values truth and order, speaks rarely but when she does her words carry undeniable weight',
      appearance: 'A massive presence more felt than seen—in darkness appears as a vaguely humanoid shadow with eyes like deep trenches, in light appears as a tall woman in black robes that seem to weigh down the very air, surrounded by an aura of oppressive gravity',
      relationships: 'Second-born of Abyssara, sister to Tideus (they oppose each other philosophically), guardian of forbidden knowledge, respected by all gods but befriended by none',
      backstory: 'Pressura was born from Abyssara\'s fear—the fear that endless motion would tear the ocean apart. She was meant to be a counterbalance to Tideus, providing stability and structure. She carved the deepest trenches to serve as boundaries, created the layers of pressure that separate the ocean into zones, and established the law that some places are forbidden even to gods. When the other gods were born, she took it upon herself to guard the deepest secrets of the ocean, ensuring that some mysteries remain forever hidden.',
      mythology_id: mythologyId,
      created_by: userId
    },

    // TIER 2: SUPREME GODS
    {
      name: 'Nautrion',
      character_type: 'god',
      title: 'King of the Deep, The Coral Throne',
      description: `Nautrion is sovereignty made flesh—powerful, proud, and absolutely convinced of his right to rule. He sits upon the Coral Throne, a massive seat of living coral that grows from his will alone, and from there he commands the civilized depths. Where chaos might reign, Nautrion brings order. Where anarchy threatens, he brings law. But his order comes at a price, and his law is harsh.

Standing over ten feet tall, with muscles carved by eons of underwater combat, Nautrion is an imposing figure. His coral crown grows directly from his skull, its branches reaching toward the surface he can never fully claim. His trident, forged from the bones of the first leviathan and wrapped in living coral, can summon earthquakes with a single strike against the ocean floor.

He is a warrior king, having fought countless battles to claim his throne. He defeated his brother Abyssor in single combat, banishing him to the trenches. He drove back the surface dwellers when they first tried to plunder the depths. He united the sea-dweller kingdoms under his banner through a combination of diplomacy and intimidation. But kingship is lonely, and the throne is heavy.`,
      domain: 'Sovereignty, Deep-Sea Kingdoms, Coral Reefs, Order, Authority, Underwater Earthquakes',
      powers: 'Command all sea creatures, generate earthquakes, manipulate water with absolute precision, accelerated coral growth, near-invulnerability underwater, superhuman strength',
      personality: 'Proud to the point of arrogance, just but inflexible, expects absolute loyalty, deeply honorable in his own code, struggles with the weight of leadership, fears being overthrown as he overthrew others',
      appearance: 'Massive humanoid, 10 feet tall, powerfully muscled, bronze skin with bluish undertones, eyes glow electric blue, coral crown growing from skull, long dark hair flowing with unseen current, dressed in armor made of pearl and deep-sea metals, carries trident of coral and bone',
      relationships: 'Husband to Marineth (political marriage with growing genuine affection), father to Coralith and several minor deities, brother and enemy to Abyssor, uneasy alliance with other supreme gods, commands respect from sea-dwellers',
      backstory: 'Born from Abyssara\'s dream of order, Nautrion was not the first of the supreme gods but became the most powerful through sheer determination. He fought his way to supremacy, defeating numerous challengers including his own brother Abyssor. The battle was legendary—it carved new trenches into the ocean floor and created tsunamis that destroyed surface civilizations. Nautrion won by trapping Abyssor in darkness and crushing him with pressure, but he could not kill a god. Instead, he banished Abyssor to the deepest trenches, creating an enemy who will never stop seeking revenge. Now Nautrion rules, but he knows his throne is built on a foundation of violence, and violence has a way of returning home.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Marineth',
      character_type: 'god',
      title: 'Queen of Tides, The Moon\'s Daughter',
      description: `Marineth is mystery and prophecy woven into a divine form. She is the pull of the moon on the water, the inexorable rise and fall of the tides, the voice that whispers of things yet to come. Where Nautrion rules through strength, Marineth guides through knowledge. She sees the threads of fate and gently tugs them toward better futures—or allows them to tangle into tragedy if that is what must be.

Her appearance is both beautiful and unsettling. She seems to exist partially out of phase with reality, her form rippling like water reflecting moonlight. When she speaks, her words echo with multiple meanings, each true in its own way. Mortals who meet her often find themselves answering questions they weren't asked and receiving answers to questions they never posed.

She did not love Nautrion when they married—it was a political union to stabilize the divine hierarchy. But over millennia, something deeper has grown between them. She sees his weaknesses and his fears, knows every possible future where he falls, and works tirelessly to prevent them. Not because she must, but because she has chosen to.`,
      domain: 'Tides, Navigation, Prophecy, Moon-Tides, Destiny, Guidance',
      powers: 'Control all tides, see multiple possible futures simultaneously, navigate by instinct alone, grant visions to others, influence probability, remain invisible in moonlight',
      personality: 'Enigmatic, speaks in riddles and prophecies, deeply compassionate but emotionally distant, struggles with seeing too many futures at once, values free will while knowing fate exists',
      appearance: 'Ethereal feminine figure that seems slightly translucent, hair flows like liquid silver and blue, eyes like perfect pearls that reflect moonlight even in darkness, robes made of sea foam that constantly regenerate, surrounded by faint mist, appears to float rather than swim',
      relationships: 'Wife to Nautrion (married for politics, stayed for love), mother to Silvara the half-mortal, sister to Luminara, served by tide sprites, respected by navigators and prophets, sends cryptic warnings to heroes',
      backstory: 'Marineth was born on the night of the first full moon, when lunar light touched the ocean for the first time. In that moment, she came into being—a goddess who existed in the liminal space between the celestial and the aquatic. From birth, she could see the threads of fate, an ability that brought her as much sorrow as wisdom. She foresaw the war between Nautrion and Abyssor and tried to prevent it, but learned that some futures are inevitable. When Nautrion claimed the throne, he sought her hand to legitimize his rule through her prophetic authority. She accepted, knowing that their union would prevent darker timelines, but also knowing it would bind her to a role she never wanted. Now she is queen, prophet, and prisoner of her own foresight.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Abyssor',
      character_type: 'god',
      title: 'Lord of the Trenches, The Devourer Below',
      description: `In the deepest, darkest places where even light fears to venture, Abyssor waits. He is hunger and ambition made divine, the shadow that lurks beneath every achievement, the darkness that grows when you close your eyes. Once he stood equal to his brother Nautrion, but he was cast down, banished to the trenches, and there he has festered for eons.

Abyssor's form is horrifying even to other gods. His body has adapted to the absolute darkness of the abyss—his skin is pitch black, his face bears the features of an angler fish with luminescent lures that dangle before him, and his mouth is filled with thousands of transparent teeth. He is patient, so very patient, because in the darkness time moves differently. He can wait centuries for the perfect moment to strike.

But Abyssor is not merely a monster—he is cunning beyond measure. He hoards secrets like treasures, collecting the forbidden knowledge that even Pressura won't guard. He knows things that could unmake reality, truths that would drive mortals mad, and he trades this knowledge carefully, corrupting heroes and gods alike with whispers from the deep.`,
      domain: 'Abyssal Trenches, Darkness, Secrets, Forbidden Knowledge, Madness, Ambition',
      powers: 'Control all abyssal creatures, induce madness with a glance, reveal any secret, survive any depth, consume divine essence, manipulate shadows, create monsters',
      personality: 'Cunning and patient, speaks softly with terrible implications, values knowledge as power, nurtures grudges for millennia, capable of false friendship, ultimately self-serving',
      appearance: 'Tall humanoid form with midnight-black skin, angler-fish features including bioluminescent lures dangling from forehead, eyes that glow with sick yellow light, mouth too wide with rows of transparent teeth, skeletal hands with webbed fingers, surrounded by writhing shadows',
      relationships: 'Brother and mortal enemy to Nautrion, uneasy relationship with Pressura (both dwell in darkness), father to Grusk the Exile, commands abyssal creatures, patron to those seeking forbidden knowledge',
      backstory: 'Abyssor was born alongside Nautrion as twins, and for a time they were inseparable. But where Nautrion dreamed of order, Abyssor craved understanding. He delved too deep into forbidden knowledge, learning truths about the nature of reality that changed him. When the Coral Throne became vacant, both brothers claimed it. The war that followed shook the ocean to its core. Abyssor fought with cunning and dark magic, but Nautrion fought with honor and strength. In the end, honor won, and Abyssor was cast into the deepest trench and sealed there by Pressura herself. But seals can be broken, and Abyssor has spent millennia preparing his return. He learned to thrive in darkness, to make allies of monsters, and to corrupt the righteous. His greatest weapon is patience—he knows that eventually, Nautrion will make a mistake.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Luminara',
      character_type: 'god',
      title: 'Lady of Bioluminescence, The Glowing One',
      description: `In a realm of crushing darkness and cold pressure, Luminara is defiant hope. She is light where there should be none, beauty in the deepest depths, warmth in the coldest water. Her very existence is a rebellion against the nature of the abyss—she glows with an inner radiance that cannot be extinguished, no matter how deep she descends.

Luminara resembles a massive jellyfish more than a humanoid, her translucent body pulsing with bioluminescent light that shifts through all colors of the visible spectrum and some that aren't. Her trailing tendrils extend for hundreds of feet, each one capable of independent movement and thought. Where she passes, dead coral blooms again. Sick fish are healed. Even the darkness itself seems to retreat.

She is the most optimistic of the gods, perhaps naively so. She believes that even Abyssor can be redeemed, that even the deepest darkness can be illuminated, that hope can survive any pressure. Other gods find her tiresome, but they cannot deny that the ocean would be infinitely darker without her.`,
      domain: 'Bioluminescence, Light, Hope, Beauty, Healing, Inspiration',
      powers: 'Create light in any darkness, heal any wound (physical or spiritual), inspire courage, communicate through colors, charm any creature, absorb and redirect energy',
      personality: 'Eternally optimistic, believes in redemption, naive about the depths of evil, speaks in musical tones, finds beauty everywhere, frustrates cynical gods with relentless positivity',
      appearance: 'Massive jellyfish-like form with translucent body showing pulsing inner light, hundreds of trailing tendrils that glow different colors, vaguely humanoid upper body emerging from the bell, eyes like pure light, voice sounds like singing, surrounded by smaller glowing organisms',
      relationships: 'Sister to Marineth and Nautrion, attempts to mediate between Nautrion and Abyssor, guardian of Luminoth, beloved by light-dwelling creatures, protected by the Coral Sentinel',
      backstory: 'Luminara was born in the darkest depths, which makes her nature all the more miraculous. Abyssara dreamed of light one night while drowning in darkness, and from that dream Luminara emerged. She rose from the trenches to the shallower waters, leaving a trail of glowing organisms in her wake. When she discovered the Luminous Gardens—a place where no light should exist—she claimed it as her domain and transformed it into the most beautiful place in all the ocean. Other gods warned her that such beauty would attract danger, but she welcomed the attention, believing that exposure to beauty might transform even monsters into something better. She was Nautrion\'s younger sister and tried to prevent the war with Abyssor by offering to share the throne three ways. Both brothers rejected her proposal, and she wept tears of light as they fought. Now she guards her gardens and waits for the day when her brothers might reconcile, a day that will likely never come.',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Krakus',
      character_type: 'god',
      title: 'The Storm Bringer, Wrath of the Surface',
      description: `Where the ocean meets the sky, chaos reigns, and Krakus is its master. He is the hurricane's heart, the wave that swallows ships, the storm that drowns entire coastlines. His rage is legendary, his mercy nonexistent, and his hatred of surface dwellers absolute. To sail the ocean is to risk offending Krakus, and his offense is death.

Krakus's form is a nightmare of tentacles and teeth. His body resembles a massive octopus crossed with some primordial terror, with nine immense tentacles (he lost one to a legendary hero centuries ago and refuses to regenerate it as a reminder of his humiliation). His eyes are whirlpools of pure storm, and his voice is thunder rolling across angry waters.

But Krakus was not always a monster. Once he was noble, a protector of sea creatures and friend to sailors. But the surface folk betrayed him, killed his mate, and enslaved his children. That day, something broke inside Krakus. He drowned the kingdom responsible, sinking their entire continent beneath the waves. Since then, he has been storm and fury, and he will not rest until every ship is at the bottom of the sea.`,
      domain: 'Storms, Hurricanes, Waves, Destruction, Vengeance, Surface Waters',
      powers: 'Summon and control any storm, create whirlpools and waterspouts, generate lightning, capsizing ships by thought alone, control wind and rain, superhuman strength',
      personality: 'Wrathful and vengeful, quick to anger and slow to forgive, harbors ancient grudge against surface dwellers, honorable in his own brutal way, mourns his lost family, impossible to reason with when enraged',
      appearance: 'Colossal octopus-like entity, nine massive tentacles (one torn off and never regrown), each tentacle 100+ feet long, covered in scars from ancient battles, eyes like spinning whirlpools, voice like rolling thunder, surrounded by permanent storm clouds, body crackling with lightning',
      relationships: 'Spawn father to the Kraken of Nine Arms, brother to Nautrion and Abyssor (neutral to both), once-friend to surface gods (now enemy), served by storm elementals, feared by all sailors',
      backstory: 'Krakus was born from the first storm that touched the ocean, and for millennia he was content. He protected migrating whales, guided lost sailors to safety, and ensured that the boundary between sea and sky remained clear. He even took a mate—a beautiful storm goddess from the surface pantheon—and together they had children, beings of wind and water. But then the surface kingdom of Atlantis captured his children and tried to harness their storm-power for war. When Krakus came to free them, the Atlanteans killed his mate before his eyes. In that moment, his grief transformed into rage so pure and absolute that it manifested as the first hurricane. He tore Atlantis from the surface and dragged it into the depths, drowning every last person. The other gods tried to stop him, but even Nautrion\'s authority could not quell his fury. Since that day, Krakus has declared war on all surface vessels. He will not rest until the seas are empty of ships and the surface dwellers remember to fear the ocean.',
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating characters...\n');

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    console.log(`[${i + 1}/${characters.length}] Creating ${char.name} - ${char.title}`);
    
    const { data, error } = await supabase
      .from('characters')
      .insert(char)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Created successfully (ID: ${data.id.substring(0, 8)}...)`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('✅ PHASE 1 COMPLETE: Divine Hierarchy Established');
  console.log('\nCreated:');
  console.log('  • 3 Primordial Forces (Abyssara, Tideus, Pressura)');
  console.log('  • 5 Supreme Gods (Nautrion, Marineth, Abyssor, Luminara, Krakus)');
  console.log('\n🌊 The foundation of Oceanborn Legends has been laid!');
}

createPhase1Characters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
