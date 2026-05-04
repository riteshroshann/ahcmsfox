/* ─────────────────────────────────────────────────
   Student Room Booking & Change Request Page
   - If allocated: show room card + "Request Room Change" flow
   - If not allocated: floor plan to submit initial booking request
   - History table: all booking requests + all change requests
   ───────────────────────────────────────────────── */

import { api } from '../../api.js';
import { getUser } from '../../auth.js';
import { toast } from '../../components/toast.js';

export async function renderRoomBooking(container) {
  container.innerHTML = `<div class="page-loading">Loading rooms…</div>`;
  try {
    const [allRooms, { allocation }, bookingReqs, changeReqs] = await Promise.all([
      api.get('/rooms'),
      api.get('/rooms/my-allocation'),
      api.get('/rooms/booking-requests'),
      api.get('/rooms/change-requests'),
    ]);
    renderPage(container, allRooms, allocation, bookingReqs, changeReqs);
  } catch(e) {
    container.innerHTML = `<div class="page-error">Failed to load: ${e.message}</div>`;
  }
}

function renderPage(container, allRooms, allocation, bookingReqs, changeReqs) {
  const user = getUser();
  const hostelRooms    = allRooms.filter(r => r.hostel === (user?.hostel || ''));
  const floorsAvailable = [...new Set(hostelRooms.map(r => r.floor))].sort((a,b) => a-b);

  let selectedFloor = floorsAvailable[0] || 1;
  let selectedRoom  = null;

  const pendingBooking = bookingReqs.find(r => r.status === 'pending');
  const pendingChange  = changeReqs.find(r => r.status === 'pending');

  // ── Skeleton ──────────────────────────────────────────────────
  container.innerHTML = `
    <style>
      .alloc-card {
        background: var(--bg-elevated);
        border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }
      .alloc-room-num {
        font-size: 48px; font-weight: 800; color: var(--accent-green);
        letter-spacing: -2px; line-height: 1;
      }
      .alloc-meta { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 4px; }
      .change-req-form { margin-top: var(--space-8); padding-top: var(--space-8); border-top: 1px solid var(--border-subtle); }
    </style>

    <div class="page-enter" id="booking-page">
      <div class="page-header">
        <h2>My Room</h2>
        <p>View your room assignment, request a room change, or apply for initial allocation.</p>
      </div>

      <!-- ① Allocated: room card + change request -->
      ${allocation ? `
        <div class="alloc-card">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
            <div>
              <div style="font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin-bottom:var(--space-2);">Your Room</div>
              <div class="alloc-room-num">${allocation.room_id}</div>
              <div class="alloc-meta">${allocation.hostel}</div>
              <div class="alloc-meta">Floor ${allocation.floor} · ${allocation.type} · ${allocation.current_occupancy}/${allocation.capacity} occupied</div>
              <div class="alloc-meta" style="margin-top:var(--space-2);">Since ${allocation.from_date} · Until ${allocation.to_date}</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:var(--space-2); align-items:flex-end;">
              <span class="badge badge-in-progress" style="font-size:13px; padding:6px 14px;">Active</span>
              ${pendingChange
                ? `<div style="font-size:var(--text-xs); color:var(--accent-amber); margin-top:var(--space-2);">Room change pending review</div>`
                : `<button class="btn btn-secondary" id="btn-show-change" style="margin-top:var(--space-2);">Request Room Change</button>`
              }
            </div>
          </div>

          <!-- Room change request form (hidden until button click) -->
                <div id="change-req-section" class="change-req-form" style="display:${pendingChange ? 'block' : 'none'}">
            ${pendingChange ? `
              <div style="font-size:var(--text-sm); font-weight:600; color:var(--accent-amber); margin-bottom:var(--space-3);">Pending Room Change Request</div>
              <div style="font-size:var(--text-sm); color:var(--text-secondary);">
                You have requested to move to <strong>${pendingChange.to_room_id}</strong> (${pendingChange.to_hostel}, Floor ${pendingChange.to_floor}).
                Submitted on ${pendingChange.created_at?.slice(0,10)}. Awaiting warden approval.
              </div>
            ` : (() => {
              // Same-floor available rooms
              const sameFloor = allRooms.filter(r =>
                r.hostel === allocation.hostel &&
                r.floor  === allocation.floor  &&
                r.room_id !== allocation.room_id &&
                r.current_occupancy < r.capacity
              ).sort((a,b) => a.room_id.localeCompare(b.room_id));

              // If entire floor is full, fall back to all rooms in hostel
              const floorFull  = sameFloor.length === 0;
              const targetList = floorFull
                ? allRooms.filter(r =>
                    r.hostel === allocation.hostel &&
                    r.room_id !== allocation.room_id &&
                    r.current_occupancy < r.capacity
                  ).sort((a,b) => a.floor - b.floor || a.room_id.localeCompare(b.room_id))
                : sameFloor;

              return `
              <div style="font-size:var(--text-sm); font-weight:600; margin-bottom:var(--space-4);">Request a Room Change</div>
              ${floorFull ? `
                <div style="font-size:var(--text-xs); background:color-mix(in srgb,var(--accent-amber) 10%,transparent); border:1px solid color-mix(in srgb,var(--accent-amber) 25%,transparent); border-radius:8px; padding:var(--space-3) var(--space-4); color:var(--accent-amber); margin-bottom:var(--space-4);">
                  All rooms on your floor (Floor ${allocation.floor}) are currently full. You may request a transfer to another floor.
                </div>
              ` : `
                <div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-bottom:var(--space-4);">
                  Only rooms on your current floor (Floor ${allocation.floor}) are shown. Cross-floor transfers are only allowed when your floor has no available rooms.
                </div>
              `}
              <div id="change-msg"></div>
              <form id="change-req-form">
                <div class="form-group">
                  <label class="form-label">Target Room *</label>
                  <select class="form-select" id="change-target-room" name="to_room_id" required>
                    <option value="">— select a room —</option>
                    ${targetList.map(r => `<option value="${r.room_id}">${r.room_id} (${r.current_occupancy}/${r.capacity})</option>`).join('')}
                  </select>
                  ${targetList.length === 0 ? `<div style="font-size:var(--text-xs); color:var(--accent-red); margin-top:4px;">No available rooms in your hostel.</div>` : ''}
                </div>
                <div class="form-group">
                  <label class="form-label">Reason for Change *</label>
                  <textarea class="form-textarea" name="reason" rows="3" placeholder="Explain why you need a different room…" required></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" id="btn-submit-change">Submit Request</button>
                  <button type="button" class="btn btn-secondary" id="btn-cancel-change">Cancel</button>
                </div>
              </form>`;
            })()
            }
          </div>
        </div>
      ` : pendingBooking ? `
        <!-- ② No allocation but pending booking -->
        <div style="background:var(--bg-elevated); border:1px solid color-mix(in srgb,var(--accent-amber) 30%,transparent); border-radius:var(--radius-lg); padding:var(--space-6); margin-bottom:var(--space-6);">
          <div style="font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin-bottom:var(--space-2);">Pending Booking Request</div>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--accent-amber);">${pendingBooking.room_id}</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-top:4px;">Submitted ${pendingBooking.created_at?.slice(0,10)} · Waiting for warden approval</div>
        </div>
      ` : ''}

      <!-- ③ Floor Plan (only shown if not yet allocated) -->
      ${!allocation ? `
        <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary); font-weight:500;">Floor:</span>
          <div class="cat-tabs" style="margin:0;">
            ${floorsAvailable.map(f => `
              <button class="cat-tab${f === selectedFloor ? ' active' : ''}" data-floor="${f}">Floor ${f}</button>
            `).join('')}
          </div>
        </div>

        <div class="form-section" style="max-width:none; margin-bottom:var(--space-6);" id="floor-plan-section">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <div class="form-section-title" id="floor-plan-title" style="margin-bottom:0;">Floor ${selectedFloor} — ${user?.hostel || ''}</div>
            <div style="display:flex; gap:var(--space-4);">
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-green); display:inline-block;"></span>Vacant</span>
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-amber); display:inline-block;"></span>Partial</span>
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-red); display:inline-block;"></span>Full</span>
            </div>
          </div>
          <div class="floor-plan" id="floor-plan"></div>
        </div>

        <div id="room-detail-panel" class="form-section" style="max-width:none; display:none; margin-bottom:var(--space-6);">
          <div class="form-section-title" id="room-detail-title">Room Details</div>
          <div id="room-detail-body"></div>
          <form id="booking-form" style="margin-top:var(--space-5);" novalidate>
            <div class="form-group" style="max-width:480px;">
              <label class="form-label" for="booking-pref">Preferences <span style="color:var(--text-tertiary)">(optional)</span></label>
              <textarea class="form-textarea" id="booking-pref" rows="2" placeholder="e.g. prefer window side, near bathroom…"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="btn-book">Request This Room</button>
              <button type="button" class="btn btn-secondary" id="btn-cancel-room">Cancel</button>
            </div>
          </form>
        </div>
      ` : ''}

      <!-- History -->
      <div class="table-container" style="margin-bottom:var(--space-6);">
        <div class="table-toolbar"><div class="table-toolbar-title">My Booking Requests</div></div>
        ${bookingReqs.length === 0
          ? `<p style="padding:var(--space-6); text-align:center; color:var(--text-tertiary);">No booking requests yet.</p>`
          : `<table>
              <thead><tr><th>Room</th><th>Hostel</th><th>Floor</th><th>Type</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
              <tbody>
                ${bookingReqs.map(r => `
                    <tr>
                      <td class="cell-mono">${r.room_id}</td>
                      <td style="font-size:var(--text-xs);">${r.hostel}</td>
                      <td>${r.floor}</td>
                      <td>${r.type}</td>
                      <td><span class="badge badge-${r.status === 'pending' ? 'open' : r.status === 'approved' ? 'in-progress' : 'resolved'}">${r.status}</span></td>
                      <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${r.admin_note || '—'}</td>
                      <td class="cell-mono">${r.created_at?.slice(0,10)}</td>
                    </tr>
                `).join('')}
              </tbody>
            </table>`
        }
      </div>

      ${changeReqs.length > 0 ? `
      <div class="table-container">
        <div class="table-toolbar"><div class="table-toolbar-title">My Room Change Requests</div></div>
        <table>
          <thead><tr><th>From</th><th>To</th><th>To Hostel</th><th>Reason</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
          <tbody>
            ${changeReqs.map(r => `
              <tr>
                <td class="cell-mono">${r.from_room_id}</td>
                <td class="cell-mono">${r.to_room_id}</td>
                <td style="font-size:var(--text-xs);">${r.to_hostel}</td>
                <td style="max-width:160px; font-size:var(--text-xs);" title="${r.reason}">${r.reason.slice(0,50)}${r.reason.length > 50 ? '…' : ''}</td>
                <td><span class="badge badge-${r.status === 'pending' ? 'open' : r.status === 'approved' ? 'in-progress' : 'resolved'}">${r.status}</span></td>
                <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${r.admin_note || '—'}</td>
                <td class="cell-mono">${r.created_at?.slice(0,10)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
    </div>
  `;

  // ── Floor plan (only if not allocated) ───────────────────────
  if (!allocation) {
    function renderFloorPlan(floor) {
      const floorRooms = hostelRooms.filter(r => r.floor === floor);
      document.getElementById('floor-plan-title').textContent = `Floor ${floor} — ${user?.hostel || ''}`;
      const plan = document.getElementById('floor-plan');
      if (!floorRooms.length) {
        plan.innerHTML = `<p style="color:var(--text-tertiary); padding:var(--space-4);">No rooms on this floor.</p>`;
        return;
      }
      plan.innerHTML = floorRooms
        .sort((a,b) => a.room_id.localeCompare(b.room_id))
        .map(r => {
          const pct   = r.capacity > 0 ? r.current_occupancy / r.capacity : 0;
          const state = pct === 0 ? 'vacant' : pct < 1 ? 'partial' : 'full';
          const sel   = selectedRoom?.room_id === r.room_id;
          return `
            <button class="room-cell ${state}${sel ? ' selected' : ''}"
                    data-room="${r.room_id}"
                    ${state === 'full' ? 'disabled' : ''}
                    title="${r.room_id} · ${r.type} · ${r.current_occupancy}/${r.capacity}">
              <span class="room-cell-id">${r.room_id}</span>
              <span class="room-cell-type">${r.type[0]}</span>
              <span class="room-cell-occ">${r.current_occupancy}/${r.capacity}</span>
            </button>`;
        }).join('');

      plan.querySelectorAll('.room-cell:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedRoom = hostelRooms.find(r => r.room_id === btn.dataset.room);
          renderFloorPlan(floor);
          showRoomDetail(selectedRoom);
        });
      });
    }

    function showRoomDetail(room) {
      const panel = document.getElementById('room-detail-panel');
      document.getElementById('room-detail-title').textContent = `Room ${room.room_id}`;
      document.getElementById('room-detail-body').innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:var(--space-4);">
          ${[['Hostel', room.hostel],['Floor', room.floor],['Type', room.type],
             ['Capacity', `${room.capacity} beds`],['Occupied', `${room.current_occupancy}/${room.capacity}`],
             ['Available', `${room.available_slots} slot(s)`]]
            .map(([k,v]) => `<div>
              <div style="font-size:var(--text-xs); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.06em;">${k}</div>
              <div style="font-size:var(--text-sm); margin-top:4px;">${v}</div>
            </div>`).join('')}
        </div>
      `;
      panel.style.display = (pendingBooking) ? 'none' : 'block';
    }

    // Floor tabs
    container.querySelectorAll('.cat-tab[data-floor]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cat-tab[data-floor]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFloor = +btn.dataset.floor;
        selectedRoom  = null;
        document.getElementById('room-detail-panel').style.display = 'none';
        renderFloorPlan(selectedFloor);
      });
    });

    document.getElementById('btn-cancel-room')?.addEventListener('click', () => {
      selectedRoom = null;
      document.getElementById('room-detail-panel').style.display = 'none';
      renderFloorPlan(selectedFloor);
    });

    document.getElementById('booking-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      if (!selectedRoom) return;
      const btn = document.getElementById('btn-book');
      btn.disabled = true; btn.textContent = 'Submitting…';
      try {
        await api.post('/rooms/book', {
          room_id: selectedRoom.room_id,
          preferences: document.getElementById('booking-pref').value.trim(),
        });
        toast(`Booking request for ${selectedRoom.room_id} submitted!`, 'success');
        renderRoomBooking(container);
      } catch(err) {
        toast(err.message, 'error');
        btn.disabled = false; btn.textContent = 'Request This Room';
      }
    });

    renderFloorPlan(selectedFloor);
  }

  // ── Room change request flow (allocated students) ─────────────
  if (allocation && !pendingChange) {
    document.getElementById('btn-show-change')?.addEventListener('click', () => {
      document.getElementById('change-req-section').style.display = 'block';
      document.getElementById('btn-show-change').style.display = 'none';
    });

    document.getElementById('btn-cancel-change')?.addEventListener('click', () => {
      document.getElementById('change-req-section').style.display = 'none';
      document.getElementById('btn-show-change').style.display = '';
    });

    document.getElementById('change-req-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const btn = document.getElementById('btn-submit-change');
      const msgEl = document.getElementById('change-msg');
      btn.disabled = true; btn.textContent = 'Submitting…';
      msgEl.innerHTML = '';
      try {
        await api.post('/rooms/change-requests', Object.fromEntries(fd.entries()));
        toast('Room change request submitted. Awaiting warden approval.', 'success');
        renderRoomBooking(container);
      } catch(err) {
        msgEl.innerHTML = `<div style="color:var(--accent-red); font-size:var(--text-sm); margin-bottom:var(--space-3); padding:var(--space-3); background:color-mix(in srgb,var(--accent-red) 10%,transparent); border-radius:8px;">${err.message}</div>`;
        btn.disabled = false; btn.textContent = 'Submit Request';
      }
    });
  }

  requestAnimationFrame(() =>
    document.getElementById('booking-page')?.classList.replace('page-enter', 'page-active')
  );
}
