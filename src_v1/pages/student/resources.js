/* ─────────────────────────────────
   Student Resources Hub  —  Minimal
   ───────────────────────────────── */

import { api } from '../../api.js';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const MENU = {
  breakfast: [
    ['Poori Chole',     'Matter Kulcha',              'Kachori Bhaji',   'Dosa Sambar',               'Pav Bhaji',         'Macaroni',           'Aloo Paratha'],
    ['Chacos',          'Idli Sambar',                'Daliya',          'Chana Chaat',               'Corn Flakes',       'Idli Sambar',        'Cut Fruits'],
    ['Egg',             'Banana',                     'Egg',             '—',                         'Egg',               '—',                  '—'],
    ['Tea / Coffee',    'Tea / Coffee',               'Tea / Coffee',    'Tea / Coffee',              'Tea / Coffee',      'Tea / Coffee',       'Tea / Coffee'],
    ['Bread & Jam',     'Bread & Jam',                'Bread & Jam',     'Bread & Jam',               'Bread & Jam',       'Bread & Jam',        'Bread & Jam'],
  ],
  lunch: [
    ['Green Salad',     'Green Salad',                'Green Salad',     'Green Salad',               'Green Salad',       'Green Salad',        'Green Salad'],
    ['Boondi Raita',    'Mix Veg Raita',              'Lauki Raita',     'Mix Veg Raita',             'Boondi Raita',      'Mix Veg Raita',      'Mint Raita'],
    ['A / P / C',       'A / P / C',                  'A / P / C',       'A / P / C',                 'A / P / C',         'A / P / C',          'A / P / C'],
    ['Mix Dal Tadka',   'Chole Masala',               'Kadi Pakora',     'Lobhiya / Masoor Dal',      'Rajma Masala',      'Dal Makhani',        'Dal Tadka'],
    ['Matar Paneer',    'Aloo Nutrela',               'Mixed Vegetable', 'Paneer Do Pyaza',           'Handi Kofta Curry', 'Aloo Gobhi Masala',  'Chap Masala'],
    ['Aloo Palak',      'Boiled Rice',                'Soya Chap Gravy', 'Boiled Rice',               'Boiled Rice',       'Boiled Rice',        'Veg Biryani'],
    ['Boiled Rice',     'Chapathi',                   'Jeera Rice',      'Cut Fruits',                'Chapathi',          'Chapathi',           'Chapathi'],
    ['Chapathi',        'Ice Cream',                  'Chapathi',        'Chapathi',                  '—',                 'Besan Barfi',        'Fruit Custard'],
  ],
  hitea: [
    ['Tea / Coffee',    'Tea / Coffee',               'Tea / Coffee',    'Tea / Coffee',              'Tea / Coffee',      'Tea / Coffee',       'Tea / Coffee'],
    ['Veg Hakka Noodles','Bhaji Pakora',             'Veg Sandwich',    'Bread Pakora',              'Cake Slice',        'Potato Wedges',      'Aloo Sandwich'],
  ],
  dinner: [
    ['Green Salad',     'Green Salad',                'Green Salad',     'Green Salad',               'Green Salad',       'Green Salad',        'Green Salad'],
    ['Dal Bukhara',     'Curd',                       'Rajma Masala',    'Curd',                      'Dal Palak',         'Khichdi',            'Curd'],
    ['Veg Jalfrezi',    'Arhar Dal Fry',              'Palak Paneer',    'Mix Dal Tadka',             'Soya Matar Masala', 'Mix Vegetable',      'Dal Dhaba'],
    ['Jeera Pulao',     'Crispy Veg Sweet Chilly',    'Onion Pulao',     'Aloo Chole',                'Tomato Rice',       'Chapati',            'Paneer Lababdar'],
    ['Chapathi',        'Aloo Jeera',                 'Chapathi',        'Masala Rice',               'Chapathi',          'Hot Milk',           'Jeera Pulao'],
    ['Milk',            'Soya Biryani',               'Milk',            'Chapathi',                  'Milk',              '—',                  'Chapathi'],
    ['Rice Kheer',      'Chapathi',                   'Fruit Custard',   'Milk',                      'Boondi',            '—',                  'Milk'],
  ],
};

const MEALS = [
  { key: 'breakfast', label: 'Breakfast',      time: '7:30 – 9:30 AM'  },
  { key: 'lunch',     label: 'Lunch',          time: '12:30 – 2:30 PM' },
  { key: 'hitea',     label: 'Evening Hi-Tea', time: '5:00 – 6:30 PM'  },
  { key: 'dinner',    label: 'Dinner',         time: '7:30 – 9:30 PM'  },
];

function todayColIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function currentMeal() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 19) return 'hitea';
  return 'dinner';
}

export async function renderStudentResources(container) {
  container.innerHTML = `<div class="page-loading">Loading…</div>`;
  let contacts = [];
  try { contacts = await api.get('/resources'); } catch(_) {}
  renderPage(container, contacts);
}

function renderPage(container, contacts) {
  const todayIdx   = todayColIndex();
  let activeMeal   = currentMeal();
  let activeDay    = todayIdx;

  container.innerHTML = `
    <div class="page-enter" id="res-page" style="max-width:1200px;">

      <!-- Header -->
      <div class="page-header">
        <h2>Resources</h2>
        <p style="color:var(--text-tertiary);">Everything you need — menu, health, services.</p>
      </div>

      <!-- ═══════════════════════════════════════
           MESS MENU
      ═══════════════════════════════════════ -->
      <section style="margin-bottom: var(--space-12);">
        <div class="res-section-label">Mess Menu</div>

        <!-- Meal selector -->
        <div style="display:flex; gap:var(--space-2); margin-bottom:var(--space-6); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-4);" id="meal-tabs">
          ${MEALS.map(m => `
            <button data-meal="${m.key}" class="res-meal-tab${m.key === activeMeal ? ' active' : ''}">
              <span class="res-meal-name">${m.label}</span>
              <span class="res-meal-time">${m.time}</span>
            </button>
          `).join('')}
        </div>

        <!-- Day selector -->
        <div style="display:flex; gap:var(--space-2); margin-bottom:var(--space-5); flex-wrap:wrap;" id="day-tabs">
          ${DAYS.map((d, i) => `
            <button class="res-day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">
              ${d.slice(0,3)}${i === todayIdx ? ' ·' : ''}
            </button>
          `).join('')}
        </div>

        <!-- Menu table -->
        <div id="menu-panel" style="overflow-x:auto;"></div>

        <!-- Live counter note -->
        <p style="margin-top:var(--space-5); font-size:var(--text-xs); color:var(--text-tertiary); padding:var(--space-3) var(--space-4); background:var(--bg-elevated); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          One Friday/month — Live counter: Tandoor / Poori &nbsp;·&nbsp; Matar Paneer &nbsp;·&nbsp; One Sweet
        </p>
      </section>

      <!-- ═══════════════════════════════════════
           INFO GRID  (pharmacy / hospital / laundry / canteens)
      ═══════════════════════════════════════ -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); margin-bottom:var(--space-12);">

        <!-- Pharmacy -->
        ${bigCard('Pharmacy', `
          <div class="res-info-block">
            <div class="res-info-place">Campus Pharmacy</div>
            <div class="res-info-line">Ground Floor, OPD Block, Amrita Hospital</div>
            <div class="res-info-line">Mon – Sat &nbsp; 8 AM – 9 PM &nbsp; · &nbsp; Sun 9 AM – 6 PM</div>
            <a href="tel:01294090000" class="res-phone">0129-409-0000</a>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-place">24-Hour Emergency Pharmacy</div>
            <div class="res-info-line">Emergency Block, Ground Floor &nbsp;·&nbsp; Open 24 × 7</div>
            <a href="tel:01294090911" class="res-phone">0129-409-0911</a>
          </div>
        `)}

        <!-- Hospital Booking -->
        ${bigCard('Hospital Appointment', `
          <div class="res-info-block">
            <div class="res-info-place">Amrita Hospital Faridabad</div>
            <div class="res-info-line" style="margin-bottom:var(--space-5);">Book OPD appointments online via the Amrita patient portal.</div>
            <a href="https://www.amritahospitals.org/faridabad/book-appointment"
               target="_blank" rel="noopener" class="res-book-btn">
              Book Appointment
            </a>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-place">Appointment Helpline</div>
            <div class="res-info-line">Mon – Sat &nbsp; 8 AM – 6 PM</div>
            <a href="tel:01294090100" class="res-phone">0129-409-0100</a>
            <a href="tel:18001024647" class="res-phone" style="margin-top:var(--space-1);">1800-102-4647 &nbsp;<span style="font-weight:400;opacity:.6;">Toll Free</span></a>
          </div>
        `)}

        <!-- Laundry -->
        ${bigCard('Laundry', `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
            <div>
              <div class="res-info-place" style="margin-bottom:var(--space-4);">Collection</div>
              ${[['Monday','Boys Hostel (Senior MBBS)'],['Wednesday','Girls Hostel (Senior MBBS)']].map(([d,t])=>
                `<div class="res-laundry-row"><span>${d}</span><span>${t}</span></div>`
              ).join('')}
            </div>
            <div>
              <div class="res-info-place" style="margin-bottom:var(--space-4);">Delivery</div>
              ${[['Thursday','Boys Hostel (Senior MBBS)'],['Saturday','Girls Hostel (Senior MBBS)']].map(([d,t])=>
                `<div class="res-laundry-row"><span>${d}</span><span>${t}</span></div>`
              ).join('')}
            </div>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-line">Label all items with name & roll number. Dry-clean items separately.</div>
            <a href="tel:9999000001" class="res-phone" style="margin-top:var(--space-3);">9999-000-001</a>
          </div>
        `)}

        <!-- Canteens -->
        ${bigCard('Canteens', `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
            <div>
              <div class="res-info-place">Oasis — Day</div>
              <div class="res-info-line" style="margin-top:var(--space-2);">10 AM – 5 PM</div>
              <div class="res-info-line">Min ₹50 · UPI / Cash</div>
              <a href="tel:9876540001" class="res-phone" style="margin-top:var(--space-3);">98765-40001</a>
              <a href="tel:9876540002" class="res-phone" style="margin-top:var(--space-1);">98765-40002</a>
            </div>
            <div style="padding-left:var(--space-6); border-left:1px solid var(--border-subtle);">
              <div class="res-info-place">NT1 — Night</div>
              <div class="res-info-line" style="margin-top:var(--space-2);">9:30 PM – 1 AM</div>
              <div class="res-info-line">UPI / Cash</div>
              <a href="tel:9876540010" class="res-phone" style="margin-top:var(--space-3);">98765-40010</a>
              <a href="tel:9876540011" class="res-phone" style="margin-top:var(--space-1);">98765-40011</a>
            </div>
          </div>
        `)}

      </div>

      <!-- ═══════════════════════════════════════
           CONTACTS (from DB)
      ═══════════════════════════════════════ -->
      ${contacts.length > 0 ? `
        <section>
          <div class="res-section-label" style="margin-bottom:var(--space-5);">Staff Directory</div>
          <div id="contacts-body">${renderContactsHTML(contacts)}</div>
        </section>
      ` : ''}

    </div>
  `;

  // ── Styles injected once ──────────────────────────────────────
  if (!document.getElementById('res-styles')) {
    const s = document.createElement('style');
    s.id = 'res-styles';
    s.textContent = `
      .res-section-label {
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .1em;
        color: var(--text-tertiary);
        margin-bottom: var(--space-6);
      }

      /* Meal tabs */
      .res-meal-tab {
        display: flex; flex-direction: column;
        padding: var(--space-4) var(--space-6);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        background: var(--bg-elevated);
        cursor: pointer;
        transition: all .15s;
        text-align: left;
        gap: 4px;
        min-width: 140px;
      }
      .res-meal-tab:hover { border-color: var(--border-default); }
      .res-meal-tab.active {
        border-color: var(--text-primary);
        background: var(--text-primary);
        color: var(--text-inverse);
      }
      .res-meal-name { font-size: var(--text-sm); font-weight: 600; }
      .res-meal-time { font-size: 11px; opacity: .6; }
      .res-meal-tab.active .res-meal-time { opacity: .7; }

      /* Day tabs */
      .res-day-tab {
        padding: 6px 14px;
        font-size: var(--text-xs);
        font-weight: 500;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full, 999px);
        background: transparent;
        color: var(--text-tertiary);
        cursor: pointer;
        transition: all .15s;
      }
      .res-day-tab:hover { color: var(--text-primary); border-color: var(--border-default); }
      .res-day-tab.active {
        background: var(--text-primary);
        color: var(--text-inverse);
        border-color: transparent;
      }

      /* Big info cards */
      .res-big-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
      }
      .res-card-title {
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .1em;
        color: var(--text-tertiary);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--border-subtle);
      }
      .res-info-block { display: flex; flex-direction: column; }
      .res-info-place {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-2);
      }
      .res-info-line {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        line-height: 1.6;
      }
      .res-phone {
        display: inline-block;
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        font-weight: 600;
        color: var(--text-primary);
        text-decoration: none;
        margin-top: var(--space-3);
      }
      .res-phone:hover { opacity: .7; }
      .res-book-btn {
        display: inline-flex;
        align-items: center;
        padding: 10px 20px;
        background: var(--text-primary);
        color: var(--text-inverse);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        font-weight: 600;
        text-decoration: none;
        transition: opacity .15s;
        align-self: flex-start;
      }
      .res-book-btn:hover { opacity: .75; }

      /* Laundry rows */
      .res-laundry-row {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--space-4);
      }
      .res-laundry-row > span:first-child {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: .04em;
      }
      .res-laundry-row > span:last-child {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: 2px;
      }

      /* Menu table */
      #menu-panel table {
        width: 100%;
        border-collapse: collapse;
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border-subtle);
      }
      #menu-panel th {
        padding: 12px 14px;
        font-size: var(--text-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: .06em;
        text-align: center;
        background: var(--bg-elevated);
        color: var(--text-tertiary);
        border-bottom: 1px solid var(--border-subtle);
      }
      #menu-panel th.today {
        background: var(--text-primary);
        color: var(--text-inverse);
      }
      #menu-panel td {
        padding: 10px 14px;
        font-size: var(--text-xs);
        text-align: center;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-subtle);
        text-transform: uppercase;
        letter-spacing: .02em;
      }
      #menu-panel td.today {
        color: var(--text-primary);
        font-weight: 600;
        background: rgba(0,0,0,.02);
      }
      [data-theme="dark"] #menu-panel td.today { background: rgba(255,255,255,.03); }
      #menu-panel tr:last-child td { border-bottom: none; }

      /* Contact directory */
      .res-dir { display: flex; flex-direction: column; }
      .res-dir-group { margin-bottom: var(--space-8); }
      .res-dir-cat {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .12em; color: var(--text-tertiary);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--border-subtle);
        margin-bottom: var(--space-4);
      }
      .res-dir-row {
        display: flex; align-items: baseline;
        justify-content: space-between; flex-wrap: wrap;
        gap: var(--space-2) var(--space-6);
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--border-subtle);
      }
      .res-dir-row:last-child { border-bottom: none; }
      .res-dir-name {
        font-size: var(--text-sm); font-weight: 600;
        color: var(--text-primary); flex-shrink: 0;
      }
      .res-dir-note {
        font-size: var(--text-xs); color: var(--text-tertiary);
        margin-top: 2px;
      }
      .res-dir-contacts {
        display: flex; align-items: center; gap: var(--space-4);
        flex-shrink: 0; flex-wrap: wrap;
      }
      .res-dir-phone {
        font-size: var(--text-xs); font-family: var(--font-mono);
        font-weight: 600; color: var(--text-primary);
        text-decoration: none; white-space: nowrap;
      }
      .res-dir-phone:hover { opacity: .65; }
      .res-dir-email {
        font-size: var(--text-xs); color: var(--text-tertiary);
        text-decoration: none; white-space: nowrap;
      }
      .res-dir-email:hover { color: var(--text-primary); }

      @media (max-width: 768px) {
        .res-big-grid { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(s);
  }

  // ── Menu render ───────────────────────────────────────────────
  function renderMenu() {
    const rows  = MENU[activeMeal];
    const panel = document.getElementById('menu-panel');
    if (!panel) return;
    panel.innerHTML = `
      <table>
        <thead>
          <tr>
            ${DAYS.map((d, i) => `<th class="${i === activeDay ? 'today' : ''}">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${row.map((cell, ci) => `<td class="${ci === activeDay ? 'today' : ''}">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  document.getElementById('meal-tabs').querySelectorAll('.res-meal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('meal-tabs').querySelectorAll('.res-meal-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMeal = btn.dataset.meal;
      renderMenu();
    });
  });

  document.getElementById('day-tabs').querySelectorAll('.res-day-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('day-tabs').querySelectorAll('.res-day-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDay = +btn.dataset.day;
      renderMenu();
    });
  });

  renderMenu();
  requestAnimationFrame(() =>
    document.getElementById('res-page')?.classList.replace('page-enter', 'page-active')
  );
}

// ── Helpers ────────────────────────────────────────────────────
function bigCard(title, bodyHTML) {
  return `
    <div class="res-big-card">
      <div class="res-card-title">${title}</div>
      ${bodyHTML}
    </div>
  `;
}

function renderContactsHTML(contacts) {
  const ORDER = ['Authority','Electrician','Plumber','WiFi','Other'];
  const CAT_LABEL = {
    Authority:    'Authority',
    Electrician:  'Electrician',
    Plumber:      'Plumber',
    WiFi:         'Wi-Fi / IT',
    Other:        'Other',
  };
  const grouped = {};
  contacts.forEach(r => { (grouped[r.category] = grouped[r.category] || []).push(r); });

  const cats = [...ORDER.filter(c => grouped[c]), ...Object.keys(grouped).filter(c => !ORDER.includes(c))];

  return `<div class="res-dir">${cats.map(cat => `
    <div class="res-dir-group">
      <div class="res-dir-cat">${CAT_LABEL[cat] || cat}</div>
      ${grouped[cat].map(r => `
        <div class="res-dir-row">
          <div>
            <div class="res-dir-name">${r.name}</div>
            ${r.notes ? `<div class="res-dir-note">${r.notes}</div>` : ''}
          </div>
          <div class="res-dir-contacts">
            ${r.phone ? `<a class="res-dir-phone" href="tel:${r.phone}">${r.phone}</a>` : ''}
            ${r.email ? `<a class="res-dir-email" href="mailto:${r.email}">${r.email}</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('')}</div>`;
}

