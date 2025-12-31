/**
 * Reset Teacher Password Script
 * Resets the password for scosom@gmail.com teacher account
 * 
 * Usage: npx tsx scripts/reset-teacher-password.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetTeacherPassword() {
  const email = 'scosom@gmail.com';
  const newPassword = 'Teacher2025!'; // Change this to whatever you want
  
  console.log('🔍 Looking for teacher account:', email);
  
  // Check if user exists
  const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message);
    return;
  }
  
  const user = authUsers.users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ Teacher account not found. Creating new account...');
    
    // Create teacher account
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true,
      user_metadata: {
        display_name: 'Mr. Scosovic',
        role: 'teacher'
      }
    });
    
    if (createError) {
      console.error('❌ Error creating teacher account:', createError.message);
      return;
    }
    
    console.log('✅ Teacher account created!');
    console.log('👤 User ID:', newUser.user.id);
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email,
        display_name: 'Mr. Scosovic',
        role: 'teacher',
        school_name: 'Test School',
        grade_level: '6-8'
      });
    
    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      return;
    }
    
    console.log('✅ Teacher profile created!');
    
    // Create a classroom
    const { data: classroom, error: classroomError } = await supabase
      .from('classrooms')
      .insert({
        name: 'Mythology Class 2025',
        teacher_id: newUser.user.id,
        invite_code: 'MYTH2025',
        school_year: '2025-2026'
      })
      .select()
      .single();
    
    if (classroomError) {
      console.error('❌ Error creating classroom:', classroomError.message);
    } else {
      console.log('✅ Classroom created!');
      console.log('🎓 Classroom ID:', classroom.id);
      console.log('🔑 Invite Code: MYTH2025');
    }
    
  } else {
    console.log('✅ Teacher account found!');
    console.log('👤 User ID:', user.id);
    
    // Reset password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('❌ Error updating password:', updateError.message);
      return;
    }
    
    console.log('✅ Password reset successfully!');
  }
  
  console.log('\n📝 Login Credentials:');
  console.log('   Email:', email);
  console.log('   Password:', newPassword);
  console.log('\n🌐 Login at: http://localhost:3000/login');
}

resetTeacherPassword()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
