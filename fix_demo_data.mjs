import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  // ─── 1. Get all staff to use for assignment ─────────────────────────────
  const { data: staff } = await supabase.from('staff').select('staff_id, role');
  const staffMap = {};
  for (const s of staff || []) staffMap[s.role] = s.staff_id;

  // ─── 2. Resolve all complaints ──────────────────────────────────────────
  console.log('Fetching complaints...');
  const { data: complaints } = await supabase
    .from('complaint')
    .select('ticket_id, status, assigned_to, category_id, complaint_category(name)')
    .not('status', 'in', '("resolved","closed")');

  console.log(`Found ${complaints?.length || 0} unresolved complaints`);

  const now = new Date().toISOString();
  const roleMap = {
    'Plumbing': 'Plumber',
    'Electricity': 'Electrician',
    'WiFi': 'WiFi_Tech',
    'Carpentry': 'Carpenter',
    'Pest': 'Pest_Control',
    'Cleanliness': 'Supervisor',
    'Structural': 'Supervisor',
    'Other': 'Warden',
  };

  for (const c of complaints || []) {
    const catName = c.complaint_category?.name || 'Other';
    const role = roleMap[catName] || 'Warden';
    const assignee = staffMap[role] || staffMap['Warden'] || Object.values(staffMap)[0];

    // First assign if unassigned
    if (c.status === 'open' || !c.assigned_to) {
      await supabase.from('complaint').update({
        status: 'assigned',
        assigned_to: assignee,
        updated_at: now,
      }).eq('ticket_id', c.ticket_id);
    }

    // Then resolve
    const { error } = await supabase.from('complaint').update({
      status: 'resolved',
      resolved_at: now,
      updated_at: now,
    }).eq('ticket_id', c.ticket_id);

    if (error) console.error(`Error on ${c.ticket_id}:`, error.message);
    else console.log(`✓ Resolved: ${c.ticket_id}`);
  }

  // ─── 3. Free up ~40% of rooms (remove allocations for some students) ────
  console.log('\nFreeing up some rooms...');
  const { data: allocs } = await supabase
    .from('allocation')
    .select('allocation_id, room_id')
    .eq('status', 'active');

  if (!allocs || allocs.length === 0) {
    console.log('No active allocations found.');
    return;
  }

  // Free every 3rd allocation to leave ~33% rooms with vacancies
  const toFree = allocs.filter((_, i) => i % 3 === 0);
  console.log(`Freeing ${toFree.length} of ${allocs.length} allocations...`);

  for (const a of toFree) {
    await supabase.from('allocation').update({
      status: 'expired',
      end_date: now.split('T')[0],
      updated_at: now,
    }).eq('allocation_id', a.allocation_id);
  }

  // ─── 4. Sync room occupancy counts ──────────────────────────────────────
  console.log('Syncing room occupancy...');
  const { data: rooms } = await supabase.from('room').select('room_id');
  for (const room of rooms || []) {
    const { count } = await supabase
      .from('allocation')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', room.room_id)
      .eq('status', 'active');

    const { data: roomData } = await supabase.from('room').select('capacity').eq('room_id', room.room_id).single();
    const occ = count || 0;
    const cap = roomData?.capacity || 1;

    await supabase.from('room').update({
      current_occupancy: occ,
      status: occ === 0 ? 'available' : occ >= cap ? 'full' : 'available',
    }).eq('room_id', room.room_id);
  }

  console.log('\n✅ Done! Complaints resolved, rooms freed up.');
}

main();
