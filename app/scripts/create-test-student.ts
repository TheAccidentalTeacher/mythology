/**
 * Create ONE student account for testing
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLASSROOM_ID = 'f84c3dc5-3ac2-4a63-a18b-c7c93b5b19c1';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createOne() {
  const username = 'eastynsh';
  const email = `${username}@student.local`;
  const password = username;
  
  console.log(`Creating account for: ${email}`);
  console.log(`Password will be: ${password}`);
  console.log('');
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'student', display_name: username },
  });
  
  if (error) {
    console.log(`❌ Error: ${error.message}`);
    return;
  }
  
  console.log(`✅ Created user: ${data.user.id}`);
  
  // Wait for trigger
  await new Promise(r => setTimeout(r, 1000));
  
  // Update profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ classroom_id: CLASSROOM_ID })
    .eq('id', data.user.id);
  
  if (profileError) {
    console.log(`⚠️ Profile update failed: ${profileError.message}`);
  } else {
    console.log(`✅ Linked to classroom`);
  }
  
  console.log('');
  console.log(`Now login with:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

createOne()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
