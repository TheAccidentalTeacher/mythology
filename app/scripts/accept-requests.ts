import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Accept all pending requests
  const { data, error } = await supabase
    .from('crossover_requests')
    .update({ status: 'accepted' })
    .eq('status', 'pending')
    .select();

  console.log('Accepted', data?.length || 0, 'requests');
  if (error) console.log('Error:', error.message);

  // Create alliances for each accepted request
  for (const req of data || []) {
    await supabase.from('mythology_alliances').upsert({
      mythology_1_id: req.requester_mythology_id,
      mythology_2_id: req.target_mythology_id,
      relationship_type: 'alliance'
    });
    console.log('Created alliance');
  }

  console.log('\nDone! Refresh the page and click the Alliances tab.');
}

main();
