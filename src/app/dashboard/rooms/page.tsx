export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase-server";

export default async function StudentRooms() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allocation } = await supabase
    .from("allocation")
    .select("*, room(room_code, hostel_code, floor, capacity, current_occupancy, noise_level, features, status)")
    .eq("student_id", user!.id)
    .eq("status", "active")
    .single();

  const room = allocation?.room as Record<string, unknown> | null;

  const { data: roommates } = room ? await supabase
    .from("allocation")
    .select("student_profile(name, roll_no, program)")
    .eq("room_id", allocation!.room_id)
    .eq("status", "active")
    .neq("student_id", user!.id) : { data: null };

  return (
    <>
      <div className="page-header">
        <h2>My Room</h2>
        <p>Your current room allocation details and roommate information.</p>
      </div>

      {!allocation ? (
        <div className="form-section">
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            You don't have an active room allocation. Visit the booking page to request one.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-6)", maxWidth: 640 }}>
          <div className="form-section">
            <div className="form-section-title">Room Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
              <div>
                <div className="form-label">Room Code</div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, fontFamily: "var(--font-mono)", marginTop: "var(--space-2)" }}>{String(room?.room_code)}</div>
              </div>
              <div>
                <div className="form-label">Floor</div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginTop: "var(--space-2)" }}>{String(room?.floor)}</div>
              </div>
              <div>
                <div className="form-label">Hostel</div>
                <div style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>{String(room?.hostel_code)}</div>
              </div>
              <div>
                <div className="form-label">Occupancy</div>
                <div style={{ marginTop: "var(--space-2)" }}>
                  <div className="occupancy-bar">
                    <span style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>{String(room?.current_occupancy)}/{String(room?.capacity)}</span>
                    <div className="occupancy-track">
                      <div
                        className={`occupancy-fill ${Number(room?.current_occupancy) >= Number(room?.capacity) ? "full" : "low"}`}
                        style={{ width: `${(Number(room?.current_occupancy) / Number(room?.capacity)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="form-label">Period</div>
                <div style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                  {allocation.start_date} → {allocation.end_date || "ongoing"}
                </div>
              </div>
              <div>
                <div className="form-label">Status</div>
                <div style={{ marginTop: "var(--space-2)" }}>
                  <span className="badge badge-active">{allocation.status}</span>
                </div>
              </div>
            </div>
          </div>

          {roommates && roommates.length > 0 && (
            <div className="form-section">
              <div className="form-section-title">Roommates</div>
              {roommates.map((rm, i) => {
                const sp = rm.student_profile as unknown as Record<string, string> | null;
                return (
                  <div key={i} style={{
                    padding: "var(--space-4)",
                    borderBottom: i < roommates.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{sp?.name}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{sp?.roll_no}</div>
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{sp?.program}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
