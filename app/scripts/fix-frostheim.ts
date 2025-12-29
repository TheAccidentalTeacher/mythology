import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Get Frostheim mythology with owner
  const { data: frost } = await supabase.from('mythologies').select('id, name, created_by').ilike('name', '%Frost%').single();
  console.log('Frostheim:', frost?.name, frost?.id);

  if (!frost) {
    console.log('No Frostheim found');
    return;
  }

  // Delete old characters and add proper ones
  await supabase.from('characters').delete().eq('mythology_id', frost.id);
  
  const characters = [
    {
      mythology_id: frost.id,
      created_by: frost.created_by,
      name: 'Ymir the Frozen',
      character_type: 'god',
      archetype: 'ruler',
      domain: 'Ice and Winter',
      powers_abilities: 'Blizzard summoning, Ice manipulation, Frost breath, Eternal cold',
      appearance_description: 'A towering figure made of living ice, with eyes like frozen stars',
      personality: 'Cold and calculating, but fair in judgment',
      description: 'Born from the first snowflake to fall on the primordial void, Ymir is winter incarnate.'
    },
    {
      mythology_id: frost.id,
      created_by: frost.created_by,
      name: 'Skadi Frostbane',
      character_type: 'hero',
      archetype: 'hero',
      domain: 'Hunting and Vengeance',
      powers_abilities: 'Ice arrows, Wolf companion, Winter tracking, Frost resistance',
      appearance_description: 'A fierce warrior woman with silver hair and ice-blue eyes',
      personality: 'Bold, independent, and fiercely loyal',
      description: 'Daughter of a frost giant who chose to protect mortals from the eternal winter.'
    },
    {
      mythology_id: frost.id,
      created_by: frost.created_by,
      name: 'Boreas Stormcaller',
      character_type: 'demigod',
      archetype: 'guardian',
      domain: 'North Wind',
      powers_abilities: 'Wind control, Blizzard creation, Flight, Temperature manipulation',
      appearance_description: 'A pale man with flowing white robes and hair that moves like the wind',
      personality: 'Stern but protective, speaks in riddles',
      description: 'Son of Ymir and a wind spirit, guardian of the northern passages.'
    }
  ];

  for (const char of characters) {
    const { error } = await supabase.from('characters').insert(char);
    if (error) console.log('Error:', error.message);
    else console.log('Created:', char.name);
  }

  // Also add a creature
  await supabase.from('creatures').delete().eq('mythology_id', frost.id);
  const { error: creatureErr } = await supabase.from('creatures').insert({
    mythology_id: frost.id,
    created_by: frost.created_by,
    name: 'Frost Wolf Alpha',
    creature_type: 'beast',
    size_category: 'large',
    danger_level: 'high',
    abilities: 'Ice bite, Pack tactics, Blizzard howl, Frost aura',
    habitat: 'Frozen tundra and ice caves',
    description: 'A massive wolf with fur of pure white and eyes that glow ice-blue. Hunts in packs, fiercely territorial.'
  });
  if (creatureErr) console.log('Creature error:', creatureErr.message);
  else console.log('Created: Frost Wolf Alpha');

  console.log('\nDone! Refresh the battle page.');
}

main();
