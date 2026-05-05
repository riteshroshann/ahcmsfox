export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase-server";

export default async function StudentComplaints() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: complaints } = await supabase
    .from("complaint")
    .select("*, complaint_category(name)")
    .eq("student_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="page-header">
        <h2>My Complaints</h2>
        <p>Track the status of your hostel maintenance requests.</p>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-title">Complaints ({complaints?.length || 0})</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Filed</th>
            </tr>
          </thead>
          <tbody>
            {(!complaints || complaints.length === 0) ? (
              <tr><td colSpan={5} className="table-empty">No complaints filed yet.</td></tr>
            ) : complaints.map((c) => (
              <tr key={c.ticket_id}>
                <td>{(c.complaint_category as unknown as Record<string, string>)?.name || "—"}</td>
                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>{c.description}</td>
                <td><span className={`badge badge-${c.severity === "Critical" ? "expired" : c.severity === "High" ? "open" : c.severity === "Medium" ? "in-progress" : "active"}`}>{c.severity}</span></td>
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
