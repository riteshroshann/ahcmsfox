/* ─────────────────────────────────
   Login Page
   Student (Roll No + Password)
   Admin (Email + Password)
   ───────────────────────────────── */

import { api } from '../api.js';
import { saveSession } from '../auth.js';
import { toast } from '../components/toast.js';

export function renderLogin(onSuccess) {
  document.body.innerHTML = `
    <div class="login-page">
      <div class="login-panel" style="position: relative;">

        <button id="login-theme" style="position: absolute; top: var(--space-6); right: var(--space-6); background: transparent; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--space-2); border-radius: var(--radius-md);" title="Toggle Theme" aria-label="Toggle Theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <div class="login-brand">
          <div class="login-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1>AHCMS</h1>
          <p>Amrita Hostel &amp; Complaint Management, Delhi NCR</p>
        </div>

        <div class="login-tabs">
          <button class="login-tab active" id="tab-student" data-tab="student">Student</button>
          <button class="login-tab" id="tab-admin" data-tab="admin">Admin</button>
        </div>

        <!-- Student Login -->
        <form id="form-student" class="login-form" novalidate>
          <div class="login-form-group">
            <label for="s-roll">Roll Number</label>
            <input type="text" id="s-roll" class="login-input" placeholder="e.g. DL.MBBS.U4AID24120" autocomplete="username" />
          </div>
          <div class="login-form-group">
            <label for="s-pass">Password</label>
            <input type="password" id="s-pass" class="login-input" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <p class="login-hint">Demo credentials &mdash; Roll: <code>DL.MBBS.U4AID24120</code> Pass: <code>Student@123</code></p>
          <button type="submit" class="login-btn" id="btn-student-login">Sign In</button>
          <div class="login-error" id="err-student"></div>
        </form>

        <!-- Admin Login -->
        <form id="form-admin" class="login-form hidden" novalidate>
          <div class="login-form-group">
            <label for="a-email">Email</label>
            <input type="email" id="a-email" class="login-input" placeholder="admin@ahcms.edu.in" autocomplete="username" />
          </div>
          <div class="login-form-group">
            <label for="a-pass">Password</label>
            <input type="password" id="a-pass" class="login-input" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <p class="login-hint">Demo credentials — Email: <code>admin@ahcms.edu.in</code> Pass: <code>Admin@123</code></p>
          <button type="submit" class="login-btn" id="btn-admin-login">Sign In</button>
          <div class="login-error" id="err-admin"></div>
          <div class="login-divider">or</div>
          <button type="button" class="login-btn login-btn-outline" id="btn-show-register">Create Admin Account</button>
        </form>

        <!-- Admin Register (hidden until clicked) -->
        <form id="form-register" class="login-form hidden" novalidate>
          <div class="login-form-group">
            <label for="r-name">Full Name</label>
            <input type="text" id="r-name" class="login-input" placeholder="Your full name" />
          </div>
          <div class="login-form-group">
            <label for="r-email">Email</label>
            <input type="email" id="r-email" class="login-input" placeholder="you@ahcms.edu.in" />
          </div>
          <div class="login-form-group">
            <label for="r-pass">Password</label>
            <input type="password" id="r-pass" class="login-input" placeholder="Min. 8 characters (e.g. Admin@123)" />
          </div>
          <button type="submit" class="login-btn" id="btn-register">Create Account</button>
          <div class="login-error" id="err-register"></div>
          <button type="button" class="login-btn login-btn-ghost" id="btn-back-login">← Back to Login</button>
        </form>

      </div>

      <div class="login-art">
        <div class="login-art-content">
          <h2>Your hostel,<br>fully managed.</h2>
          <p>Room allocations, complaints, community — all in one place.</p>
          <div class="login-art-dots">
            <span class="dot dot-blue"></span>
            <span class="dot dot-green"></span>
            <span class="dot dot-purple"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Theme toggle on login page
  document.getElementById('login-theme')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ahcms_theme', next);
  });

  // Tab switching
  let activeTab = 'student';
  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('form-student').classList.toggle('hidden', activeTab !== 'student');
      document.getElementById('form-admin').classList.toggle('hidden', activeTab !== 'admin');
      document.getElementById('form-register').classList.add('hidden');
    });
  });

  // Admin register toggle
  document.getElementById('btn-show-register').addEventListener('click', () => {
    document.getElementById('form-admin').classList.add('hidden');
    document.getElementById('form-register').classList.remove('hidden');
  });
  document.getElementById('btn-back-login').addEventListener('click', () => {
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('form-admin').classList.remove('hidden');
  });

  // Helper: set loading state
  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    btn.disabled = loading;
    btn.textContent = loading ? 'Signing in…' : 'Sign In';
  }

  // Student login
  document.getElementById('form-student').addEventListener('submit', async e => {
    e.preventDefault();
    const roll_no  = document.getElementById('s-roll').value.trim();
    const password = document.getElementById('s-pass').value;
    const errEl    = document.getElementById('err-student');
    errEl.textContent = '';
    if (!roll_no || !password) { errEl.textContent = 'All fields required.'; return; }

    setLoading('btn-student-login', true);
    try {
      const { token, user } = await api.post('/auth/student/login', { roll_no, password });
      saveSession(token, user);
      onSuccess();
    } catch (err) {
      errEl.textContent = err.message;
    } finally {
      setLoading('btn-student-login', false);
    }
  });

  // Admin login
  document.getElementById('form-admin').addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('a-email').value.trim();
    const password = document.getElementById('a-pass').value;
    const errEl    = document.getElementById('err-admin');
    errEl.textContent = '';
    if (!email || !password) { errEl.textContent = 'All fields required.'; return; }

    setLoading('btn-admin-login', true);
    try {
      const { token, user } = await api.post('/auth/admin/login', { email, password });
      saveSession(token, user);
      onSuccess();
    } catch (err) {
      errEl.textContent = err.message;
    } finally {
      setLoading('btn-admin-login', false);
    }
  });

  // Admin register
  document.getElementById('form-register').addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.getElementById('r-name').value.trim();
    const email    = document.getElementById('r-email').value.trim();
    const password = document.getElementById('r-pass').value;
    const errEl    = document.getElementById('err-register');
    errEl.textContent = '';
    if (!name || !email || !password) { errEl.textContent = 'All fields required.'; return; }
    if (password.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; return; }

    const btn = document.getElementById('btn-register');
    btn.disabled = true; btn.textContent = 'Creating…';
    try {
      await api.post('/auth/admin/register', { name, email, password });
      toast('Account created! Please sign in.', 'success');
      document.getElementById('btn-back-login').click();
      document.getElementById('a-email').value = email;
    } catch (err) {
      errEl.textContent = err.message;
    } finally {
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  });
}
