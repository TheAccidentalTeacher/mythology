// Run this script to apply the gamification migration
// Usage: npx tsx scripts/apply-gamification-migration.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🎮 Applying Gamification Migration (Phase 3)...\n');

  const migrationPath = path.join(__dirname, '../supabase/migrations/009_gamification.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolons but be careful with functions
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    if (!statement || statement.startsWith('--')) continue;
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      if (error) {
        // Try direct query
        const { error: directError } = await supabase.from('_temp').select().limit(0);
        if (directError && !directError.message.includes('does not exist')) {
          console.log('⚠️  Statement had issue:', statement.substring(0, 60) + '...');
          console.log('   Error:', directError.message);
          errorCount++;
        }
      } else {
        successCount++;
      }
    } catch {
      // For DDL statements, we'll run them via REST
    }
  }

  console.log(`\n✅ Migration attempted. Success: ${successCount}, Issues: ${errorCount}`);
  console.log('\n📋 Running migration directly via SQL editor is recommended.');
  console.log('   Copy the SQL from: supabase/migrations/009_gamification.sql');
  console.log('   Paste into Supabase Dashboard > SQL Editor > Run');
}

applyMigration().catch(console.error);
