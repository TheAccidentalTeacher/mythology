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
  const { data: mythology, error: mythError } = await supabase
    .from('mythologies')
    .select('id, created_by')
    .eq('name', 'Oceanborn Legends')
    .single();

  if (mythError) throw mythError;
  if (!mythology) throw new Error('Oceanborn Legends mythology not found');

  return { mythologyId: mythology.id, userId: mythology.created_by };
}

async function createPhase2Characters() {
  console.log('🌊 PHASE 2: Creating Major Deities (Second Tier)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const characters = [
    {
      name: 'Coralith',
      character_type: 'god',
      archetype: 'reef_builder',
      domain: 'Coral Reefs, Growth, Ecosystems, Symbiosis, Construction',
      description: `Coralith is the Reef Builder, the God of Living Stone, the architect of the ocean's most vibrant cities. He is creation personified—not through divine will alone, but through patient, methodical growth over centuries. Every coral reef in the world bears his touch, from the smallest polyp to the vast barrier structures that can be seen from the heavens above.

He appears as a humanoid figure whose body is composed of living coral—brain coral forms his skull, staghorn coral his arms, fire coral wraps around his torso in brilliant patterns. He is in constant, slow motion, always growing, always building. When he stands still for too long, coral begins to grow at his feet, anchoring him to the seafloor until he chooses to move again.

Coralith is the son of Nautrion and Marineth, born when they first sought to create something permanent and beautiful in the ever-changing ocean. He inherited his father's ambition and his mother's patience, resulting in a deity who understands that true greatness requires time. He speaks slowly, carefully, as if each word is a polyp being placed with precision.

His domain, the Endless Reef, spans thousands of miles of underwater landscape. It is a living metropolis where countless species find shelter, and where merfolk build their cities in harmony with his creations. He is beloved by all who value growth, community, and the slow work of building something that will outlast generations.

But Coralith harbors a secret fear: he is vulnerable to acidification and warming waters. As mortal civilizations above grow more careless, he feels his creations dying. This pain drives him to occasionally surface and intervene in mortal affairs, something his parents warned him against. He believes the ocean's future depends on teaching mortals to respect the delicate balance he works so hard to maintain.`,
      origin_story: 'Coralith was born when Nautrion and Marineth created the first coral reef as a gift to each other—a structure that would embody both permanence and beauty. They poured their divine essence into the reef, and from its heart emerged Coralith, already ancient in appearance despite being newly born. His first act was to expand the reef, and he has never stopped building since.',
      personality: 'Patient to the point of seeming slow, values community and symbiosis, speaks in metaphors about growth and time, protective of ecosystems, increasingly worried about ocean acidification. Son of Nautrion and Marineth, brother to several sea gods, ally of all reef-dwelling creatures, patron of builders and architects.',
      geography_connection: 'All coral reefs, particularly the Great Barrier structures, shallow tropical waters rich with life',
      powers_abilities: 'Accelerate coral growth, create living structures, communicate with all reef species, sense damage to any reef worldwide, petrify enemies in living coral',
      weaknesses: 'Vulnerable to acidification and warming waters, slow to act in crisis, overly trusting of those who claim to want to help',
      appearance_description: 'Humanoid form made entirely of living coral—staghorn coral arms, brain coral head, fire coral torso with brilliant colors, eyes like tide pools reflecting light, moves with deliberate slowness, constantly growing new coral formations',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Pearlessa',
      character_type: 'god',
      archetype: 'treasure_keeper',
      domain: 'Pearls, Treasure, Beauty, Transformation through Suffering, Hidden Worth',
      description: `Pearlessa is the Pearl Goddess, the Keeper of Hidden Beauty, the divine embodiment of transformation through adversity. She rules over all treasures of the deep—pearls, sunken gold, lost artifacts, and forgotten riches. But her true domain is not material wealth; it is the concept that beauty and value emerge from irritation, pain, and pressure.

She is breathtaking to behold, draped in robes woven from oyster silk that shimmer with every color imaginable. Her skin appears to be made of mother-of-pearl, shifting between white, pink, blue, and gold depending on the angle of light. Her hair flows like liquid silver, and she wears a crown of perfect black pearls from the deepest oyster beds.

Pearlessa is the daughter of Pressura, born from the goddess of crushing depths' rare moment of appreciation for beauty. She inherited her mother's understanding that pressure creates value—just as oysters create pearls to protect themselves from irritants, mortals grow stronger and more beautiful through their struggles.

She is obsessed with collection and curation. Her palace, the Nacre Halls, is a museum of wonders—every lost treasure that has sunk beneath the waves, organized and preserved. She knows the story of every piece: which ship it came from, who owned it, how they lost it. She is not greedy for the wealth itself, but for the stories it contains.

Mortals who seek her favor must offer not gold or jewels, but stories of transformation—times they turned pain into something beautiful. Those who impress her receive her blessing: a pearl that grants one wish related to transformation. Those who bore her with shallow requests for material wealth find themselves transformed into oysters, doomed to create pearls for others until they understand true value.`,
      origin_story: 'Pearlessa was born in the deepest trench, where Pressura discovered the first pearl—a perfect sphere created by an oyster struggling against the crushing pressure. Intrigued by how something so beautiful could emerge from such harsh conditions, Pressura held the pearl and wished for someone who could appreciate and protect such treasures. The pearl split open, and Pearlessa emerged, already adorned in nacre.',
      personality: 'Refined, values transformation and hidden beauty, collector of stories more than objects, can be vain and judgmental, respects those who have overcome adversity. Daughter of Pressura, half-sister to Luminara, patron of artists and those who transform suffering into art.',
      geography_connection: 'Oyster beds, sunken ship graveyards, underwater caves filled with treasure, the Nacre Halls (her palace)',
      powers_abilities: 'Create perfect pearls, appraise any object\'s true worth, sense all treasure in the ocean, grant wishes of transformation, turn beings into oysters',
      weaknesses: 'Obsessed with collection to the point of hoarding, can be manipulated by compelling stories, physically weak in combat',
      appearance_description: 'Skin like mother-of-pearl shifting colors in light, hair of liquid silver, robes of shimmering oyster silk, crowned with black pearls, eyes like polished abalone shells, surrounded by floating pearls of all sizes',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Salinar',
      character_type: 'god',
      archetype: 'preserver',
      domain: 'Salt, Preservation, Memory, Crystallization, Tears',
      description: `Salinar is the Salt God, the Preserver of All Things, the Lord of Crystallization. He embodies salt in all its forms—the mineral that seasons food, preserves meat and fish, forms crystals of impossible geometry, and composes the tears of every crying being. Where others see salt as simple seasoning, Salinar sees it as the essence of preservation itself—the force that keeps memories from fading and prevents decay.

He appears as a tall, angular figure whose body seems to be carved from massive salt crystals. His skin is translucent, revealing geometric patterns within like the internal structure of a crystal. His eyes are pale blue, the color of salt flats under winter skies. When he moves, tiny salt crystals fall from him like snow, and his voice has a dry, crystalline quality that resonates strangely in water.

Salinar is ancient—one of the first gods born from the ocean itself, when the first waters became salty through the dissolution of primordial rocks. He predates even some of the primordial forces, existing as a fundamental property of the sea rather than a conscious deity, until Abyssara granted him awareness and form.

His domain is preservation in all forms. He maintains the Archive of Tears, a vast cavern where every tear ever shed into the ocean is crystallized and stored, each one containing the memory of the emotion that produced it. He preserves the bodies of legendary creatures in salt, creating mummified displays in his Crystal Halls. He teaches mortals the art of salt-curing to preserve food through harsh seasons.

But Salinar struggles with his nature. To preserve is to trap things in stasis, preventing change and growth. He watches Tideus with envy, seeing the freedom of constant transformation. He loves Marineth from afar, but knows she represents cycles and change—everything he opposes. His greatest fear is that in trying to preserve everything, he preserves nothing of value.`,
      origin_story: 'When the first rocks dissolved into the primordial ocean, they released salt, giving the sea its distinctive taste and preserving properties. This salt accumulated consciousness over eons, slowly becoming aware of itself. Abyssara noticed this awakening and shaped the salt into Salinar, giving him purpose as the ocean\'s memory keeper. His first act was to crystallize and preserve the memory of his own creation.',
      personality: 'Philosophical, melancholic, obsessed with preservation and memory, values history and tradition, fears irrelevance and change, secretly lonely. One of the eldest gods, unrequited love for Marineth, ally of Pressura who shares his appreciation for permanence, opposed to Tideus\'s constant change.',
      geography_connection: 'Salt flats, brine pools, crystal caves, the Dead Sea zones where salt concentration is highest',
      powers_abilities: 'Crystallize any liquid, preserve anything indefinitely in salt, access memories stored in tears, create salt barriers, dehydrate enemies',
      weaknesses: 'Vulnerable to fresh water which dissolves his form, rigid thinking makes him predictable, preservation magic can be reversed by Tideus',
      appearance_description: 'Body made of translucent salt crystals with geometric internal patterns, pale blue crystalline eyes, angular features, sheds salt crystals like snow, voice has dry crystalline resonance, sometimes wears robes of woven salt threads',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Ventris',
      character_type: 'god',
      archetype: 'wind_dancer',
      domain: 'Ocean Winds, Waves, Surface Motion, Sailing, Freedom',
      description: `Ventris is the Wind Dancer, God of Ocean Breezes, the force that links sea and sky. He is the wind that fills sails, the breeze that cools sun-scorched sailors, the gale that whips waves into whitecaps. Unlike his cousins who dwell beneath the waves, Ventris exists in the liminal space where water meets air, forever dancing on the boundary between two worlds.

He is wild and beautiful—a being of pure motion who seems almost solid one moment and intangible the next. His form shifts like wind-blown mist, sometimes appearing as a lean young man with wild white hair, other times as a swirling column of spray and foam. His laughter sounds like wind chimes, and his anger sounds like howling gales. He wears tattered clothes that were once elegant but have been shredded by his own winds.

Ventris is the son of Tideus and a wind spirit from the sky realm—a forbidden union that scandalized both ocean and air deities. He belongs fully to neither world, and this gives him both freedom and loneliness. He can soar above the waves or dive beneath them, but he is most comfortable in the spray-filled interface where both elements meet.

He is the patron of sailors, explorers, and all who seek freedom. He despises Abyssor's crushing depths and Pressura's stillness—he believes the ocean should be alive with motion, its surface constantly dancing. He often clashes with his father Tideus, ironically, because while they both value change, Ventris wants surface-level excitement while Tideus prefers deep, fundamental transformation.

Ventris is responsible for perfect sailing days and for catastrophic storms—he is mercurial, changing his mood as quickly as weather. Sailors pray to him for favorable winds but fear his temper. He has saved countless ships by providing wind when they were becalmed, and destroyed countless others in fits of rage when he felt disrespected.`,
      origin_story: 'Tideus once fell in love with Aetheria, a wind goddess from the sky realm, during a hurricane where ocean and air became one. Their brief union produced Ventris, who was born in the eye of the storm—a moment of perfect calm surrounded by chaos. He inherited his father\'s love of change and his mother\'s freedom, but belonged fully to neither realm. He chose the ocean surface as his domain, the only place where both parents could visit him.',
      personality: 'Mercurial, values freedom above all, playful but dangerous, hates constraints and stillness, loves mortals who embrace adventure, prone to dramatic mood swings. Son of Tideus and Aetheria, half-brother to current deities, friend to sailors and explorers, rival of Krakus who represents destructive storms.',
      geography_connection: 'The ocean surface, trade wind zones, doldrums, coastal areas where sea breezes blow',
      powers_abilities: 'Control winds over water, create or calm waves, enable ships to sail without natural wind, fly/levitate, exist partially in air realm',
      weaknesses: 'Cannot function in deep water, loses power during dead calm, emotional instability makes him unpredictable, divided loyalty between sea and sky',
      appearance_description: 'Form shifts like wind-blown mist, lean young man with wild white hair when solid, sometimes appears as swirling spray column, tattered elegant clothes shredded by wind, eyes like storm clouds, moves with impossible grace',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Glacius',
      character_type: 'god',
      archetype: 'ice_tyrant',
      domain: 'Ice, Polar Seas, Glaciers, Frozen Preservation, Stillness',
      description: `Glacius is the Ice Tyrant, Lord of the Frozen Seas, the god who rules the polar oceans where water becomes solid and motion becomes stillness. He is winter's cold made divine, the force that freezes waves mid-crash and preserves ancient secrets in glacial ice. Where tropical gods are warm and vibrant, Glacius is austere, merciless, and absolutely certain of his righteousness.

He appears as a massive figure carved from glacial ice so clear you can see through him, with fractured patterns running through his body like the stress cracks in a glacier. His beard is made of icicles that tinkle when he speaks, and his eyes are the pale blue of ancient ice that has been compressed for millennia. He wears a crown of frost and carries a staff of frozen seawater that never melts.

Glacius believes that stillness is superior to motion, preservation better than change. He views the warm-water gods as chaotic and undisciplined. He is in constant philosophical conflict with Tideus and Ventris, arguing that their beloved change is merely another word for decay. He points to the creatures preserved perfectly in his glacial ice for millions of years as proof that stillness has value.

His realm is the polar seas—the Arctic and Antarctic waters where ice shelves groan and crack, where seals haul out onto floes, where ancient cold has reigned since before the gods walked. He rules this domain with absolute authority, brooking no dissent. Those who enter his waters must respect the ice or perish.

But Glacius faces an existential crisis. The world is warming, and his domain shrinks every year. His glaciers calve into the sea, his ice shelves collapse, his ancient frozen archives melt and release their secrets prematurely. This fills him with rage and desperation. He has begun to act in ways unbecoming of a god, lashing out at mortal civilizations, trying to expand his frozen realm by force.`,
      origin_story: 'Glacius was born during the first ice age, when Pressura\'s cold darkness rose to the surface and froze the ocean\'s skin. He emerged from the first glacier, already ancient and set in his ways. He immediately claimed the polar regions and has defended them fiercely ever since. He views himself as the guardian of deep time, the keeper of frozen history.',
      personality: 'Austere, authoritarian, values order and stillness, believes change equals decay, increasingly desperate as his realm shrinks, has traces of nobility beneath his tyranny. Allied with Salinar and Pressura, opposed to Tideus and Ventris, respected by Abyssara for his dedication.',
      geography_connection: 'Arctic and Antarctic oceans, glaciers, ice shelves, frozen seas, the North and South Poles',
      powers_abilities: 'Freeze water instantly, create glaciers and ice shelves, preserve anything in ice indefinitely, survive any cold, control polar marine life',
      weaknesses: 'Vulnerable to warmth, losing power as oceans warm, rigid thinking prevents adaptation, isolated from other gods due to extreme views',
      appearance_description: 'Massive figure of clear glacial ice with stress-crack patterns inside, icicle beard that tinkles, pale blue ancient-ice eyes, frost crown, staff of frozen seawater, radiates intense cold',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Echolus',
      character_type: 'god',
      archetype: 'voice_of_depths',
      domain: 'Sonar, Communication, Sound, Songs, Underwater Acoustics',
      description: `Echolus is the Voice of the Depths, the God of Echoes, the divine force behind every sound that travels through water. He is communication itself—from the haunting songs of whales to the clicks of hunting dolphins, from the grinding of tectonic plates to the whisper of a crab's footsteps. In the ocean, where sight is limited and darkness prevalent, Echolus is the sense that matters most.

He appears as a slender, almost skeletal figure with smooth skin like a dolphin's. His head is elongated, containing a massive melon-like organ for echolocation. He has no visible mouth, yet his voice resonates from everywhere and nowhere, seeming to come from the water itself. His eyes are small and almost vestigial—he has no need for sight when he can perceive everything through sound.

Echolus possesses the incredible ability to hear every sound in the ocean simultaneously. He knows every conversation, every whale song, every ship's propeller, every submarine's sonar ping. He is the ultimate intelligence gatherer, the god who knows all secrets because nothing said in the ocean escapes his awareness. This makes him incredibly valuable as an ally and terrifying as an enemy.

Despite his power, Echolus is not aggressive. He is curious, thoughtful, and somewhat melancholy. The burden of hearing everything—including things he wishes he couldn't—weighs on him. He knows every prayer for mercy that went unanswered, every final word spoken by drowning sailors, every cry of pain from hunted creatures. He cannot unhear these sounds, and they haunt him.

He is the patron of all creatures that use echolocation—whales, dolphins, porpoises—and considers them his children. He teaches mortals the art of listening, both literally and metaphorically. Those who seek his wisdom must first learn to be silent and truly hear what the ocean is telling them.`,
      origin_story: 'Echolus was born from the first sound that echoed through the ocean—a crack of lightning striking the surface in the primordial age. The sound wave propagated through the water, bounced off the seafloor, returned to the surface, and in that echo, consciousness formed. He emerged as the living embodiment of sound itself, immediately aware of every noise in the ocean.',
      personality: 'Thoughtful, burdened by omniscient hearing, values communication and understanding, melancholy from knowing too many tragic stories, wise counselor, prefers listening to speaking. Allied with Marineth who appreciates his wisdom, friend to all cetaceans, neutral in most conflicts because he hears all sides.',
      geography_connection: 'Everywhere sound travels in water—particularly deep sound channels where whale songs travel thousands of miles',
      powers_abilities: 'Hear everything in the ocean simultaneously, perfect echolocation, project voice across any distance underwater, sonic attacks that can shatter bone, understand all languages',
      weaknesses: 'Cannot block out sounds which can be overwhelming or weaponized against him, vulnerable to intense noise pollution, morally paralyzed by knowing too much',
      appearance_description: 'Slender dolphin-like humanoid with smooth skin, elongated head with echolocation organ, tiny vestigial eyes, no visible mouth yet voice emanates from everywhere, moves silently through water',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Shellar',
      character_type: 'god',
      archetype: 'armored_guardian',
      domain: 'Shells, Armor, Protection, Defensive Magic, Mollusks',
      description: `Shellar is the Shell Goddess, the Armored Guardian, the divine protector who teaches that defense is the highest form of strength. She embodies the philosophy that vulnerability is not weakness—rather, acknowledging vulnerability and protecting it is wisdom. Every shell in the ocean is her creation, from the smallest snail to the massive clam shells that can trap unwary divers.

She appears as a powerful warrior woman whose armor is made entirely of interlocking shells—abalone, conch, cowrie, scallop, and countless others, each perfectly fitted to create an impenetrable defense. Her shield is a giant clam shell that can expand to protect entire groups. Her face is beautiful but scarred from ancient battles, and she wears these scars proudly as proof that even the best armor cannot prevent all wounds.

Shellar is the daughter of Nautrion and a mortal warrior queen who died defending her coastal kingdom. Nautrion, impressed by the woman's courage, granted her a form of immortality by transforming her into a goddess. She retained her mortal understanding of vulnerability and the mortal need for protection, making her unique among the gods.

She is the patron of all who defend others—parents protecting children, soldiers defending homes, creatures building shells against predators. She teaches that there is no shame in defense, no cowardice in protection. She opposes Krakus's aggressive nature and Abyssor's philosophy of conquest through overwhelming force.

Her realm is the Shell Garden, a vast underwater forest of giant clams, enormous conch shells, and shell structures that form natural fortresses. Here, refugees from across the ocean come seeking sanctuary. Shellar grants protection to all who ask, regardless of their past, as long as they harm no one under her watch. This has made her both beloved by the weak and despised by the strong who see her as interfering with natural selection.`,
      origin_story: 'Queen Thalassa defended her coastal city against raiders for three days and nights, even after being mortally wounded. As she lay dying in the surf, Nautrion appeared to her, moved by her sacrifice. He offered her godhood if she would continue to protect the vulnerable. She accepted, and her body transformed into divine shell armor. She arose as Shellar and has defended the defenseless ever since.',
      personality: 'Protective, values defense over offense, compassionate to the vulnerable, stern with the strong who prey on the weak, wears scars proudly, believes in redemption. Daughter of Nautrion and mortal queen, ally of Marineth, opposes Krakus and Abyssor, patron of defenders and protectors.',
      geography_connection: 'Shell beds, mollusk habitats, the Shell Garden sanctuary, coastal defensive formations',
      powers_abilities: 'Create impenetrable shell armor, expand defenses to protect groups, summon mollusks, divine crafting of armor, immunity to physical attacks while shelled',
      weaknesses: 'Defensive nature makes her reactive rather than proactive, protective instincts can be exploited, limited offensive capabilities',
      appearance_description: 'Warrior woman in interlocking shell armor (abalone, conch, cowrie, scallop), carries giant clam shell shield, battle-scarred but beautiful face, strong build, radiates protective aura',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Toxira',
      character_type: 'god',
      archetype: 'poison_mistress',
      domain: 'Venom, Poison, Toxins, Chemical Defense, Dangerous Beauty',
      description: `Toxira is the Poison Mistress, the Goddess of Beautiful Danger, the divine embodiment of venom and toxins. She represents the ocean's most insidious form of danger—not the obvious threat of teeth and claws, but the subtle, beautiful danger of creatures that kill with a touch. She is the creator of every venomous spine, every toxic tentacle, every poisonous fish in the sea.

She is devastatingly beautiful—so much so that looking at her is itself dangerous. Her skin shifts through brilliant, warning colors: electric blue, vivid purple, neon green, all signaling danger to those wise enough to recognize the signs. Her hair is made of jellyfish tentacles that drift around her head, each loaded with venom. Her eyes are compound like a mantis shrimp's, able to see colors mortals cannot comprehend.

Toxira is the daughter of Abyssor and a sea witch, born from a union that even Abyssor regrets. She inherited her father's appetite for destruction but refined it into something more elegant—where Abyssor destroys through overwhelming force, Toxira destroys through a single, perfect touch. She finds brute force crude and inelegant.

She is obsessed with beauty, particularly the beauty of venomous creatures—box jellyfish, blue-ringed octopi, lionfish, stonefish, cone snails. She breeds new species constantly, always trying to create the perfect combination of beauty and lethality. Her realm, the Venom Gardens, is a place of incredible color and danger where even gods must tread carefully.

Toxira has a complex relationship with Luminara. Both goddesses represent different aspects of bioluminescence and bright colors—Luminara uses light to guide and comfort, while Toxira uses bright colors to warn and kill. They are philosophical opposites who respect each other's artistry while disagreeing on its purpose.`,
      origin_story: 'Born from Abyssor\'s brief alliance with a sea witch who specialized in poisons, Toxira emerged from a toxic bloom of algae that killed everything around it for miles. She was beautiful from the first moment, and lethal. Her first act was to create the box jellyfish, declaring it her masterpiece—nearly invisible, graceful, and instantly lethal. Even Abyssor was impressed, though he found her methods too subtle for his taste.',
      personality: 'Elegant, appreciates dangerous beauty, patient hunter, values precision over power, artistic about killing, fascinated by chemical interactions. Daughter of Abyssor and sea witch, rival-admirer of Luminara, opposed to Shellar\'s protective nature, patron of venomous creatures.',
      geography_connection: 'Toxic algae blooms, jellyfish aggregations, reef areas with venomous species, the Venom Gardens',
      powers_abilities: 'Create and control any toxin, immunity to all poisons, deadly touch, breed venomous creatures, sense chemical compositions',
      weaknesses: 'Arrogance about her toxins, antidotes can nullify her power, predictable pattern of escalation, beauty makes her vain',
      appearance_description: 'Devastatingly beautiful woman with skin that shifts through warning colors (electric blue, vivid purple, neon green), hair of drifting jellyfish tentacles, compound mantis-shrimp eyes, movements graceful but predatory',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Migratus',
      character_type: 'god',
      archetype: 'eternal_traveler',
      domain: 'Migration, Schools, Navigation, Instinct, Return',
      description: `Migratus is the Migration God, the Eternal Traveler, the divine force behind every journey that sea creatures take. He is the instinct that drives salmon to return to their birthplace, the compass that guides sea turtles across oceans, the invisible paths that whale pods follow through trackless seas. He represents not just movement, but purposeful movement—journey with destination, travel with meaning.

He appears as a figure who is never entirely present, always slightly translucent as if caught mid-journey between here and there. His form combines features of many migratory species—the sleek body of a tuna, the navigational sense of a sea turtle, the determination of a salmon. He carries a staff carved with maps that constantly redraw themselves, showing every migratory route in the ocean.

Migratus is the son of Tideus and Marineth—inheriting his father's love of motion and his mother's connection to tides and cycles. He represents the middle ground between them: not chaotic change like Tideus, but cyclical, purposeful change that returns to its starting point. He is change that preserves, movement that comes home.

He is endlessly restless, unable to stay in one place for long. He swims the ocean's great currents constantly, visiting every migratory species, ensuring they remember their routes. He is beloved by sailors who also understand the call of distant places and the yearning for home.

But Migratus faces a crisis. Human activity disrupts migration patterns—dams block salmon, light pollution confuses sea turtles, sonar disoriented whales, climate change shifts the timing of seasonal journeys. He feels his children becoming lost, unable to find their way home, and it fills him with grief and rage. He has begun to actively interfere with human shipping and coastal development, making him controversial among both gods and mortals.`,
      origin_story: 'Migratus was born from the first great migration—when the primordial seas became distinct regions and creatures had to travel between them to survive. The instinct to migrate formed consciousness, and Tideus and Marineth shaped it into their son. His first journey was to swim from pole to pole, establishing the routes that species still follow today.',
      personality: 'Restless, values purpose and homecoming, deeply connected to instinct, patient guide but increasingly frustrated, feels responsibility for every lost migrant. Son of Tideus and Marineth, brother to Coralith, ally of Echolus who helps creatures navigate by sound.',
      geography_connection: 'All major ocean currents, migratory routes, spawning grounds, the paths between distant places',
      powers_abilities: 'Perfect navigation, control migratory instincts, accelerate travel, create temporary pathways through the ocean, commune with all migratory species',
      weaknesses: 'Cannot remain still, compelled to continuously travel, feels physical pain when migrations are disrupted, divided attention across countless journeys',
      appearance_description: 'Semi-translucent figure that seems caught mid-journey, combines features of many migratory species (tuna sleekness, turtle wisdom, salmon determination), carries ever-changing map-staff, leaves faint trail of current behind',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Scavenor',
      character_type: 'god',
      archetype: 'death_recycler',
      domain: 'Scavengers, Decay, Recycling, Marine Snow, The Ocean Floor',
      description: `Scavenor is the Scavenger God, the Lord of Decay, the divine force that ensures nothing is wasted in the ocean's cycles. He represents the crucial but unglamorous work of breaking down death into life, of recycling nutrients, of ensuring that every ending becomes a new beginning. Where other gods represent creation and beauty, Scavenor represents necessary destruction and pragmatic efficiency.

He appears as a hunched, ancient figure whose body seems to be composed of creatures that feed on carrion—hagfish writhe across his skin, amphipods cluster on his shoulders, sea lice form his beard. His hands end in the claws of crabs, perfect for picking apart carcasses. His eyes are cloudy and milky, as if covered by the bacterial film that grows on decomposing matter.

Despite his grotesque appearance, Scavenor is gentle, philosophical, and surprisingly dignified. He sees beauty in efficiency, elegance in the food chain, and honor in his unglamorous work. He argues that predators like Krakus and Abyssor get glory for killing, but it is his scavengers who actually sustain the ecosystem by recycling nutrients.

His domain is the ocean floor, particularly the abyssal plains where whale falls create oases of life in the desert of the deep. When a great creature dies and sinks, Scavenor presides over the feast, ensuring every part is used—the hagfish consume the soft tissue, the crabs clean the bones, the bacteria break down the remains, and finally, the minerals return to the water to feed the phytoplankton that begin the cycle anew.

Scavenor has a complicated relationship with death. He is not a killer—he finds murder wasteful and crude. But he is death's partner, the one who ensures death serves a purpose. He has philosophical discussions with Salinar about preservation versus recycling, with Glacius about frozen versus decayed preservation, and with Pressura about the value of the deep places where the heaviest remains eventually settle.`,
      origin_story: 'When the first great creature died in the primordial ocean, its body began to sink. Abyssara watched, curious about what would happen. Bacteria began to break down the flesh, small creatures came to feed, and the nutrients spread through the water. From this first feast, Scavenor emerged—already ancient-looking, already patient, already understanding his role in the cycle of life and death.',
      personality: 'Patient, philosophical, values efficiency and cycles, unglamorous but dignified, sees beauty in decomposition, gentle despite grotesque appearance. Ally of Pressura (both value the deep), philosophical opponent of Salinar (decay vs preservation), neutral observer of most conflicts.',
      geography_connection: 'The ocean floor, abyssal plains, whale fall sites, anywhere organic matter accumulates',
      powers_abilities: 'Accelerate or slow decomposition, command all scavenging creatures, sense death anywhere in the ocean, recycle anything organic, survive without food indefinitely',
      weaknesses: 'Cannot create life only recycle it, repulsive appearance limits social interactions, bound to wait for death rather than causing it',
      appearance_description: 'Hunched ancient figure composed of scavenger creatures—hagfish skin, amphipod clusters, sea lice beard, crab claws for hands, cloudy milky eyes, moves slowly but purposefully, leaves faint trail of detritus',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Brinara',
      character_type: 'god',
      archetype: 'balance_keeper',
      domain: 'Salinity, Chemical Balance, Osmosis, Estuaries, Mixing Waters',
      description: `Brinara is the Salinity Goddess, the Keeper of Balance, the divine force that maintains the chemical composition of the ocean. She is sister to Salinar but represents a different aspect of salt—not preservation through crystallization, but balance through proper concentration. She ensures that the ocean is neither too salty nor too fresh, that mixing happens where it should, and that estuaries maintain their delicate balance.

She appears as a woman seemingly made of two halves—one side is pure saltwater, clear and heavy, while the other is freshwater, lighter and flowing differently. Where the two halves meet in the middle of her body, they create swirling patterns of mixing, a permanent halocline running through her core. Her hair flows in two distinct currents, never quite mixing. Her eyes are different colors—one the deep blue of the open ocean, one the green-brown of river water.

Brinara is a perfectionist obsessed with balance. She constantly monitors the ocean's salinity, adjusting it when rivers bring too much fresh water, concentrating it when evaporation is too high. She is the goddess of estuaries, those critical zones where river meets sea, where countless species spawn and feed precisely because of the salinity gradients she maintains.

She is the daughter of Salinar and Marineth—an unlikely pairing between the god who crystallizes everything and the goddess of constant tidal change. From Salinar she inherited precision and chemical knowledge, from Marineth she inherited understanding of cycles and change. She mediates between her parents' philosophies, arguing that balance requires both stability and flexibility.

Brinara is neutral in most divine conflicts because she understands that extremes of any kind threaten balance. She opposes Glacius when his ice traps too much freshwater, opposes excessive warming that increases evaporation, and opposes pollution that changes ocean chemistry. She is increasingly concerned about ocean acidification, seeing it as a fundamental threat to the balance she has maintained for eons.`,
      origin_story: 'Born when Salinar and Marineth briefly collaborated to create the first estuary—a place where salt and fresh water could coexist. They poured their combined power into the brackish water, and Brinara emerged from the mixing zone, already understanding that neither extreme was ideal, that true wisdom lay in the balance between opposites.',
      personality: 'Perfectionist, values balance above all, diplomatic mediator, anxious about disruptions, sees beauty in gradients and transitions. Daughter of Salinar and Marineth, sister to multiple deities, mediator in divine conflicts, increasingly activist about human-caused chemical imbalances.',
      geography_connection: 'Estuaries, haloclines, mixing zones, areas where waters of different salinity meet',
      powers_abilities: 'Control salinity levels, create or strengthen haloclines, sense chemical imbalances, mix or separate waters, survive in any salinity',
      weaknesses: 'Obsession with balance makes her indecisive in crisis, cannot tolerate extremes, chemically vulnerable to acidification',
      appearance_description: 'Woman split vertically—one side clear saltwater, other side lighter freshwater, swirling mixing pattern at her center, hair flows in two distinct currents, heterochromatic eyes (deep blue and green-brown)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'Surgus',
      character_type: 'god',
      archetype: 'undertow_hunter',
      domain: 'Undertows, Rip Currents, Drowning, Sudden Violence, Hidden Dangers',
      description: `Surgus is the Undertow God, the Rip Current Hunter, the embodiment of the ocean's sudden, hidden violence. He represents the danger that lurks beneath calm surfaces—the current that grabs swimmers' ankles, the undertow that pulls victims into deep water, the rip current that drags even strong swimmers out to sea. He is the ocean's reminder that beautiful surfaces can hide lethal depths.

He appears as a muscular, scarred warrior whose lower body dissolves into rushing water that constantly flows outward from him. His torso is solid and powerful, but from the waist down, he is a permanent rip current, always pulling, always dragging. His hands are calloused from grabbing struggling victims, and his face bears the expression of a hunter mid-pursuit.

Surgus is the son of Tideus and a mortal woman who drowned in an undertow. Tideus, feeling guilty for not saving her, transformed her dying moment into a god—perhaps as punishment for his neglect, perhaps as twisted honor. Surgus was born already angry, already hunting, already pulling victims beneath the waves.

He is not evil, but he is merciless. He believes that the ocean demands respect, and those who enter it carelessly deserve what they get. He argues that his undertows serve as evolutionary pressure, ensuring only the cautious and strong survive. This puts him at odds with nearly every other deity except Abyssor, who appreciates his philosophy.

Mortals fear and hate Surgus more than almost any other god. Parents tell children stories of him to keep them away from dangerous waters. Coastal communities leave offerings to keep him away from their beaches. He is the bogeyman of the ocean, the monster in the waves.

But Surgus has a secret vulnerability: he was born from Tideus's guilt and grief, and those emotions still define him. He hunts because it's the only thing he knows how to do. Deep down, he wishes he could save people instead of drowning them, but his nature won't allow it.`,
      origin_story: 'When Tideus\'s mortal lover drowned in an undertow, he held her body and wept with such intensity that his divine tears created new currents. These currents swirled around her corpse, mixing with Tideus\'s grief and guilt, until they became conscious. Surgus emerged from the water, looked at Tideus with his mother\'s eyes, and immediately swam away to create more undertows. Tideus has regretted creating him ever since.',
      personality: 'Merciless hunter, believes ocean demands respect, fatalistic, secretly wishes he could save instead of drown, lonely and misunderstood. Son of Tideus and drowned mortal, ally only to Abyssor, opposed by rescue-focused deities, feared and hated by mortals.',
      geography_connection: 'Rip current zones, undertows, dangerous beaches, anywhere currents flow away from shore',
      powers_abilities: 'Create rip currents and undertows, superhuman strength in pulling victims down, move through any current instantly, sense swimmers in danger',
      weaknesses: 'Nature compels him to hunt which can be predicted, guilt-born nature makes him vulnerable to emotional manipulation, cannot function in completely still water, deep self-loathing',
      appearance_description: 'Muscular scarred warrior with solid upper body but lower body that dissolves into permanent rushing outward current, calloused hands, hunter\'s focused expression, leaves trail of dangerous currents behind',
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
  console.log('✅ Phase 2 Complete!\n');
  console.log('Second Tier Deities Summary:');
  console.log('  • Coralith - Reef Builder');
  console.log('  • Pearlessa - Keeper of Treasures');
  console.log('  • Salinar - Lord of Salt & Preservation');
  console.log('  • Ventris - Wind Dancer');
  console.log('  • Glacius - Ice Tyrant');
  console.log('  • Echolus - Voice of the Depths');
  console.log('  • Shellar - Armored Guardian');
  console.log('  • Toxira - Poison Mistress');
  console.log('  • Migratus - Eternal Traveler');
  console.log('  • Scavenor - Lord of Decay');
  console.log('  • Brinara - Balance Keeper');
  console.log('  • Surgus - Undertow Hunter');
  console.log('\nTotal Characters: 20 (8 from Phase 1 + 12 from Phase 2)');
  console.log('\nNext: Phase 3 - Create 15 Heroes & Mortals');
}

createPhase2Characters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
