import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicateMythologies() {
  console.log('🔍 Finding duplicate mythologies for eastynsh...\n');

  // Get eastynsh's user ID
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('display_name', 'eastynsh');

  if (profileError || !profiles || profiles.length === 0) {
    console.error('❌ Could not find user eastynsh');
    return;
  }

  const userId = profiles[0].id;
  console.log('👤 Found user:', profiles[0].display_name, '(', userId, ')\n');

  // Get all mythologies for this user
  const { data: mythologies, error: mythError } = await supabase
    .from('mythologies')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: true });

  if (mythError) {
    console.error('❌ Error fetching mythologies:', mythError);
    return;
  }

  if (!mythologies || mythologies.length === 0) {
    console.log('ℹ️ No mythologies found');
    return;
  }

  console.log(`📚 Found ${mythologies.length} mythologies:\n`);
  mythologies.forEach((myth, index) => {
    console.log(`${index + 1}. ${myth.name}`);
    console.log(`   ID: ${myth.id}`);
    console.log(`   Created: ${new Date(myth.created_at).toLocaleString()}`);
    console.log(`   Visibility: ${myth.visibility}`);
    console.log('');
  });

  // Group by name to find duplicates
  const groupedByName: { [key: string]: typeof mythologies } = {};
  mythologies.forEach(myth => {
    if (!groupedByName[myth.name]) {
      groupedByName[myth.name] = [];
    }
    groupedByName[myth.name].push(myth);
  });

  console.log('🔍 Analyzing duplicates...\n');
  
  let toDelete: string[] = [];
  
  Object.entries(groupedByName).forEach(([name, myths]) => {
    if (myths.length > 1) {
      console.log(`⚠️ Found ${myths.length} copies of "${name}"`);
      // Keep the first one (oldest), delete the rest
      const toKeep = myths[0];
      const duplicates = myths.slice(1);
      
      console.log(`   ✅ Keeping: ${toKeep.id} (created ${new Date(toKeep.created_at).toLocaleString()})`);
      duplicates.forEach(dup => {
        console.log(`   ❌ Will delete: ${dup.id} (created ${new Date(dup.created_at).toLocaleString()})`);
        toDelete.push(dup.id);
      });
      console.log('');
    }
  });

  if (toDelete.length === 0) {
    console.log('✅ No duplicates found! Database is clean.');
    return;
  }

  console.log(`\n🗑️ About to delete ${toDelete.length} duplicate mythologies:`);
  toDelete.forEach(id => console.log(`   - ${id}`));
  console.log('\nDeleting...\n');

  // Delete the duplicates
  const { error: deleteError } = await supabase
    .from('mythologies')
    .delete()
    .in('id', toDelete);

  if (deleteError) {
    console.error('❌ Error deleting mythologies:', deleteError);
    return;
  }

  console.log(`✅ Successfully deleted ${toDelete.length} duplicate mythologies!`);
  
  // Show what remains
  const { data: remaining } = await supabase
    .from('mythologies')
    .select('name, created_at')
    .eq('created_by', userId)
    .order('name');

  if (remaining) {
    console.log('\n📚 Remaining mythologies:');
    remaining.forEach((myth, index) => {
      console.log(`${index + 1}. ${myth.name}`);
    });
  }
}

cleanupDuplicateMythologies()
  .then(() => {
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
