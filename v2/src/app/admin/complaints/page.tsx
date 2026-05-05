"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

type StatusFilter = "all" | "open" | "assigned" | "in_progress" | "resolved" | "closed" | "escalated";

export default function AdminComplaints() {
  const supabase = createClient();
  const [complaints, setComplaints] = useState<Record<string, unknown>[]>([]);
  const [staff, setStaff] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [cRes, sRes] = await Promise.all([
      supabase.from("complaint")
        .select("*, student_profile(name, roll_no, hostel_code), complaint_category(name), staff(name)")
        .order("created_at", { ascending: false }),
      supabase.from("staff").select("*").eq("availability", true).order("active_tickets"),
    ]);
    
    if (cRes.error) {
      setToast({ type: "error", msg: "Supabase Error: " + cRes.error.message });
      console.error("COMPLAINT FETCH ERROR:", cRes.error);
    }
    
    setComplaints(cRes.data || []);
    setStaff(sRes.data || []);
    setLoading(false);
  }

  async function updateStatus(ticketId: string, status: string) {
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "resolved") update.resolved_at = new Date().toISOString();
    if (status === "closed") update.closed_at = new Date().toISOString();

    const { error } = await supabase.from("complaint").update(update).eq("ticket_id", ticketId);
    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: `Status → ${status}` });
      loadData();
    }
    setTimeout(() => setToast(null), 3000);
  }

  async function assignStaff(ticketId: string, staffId: string) {
    const { error } = await supabase.from("complaint")
      .update({ assigned_to: staffId, status: "assigned", updated_at: new Date().toISOString() })
      .eq("ticket_id", ticketId);
    if (error) setToast({ type: "error", msg: error.message });
    else { setToast({ type: "success", msg: "Staff assigned" }); loadData(); }
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  if (loading) return <div className="loading-spinner" />;

  return (
    <>
      <div className="page-header">
        <h2>Complaint Management</h2>
        <p>Review, assign, and resolve hostel complaints across all categories.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        {(["all", "open", "assigned", "in_progress", "resolved", "closed", "escalated"] as StatusFilter[]).map((s) => (
          <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
            {s === "all" ? `All (${complaints.length})` : `${s.replace("_", " ")} (${complaints.filter((c) => c.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Category</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="table-empty">No complaints match this filter.</td></tr>
            ) : filtered.map((c) => (
              <tr key={String(c.ticket_id)}>
                <td>
                  <div style={{ fontWeight: 500 }}>{(c.student_profile as unknown as Record<string, string>)?.name}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{(c.student_profile as unknown as Record<string, string>)?.hostel_code}</div>
                </td>
                <td>{(c.complaint_category as unknown as Record<string, string>)?.name}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{String(c.description)}</td>
                <td><span className={`badge badge-${c.severity === "Critical" ? "expired" : c.severity === "High" ? "open" : "in-progress"}`}>{String(c.severity)}</span></td>
                <td><span className={`badge badge-${String(c.status).replace("_", "-")}`}>{String(c.status).replace("_", " ")}</span></td>
                <td>{(c.staff as unknown as Record<string, string>)?.name || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    {c.status === "open" && (
                      <select
                        className="form-select"
                        style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-xs)", width: "auto" }}
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) assignStaff(String(c.ticket_id), e.target.value); }}
                      >
                        <option value="" disabled>Assign…</option>
                        {staff.map((s) => (
                          <option key={String(s.staff_id)} value={String(s.staff_id)}>
                            {String(s.name)} ({String(s.active_tickets)})
                          </option>
                        ))}
                      </select>
                    )}
                    {c.status !== "resolved" && c.status !== "closed" && c.status !== "open" && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateStatus(String(c.ticket_id), "resolved")}>
                        Resolve
                      </button>
                    )}
                    {c.status === "resolved" && (
                      <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(String(c.ticket_id), "closed")}>
                        Close
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
