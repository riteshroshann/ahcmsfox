"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AllocatorPage() {
  const supabase = createClient();
  const [hostels, setHostels] = useState<Record<string, unknown>[]>([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [alpha, setAlpha] = useState(1.0);
  const [beta, setBeta] = useState(0.5);
  const [gamma, setGamma] = useState(0.3);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [toast, setToast] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => {
    supabase.from("HOSTEL").select("*").order("code").then(({ data }) => setHostels(data || []));
  }, []);

  async function triggerSolver() {
    if (!selectedHostel) return;
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostel_code: selectedHostel, alpha, beta, gamma }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Solver failed");
      setResult(data);
      setToast({ type: "success", msg: `Allocation complete — ${data.allocations_made} assignments` });
    } catch (err) {
      setToast({ type: "error", msg: (err as Error).message });
    }

    setRunning(false);
    setTimeout(() => setToast(null), 5000);
  }

  return (
    <>
      <div className="page-header">
        <h2>CP-SAT Room Allocator</h2>
        <p>Run the constraint-satisfaction solver to optimally assign students to rooms with fairness guarantees.</p>
      </div>

      <div className="form-section" style={{ marginBottom: "var(--space-8)" }}>
        <div className="form-section-title">Solver Configuration</div>
        <div className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Target Hostel</label>
            <select className="form-select" value={selectedHostel} onChange={(e) => setSelectedHostel(e.target.value)}>
              <option value="">Select hostel…</option>
              {hostels.map((h) => (
                <option key={String(h.code)} value={String(h.code)}>{String(h.name)} ({String(h.code)})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">α (satisfaction weight)</label>
            <input className="form-input" type="number" step="0.1" min="0" max="5" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">β (envy penalty)</label>
            <input className="form-input" type="number" step="0.1" min="0" max="5" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">γ (min-satisfaction weight)</label>
            <input className="form-input" type="number" step="0.1" min="0" max="5" value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))} />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={triggerSolver} disabled={running || !selectedHostel}>
            {running ? "Running solver…" : "Run CP-SAT Allocation"}
          </button>
        </div>
      </div>

      {result && (
        <div className="card-grid">
          <div className="card card-accent-green">
            <div className="card-label">Allocations Made</div>
            <div className="card-value">{String(result.allocations_made)}</div>
          </div>
          <div className="card card-accent-blue">
            <div className="card-label">Objective Value</div>
            <div className="card-value">{Number(result.objective_value).toFixed(1)}</div>
          </div>
          <div className="card card-accent-amber">
            <div className="card-label">EF1 Violations</div>
            <div className="card-value">{String(result.ef1_violations)}</div>
          </div>
          <div className="card card-accent-purple">
            <div className="card-label">Min Satisfaction</div>
            <div className="card-value">{String(result.min_satisfaction)}</div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
