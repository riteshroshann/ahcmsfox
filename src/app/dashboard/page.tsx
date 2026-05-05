export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase-server";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: allocation }, { count: complaintCount }, { count: openCount }] = await Promise.all([
    supabase.from("student_profile").select("*").eq("student_id", user!.id).single(),
    supabase.from("allocation").select("*, room(room_code, hostel_code, floor, capacity, current_occupancy)").eq("student_id", user!.id).eq("status", "active").single(),
    supabase.from("complaint").select("*", { count: "exact", head: true }).eq("student_id", user!.id),
    supabase.from("complaint").select("*", { count: "exact", head: true }).eq("student_id", user!.id).not("status", "in", '("resolved","closed")'),
  ]);

  const room = allocation?.ROOM as Record<string, unknown> | null;

  return (
    <>
      <div className="page-header">
        <h2>Welcome, {profile?.name || "Student"}</h2>
        <p>Your hostel dashboard — room details, complaints, and booking.</p>
      </div>

      <div className="card-grid">
        <div className="card card-accent-blue">
          <div className="card-label">Current Room</div>
          <div className="card-value">{room ? String(room.room_code) : "—"}</div>
          <div className="card-sub">{room ? `Floor ${room.floor} · ${room.hostel_code}` : "No active allocation"}</div>
        </div>

        <div className="card card-accent-green">
          <div className="card-label">Hostel</div>
          <div className="card-value" style={{ fontSize: "var(--text-xl)" }}>{profile?.hostel_code || "—"}</div>
          <div className="card-sub">{profile?.program} · Year {new Date().getFullYear() - (profile?.adm_year || 2024) + 1}</div>
        </div>

        <div className="card card-accent-amber">
          <div className="card-label">Total Complaints</div>
          <div className="card-value">{complaintCount || 0}</div>
          <div className="card-sub">{openCount || 0} open</div>
        </div>

        {room && (
          <div className="card card-accent-purple">
            <div className="card-label">Room Occupancy</div>
            <div className="card-value">{String(room.current_occupancy)}/{String(room.capacity)}</div>
            <div className="card-sub">
              <div className="occupancy-bar">
                <div className="occupancy-track">
                  <div
                    className={`occupancy-fill ${Number(room.current_occupancy) >= Number(room.capacity) ? "full" : Number(room.current_occupancy) / Number(room.capacity) > 0.5 ? "mid" : "low"}`}
                    style={{ width: `${(Number(room.current_occupancy) / Number(room.capacity)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </>
  );
}
