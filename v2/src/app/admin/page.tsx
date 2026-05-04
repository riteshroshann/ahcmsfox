export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: studentCount },
    { count: roomCount },
    { count: openComplaints },
    { count: totalComplaints },
    { count: activeAllocs },
    { count: pendingBookings },
  ] = await Promise.all([
    supabase.from("STUDENT_PROFILE").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("ROOM").select("*", { count: "exact", head: true }),
    supabase.from("COMPLAINT").select("*", { count: "exact", head: true }).not("status", "in", '("resolved","closed")'),
    supabase.from("COMPLAINT").select("*", { count: "exact", head: true }),
    supabase.from("ALLOCATION").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("ROOM_BOOKING_REQUEST").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const { data: recentComplaints } = await supabase
    .from("COMPLAINT")
    .select("ticket_id, description, severity, status, created_at, STUDENT_PROFILE(name), COMPLAINT_CATEGORY(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>System overview — students, rooms, complaints, and allocations at a glance.</p>
      </div>

      <div className="card-grid">
        <div className="card card-accent-blue">
          <div className="card-label">Students</div>
          <div className="card-value">{studentCount || 0}</div>
          <div className="card-sub">registered profiles</div>
        </div>
        <div className="card card-accent-green">
          <div className="card-label">Active Allocations</div>
          <div className="card-value">{activeAllocs || 0}</div>
          <div className="card-sub">across all hostels</div>
        </div>
        <div className="card card-accent-amber">
          <div className="card-label">Open Complaints</div>
          <div className="card-value">{openComplaints || 0}</div>
          <div className="card-sub">{totalComplaints || 0} total</div>
        </div>
        <div className="card card-accent-purple">
          <div className="card-label">Pending Bookings</div>
          <div className="card-value">{pendingBookings || 0}</div>
          <div className="card-sub">awaiting review</div>
        </div>
        <div className="card card-accent-red">
          <div className="card-label">Total Rooms</div>
          <div className="card-value">{roomCount || 0}</div>
          <div className="card-sub">in system</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-title">Recent Complaints</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Filed</th>
            </tr>
          </thead>
          <tbody>
            {(!recentComplaints || recentComplaints.length === 0) ? (
              <tr><td colSpan={5} className="table-empty">No complaints yet.</td></tr>
            ) : recentComplaints.map((c) => (
              <tr key={c.ticket_id}>
                <td>{(c.STUDENT_PROFILE as unknown as Record<string, string>)?.name || "—"}</td>
                <td>{(c.COMPLAINT_CATEGORY as unknown as Record<string, string>)?.name || "—"}</td>
                <td><span className={`badge badge-${c.severity === "Critical" ? "expired" : c.severity === "High" ? "open" : "in-progress"}`}>{c.severity}</span></td>
                <td><span className={`badge badge-${c.status.replace("_", "-")}`}>{c.status.replace("_", " ")}</span></td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
