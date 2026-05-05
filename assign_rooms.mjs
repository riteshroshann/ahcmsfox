import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log("Fetching rooms and students...");
  const { data: rooms } = await supabase.from('room').select('*');
  const { data: students } = await supabase.from('student_profile').select('*');

  if (!rooms || !students) return;

  const boys = students.filter(s => s.gender === 'M');
  const girls = students.filter(s => s.gender === 'F');

  const bRooms = rooms.filter(r => r.hostel_code === 'SmB');
  const gRooms = rooms.filter(r => r.hostel_code === 'SmG');

  let bIdx = 0;
  let gIdx = 0;

  console.log("Assigning rooms...");
  const allocations = [];

  // Assign boys
  for (const room of bRooms) {
    for (let i = 0; i < room.capacity; i++) {
      if (bIdx < boys.length) {
        allocations.push({
          student_id: boys[bIdx].student_id,
          room_id: room.room_id,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '2027-05-01'
        });
        bIdx++;
      }
    }
  }

  // Assign girls
  for (const room of gRooms) {
    for (let i = 0; i < room.capacity; i++) {
      if (gIdx < girls.length) {
        allocations.push({
          student_id: girls[gIdx].student_id,
          room_id: room.room_id,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '2027-05-01'
        });
        gIdx++;
      }
    }
  }

  console.log(`Inserting ${allocations.length} allocations...`);
  for (let i = 0; i < allocations.length; i += 20) {
    const batch = allocations.slice(i, i + 20);
    const { error } = await supabase.from('allocation').insert(batch);
    if (error) console.error("Error inserting batch:", error.message);
  }

  // Update room occupancy
  console.log("Updating room occupancy metrics...");
  for (const room of rooms) {
    const occ = allocations.filter(a => a.room_id === room.room_id).length;
    if (occ > 0) {
      await supabase.from('room').update({ 
        current_occupancy: occ,
        status: occ >= room.capacity ? 'full' : 'available'
      }).eq('room_id', room.room_id);
    }
  }

  console.log("Successfully assigned students to rooms!");
}

run();
