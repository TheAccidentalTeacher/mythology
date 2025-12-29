import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const testStudents = [
  { email: 'frost@test.local', password: 'frost123', username: 'frostuser' },
  { email: 'sun@test.local', password: 'sun123', username: 'sunuser' },
  { email: 'shadow@test.local', password: 'shadow123', username: 'shadowuser' },
];

const mythologies = [
  {
    name: 'Frostheim Chronicles',
    description: 'Ice giants and frost wolves in eternal winter.',
    geography: 'tundra', genre: 'original', timeframe: 'ancient',
    characters: [
      { name: 'Ymir the Frozen', character_type: 'god', domain: 'Ice', powers: ['Blizzard', 'Freeze'] },
      { name: 'Skadi Frostbane', character_type: 'hero', domain: 'Hunting', powers: ['Ice arrows'] },
    ],
    creatures: [
      { name: 'Frost Wolf', creature_type: 'beast', size_category: 'large', danger_level: 'high' },
    ]
  },
  {
    name: 'Sunfire Empire', 
    description: 'Blazing phoenixes and sun gods in the desert.',
    geography: 'desert', genre: 'original', timeframe: 'ancient',
    characters: [
      { name: 'Ra-Keth', character_type: 'god', domain: 'Sun', powers: ['Solar flare', 'Light'] },
      { name: 'Ember Knight', character_type: 'hero', domain: 'Fire', powers: ['Flame sword'] },
    ],
    creatures: [
      { name: 'Sand Serpent', creature_type: 'dragon', size_category: 'huge', danger_level: 'extreme' },
    ]
  },
  {
    name: 'Shadowveil Legends',
    description: 'Shadow spirits and moon goddesses in dark forests.',
    geography: 'forest', genre: 'original', timeframe: 'ancient', 
    characters: [
      { name: 'Nyx Umbra', character_type: 'god', domain: 'Shadows', powers: ['Invisibility', 'Dreams'] },
      { name: 'Kira Moonshadow', character_type: 'demigod', domain: 'Balance', powers: ['Shadow step'] },
    ],
    creatures: [
      { name: 'Phantom Stalker', creature_type: 'spirit', size_category: 'medium', danger_level: 'moderate' },
    ]
  }
];

async function main() {
  console.log('🚀 Creating crossover test data...\n');

  // Get classroom
  const { data: classroom } = await supabase.from('classrooms').select('id').limit(1).single();
  if (!classroom) { console.log('❌ No classroom found'); return; }
  console.log('✅ Found classroom:', classroom.id);

  for (let i = 0; i < testStudents.length; i++) {
    const student = testStudents[i];
    const myth = mythologies[i];
    
    console.log(`\n👤 Creating ${student.username}...`);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: student.email,
      password: student.password,
      email_confirm: true
    });
    
    let userId: string | undefined;
    
    if (authError) {
      if (authError.message.includes('already been registered')) {
        // Get existing user by email
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users?.find(u => u.email === student.email);
        userId = existingUser?.id;
        console.log('  ℹ️ User exists, using:', userId);
      } else {
        console.log('  ❌ Auth error:', authError.message);
        continue;
      }
    } else {
      userId = authData?.user?.id;
    }
    
    if (!userId) { console.log('  ❌ No user ID'); continue; }
    
    // Create/update profile
    await supabase.from('profiles').upsert({
      id: userId,
      username: student.username,
      role: 'student',
      classroom_id: classroom.id,
      points: 0, level: 1
    });
    console.log('  ✅ Profile ready');

    // Create mythology
    const { data: newMyth, error: mythErr } = await supabase.from('mythologies').insert({
      created_by: userId,
      classroom_id: classroom.id,
      name: myth.name,
      description: myth.description,
      geography_type: myth.geography,
      genre: myth.genre,
      timeframe: myth.timeframe,
      visibility: 'public'
    }).select().single();

    if (mythErr) {
      if (mythErr.message.includes('duplicate')) {
        console.log('  ⏭️ Mythology already exists');
      } else {
        console.log('  ❌ Mythology error:', mythErr.message);
      }
      continue;
    }
    console.log('  ✅ Created:', myth.name);

    // Add characters
    for (const char of myth.characters) {
      await supabase.from('characters').insert({ mythology_id: newMyth.id, ...char });
      console.log('    👤', char.name);
    }

    // Add creatures  
    for (const creature of myth.creatures) {
      await supabase.from('creatures').insert({ mythology_id: newMyth.id, ...creature });
      console.log('    🐉', creature.name);
    }
  }

  console.log('\n\n✅ DONE! Test accounts:');
  console.log('   frost@test.local / frost123 → Frostheim Chronicles');
  console.log('   sun@test.local / sun123 → Sunfire Empire');  
  console.log('   shadow@test.local / shadow123 → Shadowveil Legends');
  console.log('\n🌐 Now go to Crossover Hub to see them!');
}

main();
