/**
 * Seed Crossover Test Mythologies
 * 
 * Creates mythologies for existing student accounts to test crossover features.
 * Does NOT delete any existing data - only adds new mythologies.
 * 
 * Run with: npx tsx scripts/seed-crossover-mythologies.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLASSROOM_ID = 'f84c3dc5-3ac2-4a63-a18b-c7c93b5b19c1'; // Scott Somers's Class

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Test data for 4 different students
const crossoverTestData = [
  {
    studentEmail: 'student1@student.local',
    mythology: {
      name: 'Frostborn Saga',
      description: 'In the frozen north, ancient frost giants and ice spirits wage eternal war against the flame-keepers who guard the last warmth in the world.',
      timeframe: 'ancient',
      genre: 'fantasy',
      geography_type: 'mountain',
      setting_description: 'Endless glaciers, frozen fortresses, and aurora-lit skies where spirits dance',
      cultural_inspiration: 'Norse mythology with arctic influences',
      visibility: 'public',
    },
    characters: [
      {
        name: 'Grimfrost the Eternal',
        character_type: 'god',
        archetype: 'villain',
        domain: 'Ice, Winter, Death',
        description: 'The ancient king of frost giants, whose breath can freeze entire kingdoms.',
        origin_story: 'Born when the first snowflake fell upon primordial chaos, Grimfrost is winter incarnate.',
        personality: 'Cold, calculating, patient as a glacier',
        powers_abilities: 'Creates blizzards, freezes anything with touch, commands ice elementals, immortal',
        weaknesses: 'Fire magic, the warmth of true love, summer solstice',
      },
      {
        name: 'Emberheart',
        character_type: 'hero',
        archetype: 'protector',
        domain: 'Fire, Hope, Protection',
        description: 'The last flame-keeper, carrying the eternal ember that keeps the world from freezing.',
        origin_story: 'Chosen at birth when a phoenix feather landed in her cradle, she is destined to restore warmth.',
        personality: 'Warm, compassionate, fierce when protecting others',
        powers_abilities: 'Fire manipulation, immunity to cold, can reignite hope in the hopeless',
        weaknesses: 'Her flame dims when she doubts herself, vulnerable to despair',
      },
      {
        name: 'Snowfang',
        character_type: 'demigod',
        archetype: 'trickster',
        domain: 'Storms, Deception, Survival',
        description: 'A half-giant shapeshifter who plays both sides of the eternal war.',
        origin_story: 'Child of a frost giant and a human, rejected by both worlds.',
        personality: 'Cunning, unpredictable, secretly yearns for belonging',
        powers_abilities: 'Shapeshifting, storm summoning, enhanced strength, cold resistance',
        weaknesses: 'Cannot fully commit to either side, afraid of true connection',
      },
    ],
    creatures: [
      {
        name: 'Glacier Wurm',
        creature_type: 'dragon',
        alignment: 'evil',
        intelligence_level: 'sentient',
        size_category: 'gargantuan',
        danger_level: 'legendary',
        description: 'A massive ice dragon that burrows through glaciers, leaving frozen tunnels in its wake.',
        habitat: 'Deep within ancient glaciers',
        abilities: 'Ice breath, tunnel through ice, causes avalanches, freezing aura',
        weaknesses: 'Fire attacks, confined spaces, loud sounds that cause cave-ins',
      },
      {
        name: 'Frost Sprite',
        creature_type: 'fey',
        alignment: 'neutral',
        intelligence_level: 'sapient',
        size_category: 'tiny',
        danger_level: 'low',
        description: 'Mischievous ice fairies that create frost patterns on windows.',
        habitat: 'Anywhere cold enough for ice to form',
        abilities: 'Create frost, minor cold magic, can freeze small objects',
        weaknesses: 'Warmth, iron, being ignored',
      },
    ],
  },
  {
    studentEmail: 'student2@student.local',
    mythology: {
      name: 'Stormrider Chronicles',
      description: 'Sky pirates and cloud kingdoms clash above an endless storm that has covered the world for a thousand years.',
      timeframe: 'steampunk',
      genre: 'adventure',
      geography_type: 'sky',
      setting_description: 'Floating islands, airships, and cities built on clouds above eternal lightning',
      cultural_inspiration: 'Steampunk adventure with weather mythology',
      visibility: 'public',
    },
    characters: [
      {
        name: 'Captain Thunderbolt',
        character_type: 'hero',
        archetype: 'rebel',
        domain: 'Lightning, Freedom, Adventure',
        description: 'The most infamous sky pirate, who steals from the cloud aristocracy to help surface dwellers.',
        origin_story: 'Born during the storm\'s first lightning strike, she was marked by thunder from birth.',
        personality: 'Bold, charismatic, never backs down from a challenge',
        powers_abilities: 'Lightning manipulation, storm sense, incredible piloting skills, immune to electricity',
        weaknesses: 'Overconfident, protective of her crew to a fault, grounded without her ship',
      },
      {
        name: 'Lord Cumulus',
        character_type: 'god',
        archetype: 'tyrant',
        domain: 'Clouds, Weather, Order',
        description: 'Self-proclaimed god of the sky kingdoms, he controls the clouds that keep the elite above the storm.',
        origin_story: 'A mortal who discovered how to solidify clouds and declared himself divine.',
        personality: 'Arrogant, controlling, believes in absolute hierarchy',
        powers_abilities: 'Cloud manipulation, weather control, can disperse or solidify vapor',
        weaknesses: 'Not actually immortal, relies on technology, feared rather than loved',
      },
      {
        name: 'Misty',
        character_type: 'spirit',
        archetype: 'guide',
        domain: 'Fog, Secrets, Navigation',
        description: 'A mysterious fog spirit that guides lost ships through dangerous storm banks.',
        origin_story: 'The ghost of the first pilot lost in the eternal storm, now helps others find their way.',
        personality: 'Enigmatic, helpful but cryptic, speaks in riddles',
        powers_abilities: 'Become intangible, see through any fog, know all paths through the storm',
        weaknesses: 'Cannot leave the storm, fades in direct sunlight, bound by ancient rules',
      },
    ],
    creatures: [
      {
        name: 'Storm Kraken',
        creature_type: 'elemental',
        alignment: 'chaotic',
        intelligence_level: 'animal',
        size_category: 'colossal',
        danger_level: 'catastrophic',
        description: 'A living hurricane in the shape of a massive squid, destroyer of airships.',
        habitat: 'The eye of the eternal storm',
        abilities: 'Creates tornadoes with tentacles, lightning attacks, near-indestructible, absorbs storms',
        weaknesses: 'Calm weather magic, can be distracted by electrical bait, slow to turn',
      },
      {
        name: 'Cloud Shark',
        creature_type: 'beast',
        alignment: 'neutral',
        intelligence_level: 'animal',
        size_category: 'large',
        danger_level: 'dangerous',
        description: 'Predatory fish that swim through clouds, hunting small airships.',
        habitat: 'Dense cloud banks',
        abilities: 'Swim through vapor, sharp teeth, pack hunters, can smell fear',
        weaknesses: 'Cannot survive in clear air, attracted to bait, territorial disputes',
      },
    ],
  },
  {
    studentEmail: 'student3@student.local',
    mythology: {
      name: 'Shadowveil Mysteries',
      description: 'Between the world of light and the realm of darkness lies the Shadowveil, where spirits, demons, and brave mortals navigate the twilight.',
      timeframe: 'timeless',
      genre: 'horror',
      geography_type: 'underworld',
      setting_description: 'Eternal dusk, shadow forests, ghost cities, and the border between life and death',
      cultural_inspiration: 'Gothic horror with Shinto spirit mythology',
      visibility: 'public',
    },
    characters: [
      {
        name: 'The Veiled One',
        character_type: 'god',
        archetype: 'mysterious',
        domain: 'Shadows, Secrets, Balance',
        description: 'The keeper of the boundary between worlds, neither good nor evil but essential.',
        origin_story: 'Created when the first shadow was cast, they are the living border between realms.',
        personality: 'Impartial, ancient, speaks in half-truths that are always accurate',
        powers_abilities: 'Control all shadows, know all secrets spoken in darkness, open portals between realms',
        weaknesses: 'Must maintain balance, cannot directly intervene, weakened by absolute light or dark',
      },
      {
        name: 'Kira Nightwalker',
        character_type: 'hero',
        archetype: 'investigator',
        domain: 'Truth, Courage, Ghost-speaking',
        description: 'A mortal detective who can see and communicate with spirits, solving mysteries that span both worlds.',
        origin_story: 'After a near-death experience, she returned with the ability to see beyond the veil.',
        personality: 'Determined, skeptical despite her abilities, protective of both living and dead',
        powers_abilities: 'Spirit sight, can touch ghosts, immune to fear magic, uncovers hidden truths',
        weaknesses: 'Caught between worlds, hunted by demons, her gift takes a physical toll',
      },
      {
        name: 'Grimjaw',
        character_type: 'creature',
        archetype: 'guardian',
        domain: 'Gates, Protection, Judgment',
        description: 'A massive three-headed shadow hound that guards the gates between realms.',
        origin_story: 'Bound to the gates when the realms were first separated, eternally loyal to the Veiled One.',
        personality: 'Fierce, just, has a soft spot for lost souls',
        powers_abilities: 'Judge souls, open/close realm gates, immortal, three heads see past/present/future',
        weaknesses: 'Bound to the gates, can be tricked with riddles, vulnerable to silver',
      },
    ],
    creatures: [
      {
        name: 'Whisper Moth',
        creature_type: 'spirit',
        alignment: 'neutral',
        intelligence_level: 'sentient',
        size_category: 'small',
        danger_level: 'harmless',
        description: 'Ghostly moths that carry messages between the living and the dead.',
        habitat: 'Anywhere spirits dwell',
        abilities: 'Phase through matter, carry spirit messages, guide lost souls',
        weaknesses: 'Strong light, cannot speak directly, fade at dawn',
      },
      {
        name: 'Nightmare Stalker',
        creature_type: 'demon',
        alignment: 'evil',
        intelligence_level: 'sapient',
        size_category: 'medium',
        danger_level: 'extreme',
        description: 'Demons that feed on fear, appearing as the victim\'s worst nightmare.',
        habitat: 'Dark corners, under beds, in closets',
        abilities: 'Shapeshift to fears, feed on terror, cause paralysis, invade dreams',
        weaknesses: 'Courage, facing one\'s fears, laughter, morning light',
      },
    ],
  },
  {
    studentEmail: 'student4@student.local',
    mythology: {
      name: 'Sunfire Empire',
      description: 'In a world where the sun never sets on one hemisphere and never rises on the other, the Sunfire Empire wages eternal war against the Night Kingdom.',
      timeframe: 'ancient',
      genre: 'epic',
      geography_type: 'desert',
      setting_description: 'Blazing golden deserts, solar temples, and the twilight border where armies clash',
      cultural_inspiration: 'Egyptian sun worship with Persian empire elements',
      visibility: 'public',
    },
    characters: [
      {
        name: 'Emperor Solarius',
        character_type: 'god',
        archetype: 'ruler',
        domain: 'Sun, Fire, Justice',
        description: 'The living incarnation of the sun, he has ruled the Sunfire Empire for three thousand years.',
        origin_story: 'A mortal pharaoh who ascended to godhood by walking into the heart of the sun and emerging transformed.',
        personality: 'Regal, just but harsh, believes light is always right',
        powers_abilities: 'Solar fire projection, immortality, flight, radiates truth (lies burn in his presence)',
        weaknesses: 'Cannot enter darkness, grows weary during eclipses, blind to shadows',
      },
      {
        name: 'Princess Dawnbreaker',
        character_type: 'demigod',
        archetype: 'hero',
        domain: 'Dawn, Hope, Healing',
        description: 'Daughter of Solarius, she alone can walk in both light and shadow.',
        origin_story: 'Her mother was a Night Kingdom princess, making her a child of both worlds.',
        personality: 'Compassionate, diplomatic, believes in unity over war',
        powers_abilities: 'Healing light, can survive in darkness, bridge between realms, inspires hope',
        weaknesses: 'Torn between loyalties, neither side fully trusts her, powers weaken at noon and midnight',
      },
      {
        name: 'General Blazeheart',
        character_type: 'hero',
        archetype: 'warrior',
        domain: 'War, Valor, Sacrifice',
        description: 'The empire\'s greatest general, whose armor is forged from solidified sunlight.',
        origin_story: 'A common soldier who saved Solarius during an assassination attempt, elevated to champion.',
        personality: 'Loyal, honorable, secretly questions the endless war',
        powers_abilities: 'Sunlight armor, enhanced strength and speed, inspires troops, tactical genius',
        weaknesses: 'Mortal, armor has limits, growing doubt weakens his faith',
      },
    ],
    creatures: [
      {
        name: 'Phoenix Guardian',
        creature_type: 'elemental',
        alignment: 'good',
        intelligence_level: 'sapient',
        size_category: 'huge',
        danger_level: 'legendary',
        description: 'Immortal fire birds that guard the solar temples and are reborn from their ashes.',
        habitat: 'Solar temples, volcanic peaks, anywhere touched by constant sun',
        abilities: 'Fire immunity, rebirth, healing tears, cleansing flames, flight',
        weaknesses: 'Water in large quantities, cold magic, must rest after rebirth',
      },
      {
        name: 'Sand Serpent',
        creature_type: 'beast',
        alignment: 'neutral',
        intelligence_level: 'animal',
        size_category: 'gargantuan',
        danger_level: 'extreme',
        description: 'Massive snakes that swim through desert sand like water, ambushing caravans.',
        habitat: 'Deep desert dunes',
        abilities: 'Burrow through sand, heat sense, crushing coils, venomous bite',
        weaknesses: 'Cannot survive in rocky terrain, cold temperatures, loud vibrations confuse them',
      },
    ],
  },
];

async function main() {
  console.log('🌐 Seeding Crossover Test Mythologies...\n');
  console.log('This will create mythologies for student1-4 to test crossover features.\n');

  for (const data of crossoverTestData) {
    console.log(`\n📚 Processing: ${data.mythology.name}`);
    console.log(`   Student: ${data.studentEmail}`);

    // Find the student's profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, username')
      .eq('username', data.studentEmail.split('@')[0])
      .single();

    if (profileError || !profile) {
      console.log(`   ❌ Student not found: ${data.studentEmail}`);
      console.log(`   Trying alternate lookup...`);
      
      // Try finding by email pattern in auth.users
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(u => u.email === data.studentEmail);
      
      if (!authUser) {
        console.log(`   ❌ Could not find student account. Skipping.`);
        continue;
      }

      // Get profile by auth user id
      const { data: profileById } = await supabaseAdmin
        .from('profiles')
        .select('id, username')
        .eq('id', authUser.id)
        .single();

      if (!profileById) {
        console.log(`   ❌ Profile not found for auth user. Skipping.`);
        continue;
      }

      Object.assign(profile || {}, profileById);
    }

    const studentId = profile!.id;
    console.log(`   ✅ Found student: ${profile!.username} (${studentId})`);

    // Check if mythology already exists
    const { data: existingMythology } = await supabaseAdmin
      .from('mythologies')
      .select('id, name')
      .eq('student_id', studentId)
      .eq('name', data.mythology.name)
      .single();

    if (existingMythology) {
      console.log(`   ⚠️  Mythology "${data.mythology.name}" already exists. Skipping.`);
      continue;
    }

    // Create mythology
    const { data: mythology, error: mythError } = await supabaseAdmin
      .from('mythologies')
      .insert({
        ...data.mythology,
        student_id: studentId,
        classroom_id: CLASSROOM_ID,
      })
      .select()
      .single();

    if (mythError) {
      console.log(`   ❌ Failed to create mythology: ${mythError.message}`);
      continue;
    }

    console.log(`   ✅ Created mythology: ${mythology.name} (${mythology.id})`);

    // Create characters
    for (const char of data.characters) {
      const { error: charError } = await supabaseAdmin
        .from('characters')
        .insert({
          ...char,
          mythology_id: mythology.id,
        });

      if (charError) {
        console.log(`   ❌ Failed to create character ${char.name}: ${charError.message}`);
      } else {
        console.log(`   ✅ Created character: ${char.name}`);
      }
    }

    // Create creatures
    for (const creature of data.creatures) {
      const { error: creatureError } = await supabaseAdmin
        .from('creatures')
        .insert({
          ...creature,
          mythology_id: mythology.id,
        });

      if (creatureError) {
        console.log(`   ❌ Failed to create creature ${creature.name}: ${creatureError.message}`);
      } else {
        console.log(`   ✅ Created creature: ${creature.name}`);
      }
    }
  }

  console.log('\n\n✨ Crossover test data seeding complete!');
  console.log('\n📋 Test Accounts Created:');
  console.log('   • student1@student.local / student1 → Frostborn Saga');
  console.log('   • student2@student.local / student2 → Stormrider Chronicles');
  console.log('   • student3@student.local / student3 → Shadowveil Mysteries');
  console.log('   • student4@student.local / student4 → Sunfire Empire');
  console.log('\n🌐 How to test crossovers:');
  console.log('   1. Log in as eastynsh (your account with Oceanborn Legends)');
  console.log('   2. Go to Mythology → Crossover Hub');
  console.log('   3. Browse tab: See all 4 new mythologies');
  console.log('   4. Send a battle request to Frostborn Saga');
  console.log('   5. Log in as student1, accept the request');
  console.log('   6. Start a cross-mythology battle!');
}

main().catch(console.error);
