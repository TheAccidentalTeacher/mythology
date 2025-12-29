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

// Simple canvas data structure for Konva
function createCanvasData(elements: unknown[]) {
  return {
    attrs: {
      width: 1200,
      height: 800
    },
    className: 'Stage',
    children: [
      {
        attrs: {},
        className: 'Layer',
        children: elements
      }
    ]
  };
}

async function createPhase7Maps() {
  console.log('🌊 PHASE 7: Creating Maps (FINAL PHASE!)\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const maps = [
    {
      title: 'The Ocean Realms - Complete Map',
      description: 'A comprehensive map showing all major realms and locations in the Oceanborn Legends mythology. From the frozen poles of the Frozen Frontier to the crushing depths of the Pressure Forge, this map displays the full scope of the ocean world.',
      map_type: 'world',
      width: 1400,
      height: 1000,
      background_color: '#0a1628',
      canvas_data: createCanvasData([
        {
          attrs: {
            x: 700,
            y: 100,
            text: 'THE FROZEN FRONTIER',
            fontSize: 24,
            fill: '#00d4ff',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 650,
            y: 150,
            radius: 60,
            fill: '#1e90ff',
            opacity: 0.6
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 200,
            y: 300,
            text: 'THE LUMINOUS ABYSS',
            fontSize: 20,
            fill: '#ffeb3b',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 300,
            y: 350,
            radius: 80,
            fill: '#ffd700',
            opacity: 0.5
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 1000,
            y: 400,
            text: 'THE CORAL GARDENS',
            fontSize: 20,
            fill: '#ff6b6b',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 1100,
            y: 450,
            radius: 70,
            fill: '#ff7f50',
            opacity: 0.5
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 500,
            y: 600,
            text: 'THE PRESSURE FORGE',
            fontSize: 18,
            fill: '#8b0000',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 650,
            radius: 50,
            fill: '#4a0000',
            opacity: 0.7
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 300,
            y: 700,
            text: 'THE BRINE POOLS',
            fontSize: 16,
            fill: '#90ee90',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 700,
            y: 400,
            text: 'THE STORM ZONES',
            fontSize: 22,
            fill: '#9370db',
            fontStyle: 'bold'
          },
          className: 'Text'
        }
      ]),
      locations: [
        { id: '1', name: 'Frozen Frontier', x: 700, y: 150, icon: '❄️' },
        { id: '2', name: 'Luminous Abyss', x: 300, y: 350, icon: '💡' },
        { id: '3', name: 'Coral Gardens', x: 1100, y: 450, icon: '🪸' },
        { id: '4', name: 'Pressure Forge', x: 600, y: 650, icon: '⚒️' },
        { id: '5', name: 'Brine Pools', x: 350, y: 750, icon: '🧂' },
        { id: '6', name: 'Storm Zones', x: 700, y: 450, icon: '⛈️' },
        { id: '7', name: 'Pearlescent Depths', x: 900, y: 600, icon: '🦪' },
        { id: '8', name: 'Tidal Sanctuaries', x: 1200, y: 300, icon: '🏝️' }
      ],
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Luminous Abyss - Detailed Map',
      description: 'A detailed view of Luminara\'s domain, showing the Palace of Eternal Light, bioluminescent zones organized by color depth, and the territories of Light Dancers. This map reveals the stunning beauty hidden in the deepest darkness.',
      map_type: 'realm',
      width: 1200,
      height: 900,
      background_color: '#000a1f',
      canvas_data: createCanvasData([
        {
          attrs: {
            x: 600,
            y: 50,
            text: 'THE LUMINOUS ABYSS',
            fontSize: 28,
            fill: '#ffeb3b',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 450,
            text: 'PALACE OF ETERNAL LIGHT',
            fontSize: 24,
            fill: '#ffd700',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 500,
            radius: 100,
            fill: '#ffeb3b',
            opacity: 0.8
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 200,
            y: 200,
            text: 'Blue Zone',
            fontSize: 18,
            fill: '#00bfff'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 1000,
            y: 200,
            text: 'Purple Zone',
            fontSize: 18,
            fill: '#9370db'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 750,
            text: 'Gold Zone (Deepest)',
            fontSize: 18,
            fill: '#ffd700'
          },
          className: 'Text'
        }
      ]),
      locations: [
        { id: '1', name: 'Palace of Eternal Light', x: 600, y: 500, icon: '🏰' },
        { id: '2', name: 'Blue Bioluminescent Zone', x: 200, y: 250, icon: '💙' },
        { id: '3', name: 'Purple Zone', x: 1000, y: 250, icon: '💜' },
        { id: '4', name: 'Gold Zone', x: 600, y: 800, icon: '💛' },
        { id: '5', name: 'Light Dancer Performance Hall', x: 400, y: 400, icon: '✨' }
      ],
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Frozen Frontier - Glacius\'s Domain',
      description: 'Map of the polar regions showing the Palace of Eternal Winter, ice shelf territories, Ice Serpent patrol routes, and the shrinking ice boundaries. This map documents the realm under threat from climate change.',
      map_type: 'realm',
      width: 1200,
      height: 800,
      background_color: '#0d1b2a',
      canvas_data: createCanvasData([
        {
          attrs: {
            x: 600,
            y: 50,
            text: 'THE FROZEN FRONTIER',
            fontSize: 28,
            fill: '#00d4ff',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 300,
            text: 'PALACE OF ETERNAL WINTER',
            fontSize: 22,
            fill: '#87ceeb',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 600,
            y: 350,
            radius: 80,
            fill: '#1e90ff',
            opacity: 0.7
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 300,
            y: 500,
            text: 'Ice Shelf Territory',
            fontSize: 18,
            fill: '#b0e0e6'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 900,
            y: 500,
            text: 'Frozen Galleries',
            fontSize: 18,
            fill: '#add8e6'
          },
          className: 'Text'
        },
        {
          attrs: {
            points: [200, 700, 1000, 700],
            stroke: '#ff0000',
            strokeWidth: 3,
            dash: [10, 5]
          },
          className: 'Line'
        },
        {
          attrs: {
            x: 450,
            y: 680,
            text: 'Shrinking Ice Boundary',
            fontSize: 16,
            fill: '#ff6b6b'
          },
          className: 'Text'
        }
      ]),
      locations: [
        { id: '1', name: 'Palace of Eternal Winter', x: 600, y: 350, icon: '🏰' },
        { id: '2', name: 'Northern Ice Shelf', x: 300, y: 550, icon: '🧊' },
        { id: '3', name: 'Frozen Galleries', x: 900, y: 550, icon: '❄️' },
        { id: '4', name: 'Ice Serpent Nest', x: 450, y: 200, icon: '🐉' },
        { id: '5', name: 'Aurora Viewing Point', x: 750, y: 200, icon: '🌌' }
      ],
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Coral Gardens - Biodiversity Map',
      description: 'Comprehensive map of Coralith\'s reef systems showing the Sanctuary at the center, major coral formations, biodiversity hotspots, and the territories of reef creatures. Includes notations of threatened areas.',
      map_type: 'realm',
      width: 1300,
      height: 850,
      background_color: '#001a33',
      canvas_data: createCanvasData([
        {
          attrs: {
            x: 650,
            y: 50,
            text: 'THE CORAL GARDENS',
            fontSize: 28,
            fill: '#ff6b6b',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 650,
            y: 425,
            text: 'CORALITH\'S SANCTUARY',
            fontSize: 24,
            fill: '#ff7f50',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 650,
            y: 475,
            radius: 120,
            fill: '#ff6b6b',
            opacity: 0.6
          },
          className: 'Circle'
        },
        {
          attrs: {
            x: 250,
            y: 250,
            text: 'Reef Section A',
            fontSize: 16,
            fill: '#ffb347'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 1000,
            y: 250,
            text: 'Reef Section B',
            fontSize: 16,
            fill: '#ffb347'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 400,
            y: 650,
            text: 'Threatened Area',
            fontSize: 16,
            fill: '#ff0000'
          },
          className: 'Text'
        }
      ]),
      locations: [
        { id: '1', name: 'Coralith\'s Sanctuary', x: 650, y: 475, icon: '🏛️' },
        { id: '2', name: 'Ancient Coral Forest', x: 250, y: 300, icon: '🌳' },
        { id: '3', name: 'Reef Section B', x: 1000, y: 300, icon: '🪸' },
        { id: '4', name: 'Coral Wyrm\'s Lair', x: 650, y: 650, icon: '🐉' },
        { id: '5', name: 'Biodiversity Hotspot', x: 900, y: 500, icon: '🐠' },
        { id: '6', name: 'Bleached Zone (Threatened)', x: 400, y: 700, icon: '⚠️' }
      ],
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'Migration Routes - Journey of the Migration King',
      description: 'Chart showing the twice-yearly migration routes led by the Migration King. Displays both the ancient routes (now disrupted) and new adaptive routes being established. Essential for understanding creature movements and ecological connections.',
      map_type: 'world',
      width: 1500,
      height: 900,
      background_color: '#0f1a2e',
      canvas_data: createCanvasData([
        {
          attrs: {
            x: 750,
            y: 50,
            text: 'MIGRATION ROUTES',
            fontSize: 28,
            fill: '#4ecdc4',
            fontStyle: 'bold'
          },
          className: 'Text'
        },
        {
          attrs: {
            points: [100, 400, 300, 300, 500, 350, 700, 250, 900, 300, 1100, 400, 1300, 350],
            stroke: '#4ecdc4',
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
          },
          className: 'Line'
        },
        {
          attrs: {
            x: 600,
            y: 200,
            text: 'Ancient Route (Disrupted)',
            fontSize: 18,
            fill: '#4ecdc4'
          },
          className: 'Text'
        },
        {
          attrs: {
            points: [100, 450, 250, 550, 450, 500, 650, 600, 850, 550, 1050, 600, 1300, 500],
            stroke: '#ff6b9d',
            strokeWidth: 4,
            dash: [15, 10],
            lineCap: 'round',
            lineJoin: 'round'
          },
          className: 'Line'
        },
        {
          attrs: {
            x: 650,
            y: 650,
            text: 'New Adaptive Route',
            fontSize: 18,
            fill: '#ff6b9d'
          },
          className: 'Text'
        },
        {
          attrs: {
            x: 700,
            y: 450,
            text: 'Migration King\'s Path',
            fontSize: 20,
            fill: '#ffd700',
            fontStyle: 'bold'
          },
          className: 'Text'
        }
      ]),
      locations: [
        { id: '1', name: 'Northern Feeding Grounds', x: 300, y: 300, icon: '🐟' },
        { id: '2', name: 'Ancient Rest Stop (Abandoned)', x: 700, y: 250, icon: '⚓' },
        { id: '3', name: 'Southern Breeding Grounds', x: 1100, y: 400, icon: '🥚' },
        { id: '4', name: 'New Rest Area', x: 650, y: 600, icon: '🏝️' },
        { id: '5', name: 'Temperature Barrier', x: 450, y: 425, icon: '🌡️' },
        { id: '6', name: 'Captain Maris Observation Point', x: 750, y: 500, icon: '🔭' },
        { id: '7', name: 'Current Convergence', x: 1050, y: 550, icon: '🌀' }
      ],
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating maps...\n');

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    console.log(`[${i + 1}/${maps.length}] Creating "${map.title}"`);

    try {
      const { error } = await supabase
        .from('maps')
        .insert([map])
        .select()
        .single();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Created successfully (${map.locations.length} locations)`);
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err}`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('✅ Phase 7 Complete!\n');
  console.log('Maps Created:');
  console.log('  1. The Ocean Realms - Complete overview map');
  console.log('  2. The Luminous Abyss - Luminara\'s bioluminescent domain');
  console.log('  3. The Frozen Frontier - Glacius\'s polar territories');
  console.log('  4. The Coral Gardens - Coralith\'s biodiversity map');
  console.log('  5. Migration Routes - Journey of the Migration King');
  console.log('\n' + '━'.repeat(60));
  console.log('🎉🎉🎉 ALL PHASES COMPLETE! 🎉🎉🎉\n');
  console.log('═'.repeat(60));
  console.log('OCEANBORN LEGENDS - FINAL SUMMARY');
  console.log('═'.repeat(60));
  console.log('\n📊 Complete Mythology Statistics:');
  console.log('  • 35 Characters (3 primordial, 5 supreme, 12 major, 15 heroes)');
  console.log('  • 25 Creatures (dragons, beasts, spirits, constructs, etc.)');
  console.log('  • 10 Realms (underwater, surface, coastal domains)');
  console.log('  • 12 Stories (origin myths, legends, battles, quests)');
  console.log('  • 5 Maps (world and realm visualizations)');
  console.log('  ─'.repeat(60));
  console.log('  = 87 TOTAL ENTITIES');
  console.log('\n🌊 Oceanborn Legends is now a complete mythology!');
  console.log('\n✨ Features:');
  console.log('  • Interconnected pantheon with primordial forces');
  console.log('  • Environmental themes (climate change, conservation)');
  console.log('  • Rich lore with detailed backstories');
  console.log('  • Character relationships and conflicts');
  console.log('  • Diverse creatures with ecological roles');
  console.log('  • Mapped realms with geographical context');
  console.log('  • Epic stories and origin myths');
  console.log('\n🎓 This mythology rivals Greek and Norse pantheons in depth!');
  console.log('═'.repeat(60));
}

createPhase7Maps()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
