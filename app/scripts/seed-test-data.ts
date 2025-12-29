/**
 * Seed Test Data
 * 
 * Instantly populate the database with sample mythologies, characters, and creatures
 * for testing without manually filling out forms.
 * 
 * Run with: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Sample mythologies based on EXAMPLE_MYTHOLOGIES.md
const sampleMythologies = [
  {
    username: 'eastynsh',
    mythology: {
      name: 'Norse-Tech Fusion',
      description: 'A world where ancient Norse gods have merged with advanced technology, creating cyber-Vikings and digital Valkyries who battle for control of the Nine Realms through virtual reality.',
      timeframe: 'future',
      genre: 'cyberpunk',
      geography_type: 'urban',
      setting_description: 'Neon-lit cities built atop ancient Nordic ruins, where holographic ravens carry messages between worlds',
      cultural_inspiration: 'Norse mythology meets cyberpunk aesthetics',
      visibility: 'public',
    },
    characters: [
      {
        name: 'Odin.exe',
        character_type: 'god',
        archetype: 'wise_elder',
        domain: 'Knowledge, Code, Digital Wisdom',
        description: 'The All-Father has uploaded his consciousness into the mainframe. One eye sees the physical realm, the other sees through every connected device.',
        origin_story: 'When the old world fell to technology, Odin chose to evolve rather than fade. He sacrificed his physical form to become part of the network itself.',
        personality: 'Calculating yet wise, speaks in binary and ancient runes simultaneously',
        powers_abilities: 'Can manipulate any connected device, sees all network traffic, controls digital ravens (data packets)',
        weaknesses: 'Vulnerable to complete system shutdowns, can be trapped in isolated networks',
      },
      {
        name: 'Thor.v2',
        character_type: 'god',
        archetype: 'warrior',
        domain: 'Thunder, Electromagnetic Pulses, Storm',
        description: 'A cybernetically enhanced thunder god who wields Mjolnir 2.0 - a hammer that generates EMP blasts.',
        origin_story: 'Thor embraced augmentation to protect the realms from digital threats. His hammer was reforged with quantum processors.',
        personality: 'Bold, impulsive, loves a good fight whether physical or cyber',
        powers_abilities: 'EMP generation, superhuman strength from cybernetic enhancements, can cause blackouts',
        weaknesses: 'Overconfident, cybernetics can be hacked, needs regular system updates',
      },
    ],
    creatures: [
      {
        name: 'Glitch Wolf',
        creature_type: 'beast',
        alignment: 'neutral',
        intelligence_level: 'sentient',
        size_category: 'large',
        danger_level: 'dangerous',
        description: 'Digital wolves that hunt in packs through cyberspace, appearing as visual glitches before materializing.',
        habitat: 'Dark web forests, corrupted data streams',
        abilities: 'Phase through firewalls, corrupt data with their bite, travel at network speeds',
        weaknesses: 'Antivirus software, clean code environments, light-based attacks',
      },
    ],
  },
  {
    username: 'eastynsh',
    mythology: {
      name: 'Oceanborn Legends',
      description: 'Deep beneath the waves lies an ancient civilization of sea deities and their monstrous guardians, locked in eternal conflict over control of the ocean depths.',
      timeframe: 'ancient',
      genre: 'fantasy',
      geography_type: 'ocean',
      setting_description: 'Bioluminescent underwater cities, massive coral palaces, and dark trenches where ancient evils sleep',
      cultural_inspiration: 'Greek/Pacific Island mythologies mixed with deep sea biology',
      visibility: 'public',
    },
    characters: [
      {
        name: 'Thalassia',
        character_type: 'god',
        archetype: 'nature_spirit',
        domain: 'Oceans, Tides, Marine Life',
        description: 'Queen of the deep ocean, she can command all sea creatures and control the tides with her emotions.',
        origin_story: 'Born from the first wave to touch land, she has watched civilizations rise and fall from beneath the surface.',
        personality: 'Calm yet unpredictable like the sea itself, protective of marine life',
        powers_abilities: 'Water manipulation, can breathe life into water, commands all sea creatures, creates whirlpools',
        weaknesses: 'Loses power when away from large bodies of water, can be contained in salt circles',
      },
    ],
    creatures: [
      {
        name: 'Abyssal Leviathan',
        creature_type: 'dragon',
        alignment: 'evil',
        intelligence_level: 'highly_intelligent',
        size_category: 'gargantuan',
        danger_level: 'catastrophic',
        description: 'A massive serpentine creature from the deepest trenches, capable of swallowing ships whole. Its scales are harder than steel.',
        habitat: 'The Midnight Trench, 20,000 feet below the surface',
        abilities: 'Creates tsunamis with its tail, can crush submarines, breathes pressurized water jets that cut through metal',
        weaknesses: 'Cannot survive in shallow water, attracted to sonar pings (can be lured), vulnerable underbelly',
      },
    ],
  },
];

async function seedTestData() {
  console.log('🌱 Starting test data seed...\n');

  let totalMythologies = 0;
  let totalCharacters = 0;
  let totalCreatures = 0;

  for (const sample of sampleMythologies) {
    // Get user ID for this username
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.users.find(u => u.email === `${sample.username}@student.local`);
    
    if (!user) {
      console.log(`⚠️  User ${sample.username} not found, skipping...`);
      continue;
    }

    // Get user's classroom
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('classroom_id')
      .eq('id', user.id)
      .single();

    // Create mythology
    const { data: mythology, error: mythError } = await supabaseAdmin
      .from('mythologies')
      .insert([{
        ...sample.mythology,
        created_by: user.id,
        classroom_id: profile?.classroom_id,
      }])
      .select()
      .single();

    if (mythError) {
      console.error(`❌ Failed to create mythology for ${sample.username}:`, mythError.message);
      continue;
    }

    console.log(`✅ Created mythology: "${mythology.name}"`);
    totalMythologies++;

    // Create characters
    for (const char of sample.characters) {
      const { error: charError } = await supabaseAdmin
        .from('characters')
        .insert([{
          ...char,
          mythology_id: mythology.id,
          created_by: user.id,
          visibility: 'public',
        }]);

      if (charError) {
        console.error(`  ❌ Failed to create character ${char.name}:`, charError.message);
      } else {
        console.log(`  ✅ Created character: ${char.name}`);
        totalCharacters++;
      }
    }

    // Create creatures
    for (const creature of sample.creatures) {
      const { error: creatureError } = await supabaseAdmin
        .from('creatures')
        .insert([{
          ...creature,
          mythology_id: mythology.id,
          created_by: user.id,
          visibility: 'public',
        }]);

      if (creatureError) {
        console.error(`  ❌ Failed to create creature ${creature.name}:`, creatureError.message);
      } else {
        console.log(`  ✅ Created creature: ${creature.name}`);
        totalCreatures++;
      }
    }

    // Award points for creating content
    await supabaseAdmin
      .from('profiles')
      .update({ points: 200 }) // 50 for mythology + 50 per character/creature
      .eq('id', user.id);

    console.log('');
  }

  console.log('='.repeat(50));
  console.log('🎉 Seed complete!');
  console.log(`✅ Mythologies: ${totalMythologies}`);
  console.log(`✅ Characters: ${totalCharacters}`);
  console.log(`✅ Creatures: ${totalCreatures}`);
  console.log('='.repeat(50));
  console.log('\n🔗 Now visit http://localhost:3000/student/dashboard');
  console.log('   Login as: eastynsh@student.local / eastynsh\n');
}

seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
