"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "student" | "admin";
  userName: string;
  rollNo?: string;
}

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  complaints: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  booking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
    </svg>
  ),
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  allocator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  fairness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  theme: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};

const studentNav: { section: string; items: NavItem[] }[] = [
  {
    section: "Navigation",
    items: [
      { label: "Home",           href: "/dashboard",            icon: ICONS.home },
      { label: "My Complaints",  href: "/dashboard/complaints", icon: ICONS.complaints },
      { label: "Book a Room",    href: "/dashboard/booking",    icon: ICONS.booking },
      { label: "My Room",        href: "/dashboard/rooms",      icon: ICONS.rooms },
    ],
  },
];

const adminNav: { section: string; items: NavItem[] }[] = [
  {
    section: "Navigation",
    items: [
      { label: "Home",       href: "/admin",            icon: ICONS.home },
      { label: "Complaints", href: "/admin/complaints", icon: ICONS.complaints },
      { label: "Rooms",      href: "/admin/rooms",      icon: ICONS.rooms },
      { label: "Students",   href: "/admin/students",   icon: ICONS.students },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { label: "Allocator", href: "/admin/allocator", icon: ICONS.allocator },
      { label: "Fairness",  href: "/admin/fairness",  icon: ICONS.fairness },
    ],
  },
];

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("ahcms_theme", next);
}

export default function Sidebar({ role, userName, rollNo }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const sections = role === "admin" ? adminNav : studentNav;
  const initial = (userName || "U")[0].toUpperCase();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>AHCMS</h1>
        <span>{role === "admin" ? "Admin Panel" : "Student Portal"}</span>
      </div>

      {/* User avatar block */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initial}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{userName || "User"}</div>
          <div className="sidebar-user-role">
            {role === "admin" ? "Administrator" : rollNo || "Student"}
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <div className="sidebar-section" key={section.section}>
          <div className="sidebar-section-label">{section.section}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? " active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <button
          className="nav-item"
          onClick={toggleTheme}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", marginBottom: "var(--space-2)", color: "var(--text-secondary)" }}
        >
          {ICONS.theme}
          Toggle Theme
        </button>
        <button
          className="nav-item"
          onClick={handleLogout}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
        >
          {ICONS.logout}
          Sign Out
        </button>
        <p style={{ marginTop: "var(--space-4)" }}>v2.0 · 2026</p>
      </div>
    </aside>
  );
}
