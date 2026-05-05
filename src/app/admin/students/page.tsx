"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AdminStudents() {
  const supabase = createClient();
  const [studentsWithRooms, setStudentsWithRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<"All" | "M" | "F">("All");

  useEffect(() => {
    async function loadData() {
      const { data: students } = await supabase
        .from("student_profile")
        .select("*, allocation!inner(room_id, status, room(room_code))")
        .is("deleted_at", null)
        .order("name");

      const { data: allStudents } = await supabase
        .from("student_profile")
        .select("*")
        .is("deleted_at", null)
        .order("name");

      const mapped = (allStudents || []).map((s) => {
        const match = (students || []).find(
          (sw) => sw.student_id === s.student_id && (sw.allocation as any)?.status === "active"
        );
        const alloc = match?.allocation as any;
        const room = alloc?.room as any;
        return { ...s, room_code: room?.room_code || null };
      });

      setStudentsWithRooms(mapped);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredStudents = studentsWithRooms.filter((s) => {
    if (genderFilter === "All") return true;
    return s.gender === genderFilter;
  });

  return (
    <>
      <div className="page-header">
        <h2>Student Directory</h2>
        <p>All registered students with their current room assignments.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <button 
          className={`filter-chip ${genderFilter === "All" ? "active" : ""}`} 
          onClick={() => setGenderFilter("All")}
        >
          All Students ({studentsWithRooms.length})
        </button>
        <button 
          className={`filter-chip ${genderFilter === "M" ? "active" : ""}`} 
          onClick={() => setGenderFilter("M")}
        >
          Boys ({studentsWithRooms.filter(s => s.gender === "M").length})
        </button>
        <button 
          className={`filter-chip ${genderFilter === "F" ? "active" : ""}`} 
          onClick={() => setGenderFilter("F")}
        >
          Girls ({studentsWithRooms.filter(s => s.gender === "F").length})
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-tertiary)" }}>
            Loading directory...
          </div>
        ) : (
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
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">No students found.</td></tr>
              ) : filteredStudents.map((s) => (
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
        )}
      </div>
    </>
  );
}
