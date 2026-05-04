"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
          <h1 style={{
            fontSize: "var(--text-xl)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: "var(--space-2)",
          }}>AHCMS</h1>
          <p style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
          }}>Hostel & Complaint Management</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: "var(--space-5)" }}>
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ahcms.edu.in"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{
              fontSize: "var(--text-xs)",
              color: "var(--accent-red)",
              marginBottom: "var(--space-4)",
            }}>{error}</p>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
