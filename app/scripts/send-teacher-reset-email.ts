/**
 * Send Password Reset Email to Teacher
 * 
 * Usage: npx tsx scripts/send-teacher-reset-email.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sendResetEmail() {
  const email = 'scosom@gmail.com';
  
  console.log('📧 Sending password reset email to:', email);
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/login',
  });
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log('✅ Password reset email sent!');
  console.log('📬 Check your email at:', email);
  console.log('📝 Click the link in the email to set a new password');
}

sendResetEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
