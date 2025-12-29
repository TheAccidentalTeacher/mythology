/**
 * Bulk Create Student Accounts
 * 
 * This script creates all 91 student accounts at once using Supabase Admin API
 * Run with: npx tsx scripts/bulk-create-students.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLASSROOM_ID = 'f84c3dc5-3ac2-4a63-a18b-c7c93b5b19c1'; // Scott Somers's Class

// Create admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Student list from STUDENT_ACCOUNTS.md
// Using username as BOTH email and password for simplicity
const students = [
  'kalayabo',
  'kisubo',
  'saynacu',
  'helenade',
  'jackde',
  'normaha',
  'ashtonja',
  'gabrielja',
  'graceki',
  'eastonkv',
  'alaynama',
  'lesliepe',
  'sawyerro',
  'syklersa',
  'oscarwi',
  'riverbe',
  'alvaroch',
  'johnco',
  'joslynndo',
  'caseyfi',
  'adamja',
  'tiannakv',
  'mattdo',
  'milael',
  'nicofa',
  'gracefe',
  'sofife',
  'matuga',
  'deange',
  'danielgo',
  'tristha',
  'noahjo',
  'joskn',
  'connla',
  'luisle',
  'samule',
  'briali',
  'jacoma',
  'wesmar',
  'deremc',
  'connme',
  'jasomi',
  'lukemi',
  'isaina',
  'branor',
  'leviov',
  'ryanpe',
  'aaropi',
  'janapr',
  'aydaqe',
  'zacara',
  'jakere',
  'daviro',
  'etharo',
  'darero',
  'alexru',
  'dominsa',
  'mattsh',
  'huntsi',
  'kevisi',
  'natasm',
  'lucast',
  'oliyta',
  'ethava',
  'josvin',
  'nickwa',
  'ethawa',
  'justwe',
  'ryanwe',
  'emmawi',
  'caraxt',
  'alayal',
  'mariay',
  'lilaad',
  'leilae',
  'sofiae',
  'annaan',
  'miabal',
  'aivibe',
  'ariabo',
  'maddca',
  'lillca',
  'sophca',
  'aubrda',
  'gracdi',
  'nataed',
  'sofifa',
  'emilga',
  'liligo',
  'ashagr',
  'emmagr',
  'abbiha',
  'isabha',
  'emilhi',
  'gracjo',
  'ayshjo',
  'hannji',
  'olivka',
  'avakl',
  'cammle',
  'ellema',
  'olivme',
  'bellme',
  'aliyme',
  'bellmi',
  'ellinc',
  'emerno',
  'emmapa',
  'liliro',
  'liviro',
  'kaylsi',
  'hayast',
  'bellwa',
  'bellwh',
  'kaylwi'
];

// Main function
async function bulkCreateStudents() {
  console.log(`🚀 Starting bulk creation of ${students.length} students...`);
  console.log(`📚 Classroom ID: ${CLASSROOM_ID}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ username: string; error: string }> = [];

  for (const username of students) {
    const email = `${username}@student.local`;
    
    try {
      // Create auth user with admin API (bypasses email confirmation)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: username, // Using username as password
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          role: 'student',
          display_name: username,
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user returned from createUser');
      }

      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update profile with classroom_id
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ classroom_id: CLASSROOM_ID })
        .eq('id', authData.user.id);

      if (profileError) {
        console.warn(`⚠️  Profile update warning for ${username}:`, profileError.message);
      }

      successCount++;
      console.log(`✅ ${successCount}/${students.length} - Created: ${username} (${email})`);
      
    } catch (error: unknown) {
      errorCount++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ username, error: errorMsg });
      console.error(`❌ Failed: ${username} - ${errorMsg}`);
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`✨ Bulk creation complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(50));

  if (errors.length > 0) {
    console.log('');
    console.log('Errors:');
    errors.forEach(({ username, error }) => {
      console.log(`  - ${username}: ${error}`);
    });
  }
}

// Run the script
bulkCreateStudents()
  .then(() => {
    console.log('\n🎉 Script finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
