/* ─────────────────────────────────────────────────
   Hostel Store — shared global filter state
   Uses localStorage + a custom event so any page
   can react to hostel selection changes without
   reloading the entire SPA.
   ─────────────────────────────────────────────────
   Usage:
     import { getHostel, setHostel, onHostelChange } from '../components/hostelStore.js';

     getHostel()         → '' | 'Sardha building : Block A (girls)' | …
     setHostel(value)    → stores + fires 'hostel-change' event
     onHostelChange(fn)  → fn(hostel) called on every change
   ───────────────────────────────────────────────── */

const KEY = 'ahcms_hostel_filter';

export function getHostel() {
  return localStorage.getItem(KEY) || '';
}

export function setHostel(value) {
  if (value) {
    localStorage.setItem(KEY, value);
  } else {
    localStorage.removeItem(KEY);
  }
  window.dispatchEvent(new CustomEvent('hostel-change', { detail: value }));
}

export function onHostelChange(fn) {
  window.addEventListener('hostel-change', e => fn(e.detail));
}
