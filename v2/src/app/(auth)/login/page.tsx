"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const theme = localStorage.getItem("ahcms_theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ahcms_theme", next);
  }

  async function handleStudentLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!rollNo || !password) { setError("All fields required."); return; }
    setLoading(true);

    // Students log in with roll_no as email alias
    const studentEmail = `${rollNo.toLowerCase().replace(/[^a-z0-9]/g, "")}@ahcms.edu.in`;
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: studentEmail,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.refresh();
    router.push("/");
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields required."); return; }
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

  return (
    <div className="login-page">
      <div className="login-panel">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: "absolute", top: "var(--space-6)", right: "var(--space-6)",
            background: "transparent", border: "none", color: "var(--text-tertiary)",
            cursor: "pointer", padding: "var(--space-2)", borderRadius: "var(--radius-md)",
          }}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1>AHCMS</h1>
          <p>Amrita Hostel &amp; Complaint Management, Delhi NCR</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => { setActiveTab("student"); setError(""); }}
          >
            Student
          </button>
          <button
            className={`login-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => { setActiveTab("admin"); setError(""); }}
          >
            Admin
          </button>
        </div>

        {/* Student Login Form */}
        {activeTab === "student" && (
          <form className="login-form" onSubmit={handleStudentLogin} noValidate>
            <div className="login-form-group">
              <label htmlFor="s-roll">Roll Number</label>
              <input
                id="s-roll"
                className="login-input"
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g. DL.MBBS.U4AID24120"
                autoComplete="username"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="s-pass">Password</label>
              <input
                id="s-pass"
                className="login-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <p className="login-hint">
              Demo credentials &mdash; Roll: <code>DL.MBBS.U4AID24120</code> Pass: <code>Student@123</code>
            </p>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* Admin Login Form */}
        {activeTab === "admin" && (
          <form className="login-form" onSubmit={handleAdminLogin} noValidate>
            <div className="login-form-group">
              <label htmlFor="a-email">Email</label>
              <input
                id="a-email"
                className="login-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ahcms.edu.in"
                autoComplete="username"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="a-pass">Password</label>
              <input
                id="a-pass"
                className="login-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <p className="login-hint">
              Demo credentials — Email: <code>admin@ahcms.edu.in</code> Pass: <code>Admin@123</code>
            </p>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}
      </div>

      {/* Art Panel */}
      <div className="login-art">
        <div className="login-art-content">
          <h2>Your hostel,<br />fully managed.</h2>
          <p>Room allocations, complaints, community — all in one place.</p>
          <div className="login-art-dots">
            <span className="dot dot-blue" />
            <span className="dot dot-green" />
            <span className="dot dot-purple" />
          </div>
        </div>
      </div>
    </div>
  );
}
