/* ─────────────────────────────────
   Student Home Page
   Wardens · Room Allocation · Complaints
   ───────────────────────────────── */

import { api } from '../../api.js';

export async function renderStudentHome(container) {
  container.innerHTML = `<div class="page-loading">Loading…</div>`;
  try {
    const { student, allocation, complaints, wardens, wardenOfficePhone } = await api.get('/dashboard/student');
    renderPage(container, student, allocation, complaints, wardens, wardenOfficePhone);
  } catch (e) {
    container.innerHTML = `<div class="page-error">Failed to load dashboard: ${e.message}</div>`;
  }
}

function renderPage(container, student, allocation, complaints, wardens, wardenOfficePhone) {
  const warden_list = wardens.filter(w => w.role === 'Warden');
  const guard_list  = wardens.filter(w => w.role === 'Guard');

  container.innerHTML = `
    <div class="page-enter" id="student-home">
      <div class="page-header">
        <h2>Welcome, ${student?.name?.split(' ')[0] || 'Student'}</h2>
        <p>${student?.course || ''} · ${student?.hostel || ''} · Year ${student?.year || ''}</p>
      </div>

      <!-- Student Info Card -->
      <div class="form-section" style="max-width: none; margin-bottom: var(--space-10);">
        <div class="form-section-title">Your Profile</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
          ${[
            ['Roll No',      student?.roll_no],
            ['Course',       student?.course],
            ['Admission',    student?.adm_year],
            ['Passing Year', student?.pass_year],
            ['Gender',       student?.gender === 'M' ? 'Male' : student?.gender === 'F' ? 'Female' : student?.gender],
            ['Address',      student?.address || '—'],
          ].map(([k,v]) => `
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .06em;">${k}</div>
              <div style="font-size: var(--text-sm); color: var(--text-primary); margin-top: 4px;">${v || '—'}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Room Card -->
      <div class="card-grid">
        <div class="card card-accent-blue" style="grid-column: span 2;">
          <div class="card-label">Your Room</div>
          ${allocation
            ? `<div class="card-value">${allocation.room_id}</div>
               <div class="card-sub">${allocation.hostel} · Floor ${allocation.floor} · ${allocation.type} · ${allocation.status}</div>
               <div style="margin-top: var(--space-2); font-size: var(--text-xs); color: var(--text-tertiary);">
                 ${allocation.from_date} → ${allocation.to_date}
               </div>`
            : `<div style="color: var(--text-tertiary); font-size: var(--text-sm); padding: var(--space-2) 0;">
                 No active room allocation. <a class="link-accent" href="#booking">Book a room →</a>
               </div>`
          }
        </div>

        <div class="card card-accent-amber">
          <div class="card-label">Open Complaints</div>
          <div class="card-value">${complaints.filter(c => c.status === 'open').length}</div>
          <div class="card-sub">${complaints.filter(c => c.status === 'in-progress').length} in progress</div>
        </div>

        <div class="card card-accent-green">
          <div class="card-label">Resolved</div>
          <div class="card-value">${complaints.filter(c => c.status === 'resolved').length}</div>
          <div class="card-sub">of ${complaints.length} total</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
        <!-- On-Duty Wardens -->
        <div class="form-section" style="max-width: none;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-4);">
            <div class="form-section-title" style="margin-bottom:0;">On-Duty Wardens</div>
            ${wardenOfficePhone ? `
              <a href="tel:${wardenOfficePhone}" style="
                display: inline-flex; align-items: center; gap: 6px;
                background: color-mix(in srgb, var(--accent-green) 12%, transparent);
                border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
                color: var(--accent-green);
                font-size: var(--text-xs);
                font-weight: 600;
                letter-spacing: .04em;
                padding: 4px 10px;
                border-radius: 999px;
                text-decoration: none;
                transition: background .15s, transform .1s;
              "
              onmouseover="this.style.background='color-mix(in srgb,var(--accent-green) 22%,transparent)'; this.style.transform='scale(1.03)'"
              onmouseout="this.style.background='color-mix(in srgb,var(--accent-green) 12%,transparent)'; this.style.transform='scale(1)'"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Office: ${wardenOfficePhone}
              </a>` : ''}
          </div>
          ${warden_list.length === 0
            ? `<p class="empty-msg">No warden data available.</p>`
            : warden_list.map(w => `
              <div class="contact-row" style="align-items: flex-start;">
                <div class="contact-avatar">${w.name[0]}</div>
                <div class="contact-info" style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                    <div class="contact-name">${w.name}</div>
                    <a href="tel:${w.phone}" class="contact-phone" style="margin-left: auto;">${w.phone || '—'}</a>
                  </div>
                  <div class="contact-meta">${w.hostel}</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-color); color: var(--text-secondary);">
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Last:</span> ${w.previous ? w.previous.name : 'Unknown'}</span>
                    <span style="color:var(--accent-green);"><span style="font-weight:600;">Current:</span> Active</span>
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Next:</span> ${w.next ? w.next.name : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            `).join('')}

          <div class="form-section-title" style="margin-top: var(--space-6);">On-Duty Guards</div>
          ${guard_list.length === 0
            ? `<p class="empty-msg">No guard data.</p>`
            : guard_list.map(w => `
              <div class="contact-row">
                <div class="contact-avatar guard">${w.name[0]}</div>
                <div class="contact-info">
                  <div class="contact-name">${w.name}</div>
                  <div class="contact-meta">${w.hostel} · ${w.shift} shift</div>
                </div>
                <a href="tel:${w.phone}" class="contact-phone">${w.phone || '—'}</a>
              </div>
            `).join('')}
        </div>

        <!-- Recent Complaints -->
        <div class="form-section" style="max-width: none;">
          <div class="form-section-title">Your Recent Complaints</div>
          ${complaints.length === 0
            ? `<p class="empty-msg">No complaints filed yet.</p>`
            : `<div class="activity-list">
                ${complaints.slice(0, 5).map(c => {
                  const color = c.status === 'open' ? 'var(--accent-amber)'
                    : c.status === 'in-progress' ? 'var(--accent-blue)' : 'var(--accent-green)';
                  return `
                    <div class="activity-item">
                      <div class="activity-dot" style="background:${color}"></div>
                      <div class="activity-content">
                        <div class="activity-text">${c.category} — <span class="badge badge-${c.status}">${c.status}</span></div>
                        <div class="activity-time">${c.date} · ${c.room_id || 'N/A'}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${c.description.slice(0,60)}…</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>`
          }
          <a class="link-accent" href="#complaints" style="display:block; margin-top: var(--space-4); font-size: var(--text-sm);">View all complaints →</a>
        </div>
      </div>


    </div>
  `;

  // wire hash links
  container.querySelectorAll('a.link-accent[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      window.location.hash = a.getAttribute('href').slice(1);
    });
  });

  requestAnimationFrame(() =>
    document.getElementById('student-home')?.classList.replace('page-enter', 'page-active')
  );
}
