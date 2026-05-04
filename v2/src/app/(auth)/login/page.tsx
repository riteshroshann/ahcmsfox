"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Role = "student" | "admin" | null;

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.refresh();
    router.push("/");
  }

  // ── Role selection screen ──────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-root)",
        padding: "24px",
      }}>
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "var(--space-2)" }}>
            AHCMS
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            Hostel &amp; Complaint Management
          </p>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sign in as
        </p>

        <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "480px" }}>
          {/* Student card */}
          <button
            onClick={() => setSelectedRole("student")}
            style={{
              flex: 1,
              padding: "32px 20px",
              border: "1px solid #EBEBEB",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              textAlign: "center",
              transition: "border-color 0.15s, box-shadow 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#1A1A2E";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#EBEBEB";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎓</div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#111", margin: "0 0 4px" }}>Student</p>
            <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>Room booking, complaints, status</p>
          </button>

          {/* Admin card */}
          <button
            onClick={() => setSelectedRole("admin")}
            style={{
              flex: 1,
              padding: "32px 20px",
              border: "1px solid #EBEBEB",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              textAlign: "center",
              transition: "border-color 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#1A1A2E";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#EBEBEB";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🏛️</div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#111", margin: "0 0 4px" }}>Admin / Staff</p>
            <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>Manage rooms, allocations, staff</p>
          </button>
        </div>
      </div>
    );
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-root)",
    }}>
      <div className="form-section" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <button
            onClick={() => { setSelectedRole(null); setError(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-secondary)", padding: "0 0 16px", fontFamily: "inherit" }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "var(--space-2)" }}>
            {selectedRole === "admin" ? "Admin Sign in" : "Student Sign in"}
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            {selectedRole === "admin" ? "Warden · Deputy Warden · Staff" : "Enter your institution credentials"}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: "var(--space-5)" }}>
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={selectedRole === "admin" ? "warden@ahcms.edu.in" : "you@ahcms.edu.in"}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "var(--space-6)" }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-red)", marginBottom: "var(--space-4)" }}>
              {error}
            </p>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
