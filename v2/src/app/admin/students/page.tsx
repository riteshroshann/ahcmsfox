export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase-server";

export default async function AdminStudents() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("STUDENT_PROFILE")
    .select("*, ALLOCATION!inner(room_id, status, ROOM(room_code))")
    .is("deleted_at", null)
    .order("name");

  const { data: allStudents } = await supabase
    .from("STUDENT_PROFILE")
    .select("*")
    .is("deleted_at", null)
    .order("name");

  const studentsWithRooms = (allStudents || []).map((s) => {
    const match = (students || []).find(
      (sw) => sw.student_id === s.student_id && (sw.ALLOCATION as Record<string, unknown>)?.status === "active"
    );
    const alloc = match?.ALLOCATION as Record<string, unknown> | undefined;
    const room = alloc?.ROOM as Record<string, string> | undefined;
    return { ...s, room_code: room?.room_code || null };
  });

  return (
    <>
      <div className="page-header">
        <h2>Student Directory</h2>
        <p>All registered students with their current room assignments.</p>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-title">Students ({studentsWithRooms.length})</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Program</th>
              <th>Batch</th>
              <th>Hostel</th>
              <th>Room</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithRooms.length === 0 ? (
              <tr><td colSpan={7} className="table-empty">No students registered.</td></tr>
            ) : studentsWithRooms.map((s) => (
              <tr key={s.student_id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{s.roll_no}</td>
                <td>{s.program}</td>
                <td>{s.batch}</td>
                <td>{s.hostel_code}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                  {s.room_code || <span style={{ color: "var(--text-tertiary)" }}>—</span>}
                </td>
                <td>{s.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
