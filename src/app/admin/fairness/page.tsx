"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#059669", "#d97706", "#dc2626", "#2563eb", "#7c3aed"];

export default function FairnessDashboard() {
  const supabase = createClient();
  const [fairness, setFairness] = useState<Record<string, unknown>[]>([]);
  const [solverRuns, setSolverRuns] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [{ data: fData }, { data: sData }] = await Promise.all([
      supabase.from("v_complaint_fairness_summary").select("*"),
      supabase.from("SOLVER_RUN").select("*").order("created_at", { ascending: false }).limit(10),
    ]);
    setFairness(fData || []);
    setSolverRuns(sData || []);
    setLoading(false);
  }

  if (loading) return <div className="loading-spinner" />;

  const byCategory = Object.entries(
    fairness.reduce<Record<string, { total: number; met: number }>>((acc, f) => {
      const cat = String(f.category || "Other");
      if (!acc[cat]) acc[cat] = { total: 0, met: 0 };
      acc[cat].total++;
      if (f.sla_met) acc[cat].met++;
      return acc;
    }, {})
  ).map(([name, { total, met }]) => ({ name, rate: Math.round((met / total) * 100) }));

  const byHostel = Object.entries(
    fairness.reduce<Record<string, { total: number; sum: number }>>((acc, f) => {
      const h = String(f.hostel_code || "Unknown");
      if (!acc[h]) acc[h] = { total: 0, sum: 0 };
      acc[h].total++;
      acc[h].sum += Number(f.response_time_min) || 0;
      return acc;
    }, {})
  ).map(([name, { total, sum }]) => ({ name, avg: Math.round(sum / total) }));

  const severityDist = Object.entries(
    fairness.reduce<Record<string, number>>((acc, f) => {
      const s = String(f.severity || "Medium");
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <>
      <div className="page-header">
        <h2>Fairness Analytics</h2>
        <p>SLA compliance, response equity, and allocation fairness metrics.</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        <div className="card">
          <div className="card-label">SLA Compliance by Category</div>
          <div style={{ height: 240, marginTop: "var(--space-4)" }}>
            <ResponsiveContainer>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} unit="%" />
                <Tooltip />
                <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-label">Avg Response Time by Hostel (min)</div>
          <div style={{ height: 240, marginTop: "var(--space-4)" }}>
            <ResponsiveContainer>
              <BarChart data={byHostel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip />
                <Bar dataKey="avg" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-label">Severity Distribution</div>
          <div style={{ height: 240, marginTop: "var(--space-4)" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={severityDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {severityDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: "var(--space-8)" }}>
        <div className="table-toolbar">
          <div className="table-toolbar-title">Solver Runs (CP-SAT Allocation)</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hostel</th>
              <th>Status</th>
              <th>Students</th>
              <th>Rooms</th>
              <th>Feasible</th>
              <th>EF1 Violations</th>
              <th>Min Satisfaction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {solverRuns.length === 0 ? (
              <tr><td colSpan={8} className="table-empty">No solver runs yet. Trigger one from the Allocator page.</td></tr>
            ) : solverRuns.map((r) => (
              <tr key={String(r.run_id)}>
                <td style={{ fontFamily: "var(--font-mono)" }}>{String(r.hostel_code)}</td>
                <td><span className={`badge badge-${r.status === "completed" ? "resolved" : r.status === "failed" ? "expired" : "pending"}`}>{String(r.status)}</span></td>
                <td>{String(r.student_count ?? "—")}</td>
                <td>{String(r.room_count ?? "—")}</td>
                <td>{r.feasible === null ? "—" : r.feasible ? "✓" : "✗"}</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>{String(r.ef1_violations ?? "—")}</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>{String(r.min_satisfaction ?? "—")}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                  {new Date(String(r.created_at)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
