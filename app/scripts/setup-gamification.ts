// Apply Gamification Schema
// Usage: npx tsx scripts/setup-gamification.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function setupGamification() {
  console.log('🎮 Setting up Gamification System (Phase 3)...\n');

  // Step 1: Create badges table
  console.log('1️⃣ Creating badges table...');
  await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        icon VARCHAR(10) NOT NULL DEFAULT '🏅',
        category VARCHAR(50) NOT NULL DEFAULT 'general',
        points_reward INTEGER NOT NULL DEFAULT 0,
        requirement_type VARCHAR(50) NOT NULL,
        requirement_target INTEGER DEFAULT 1,
        requirement_entity VARCHAR(50),
        rarity VARCHAR(20) NOT NULL DEFAULT 'common',
        is_hidden BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  // Step 2: Create user_badges table
  console.log('2️⃣ Creating user_badges table...');
  await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS user_badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        earned_at TIMESTAMPTZ DEFAULT NOW(),
        is_displayed BOOLEAN DEFAULT TRUE,
        UNIQUE(user_id, badge_id)
      );
    `
  });

  // Step 3: Create points_log table
  console.log('3️⃣ Creating points_log table...');
  await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS points_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        description TEXT,
        reference_id UUID,
        reference_type VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  // Step 4: Create user_streaks table
  console.log('4️⃣ Creating user_streaks table...');

  // Step 5: Create daily_challenges table
  console.log('5️⃣ Creating daily_challenges table...');

  // Step 6: Create leaderboard_cache table
  console.log('6️⃣ Creating leaderboard_cache table...');

  console.log('\n⚠️  For full migration, please run the SQL directly in Supabase:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to SQL Editor');
  console.log('   4. Copy contents of: supabase/migrations/009_gamification.sql');
  console.log('   5. Paste and click "Run"');
  
  console.log('\n📋 I will now check if tables were created...');

  // Check what exists
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  console.log('\n✅ Existing tables:', tables?.map((t: { table_name: string }) => t.table_name).join(', ') || 'Could not retrieve');
}

setupGamification().catch(console.error);
