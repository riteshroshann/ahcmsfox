/* ─────────────────────────────────
   Client-side Auth Utilities
   Backed by localStorage
   ───────────────────────────────── */

const TOKEN_KEY = 'ahcms_token';
const USER_KEY  = 'ahcms_user';

// One-time migration: carry forward sessions stored under the old key names
(function migrateKeys() {
  const oldToken = localStorage.getItem('cw_hostel_token');
  const oldUser  = localStorage.getItem('cw_hostel_user');
  if (oldToken) { localStorage.setItem(TOKEN_KEY, oldToken); localStorage.removeItem('cw_hostel_token'); }
  if (oldUser)  { localStorage.setItem(USER_KEY,  oldUser);  localStorage.removeItem('cw_hostel_user');  }
})();

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function getRole() {
  return getUser()?.role || null;
}

export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode payload (no verify — server verifies on each request)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
