/**
 * Reset a single student password to their username
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetPassword() {
  const username = 'eastynsh';
  const email = `${username}@student.local`;
  
  console.log(`🔄 Resetting password for ${email}...`);
  
  try {
    // Get user by email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      console.log(`\nTry creating the account first with:`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${username}`);
      return;
    }
    
    console.log(`✅ Found user: ${user.id}`);
    console.log(`   Created: ${user.created_at}`);
    
    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: username }
    );
    
    if (updateError) throw updateError;
    
    console.log(`✅ Password reset to: ${username}`);
    console.log(`\nNow try logging in with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${username}`);
    
  } catch (error: unknown) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

resetPassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
