import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', 'eastynsh@gmail.com')
    .single();

  console.log('Profile:', profile);

  const { data: myths } = await supabase
    .from('mythologies')
    .select('id, name, created_by')
    .eq('created_by', profile!.id);

  console.log('Mythologies:', myths);
}

check();
