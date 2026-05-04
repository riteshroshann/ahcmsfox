/* ─────────────────────────────────
   Sidebar Navigation — Role-Aware
   ───────────────────────────────── */

import { getRole, getUser, logout } from '../auth.js';

const ICONS = {
  home:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  complaints: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="15" r="0.5" fill="currentColor"/></svg>`,
  booking:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  forum:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/><path d="M15 3H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>`,
  rooms:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  resources:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  logout:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  theme:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  menu:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

const STUDENT_NAV = [
  { id: 'home',       label: 'Home',            icon: ICONS.home },
  { id: 'complaints', label: 'Complaint',        icon: ICONS.complaints },
  { id: 'booking',    label: 'Room Booking',     icon: ICONS.booking },
  { id: 'resources',  label: 'Resources',        icon: ICONS.resources },
];

const ADMIN_NAV = [
  { id: 'home',       label: 'Home',            icon: ICONS.home },
  { id: 'complaints', label: 'Complaints',       icon: ICONS.complaints },
  { id: 'rooms',      label: 'Room Details',     icon: ICONS.rooms },
  { id: 'resources',  label: 'Resources',        icon: ICONS.resources },
];

export function renderNav(container, activeId, onNavigate) {
  const role  = getRole();
  const user  = getUser();
  const items = role === 'admin' ? ADMIN_NAV : STUDENT_NAV;
  const label = role === 'admin' ? 'Admin Panel' : 'Student Portal';

  container.innerHTML = `
    <div class="sidebar-brand">
      <h1>AHCMS</h1>
      <span>${label}</span>
    </div>

    <div class="sidebar-user">
      <div class="sidebar-user-avatar">${(user?.name || 'U')[0].toUpperCase()}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${user?.name || 'User'}</div>
        <div class="sidebar-user-role">${role === 'admin' ? 'Administrator' : user?.roll_no || 'Student'}</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Navigation</div>
      ${items.map(item => `
        <a class="nav-item${item.id === activeId ? ' active' : ''}"
           data-page="${item.id}"
           id="nav-${item.id}"
           role="button"
           tabindex="0">
          ${item.icon}
          ${item.label}
        </a>
      `).join('')}
    </div>

    <div class="sidebar-footer">
      <button class="nav-item logout-btn" id="nav-theme" style="margin-bottom: var(--space-2); color: var(--text-secondary);">
        ${ICONS.theme}
        Toggle Theme
      </button>
      <button class="nav-item logout-btn" id="nav-logout">
        ${ICONS.logout}
        Sign Out
      </button>
      <p>v2.0 · 2026</p>
    </div>
  `;

  container.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => onNavigate(el.dataset.page));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  document.getElementById('nav-logout')?.addEventListener('click', () => {
    logout();
    window.location.reload();
  });

  document.getElementById('nav-theme')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ahcms_theme', next);
  });
}

export function createMobileToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.id = 'sidebar-toggle';
  toggle.innerHTML = ICONS.menu;
  toggle.setAttribute('aria-label', 'Toggle navigation');

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';

  document.body.appendChild(toggle);
  document.body.appendChild(overlay);

  const sidebar = document.getElementById('sidebar');

  function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('show'); toggle.innerHTML = ICONS.close; }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); toggle.innerHTML = ICONS.menu; }

  toggle.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
  overlay.addEventListener('click', closeSidebar);

  return { close: closeSidebar };
}
