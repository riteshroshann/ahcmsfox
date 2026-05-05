/* ─────────────────────────────────
   Admin Home Page
   Stats · Wardens · Recent Complaints
   Global hostel filter via hostelStore
   ───────────────────────────────── */

import { api } from '../../api.js';
import { getHostel, setHostel, onHostelChange } from '../../components/hostelStore.js';

export async function renderAdminHome(container) {
  let hostels = [];

  async function reload() {
    container.innerHTML = `<div class="page-loading">Loading</div>`;
    try {
      const h  = getHostel();
      const qs = h ? `?hostel=${encodeURIComponent(h)}` : '';
      const [data, rooms] = await Promise.all([
        api.get(`/dashboard/admin${qs}`),
        api.get('/rooms'),
      ]);
      hostels = [...new Set(rooms.map(r => r.hostel))].sort();
      renderPage(container, data, hostels, h);
    } catch(e) {
      container.innerHTML = `<div class="page-error">Failed to load: ${e.message}</div>`;
    }
  }

  // Re-render when another page changes the hostel
  onHostelChange(() => reload());

  await reload();

  function renderPage(container, { stats, recentComplaints, wardens, wardenOfficePhone }, hostels, currentHostel) {
    const wardenList = wardens.filter(w => w.role === 'Warden');
    const guardList  = wardens.filter(w => w.role === 'Guard');
    const occ = stats.totalCapacity > 0 ? Math.round((stats.totalOccupied / stats.totalCapacity) * 100) : 0;

    container.innerHTML = `
      <div class="page-enter" id="admin-home">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:var(--space-4);">
          <div>
            <h2>Admin Dashboard</h2>
            <p>System-wide overview — occupancy, complaints, and on-duty staff.</p>
          </div>
          <div class="hostel-filter-bar">
            <label class="hostel-filter-label">Hostel</label>
            <select class="hostel-filter-select" id="hostel-filter">
              <option value="">All Hostels</option>
              ${hostels.map(h => `<option value="${h}" ${h === currentHostel ? 'selected' : ''}>${esc(h)}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="card-grid">
          <div class="card card-accent-blue">
            <div class="card-label">Total Rooms</div>
            <div class="card-value">${stats.totalRooms}</div>
            <div class="card-sub">${stats.vacantRooms} vacant · ${occ}% utilized</div>
          </div>
          <div class="card card-accent-amber">
            <div class="card-label">Open Complaints</div>
            <div class="card-value">${stats.openComplaints}</div>
            <div class="card-sub">${stats.inProgressComplaints} in progress</div>
          </div>
          <div class="card card-accent-green">
            <div class="card-label">Resolved</div>
            <div class="card-value">${stats.resolvedComplaints}</div>
            <div class="card-sub">complaints closed</div>
          </div>
          <div class="card card-accent-purple">
            <div class="card-label">Students</div>
            <div class="card-value">${stats.totalStudents}</div>
            <div class="card-sub">${stats.pendingBookings} pending bookings</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
          <!-- Wardens & Guards -->
          <div class="form-section" style="max-width:none;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-4);">
              <div class="form-section-title" style="margin-bottom:0;">On-Duty Wardens</div>
              ${wardenOfficePhone ? `
                <a href="tel:${wardenOfficePhone}" style="
                  display:inline-flex; align-items:center; gap:6px;
                  background:color-mix(in srgb,var(--accent-green) 12%,transparent);
                  border:1px solid color-mix(in srgb,var(--accent-green) 30%,transparent);
                  color:var(--accent-green); font-size:var(--text-xs); font-weight:600;
                  letter-spacing:.04em; padding:4px 10px; border-radius:999px;
                  text-decoration:none; transition:background .15s;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Office: ${wardenOfficePhone}
                </a>` : ''}
            </div>
            ${wardenList.length === 0 ? '<p class="empty-msg">No warden data available.</p>' : wardenList.map(w => `
              <div class="contact-row" style="align-items:flex-start;">
                <div class="contact-avatar">${w.name[0]}</div>
                <div class="contact-info" style="flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2px;">
                    <div class="contact-name">${w.name}</div>
                    <a href="tel:${w.phone}" class="contact-phone" style="margin-left:auto;">${w.phone || ''}</a>
                  </div>
                  <div class="contact-meta">${w.hostel} · ${w.email || ''}</div>
                  <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle); color:var(--text-secondary);">
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Last:</span> ${w.previous ? w.previous.name : 'Unknown'}</span>
                    <span style="color:var(--accent-green);"><span style="font-weight:600;">Current:</span> Active</span>
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Next:</span> ${w.next ? w.next.name : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
            <div class="form-section-title" style="margin-top:var(--space-5);">On-Duty Guards</div>
            ${guardList.length === 0 ? '<p class="empty-msg">No guard data.</p>' : guardList.map(w => `
              <div class="contact-row">
                <div class="contact-avatar guard">${w.name[0]}</div>
                <div class="contact-info">
                  <div class="contact-name">${w.name}</div>
                  <div class="contact-meta">${w.hostel} · ${w.shift} shift</div>
                </div>
                <a href="tel:${w.phone}" class="contact-phone">${w.phone || ''}</a>
              </div>
            `).join('')}
          </div>

          <!-- Recent Complaints -->
          <div class="form-section" style="max-width:none;">
            <div class="form-section-title">Recent Complaints</div>
            ${recentComplaints.length === 0 ? '<p class="empty-msg">No recent complaints.</p>' : `
            <div class="activity-list">
              ${recentComplaints.map(c => {
                const color = c.status === 'open' ? 'var(--accent-amber)'
                  : c.status === 'in-progress' ? 'var(--accent-blue)' : 'var(--accent-green)';
                return `
                  <div class="activity-item">
                    <div class="activity-dot" style="background:${color}"></div>
                    <div class="activity-content">
                      <div class="activity-text">
                        <strong>${c.student_name || c.student_id}</strong> · ${c.category}
                        <span class="badge badge-${c.status}">${c.status}</span>
                      </div>
                      <div class="activity-time">${c.date} · ${c.room_id || ''}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            `}
            <a class="link-accent" href="#complaints" style="display:block; margin-top:var(--space-4); font-size:var(--text-sm);">Manage all complaints →</a>
          </div>
        </div>

        <!-- Occupancy Bar -->
        <div class="form-section" style="max-width:none; margin-top:var(--space-6);">
          <div class="form-section-title">Occupancy Overview</div>
          <div class="occ-overview">
            <div class="occ-track-outer">
              <div class="occ-track-inner" style="width:${occ}%"></div>
            </div>
            <span style="font-size:var(--text-sm); color:var(--text-secondary);">${stats.totalOccupied} / ${stats.totalCapacity} beds · ${occ}%</span>
          </div>
          <div class="card-grid" style="margin-top:var(--space-4); margin-bottom:0;">
            <div class="card" style="text-align:center;">
              <div class="card-label">Total Beds</div>
              <div class="card-value" style="font-size:var(--text-2xl);">${stats.totalCapacity}</div>
            </div>
            <div class="card" style="text-align:center;">
              <div class="card-label">Occupied</div>
              <div class="card-value" style="font-size:var(--text-2xl);">${stats.totalOccupied}</div>
            </div>
            <div class="card" style="text-align:center;">
              <div class="card-label">Vacant</div>
              <div class="card-value" style="font-size:var(--text-2xl); color:var(--accent-green);">${stats.totalCapacity - stats.totalOccupied}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('hostel-filter').addEventListener('change', e => {
      setHostel(e.target.value);
      reload();
    });

    container.querySelectorAll('a.link-accent[href^="#"]').forEach(a => {
      a.addEventListener('click', ev => {
        ev.preventDefault();
        window.location.hash = a.getAttribute('href').slice(1);
      });
    });

    requestAnimationFrame(() =>
      document.getElementById('admin-home')?.classList.replace('page-enter', 'page-active')
    );
  }
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
