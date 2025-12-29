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

async function createPhase5Realms() {
  console.log('🌊 PHASE 5: Creating Realms & Locations\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const realms = [
    {
      name: 'The Luminous Abyss',
      realm_type: 'underwater',
      description: `The Luminous Abyss is Luminara's domain—a vast region of the deep sea where bioluminescence is law and darkness is banished. This realm exists at depths where sunlight never reaches, yet it glows with the light of millions of creatures. Every fish, every coral, every microorganism produces light, creating an underwater aurora that shifts and dances continuously.

The Abyss is organized in layers, each with its own color palette. The upper reaches glow blue and green, dominated by jellyfish and small fish. The middle depths shine with purples and reds from squid and deep-sea creatures. The deepest parts pulse with white and gold light—Luminara's own radiance reflected by her most devoted followers.

At the heart of the realm lies the Palace of Eternal Light, Luminara's sanctuary carved from a massive underwater mountain. The palace is constructed entirely from bioluminescent coral that Luminara cultivated over millennia. Its walls pulse with patterns that tell stories, its halls lit by schools of glowing fish that swim through the architecture.

The Luminous Abyss serves as a refuge for creatures fleeing predators—the constant light makes ambush impossible. But it is also a place of beauty and art. Light Dancers perform here nightly, creating displays that even gods come to witness. Luminara welcomes all who appreciate beauty, though she expects visitors to contribute their own light to the collective glow.

The realm is expanding slowly as Luminara teaches more creatures to produce bioluminescence. She dreams of one day making the entire ocean glow, banishing darkness forever. Whether this is noble goal or dangerous obsession remains debated among the other gods.`,
      access_requirements: 'Must produce or carry light source; complete darkness is forbidden. Visitors who dim or destroy light are expelled violently.',
      inhabitants: 'Luminara (goddess), Light Dancers, bioluminescent fish and jellyfish, creatures seeking refuge from predators, artists and beauty-seekers',
      geography: 'Organized in color-coded depth layers; Palace of Eternal Light at the center; underwater mountains with bioluminescent coral gardens',
      cultural_significance: 'Luminara\'s domain, refuge for the hunted, artistic center of the ocean, symbol of beauty in darkness',
      connected_to: 'The Pressure Forge (borders it at extreme depths), The Tidewatcher\'s Horizon (through migration routes)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Pressure Forge',
      realm_type: 'underwater',
      description: `The Pressure Forge is Pressura's domain—the deepest trenches of the ocean where pressure crushes all but the most adapted. This realm exists at depths measured in miles, where water pressure would flatten submarines and extinguish any light. It is a place of absolute darkness and crushing force, beautiful in its extremity.

The Forge is named for its effect on those who enter. The pressure does not merely crush—it tests, transforms, forges character from weakness. Pressura believes that only through surviving the greatest pressure can one discover true strength. She welcomes challengers, though few survive to leave.

Geologically, the Forge consists of massive trenches, some so deep their bottoms have never been mapped. Volcanic vents line the trench floors, creating rare oases of warmth in the cold depths. Strange ecosystems cluster around these vents—tube worms, blind shrimp, and creatures that have adapted to use chemicals instead of sunlight for energy.

At the deepest point lies Pressura's Throne, a seat carved from the densest rock in the ocean, positioned at the exact point of greatest pressure. She sits there for months at a time, meditating on the nature of strength, occasionally rising to test those brave or foolish enough to seek her out.

The Pressure Forge has become a pilgrimage site for those seeking to prove themselves. Warriors come to train in the crushing depths, believing that if they can fight under such pressure, surface combat will seem easy. Many leave their bones on the trench floor, but those who survive emerge transformed, their spirits forged as hard as diamond.`,
      access_requirements: 'Must be adapted to extreme pressure or have divine blessing. Unprepared visitors die within seconds.',
      inhabitants: 'Pressura (goddess), Pressure Crushers, deep-trench creatures, pilgrims seeking strength, volcanic vent ecosystems',
      geography: 'Deepest ocean trenches, volcanic vent oases, trench floor littered with failed pilgrims\' remains, Pressura\'s Throne at the point of greatest pressure',
      cultural_significance: 'Pressura\'s domain, testing ground for strength, pilgrimage site for warriors, symbol of growth through adversity',
      connected_to: 'The Luminous Abyss (at its upper boundary), The Brine Pools (through underground channels)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Frozen Frontier',
      realm_type: 'underwater',
      description: `The Frozen Frontier is Glacius's domain—the polar seas where ice reigns supreme. This realm encompasses both Arctic and Antarctic waters, places where the ocean itself begins to freeze, creating landscapes of surreal beauty and deadly cold. Ice shelves miles thick float above waters that would freeze flesh in minutes.

The Frontier is a realm of stark contrasts. Above the water, glaciers and icebergs tower like cathedrals of frozen water. Below, the ocean teems with life adapted to extreme cold—seals, penguins, polar bears, and fish with antifreeze in their blood. The ice creates unique ecosystems, with communities of microorganisms living within the ice itself.

Glacius's Palace of Eternal Winter sits at the North Pole, carved from a massive iceberg that has never melted. The palace is a maze of ice tunnels and frozen halls, beautiful but deadly. The walls display frozen scenes—creatures and moments Glacius deemed worth preserving, trapped in ice for eternity like museum exhibits.

The realm is under threat from climate change. As temperatures rise, the Frozen Frontier shrinks year by year. Glacius grows more desperate and aggressive, unleashing his Ice Serpents on anything contributing to warming. The realm has become militarized, a last stand against the tide of change.

Despite the hostility, the Frontier remains breathtakingly beautiful. The aurora borealis dances across polar skies, reflecting off ice to create light shows rivaling even Luminara's domain. Whales breach through ice flows, their songs echoing under frozen surfaces. It is a realm worth saving, if anyone can convince Glacius to accept help rather than lashing out in fear.`,
      access_requirements: 'Must withstand extreme cold or be blessed by Glacius. Anything bringing warmth is attacked by Ice Serpents.',
      inhabitants: 'Glacius (god), Ice Serpents, polar bears, seals, penguins, cold-adapted fish, creatures preserved in ice',
      geography: 'Arctic and Antarctic waters, massive ice shelves and icebergs, Palace of Eternal Winter at North Pole, ice caves and frozen tunnels',
      cultural_significance: 'Glacius\'s domain, symbol of preservation through cold, under threat from climate change, militarized last stand',
      connected_to: 'The Tidewatcher\'s Horizon (through migration routes), The Storm Zones (where polar and tropical waters meet)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Coral Gardens',
      realm_type: 'underwater',
      description: `The Coral Gardens are Coralith's masterwork—vast reef systems that represent the most biodiverse ecosystems in the ocean. These gardens span thousands of square miles, from the Great Barrier to tiny hidden reefs, each one a city of life where thousands of species coexist in delicate balance.

The Gardens are organized chaos—every surface covered with coral, every crevice occupied by some creature. Fish of impossible colors dart between coral branches. Octopi hide in caves while eels wait in ambush. Sea turtles glide overhead while rays bury themselves in sand below. It is life competing and cooperating simultaneously, a perfect demonstration of ecosystem dynamics.

At the heart of the largest reef system lies Coralith's Sanctuary, a region where coral has grown for thousands of years undisturbed. The coral structures here are massive, creating underwater forests and canyons. The Coral Wyrm, Coralith's first creation, makes its home in these ancient formations, serving as both guardian and symbol.

The Gardens face multiple threats. Ocean acidification bleaches coral, killing the polyps that build reefs. Rising temperatures cause bleaching events. Pollution smothers reefs. Overfishing disrupts ecosystem balance. Coralith works tirelessly to combat these threats, but even a god can only do so much against global change.

Despite the challenges, the Coral Gardens remain places of wonder. Snorkelers and divers consider them sacred spaces. Scientists study them to understand ecosystem complexity. The Gardens prove that beauty and diversity can thrive when conditions allow, making their decline all the more tragic.`,
      access_requirements: 'Open to all who respect the reef. Damaging coral results in curse of sensitivity—feeling every ecological wound personally.',
      inhabitants: 'Coralith (god), Coral Wyrm, thousands of reef fish species, sea turtles, rays, octopi, sharks, reef ecosystems',
      geography: 'Vast reef systems worldwide, Coralith\'s Sanctuary at the largest reef, underwater forests and canyons of ancient coral',
      cultural_significance: 'Coralith\'s masterwork, most biodiverse ocean ecosystems, under threat from climate change and pollution, places of wonder and scientific study',
      connected_to: 'The Shallows (shallow water transition zones), The Open Ocean (where reef fish venture out)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Storm Zones',
      realm_type: 'surface',
      description: `The Storm Zones are regions where Krakus, Ventris, and the Tempest Whale play—areas of perpetual atmospheric chaos where the ocean and sky wage eternal war. These zones move across the ocean unpredictably, though certain regions see them more frequently. Hurricane Alley, the North Atlantic Storm Track, the Typhoon Belt—these are the Storm Zones' favorite hunting grounds.

In these realms, the ocean surface churns with waves stories tall. Lightning strikes constantly, illuminating clouds that roil like living things. Winds howl at speeds that tear ships apart. Rain falls so heavily it obscures all vision. Yet within the chaos, there is terrible beauty—a power and energy that reminds mortals how small they truly are.

Krakus and Ventris treat the Storm Zones as their playground and battlefield. They chase each other through tempests, their conflicts generating hurricanes. The Tempest Whale swims through the zones, feeding on storm energy, growing more powerful with each hurricane season. Together, they create weather events that reshape coastlines and enter historical record.

Surprisingly, the Storm Zones have their defenders. Storm sailors—humans blessed by Krakus—navigate these regions deliberately, finding peace in chaos. Storm Mantas hunt in the zones, feeding on fish pushed to the surface by pressure changes. Even scientists venture here, studying the phenomena despite the danger.

The zones serve an ecological purpose—they distribute heat from tropics to poles, drive ocean currents, and bring rain to dry regions. Without them, the ocean's circulation would stagnate. But their increasing intensity due to climate change concerns even the gods. More powerful storms cause more destruction, threatening the balance between chaos and order.`,
      access_requirements: 'No restrictions, but survival requires storm adaptation or divine protection. Ships unprepared are destroyed.',
      inhabitants: 'Krakus (god), Ventris (god), Tempest Whale, Storm Mantas, storm sailors, desperate creatures',
      geography: 'Perpetually moving zones of atmospheric chaos, favorite regions include Hurricane Alley and Typhoon Belt, waves and lightning constant',
      cultural_significance: 'Playground and battlefield of chaos gods, regions of terrible beauty, ecologically necessary for ocean circulation, increasingly intense due to climate change',
      connected_to: 'The Open Ocean (surrounding regions), The Frozen Frontier (where cold and warm meet)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Brine Pools',
      realm_type: 'underwater',
      description: `The Brine Pools are underwater lakes of hypersaline water that sits on the ocean floor like pools of mercury—water so dense that normal seawater floats on top, creating an underwater interface that looks like a lake surface. These pools are Salinar's domain, and they contain some of the strangest ecosystems in the ocean.

The pools form when salt deposits on the seafloor dissolve, creating water several times saltier than normal seawater. This brine is so dense it does not mix with the ocean above, instead pooling in depressions where it can persist for centuries. The interface between brine and seawater creates unique chemistry—some pools are toxic, others support specialized ecosystems.

Salinar maintains temples at the largest brine pools, structures that exist half in normal water, half in brine. His Salt Golems patrol these temples, ensuring mortals who harvest salt do so respectfully. The pools serve as natural preservation sites—anything falling into them is pickled perfectly, preserved for future study.

The Brine Hydra, a seven-headed monster, rules the most toxic pools, preventing intrusion. But other pools support life found nowhere else—bacteria that can survive extreme salinity, specialized fish that dive into brine to escape predators, tubeworms that harvest chemicals from pool interfaces.

The pools have become sites of scientific interest and spiritual pilgrimage. Scientists study them to understand how life adapts to extreme conditions. Salinar's followers meditate at pool edges, contemplating the nature of preservation. Some seek to be mummified in the pools when they die, believing Salinar will preserve their wisdom eternally.`,
      access_requirements: 'Open to respectful visitors. Taking salt without offering something in return results in transformation into salt statue.',
      inhabitants: 'Salinar (god), Salt Golems, Brine Hydra, extremophile bacteria, specialized fish, pilgrims and scientists',
      geography: 'Underwater lakes of hypersaline water, temples at largest pools, toxic and life-supporting pools both present',
      cultural_significance: 'Salinar\'s domain, natural preservation sites, scientific research locations, pilgrimage destinations for understanding preservation',
      connected_to: 'The Pressure Forge (through underwater channels), The Open Ocean (above the pools)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Tidewatcher\'s Horizon',
      realm_type: 'surface',
      description: `The Tidewatcher's Horizon is not a fixed location but a conceptual realm—the boundary between known and unknown seas, the edge of every map where exploration ends and mystery begins. This realm moves as knowledge expands, always staying just beyond mortal understanding. It is where Tideus swims his eternal circuits and where the Migration King leads his followers.

The Horizon is characterized by uncertainty. Charts become unreliable here, compasses spin without purpose, GPS signals fail mysteriously. The ocean seems deeper, the waves more purposeful. Creatures appear that no bestiary records. Some report seeing islands that vanish upon approach, ghost ships crewed by the long-dead, or lights beneath the surface that pulse with alien intelligence.

Tideus patrols the Horizon ceaselessly, maintaining the boundary between order and chaos. He ensures that ocean currents continue flowing correctly, that migration routes remain stable, that the known world stays known. But he also protects the unknown, preventing mortals from exploring too quickly, ensuring some mysteries remain unsolved.

The realm has practical importance—it is where currents converge and diverge, where ocean basins meet, where different water masses collide and mix. Captain Maris has mapped portions of it, but even her charts come with warnings that conditions here change continuously. The Migration King guides creatures through the Horizon twice yearly, leading them on journeys that cross multiple ocean basins.

The Tidewatcher's Horizon represents the ocean's final frontier. As technology advances and exploration extends, it retreats further. But it never disappears entirely. There are always edges to every map, boundaries to every understanding. The Horizon ensures the ocean retains mystery, that exploration never truly ends.`,
      access_requirements: 'No formal restrictions, but navigation requires skill or divine guidance. Most who venture here become lost.',
      inhabitants: 'Tideus (god), Migration King, Current Riders, explorers, lost ships, creatures in migration',
      geography: 'Boundary realm that moves as knowledge expands, regions where ocean basins meet, convergence zones of multiple currents',
      cultural_significance: 'Edge of known world, realm of mystery and exploration, where Captain Maris charts and Migration King leads migrations, represents ocean\'s eternal frontier',
      connected_to: 'All ocean realms (as the boundary between them and the unknown)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Pearlescent Depths',
      realm_type: 'underwater',
      description: `The Pearlescent Depths are Pearlessa's domain—underwater valleys where oyster beds stretch for miles and the seafloor glitters with pearls like stars in a night sky. This realm exists at moderate depths where sunlight penetrates just enough to create shimmering illumination, each pearl catching and refracting light into rainbow patterns.

The Depths are organized around the largest oyster beds, each one a community that has grown for generations. The central bed, protected by the Pearled Kraken, contains oysters that have lived for centuries, their shells massive and their pearls legendary. Each pearl here contains not just beauty but history—memories crystallized into gemstone form.

Pearl Whisperer Shen maintains gardens in the Depths, carefully tending oyster populations and learning their needs. She has created a symbiotic relationship between mortals and mollusks—humans protect oysters from predators and pollution, while oysters produce pearls that help humans understand the past. It is cooperation that benefits all involved.

The realm has an almost meditative quality. The gentle current creates a lullaby as it flows through pearl beds. Oysters open and close in rhythmic patterns. Light dances across pearls in mesmerizing displays. Many come here seeking peace, finding solace in the simple beauty of transformation—irritation becoming treasure, suffering becoming wisdom.

Pearlessa has made the Depths a sanctuary not just for oysters but for all creatures that transform pain into beauty. Artists come to seek inspiration. Wounded souls come to heal. The traumatized come to learn that their suffering need not be meaningless—it can be the seed from which something beautiful grows.`,
      access_requirements: 'Open to all who approach with respect. Taking pearls without offering fair exchange results in curse of empathy—feeling every pain around you.',
      inhabitants: 'Pearlessa (goddess), Pearl Whisperer Shen, Pearled Kraken, sacred Pearl Oysters, artists and wounded souls seeking transformation',
      geography: 'Underwater valleys with massive oyster beds, central bed protected by Pearled Kraken, seafloor glittering with pearls',
      cultural_significance: 'Pearlessa\'s domain, sanctuary for transformation, place where pain becomes beauty, meditation and healing center',
      connected_to: 'The Coral Gardens (sharing similar depths), The Shallows (where some pearl oysters live)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Tidal Sanctuaries',
      realm_type: 'coastal',
      description: `The Tidal Sanctuaries are Marineth's gift to the vulnerable—coastal regions where tide pools, mangroves, and estuaries create safe havens for young creatures. These sanctuaries exist where river meets sea, where tides create rhythmic flooding and exposure, where brackish water supports unique ecosystems that serve as nurseries for countless species.

The Sanctuaries are characterized by diversity and protection. Mangrove roots create mazes that shield young fish from predators. Tide pools isolated at low tide become temporary worlds where small creatures grow in relative safety. Salt marshes filter pollution and provide feeding grounds for migrating birds. These regions are transition zones, places that belong fully to neither land nor sea.

Marineth blessed these areas personally, ensuring they receive her full protection. Tide Pool Guardians watch over individual pools, while larger spirits patrol mangrove forests and estuaries. Tide Pool Guardian Mira coordinates protection efforts, teaching mortals to respect these fragile ecosystems.

The Sanctuaries face threats from development, pollution, and sea-level rise. Mangroves are cleared for construction, tide pools trampled by tourists, estuaries poisoned by runoff. Marineth fights to preserve them, but she cannot be everywhere. The Sanctuaries need mortal allies who understand their importance.

Despite threats, the Sanctuaries remain places of wonder. Children discover marine life in tide pools, learning to love the ocean through hands-on exploration. Scientists study ecosystem dynamics in estuaries. Artists capture the beauty of mangrove forests. These realms connect humans to the sea more directly than any other, making them crucial for fostering environmental stewardship.`,
      access_requirements: 'Open to all respectful visitors. Damaging sanctuaries results in tidal curse—being swept away by next high tide.',
      inhabitants: 'Marineth (goddess), Tide Pool Guardians, Tide Pool Guardian Mira, young fish and invertebrates, migrating birds, nursery species',
      geography: 'Coastal tide pools, mangrove forests, salt marshes, estuaries where rivers meet the sea, brackish transition zones',
      cultural_significance: 'Marineth\'s protected nurseries, connection points between humans and ocean, educational centers, under threat from development',
      connected_to: 'The Shallows (as tides bring in ocean water), Rivers (where fresh water enters)',
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      name: 'The Forgotten Deep',
      realm_type: 'underwater',
      description: `The Forgotten Deep is not a geographical location but a metaphysical realm—the collective space where all lost ships, drowned sailors, and forgotten maritime history resides. This realm exists in the deepest, darkest parts of the ocean where light never reaches and pressure prevents retrieval. It is where the Forgotten Depths entity dwells, growing larger with every unmourned loss.

The Deep manifests as a graveyard of ships spanning centuries. Ancient triremes rest beside modern freighters. Sailing vessels slowly disintegrate next to submarines that imploded under pressure. Each wreck tells a story of human ambition meeting the ocean's power, of confidence meeting humility, of life meeting death.

The realm has a haunting quality. Ghost lights flicker in the darkness—souls of the dead trying to signal rescue that will never come. Phantom voices call out positions and orders, echoing commands given in final moments. The Drowned Poet swims through the Deep regularly, singing dirges to ease the suffering of unmourned souls.

Marineth views the Forgotten Deep with pity and determination. She is slowly performing rituals to help unmourned souls find peace, but the process is lengthy. Each soul requires individual mourning, specific memories to be honored. As she succeeds, parts of the Forgotten Deep fade, ghost ships disappearing as their crews finally rest.

The realm serves as a reminder of the ocean's dangers and the importance of honoring the dead. Maritime cultures perform rituals to prevent their sailors from joining the Forgotten Deep, ensuring every loss is mourned. The Deep grows smaller when humans remember to value life and honor death, larger when casualties become mere statistics.`,
      access_requirements: 'Accessible only to the dead, dying, or those with special blessing. Living who enter uninvited are absorbed into collective.',
      inhabitants: 'Forgotten Depths entity, unmourned souls of drowned sailors, The Drowned Poet, ghost ships, tragic spirits',
      geography: 'Metaphysical realm manifesting in deepest ocean, graveyard of lost ships, darkness and pressure define physical location',
      cultural_significance: 'Repository of maritime tragedy, reminder of ocean\'s power, slowly being resolved through Marineth\'s rituals, grows when dead go unmourned',
      connected_to: 'All ocean regions (manifests anywhere the unmourned have drowned)',
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating realms...\n');

  for (let i = 0; i < realms.length; i++) {
    const realm = realms[i];
    console.log(`[${i + 1}/${realms.length}] Creating ${realm.name} - ${realm.realm_type}`);

    try {
      const { data, error } = await supabase
        .from('realms')
        .insert([realm])
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
  console.log('✅ Phase 5 Complete!\n');
  console.log('Realms Created:');
  console.log('  1. The Luminous Abyss - Luminara\'s glowing deep');
  console.log('  2. The Pressure Forge - Pressura\'s crushing trenches');
  console.log('  3. The Frozen Frontier - Glacius\'s polar domain');
  console.log('  4. The Coral Gardens - Coralith\'s biodiverse reefs');
  console.log('  5. The Storm Zones - Krakus & Ventris\'s chaos');
  console.log('  6. The Brine Pools - Salinar\'s preservation sites');
  console.log('  7. The Tidewatcher\'s Horizon - Tideus\'s boundary');
  console.log('  8. The Pearlescent Depths - Pearlessa\'s pearl valleys');
  console.log('  9. The Tidal Sanctuaries - Marineth\'s nurseries');
  console.log('  10. The Forgotten Deep - Repository of tragedy');
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 PHASE 5 COMPLETE!\n');
  console.log('Oceanborn Legends Summary:');
  console.log('  35 Characters (gods, heroes, mortals)');
  console.log('  25 Creatures (diverse types)');
  console.log('  10 Realms (underwater, surface, coastal)');
  console.log('  = 70 total entities');
  console.log('\nNext: Phase 6 - Create 12 Stories/Myths');
}

createPhase5Realms()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
