/**
 * Force Update Teacher Password
 * Uses admin API to directly update password
 * 
 * Usage: npx tsx scripts/force-update-teacher-password.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hiduifpikgdsotewhljk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZHVpZnBpa2dkc290ZXdobGprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3MzM0OCwiZXhwIjoyMDgxNzQ5MzQ4fQ.4okAc7Px3Hto1vr_AIeM1FN8y6iyuUBVG4B7kDSvQCU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function forceUpdatePassword() {
  const email = 'scosom@gmail.com';
  const newPassword = 'teacher123'; // Simple password for testing
  
  console.log('🔍 Looking for user:', email);
  
  // Get user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error('❌ User not found');
    return;
  }
  
  console.log('✅ User found!');
  console.log('👤 User ID:', user.id);
  console.log('📧 Email:', user.email);
  
  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );
  
  if (updateError) {
    console.error('❌ Error updating password:', updateError);
    return;
  }
  
  console.log('✅ Password updated successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('   Email: scosom@gmail.com');
  console.log('   Password: teacher123');
  console.log('\n🌐 Login at: http://localhost:3000/login');
}

forceUpdatePassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
