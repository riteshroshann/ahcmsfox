/* ─────────────────────────────────
   Admin Resources Page
   Contact directory — CRUD
   ───────────────────────────────── */

import { api } from '../../api.js';
import { toast } from '../../components/toast.js';

const CATEGORIES = ['Plumber','Electrician','WiFi','Authority','Other'];

// Minimal, stroke-only SVG icons — 14×14, currentColor
const SVG = (path, extra = '') =>
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.65;" ${extra}>${path}</svg>`;

const CAT_ICONS = {
  Plumber:     SVG(`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`),
  Electrician: SVG(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`),
  WiFi:        SVG(`<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`),
  Authority:   SVG(`<line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="11" width="20" height="11" rx="1"/><polygon points="12 2 2 7 22 7"/><line x1="12" y1="7" x2="12" y2="11"/><rect x="9" y="15" width="6" height="7" rx="1"/>`),
  Other:       SVG(`<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`),
};

const PHONE_ICON = SVG(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`);
const EMAIL_ICON = SVG(`<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`);

export async function renderResources(container) {
  container.innerHTML = `<div class="page-loading">Loading…</div>`;
  try {
    const resources = await api.get('/resources');
    renderPage(container, resources);
  } catch(e) {
    container.innerHTML = `<div class="page-error">Failed to load: ${e.message}</div>`;
  }
}

function renderPage(container, initial) {
  let resources = initial;
  let filterCat = '';
  let editingId = null;

  container.innerHTML = `
    <div class="page-enter" id="resources-page">
      <div class="page-header">
        <h2>Resources &amp; Contacts</h2>
        <p>Manage the contact directory for maintenance staff and authorities.</p>
      </div>

      <!-- Add / Edit Form -->
      <div class="form-section" style="max-width: none; margin-bottom: var(--space-8);">
        <div class="form-section-title" id="resource-form-title">Add New Contact</div>
        <form id="resource-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="res-cat">Category</label>
              <select class="form-select" id="res-cat" required>
                <option value="">Select…</option>
                ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
              <div class="form-error" id="err-res-cat">Required</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-name">Name / Organisation</label>
              <input type="text" class="form-input" id="res-name" placeholder="e.g. Vijay Electricals" required />
              <div class="form-error" id="err-res-name">Required</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-phone">Phone</label>
              <input type="tel" class="form-input" id="res-phone" placeholder="10-digit number" />
            </div>
            <div class="form-group">
              <label class="form-label" for="res-email">Email</label>
              <input type="email" class="form-input" id="res-email" placeholder="contact@example.com" />
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="res-notes">Notes</label>
              <textarea class="form-textarea" id="res-notes" rows="2" placeholder="Availability, instructions, etc."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="btn-res-submit">Add Contact</button>
            <button type="button" class="btn btn-secondary" id="btn-res-cancel" style="display:none;">Cancel Edit</button>
          </div>
        </form>
      </div>

      <!-- Filter + Directory -->
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">Contact Directory</div>
          <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
            <select class="form-select" id="cat-filter-select" style="width:auto; padding:6px 28px 6px 12px; font-size:var(--text-sm);">
              <option value="">All Categories</option>
              ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div id="resources-body"></div>
      </div>
    </div>
  `;

  function renderDirectory() {
    const filtered = filterCat ? resources.filter(r => r.category === filterCat) : resources;
    const el = document.getElementById('resources-body');
    if (filtered.length === 0) {
      el.innerHTML = `<p style="padding:var(--space-8); text-align:center; color:var(--text-tertiary);">No contacts in this category.</p>`;
      return;
    }
    // Group by category
    const grouped = {};
    filtered.forEach(r => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });
    el.innerHTML = Object.entries(grouped).map(([cat, items]) => `
      <div style="padding: var(--space-4) var(--space-6);">
        <div style="display:flex; align-items:center; gap:6px; font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--text-tertiary); margin-bottom: var(--space-3);">
          ${CAT_ICONS[cat] || ''} ${cat}
        </div>
        ${items.map(r => `
          <div class="contact-row" style="margin-bottom: var(--space-2);">
            <div class="contact-avatar">${r.name[0].toUpperCase()}</div>
            <div class="contact-info" style="flex:1;">
              <div class="contact-name">${r.name}</div>
              <div class="contact-meta" style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--space-4);">
                ${r.phone ? `<span style="display:inline-flex;align-items:center;gap:4px;">${PHONE_ICON}<a href="tel:${r.phone}" style="color:inherit;">${r.phone}</a></span>` : ''}
                ${r.email ? `<span style="display:inline-flex;align-items:center;gap:4px;">${EMAIL_ICON}<a href="mailto:${r.email}" style="color:inherit;">${r.email}</a></span>` : ''}
              </div>
              ${r.notes ? `<div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-top:2px;">${r.notes}</div>` : ''}
            </div>
            <div style="display:flex; gap:4px; flex-shrink:0;">
              <button class="btn btn-sm btn-secondary" data-edit="${r.resource_id}">Edit</button>
              <button class="btn btn-sm btn-secondary" data-delete="${r.resource_id}" style="color:var(--accent-red);">Del</button>
            </div>
          </div>
        `).join('')}
        <hr style="border:none; border-top: 1px solid var(--border-subtle); margin: var(--space-3) 0;" />
      </div>
    `).join('');

    // Edit
    el.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = resources.find(x => x.resource_id === +btn.dataset.edit);
        if (!r) return;
        editingId = r.resource_id;
        document.getElementById('res-cat').value   = r.category;
        document.getElementById('res-name').value  = r.name;
        document.getElementById('res-phone').value = r.phone || '';
        document.getElementById('res-email').value = r.email || '';
        document.getElementById('res-notes').value = r.notes || '';
        document.getElementById('resource-form-title').textContent = 'Edit Contact';
        document.getElementById('btn-res-submit').textContent = 'Save Changes';
        document.getElementById('btn-res-cancel').style.display = '';
        document.getElementById('resource-form').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Delete
    el.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this contact?')) return;
        btn.disabled = true;
        try {
          await api.delete(`/resources/${btn.dataset.delete}`);
          resources = resources.filter(r => r.resource_id !== +btn.dataset.delete);
          toast('Contact deleted.', 'success');
          renderDirectory();
        } catch(err) {
          toast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });
  }

  // Category dropdown filter
  document.getElementById('cat-filter-select').addEventListener('change', e => {
    filterCat = e.target.value;
    renderDirectory();
  });

  // Cancel edit
  document.getElementById('btn-res-cancel').addEventListener('click', () => {
    editingId = null;
    document.getElementById('resource-form').reset();
    document.getElementById('resource-form-title').textContent = 'Add New Contact';
    document.getElementById('btn-res-submit').textContent = 'Add Contact';
    document.getElementById('btn-res-cancel').style.display = 'none';
  });

  // Form submit
  const form = document.getElementById('resource-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    container.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
    let valid = true;
    const category = document.getElementById('res-cat').value;
    const name     = document.getElementById('res-name').value.trim();
    if (!category) { document.getElementById('err-res-cat').classList.add('visible');  valid = false; }
    if (!name)     { document.getElementById('err-res-name').classList.add('visible'); valid = false; }
    if (!valid) return;

    const payload = {
      category, name,
      phone: document.getElementById('res-phone').value.trim() || null,
      email: document.getElementById('res-email').value.trim() || null,
      notes: document.getElementById('res-notes').value.trim() || null,
    };

    const btn = document.getElementById('btn-res-submit');
    btn.disabled = true;
    try {
      if (editingId) {
        const updated = await api.put(`/resources/${editingId}`, payload);
        resources = resources.map(r => r.resource_id === editingId ? updated : r);
        toast('Contact updated.', 'success');
        document.getElementById('btn-res-cancel').click();
      } else {
        const created = await api.post('/resources', payload);
        resources = [created, ...resources];
        toast('Contact added.', 'success');
        form.reset();
      }
      renderDirectory();
    } catch(err) {
      toast(err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  renderDirectory();
  requestAnimationFrame(() =>
    document.getElementById('resources-page')?.classList.replace('page-enter', 'page-active')
  );
}
