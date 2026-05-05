/* ─────────────────────────────────
   Student Complaints Page
   Lodge + Track own complaints
   ───────────────────────────────── */

import { api } from '../../api.js';
import { toast } from '../../components/toast.js';

const CATEGORIES = ['Plumbing','Electricity','WiFi','Cleanliness','Carpentry','Other'];
// Minimal stroke SVGs — 14×14, currentColor
const _s = p => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.6;vertical-align:middle;">${p}</svg>`;
const CAT_ICONS = {
  Plumbing:    _s(`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`),
  Electricity: _s(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`),
  WiFi:        _s(`<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`),
  Cleanliness: _s(`<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`),
  Carpentry:   _s(`<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`),
  Other:       _s(`<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`),
};
const STATUSES   = ['open','in-progress','resolved'];

export async function renderStudentComplaints(container) {
  container.innerHTML = `<div class="page-loading">Loading…</div>`;
  let complaints = [];
  try {
    complaints = await api.get('/complaints');
  } catch(e) {
    container.innerHTML = `<div class="page-error">Failed to load: ${e.message}</div>`;
    return;
  }
  renderPage(container, complaints);
}

function renderPage(container, initial) {
  let complaints   = initial;
  let activeFilter = 'all';
  let activeTab    = '';

  container.innerHTML = `
    <div class="page-enter" id="complaints-page">
      <div class="page-header">
        <h2>Complaints</h2>
        <p>Lodge a complaint by category or track your existing ones.</p>
      </div>

      <!-- Lodge Form -->
      <div class="form-section" style="margin-bottom: var(--space-6); max-width: none;">
        <div class="form-section-title">Lodge a Complaint</div>
        <form id="complaint-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="cmp-category">Category <span style="color:var(--danger)">*</span></label>
              <select class="form-select" id="cmp-category" required>
                <option value="">Select category…</option>
                ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
              <div class="form-error" id="err-cmp-cat">Category is required</div>
            </div>
            <div class="form-group" id="cmp-other-group" style="display: none;">
              <label class="form-label" for="cmp-other-type">Please Specify Category <span style="color:var(--danger)">*</span></label>
              <input type="text" class="form-input" id="cmp-other-type" placeholder="e.g. Pest Control, Room Allocation..." />
              <div class="form-error" id="err-cmp-other">Please specify what the complaint is about.</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cmp-photo">Attach Photo <span style="color:var(--text-tertiary)">(optional)</span></label>
              <input type="file" class="form-input" id="cmp-photo" accept="image/*" />
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="cmp-desc">Description <span style="color:var(--danger)">*</span></label>
              <textarea class="form-textarea" id="cmp-desc" rows="3" placeholder="Describe the issue in detail…" required></textarea>
              <div class="form-error" id="err-cmp-desc">Description is required</div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="cmp-submit">Submit Complaint</button>
            <button type="reset" class="btn btn-secondary">Clear</button>
          </div>
        </form>
      </div>

      <!-- Category Filter -->
      <div class="cat-filter-row">
        <label class="form-label" for="cat-filter-select">Filter by Category</label>
        <select class="form-select cat-filter-select" id="cat-filter-select">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>

      <!-- My Complaints Table -->
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">My Complaints</div>
          <div style="display:flex; gap: var(--space-2); flex-wrap: wrap;">
            <button class="filter-chip active" data-status="all">All</button>
            ${STATUSES.map(s => `<button class="filter-chip" data-status="${s}">${s}</button>`).join('')}
          </div>
        </div>
        <div id="complaints-list"></div>
      </div>
    </div>
  `;

  function renderList() {
    let items = complaints;
    if (activeTab)    items = items.filter(c => c.category === activeTab);
    if (activeFilter !== 'all') items = items.filter(c => c.status === activeFilter);

    const el = document.getElementById('complaints-list');
    if (items.length === 0) {
      el.innerHTML = `<p style="padding: var(--space-8); text-align:center; color: var(--text-tertiary);">No complaints found.</p>`;
      return;
    }
    el.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th><th>Category</th><th>Description</th><th>Date</th><th>Status</th><th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(c => `
            <tr>
              <td class="cell-mono">${c.complaint_id}</td>
              <td><span style="display:inline-flex;align-items:center;gap:5px;">${CAT_ICONS[c.category] || ''} ${c.category}</span></td>
              <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;" title="${c.description}">${c.description.slice(0,50)}${c.description.length > 50 ? '…' : ''}</td>
              <td class="cell-mono">${c.date}</td>
              <td><span class="badge badge-${c.status}">${c.status}</span></td>
              <td style="color: var(--text-tertiary); font-size: var(--text-xs);">${c.admin_note || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Category dropdown filter
  document.getElementById('cat-filter-select').addEventListener('change', e => {
    activeTab = e.target.value;
    renderList();
  });

  // Status filter chips
  container.querySelectorAll('[data-status]').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('[data-status]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.status;
      renderList();
    });
  });

  // Category toggle logic for "Other"
  const catSelect = document.getElementById('cmp-category');
  const otherGroup = document.getElementById('cmp-other-group');
  catSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Other') {
      otherGroup.style.display = '';
    } else {
      otherGroup.style.display = 'none';
      document.getElementById('cmp-other-type').value = '';
      document.getElementById('err-cmp-other').classList.remove('visible');
    }
  });

  // Form submission
  const form = document.getElementById('complaint-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    container.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));

    const category = document.getElementById('cmp-category').value;
    const otherType = document.getElementById('cmp-other-type').value.trim();
    const desc     = document.getElementById('cmp-desc').value.trim();
    const photoFile = document.getElementById('cmp-photo').files[0];

    if (!category) { document.getElementById('err-cmp-cat').classList.add('visible'); valid = false; }
    if (category === 'Other' && !otherType) { document.getElementById('err-cmp-other').classList.add('visible'); valid = false; }
    if (!desc)     { document.getElementById('err-cmp-desc').classList.add('visible'); valid = false; }
    if (!valid)    { toast('Fill in all required fields.', 'error'); return; }

    const btn = document.getElementById('cmp-submit');
    btn.disabled = true; btn.textContent = 'Submitting…';

    try {
      let photo_base64 = null;
      if (photoFile) {
        photo_base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(photoFile);
        });
      }

      const finalDesc = (category === 'Other' && otherType) ? `[Other: ${otherType}] ${desc}` : desc;

      const newCmp = await api.post('/complaints', { category, description: finalDesc, photo_base64 });
      complaints = [newCmp, ...complaints];
      toast(`Complaint #${newCmp.complaint_id} submitted.`, 'success');
      form.reset();
      renderList();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Submit Complaint';
    }
  });

  form.addEventListener('reset', () => {
    container.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
    document.getElementById('cmp-other-group').style.display = 'none';
  });

  renderList();
  requestAnimationFrame(() =>
    document.getElementById('complaints-page')?.classList.replace('page-enter', 'page-active')
  );
}
