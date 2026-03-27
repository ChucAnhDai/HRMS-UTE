import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
  console.log("Checking activity_logs using service role...");
  
  // 1. Check if we can select without joins
  const { data: rawData, error: rawError } = await supabase.from('activity_logs').select('*').limit(5);
  if (rawError) {
     console.error("Error fetching raw activity_logs:", rawError);
  } else {
     console.log("Raw activity_logs count:", rawData?.length);
     console.log("Raw activity_logs:", rawData);
  }

  // 2. Check the join with employees
  const { data: joinData, error: joinError } = await supabase
     .from('activity_logs')
     .select('*, employees(first_name, last_name, avatar)')
     .limit(5);

  if (joinError) {
     console.error("Error fetching activity_logs WITH employees relation:", joinError);
  } else {
     console.log("Joined activity_logs:", joinData);
  }
}

checkLogs();
