/* ─────────────────────────────────────────────────────────
   Admin Room Management
   4 tabs:
     Room Grid  |  Add Student  |  Pending  |  All Requests
   ───────────────────────────────────────────────────────── */

import { api } from '../../api.js';
import { toast } from '../../components/toast.js';
import { getHostel, setHostel, onHostelChange } from '../../components/hostelStore.js';

const esc   = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const today = () => new Date().toISOString().split('T')[0];

const HOSTELS = [
  'Senior MBBS boys hostel',
  'Senior MBBS girls hostel',
];

// gender + course → exact hostel + floor
const FLOOR_MAP = {
  'M-MBBS':   { hostel: 'Senior MBBS boys hostel',  floor: 8 },
  'M-B.Tech': { hostel: 'Senior MBBS boys hostel',  floor: 9 },
  'F-MBBS':   { hostel: 'Senior MBBS girls hostel', floor: 7 },
  'F-B.Tech': { hostel: 'Senior MBBS girls hostel', floor: 8 },
};

function eligibleRooms(rooms, gender, course) {
  const key    = gender && course ? `${gender}-${course}` : null;
  const target = key ? FLOOR_MAP[key] : null;
  return rooms
    .filter(r => {
      if (r.current_occupancy >= r.capacity) return false;
      if (!target) {
        // fall back to gender-only hostel filter
        const kw = gender === 'M' ? 'boys' : gender === 'F' ? 'girls' : '';
        return kw ? r.hostel.toLowerCase().includes(kw) : true;
      }
      return r.hostel === target.hostel && r.floor === target.floor;
    })
    .sort((a,b) => a.room_id.localeCompare(b.room_id));
}

function roomOption(r) {
  return `<option value="${r.room_id}">${r.room_id} (${r.current_occupancy}/${r.capacity})</option>`;
}

// ── Entry point ────────────────────────────────────────────
export async function renderAdminRooms(container) {
  async function load() {
    container.innerHTML = `<div class="page-loading">Loading…</div>`;
    try {
      const [rooms, bookReqs, changeReqs, allocs, students] = await Promise.all([
        api.get('/rooms'),
        api.get('/rooms/booking-requests'),
        api.get('/rooms/change-requests'),
        api.get('/rooms/allocations'),
        api.get('/students'),
      ]);
      renderPage(container, { rooms, bookReqs, changeReqs, allocs, students }, load);
    } catch(e) {
      container.innerHTML = `<div class="page-error">Failed to load: ${e.message}</div>`;
    }
  }
  onHostelChange(() => load());
  await load();
}

// ── Main ───────────────────────────────────────────────────
function renderPage(container, data, reloadFn) {
  const { rooms, bookReqs, changeReqs, allocs, students } = data;
  let tab          = 'grid';
  let filterHostel = getHostel();

  // Combine all pending items for badge count
  const pendingCount =
    bookReqs.filter(r => r.status === 'pending').length +
    changeReqs.filter(r => r.status === 'pending').length;

  container.innerHTML = `
    <style>
      /* corridor layout */
      .floor-corridor { display:flex; flex-direction:column; gap:3px; margin-bottom:var(--space-5); }
      .corridor-row { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; }
      .corridor-strip { display:flex; align-items:center; gap:8px; padding:3px 0; }
      .corridor-strip-line { flex:1; height:1px; background:var(--border-subtle); }
      .corridor-strip-label { font-size:9px; letter-spacing:.1em; color:var(--text-tertiary); text-transform:uppercase; }
      /* room cells */
      .room-cell {
        border-radius:8px; padding:10px 4px 8px; display:flex; flex-direction:column;
        align-items:center; justify-content:center; font-size:10px; font-weight:600;
        line-height:1.3; text-align:center; border:1px solid transparent;
        transition:transform .12s, box-shadow .12s; cursor:default;
      }
      .room-cell:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.3); }
      .room-cell.vacant  { background:color-mix(in srgb,var(--accent-green) 10%,transparent); border-color:color-mix(in srgb,var(--accent-green) 25%,transparent); color:var(--accent-green); }
      .room-cell.partial { background:color-mix(in srgb,var(--accent-amber) 10%,transparent); border-color:color-mix(in srgb,var(--accent-amber) 25%,transparent); color:var(--accent-amber); }
      .room-cell.full    { background:color-mix(in srgb,var(--accent-red) 10%,transparent);   border-color:color-mix(in srgb,var(--accent-red) 25%,transparent);   color:var(--accent-red); opacity:.65; }
      .rc-id { font-family:var(--font-mono); font-size:9px; opacity:.7; }
      /* minimal tabs */
      #rm-tabs { display:flex; gap:var(--space-6); border-bottom:1px solid var(--border-subtle); margin-bottom:var(--space-6); }
      #rm-tabs button {
        background:none; border:none; border-bottom:2px solid transparent;
        padding:8px 0; font-size:var(--text-sm); font-weight:500;
        color:var(--text-tertiary); cursor:pointer; transition:color .15s, border-color .15s;
      }
      #rm-tabs button:hover  { color:var(--text-primary); }
      #rm-tabs button.active { color:var(--text-primary); border-bottom-color:var(--text-primary); }
      .pending-badge { background:var(--accent-amber); color:#000; border-radius:999px; font-size:10px; font-weight:700; padding:1px 6px; margin-left:4px; }
      .floor-label { font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin:var(--space-5) 0 var(--space-3); }
      .legend-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
    </style>

    <div id="admin-rooms-page" class="page-enter">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:var(--space-4); margin-bottom:var(--space-5);">
        <div>
          <h2>Room Management</h2>
          <p>Allocate rooms, manage students, handle requests.</p>
        </div>
        <div class="hostel-filter-bar">
          <label class="hostel-filter-label">Hostel</label>
          <select class="hostel-filter-select" id="rm-hostel-filter">
            <option value="">All</option>
            ${HOSTELS.map(h => `<option value="${h}" ${h === filterHostel ? 'selected' : ''}>${h}</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="rm-tabs">
        <button data-tab="grid"    class="active">Room Grid</button>
        <button data-tab="student">Add Student</button>
        <button data-tab="pending">Pending${pendingCount > 0 ? `<span class="pending-badge">${pendingCount}</span>` : ''}</button>
        <button data-tab="history">All Requests</button>
      </div>

      <div id="rm-panel-grid"></div>
      <div id="rm-panel-student" style="display:none;"></div>
      <div id="rm-panel-pending" style="display:none;"></div>
      <div id="rm-panel-history" style="display:none;"></div>
    </div>
  `;

  // ── Hostel filter ─────────────────────────────────────────
  document.getElementById('rm-hostel-filter').addEventListener('change', e => {
    filterHostel = e.target.value;
    setHostel(filterHostel);
    renderCurrent();
  });

  // ── Tab switching ─────────────────────────────────────────
  document.querySelectorAll('#rm-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      tab = btn.dataset.tab;
      document.querySelectorAll('#rm-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      ['grid','student','pending','history'].forEach(id => {
        document.getElementById(`rm-panel-${id}`).style.display = id === tab ? '' : 'none';
      });
      renderCurrent();
    });
  });

  function renderCurrent() {
    if (tab === 'grid')    renderGrid();
    if (tab === 'student') renderAddStudent();
    if (tab === 'pending') renderPending();
    if (tab === 'history') renderHistory();
  }

  // ══════════════════════════════════════════════
  // TAB 1 — Room Grid
  // ══════════════════════════════════════════════
  function renderGrid() {
    const filtered = filterHostel ? rooms.filter(r => r.hostel === filterHostel) : rooms;
    const byHostel = {};
    filtered.forEach(r => {
      (byHostel[r.hostel] = byHostel[r.hostel] || {})[r.floor] =
        (byHostel[r.hostel][r.floor] || []).concat(r);
    });

    const vac = filtered.filter(r => r.current_occupancy === 0).length;
    const par = filtered.filter(r => r.current_occupancy > 0 && r.current_occupancy < r.capacity).length;
    const ful = filtered.filter(r => r.current_occupancy >= r.capacity).length;

    const cell = r => {
      const pct   = r.capacity > 0 ? r.current_occupancy / r.capacity : 0;
      const state = pct === 0 ? 'vacant' : pct < 1 ? 'partial' : 'full';
      return `<div class="room-cell ${state}" title="${r.room_id} — ${r.type} ${r.current_occupancy}/${r.capacity}">
        <div class="rc-id">${r.room_id}</div>
        <div style="font-size:9px;opacity:.5;">${r.current_occupancy}/${r.capacity}</div>
      </div>`;
    };

    let html = `<div style="display:flex;gap:var(--space-5);margin-bottom:var(--space-5);">
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-green);"></span>Vacant (${vac})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-amber);"></span>Partial (${par})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-red);"></span>Full (${ful})</span>
    </div>`;

    for (const hostel of Object.keys(byHostel).sort()) {
      html += `<div style="font-size:var(--text-sm);font-weight:600;margin:var(--space-6) 0 var(--space-3);padding-bottom:var(--space-2);border-bottom:1px solid var(--border-subtle);">${hostel}</div>`;
      for (const floor of Object.keys(byHostel[hostel]).sort((a,b) => +a - +b)) {
        const fr = byHostel[hostel][floor].sort((a,b) => a.room_id.localeCompare(b.room_id));
        const a5 = fr.slice(0, 5), b5 = fr.slice(5, 10);
        html += `<div class="floor-label">Floor ${floor}</div>
          <div class="floor-corridor">
            <div class="corridor-row">${a5.map(cell).join('')}</div>
            <div class="corridor-strip"><div class="corridor-strip-line"></div><div class="corridor-strip-label">corridor</div><div class="corridor-strip-line"></div></div>
            <div class="corridor-row">${b5.map(cell).join('')}</div>
          </div>`;
      }
    }
    if (!filtered.length) html += `<p style="padding:var(--space-8);text-align:center;color:var(--text-tertiary);">No rooms.</p>`;
    document.getElementById('rm-panel-grid').innerHTML = html;
  }

  // ══════════════════════════════════════════════
  // TAB 2 — Add Student + Direct Allocate
  // ══════════════════════════════════════════════
  function renderAddStudent() {
    const el = document.getElementById('rm-panel-student');
    el.innerHTML = `
      <div style="display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,1fr); gap:var(--space-8); align-items:start;">

        <!-- LEFT: Register form -->
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-5);">Register Student</div>
          <div id="add-msg"></div>
          <form id="add-form" autocomplete="off">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
              <div class="form-group">
                <label class="form-label">Roll No *</label>
                <input class="form-input" name="roll_no" placeholder="DL.AI.U4AID24200" required />
              </div>
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input class="form-input" name="name" placeholder="Priya Mehta" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input class="form-input" type="email" name="email" placeholder="priya@ahcms.edu.in" required />
              </div>
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select class="form-select" name="gender" id="add-gender" required>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Course *</label>
                <select class="form-select" name="course" id="add-course" required>
                  <option value="">Select</option>
                  <option value="MBBS">MBBS</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Year *</label>
                <select class="form-select" name="year" id="add-year" required>
                  <option value="">Select course first</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Adm. Year *</label>
                <input class="form-input" type="number" name="adm_year" min="2015" max="2030" placeholder="2024" required />
              </div>
              <div class="form-group">
                <label class="form-label">Pass-out Year *</label>
                <input class="form-input" type="number" name="pass_year" min="2015" max="2035" placeholder="2029" required />
              </div>
              <div class="form-group" style="grid-column:span 2;">
                <label class="form-label">Home Address</label>
                <input class="form-input" name="address" placeholder="City, State" />
              </div>
            </div>

            <hr style="border-color:var(--border-subtle);margin:var(--space-5) 0;" />
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
              <input type="checkbox" id="also-alloc" style="width:15px;height:15px;" />
              <label for="also-alloc" style="font-size:var(--text-sm);cursor:pointer;font-weight:500;">Assign room immediately</label>
            </div>
            <div id="alloc-room-wrap" style="display:none;margin-bottom:var(--space-4);">
              <label class="form-label">Room</label>
              <select class="form-select" name="alloc_room" id="alloc-room-select">
                <option value="">— pick gender first —</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;" id="add-btn">Register Student</button>
          </form>
        </div>

        <!-- RIGHT: Students list + quick allocate -->
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-5);">
            Students (${students.length})
          </div>
          <div id="quick-alloc-msg"></div>
          <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3);">Unallocated · click  Assign to allocate a room</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);" id="student-quick-list">
            ${students.map(s => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);gap:var(--space-3);">
                <div>
                  <div style="font-size:var(--text-sm);font-weight:500;">${esc(s.name)}</div>
                  <div style="font-size:var(--text-xs);color:var(--text-tertiary);">${s.roll_no} · ${s.gender === 'M' ? 'Male' : 'Female'} · ${s.course} Yr ${s.year}</div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
                  ${s.alloc_room
                    ? `<span class="cell-mono" style="font-size:var(--text-xs);color:var(--accent-green);">${s.alloc_room}</span>`
                    : `<select class="form-select" style="padding:4px 8px;font-size:var(--text-xs);min-width:130px;" data-stu="${s.student_id}" data-gender="${s.gender}" id="qs-room-${s.student_id}">
                        <option value="">— room —</option>
                        ${eligibleRooms(rooms, s.gender, s.course).map(roomOption).join('')}
                      </select>
                      <button class="btn btn-sm btn-primary" data-assign="${s.student_id}" style="white-space:nowrap;">Assign</button>`
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Toggle alloc room section and populate rooms based on gender selection
    document.getElementById('also-alloc').addEventListener('change', e => {
      document.getElementById('alloc-room-wrap').style.display = e.target.checked ? '' : 'none';
      updateAllocRoomDropdown();
    });
    document.getElementById('add-gender').addEventListener('change', updateAllocRoomDropdown);

    // Course → Year dropdown + update room dropdown
    document.getElementById('add-course').addEventListener('change', e => {
      const years = e.target.value === 'MBBS' ? 5 : e.target.value === 'B.Tech' ? 4 : 0;
      const yrSel = document.getElementById('add-year');
      yrSel.innerHTML = years
        ? `<option value="">Select</option>` + Array.from({length: years}, (_,i) => `<option value="${i+1}">Year ${i+1}</option>`).join('')
        : `<option value="">Select course first</option>`;
      updateAllocRoomDropdown();
    });

    function updateAllocRoomDropdown() {
      const gender = document.getElementById('add-gender').value;
      const course = document.getElementById('add-course').value;
      const opts   = eligibleRooms(rooms, gender, course);
      const sel    = document.getElementById('alloc-room-select');
      const label  = FLOOR_MAP[`${gender}-${course}`]
        ? `Floor ${FLOOR_MAP[`${gender}-${course}`].floor} rooms`
        : 'rooms';
      sel.innerHTML = opts.length
        ? `<option value="">— pick a room (${label}) —</option>${opts.map(roomOption).join('')}`
        : `<option value="">No vacant ${label}</option>`;
    }

    // Quick assign buttons
    el.querySelectorAll('[data-assign]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sid  = btn.dataset.assign;
        const rSel = document.getElementById(`qs-room-${sid}`);
        const rid  = rSel?.value;
        if (!rid) { toast('Select a room first.', 'error'); return; }
        btn.disabled = true; btn.textContent = '…';
        try {
          await api.post('/rooms/direct-allocate', { student_id: sid, room_id: rid });
          toast('Room assigned!', 'success');
          await reloadFn();
        } catch(err) {
          toast(err.message, 'error');
          btn.disabled = false; btn.textContent = 'Assign';
        }
      });
    });

    // Register form submit
    document.getElementById('add-form').addEventListener('submit', async e => {
      e.preventDefault();
      const fd  = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      // Hostel derived from gender
      payload.hostel = payload.gender === 'M'
        ? 'Senior MBBS boys hostel'
        : payload.gender === 'F'
        ? 'Senior MBBS girls hostel'
        : '';
      const btn    = document.getElementById('add-btn');
      const msgEl  = document.getElementById('add-msg');
      btn.disabled = true; btn.textContent = 'Registering…'; msgEl.innerHTML = '';
      try {
        const created = await api.post('/students', payload);
        if (document.getElementById('also-alloc').checked && payload.alloc_room) {
          await api.post('/rooms/direct-allocate', { student_id: created.student_id, room_id: payload.alloc_room });
        }
        msgEl.innerHTML = `<div style="background:color-mix(in srgb,var(--accent-green) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-green) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-green);margin-bottom:var(--space-4);">
          ✓ ${created.name} registered. ID: <strong>${created.student_id}</strong> · Login: <strong>${created.default_password}</strong>
        </div>`;
        e.target.reset();
        document.getElementById('alloc-room-wrap').style.display = 'none';
        await reloadFn();
      } catch(err) {
        msgEl.innerHTML = `<div style="background:color-mix(in srgb,var(--accent-red) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-red) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-red);margin-bottom:var(--space-4);">${err.message}</div>`;
        btn.disabled = false; btn.textContent = 'Register Student';
      }
    });
  }

  // ══════════════════════════════════════════════
  // TAB 3 — Pending (needs action)
  // ══════════════════════════════════════════════
  function renderPending() {
    const el = document.getElementById('rm-panel-pending');
    const pendingBook   = bookReqs.filter(r => r.status === 'pending');
    const pendingChange = changeReqs.filter(r => r.status === 'pending');

    if (!pendingBook.length && !pendingChange.length) {
      el.innerHTML = `<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No pending requests. All clear.</p>`;
      return;
    }

    let html = '';

    if (pendingBook.length) {
      html += `<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Booking Requests (${pendingBook.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-8);">
        ${pendingBook.map(r => `
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${esc(r.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${r.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Room <strong style="color:var(--text-secondary);">${r.room_id}</strong> · ${esc(r.room_hostel || r.hostel)} · Floor ${r.floor} · ${r.type} · ${r.current_occupancy}/${r.capacity}</div>
              ${r.preferences ? `<div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Pref: ${esc(r.preferences)}</div>` : ''}
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${r.created_at?.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-breq="${r.request_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-breq="${r.request_id}" data-action="rejected">Reject</button>
            </div>
          </div>`).join('')}
      </div>`;
    }

    if (pendingChange.length) {
      html += `<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Room Change Requests (${pendingChange.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        ${pendingChange.map(r => `
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${esc(r.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${r.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;"><strong style="color:var(--text-secondary);">${r.from_room_id}</strong> → <strong style="color:var(--text-secondary);">${r.to_room_id}</strong> · ${esc(r.to_hostel)} · Fl ${r.to_floor} · ${r.to_occupancy}/${r.to_capacity}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Reason: ${esc(r.reason)}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${r.created_at?.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-creq="${r.change_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-creq="${r.change_id}" data-action="rejected">Reject</button>
            </div>
          </div>`).join('')}
      </div>`;
    }

    el.innerHTML = html;

    el.querySelectorAll('[data-breq]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await api.patch(`/rooms/booking-requests/${btn.dataset.breq}`, { status: btn.dataset.action });
          toast(`Request ${btn.dataset.action}.`, 'success');
          await reloadFn();
        } catch(err) { toast(err.message, 'error'); btn.disabled = false; }
      });
    });

    el.querySelectorAll('[data-creq]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await api.patch(`/rooms/change-requests/${btn.dataset.creq}`, { status: btn.dataset.action });
          toast(`Room change ${btn.dataset.action}.`, 'success');
          await reloadFn();
        } catch(err) { toast(err.message, 'error'); btn.disabled = false; }
      });
    });
  }

  // ══════════════════════════════════════════════
  // TAB 4 — All Requests (history)
  // ══════════════════════════════════════════════
  function renderHistory() {
    const el = document.getElementById('rm-panel-history');
    const allBook   = filterHostel ? bookReqs.filter(r => r.room_hostel === filterHostel || r.hostel === filterHostel) : bookReqs;
    const allChange = filterHostel ? changeReqs.filter(r => r.from_hostel === filterHostel || r.to_hostel === filterHostel) : changeReqs;

    const combined = [
      ...allBook.map(r => ({ type: 'booking', ...r })),
      ...allChange.map(r => ({ type: 'change', ...r })),
    ].sort((a,b) => (b.created_at || '').localeCompare(a.created_at || ''));

    if (!combined.length) {
      el.innerHTML = `<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No requests yet.</p>`;
      return;
    }

    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>Type</th><th>Student</th><th>Details</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            ${combined.map(r => {
              const detail = r.type === 'booking'
                ? `Room ${r.room_id} · ${esc(r.room_hostel || r.hostel)} · Fl ${r.floor}`
                : `${r.from_room_id} → ${r.to_room_id} · ${esc(r.to_hostel)}`;
              const st = r.status === 'pending' ? 'open' : r.status === 'approved' ? 'in-progress' : 'resolved';
              return `<tr>
                <td style="font-size:var(--text-xs);color:var(--text-tertiary);">${r.type === 'booking' ? 'Booking' : 'Transfer'}</td>
                <td><div style="font-weight:500;font-size:var(--text-sm);">${esc(r.student_name)}</div><div style="font-size:var(--text-xs);color:var(--text-tertiary);">${r.roll_no}</div></td>
                <td style="font-size:var(--text-xs);">${detail}</td>
                <td><span class="badge badge-${st}">${r.status}</span></td>
                <td class="cell-mono">${r.created_at?.slice(0,10)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  renderGrid();
  requestAnimationFrame(() =>
    document.getElementById('admin-rooms-page')?.classList.replace('page-enter','page-active')
  );
}
