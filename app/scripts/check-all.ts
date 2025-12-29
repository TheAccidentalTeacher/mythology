import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, display_name, role');

  console.log('All profiles:', profiles);

  if (profiles && profiles.length > 0) {
    const { data: myths } = await supabase
      .from('mythologies')
      .select('id, name, created_by');

    console.log('\nAll mythologies:', myths);
  }
}

check();
