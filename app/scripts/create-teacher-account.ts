/**
 * Create a teacher account for testing the teacher dashboard
 * 
 * This script:
 * 1. Creates a Supabase Auth user with teacher role
 * 2. Creates a profile with role='teacher'
 * 3. Creates a classroom with invite code
 * 
 * Usage: npx tsx scripts/create-teacher-account.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTeacherAccount() {
  console.log('🎓 Creating teacher account...\n');

  const teacherEmail = 'teacher@mythology.local';
  const teacherPassword = 'teacher123';
  const teacherName = 'Mr. Eastyn Shefler';
  const classroomName = 'Creative Writing 2025';
  const inviteCode = 'MYTHOLOGY2025';

  try {
    // Step 1: Create auth user
    console.log('1️⃣ Creating Supabase Auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: teacherEmail,
      password: teacherPassword,
      email_confirm: true,
      user_metadata: {
        display_name: teacherName,
        role: 'teacher'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Teacher user already exists, continuing...');
        
        // Get existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users.find(u => u.email === teacherEmail);
        
        if (!existingUser) {
          throw new Error('Could not find existing teacher user');
        }

        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single();

        if (profile) {
          console.log('✅ Teacher profile already exists');
          console.log(`👤 Teacher ID: ${profile.id}`);
          
          // Check for classroom
          const { data: classroom } = await supabase
            .from('classrooms')
            .select('*')
            .eq('teacher_id', profile.id)
            .single();

          if (classroom) {
            console.log('✅ Classroom already exists\n');
            printLoginInfo(teacherEmail, teacherPassword, classroom.invite_code);
            return;
          } else {
            // Create classroom for existing teacher
            await createClassroom(profile.id, classroomName, inviteCode);
            printLoginInfo(teacherEmail, teacherPassword, inviteCode);
            return;
          }
        } else {
          // Create profile for existing auth user
          await createProfile(existingUser.id, teacherName);
          await createClassroom(existingUser.id, classroomName, inviteCode);
          printLoginInfo(teacherEmail, teacherPassword, inviteCode);
          return;
        }
      } else {
        throw authError;
      }
    }

    const userId = authData.user.id;
    console.log(`✅ Auth user created: ${userId}`);

    // Step 2: Create profile
    await createProfile(userId, teacherName);

    // Step 3: Create classroom
    await createClassroom(userId, classroomName, inviteCode);

    // Done!
    console.log('\n🎉 Teacher account created successfully!\n');
    printLoginInfo(teacherEmail, teacherPassword, inviteCode);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function createProfile(userId: string, displayName: string) {
  console.log('\n2️⃣ Creating teacher profile...');
  
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      role: 'teacher',
      display_name: displayName,
      school_name: 'Mythology Middle School',
      grade_level: '6-8',
      points: 0,
      level: 1,
      preferred_theme: 'cyberpunk_neon'
    });

  if (profileError) throw profileError;
  console.log('✅ Profile created with role=teacher');
}

async function createClassroom(teacherId: string, name: string, inviteCode: string) {
  console.log('\n3️⃣ Creating classroom...');
  
  const { data: classroom, error: classroomError } = await supabase
    .from('classrooms')
    .insert({
      name: name,
      teacher_id: teacherId,
      invite_code: inviteCode,
      school_year: '2025-2026'
    })
    .select()
    .single();

  if (classroomError) {
    if (classroomError.message.includes('duplicate key')) {
      console.log('⚠️  Classroom with this invite code already exists');
      return;
    }
    throw classroomError;
  }

  console.log(`✅ Classroom created: "${name}"`);
  console.log(`📝 Invite Code: ${inviteCode}`);
}

function printLoginInfo(email: string, password: string, inviteCode: string) {
  console.log('\n' + '='.repeat(60));
  console.log('🎓 TEACHER ACCOUNT LOGIN INFO');
  console.log('='.repeat(60));
  console.log(`\n📧 Email:    ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`\n🏫 Classroom Invite Code: ${inviteCode}`);
  console.log('\n📍 Login at: http://localhost:3000/login');
  console.log('\n👉 After login, you\'ll be redirected to: /teacher/dashboard');
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 TIP: Have students sign up with invite code "MYTHOLOGY2025"');
  console.log('    to join your classroom!\n');
}

// Run the script
createTeacherAccount();
