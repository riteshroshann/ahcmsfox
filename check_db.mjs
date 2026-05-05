import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const { data: rooms, error: err } = await supabase.from('room').select('room_id');
  console.log("Rooms count:", rooms ? rooms.length : 0);
  if (err) console.error("Error:", err.message);

  const { data: students, error: err2 } = await supabase.from('student_profile').select('student_id');
  console.log("Students count:", students ? students.length : 0);
  if (err2) console.error("Error:", err2.message);
}

run();
