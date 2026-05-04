"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface NavConfig {
  label: string;
  href: string;
}

interface SidebarProps {
  role: "student" | "admin";
  userName: string;
}

const studentNav: { section: string; items: NavConfig[] }[] = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard" }],
  },
  {
    section: "Hostel",
    items: [
      { label: "My Room", href: "/dashboard/rooms" },
      { label: "Book a Room", href: "/dashboard/booking" },
    ],
  },
  {
    section: "Support",
    items: [
      { label: "My Complaints", href: "/dashboard/complaints" },
    ],
  },
];

const adminNav: { section: string; items: NavConfig[] }[] = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    section: "Management",
    items: [
      { label: "Rooms", href: "/admin/rooms" },
      { label: "Complaints", href: "/admin/complaints" },
      { label: "Students", href: "/admin/students" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { label: "Allocator", href: "/admin/allocator" },
      { label: "Fairness", href: "/admin/fairness" },
    ],
  },
];

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const sections = role === "admin" ? adminNav : studentNav;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>AHCMS</h1>
        <span>{role === "admin" ? "Administration" : "Student Portal"}</span>
      </div>

      {sections.map((section) => (
        <div className="sidebar-section" key={section.section}>
          <div className="sidebar-section-label">{section.section}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <p style={{ marginBottom: "var(--space-3)" }}>{userName}</p>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
