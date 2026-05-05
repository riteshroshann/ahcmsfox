"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AdminStudents() {
  const supabase = createClient();
  const [allStudents, setAllStudents] = useState<Record<string, unknown>[]>([]);
  const [allocMap, setAllocMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<"All" | "M" | "F">("All");

  useEffect(() => {
    async function loadData() {
      // Fetch all students
      const { data: students } = await supabase
        .from("student_profile")
        .select("*")
        .is("deleted_at", null)
        .order("name");

      // Fetch ALL active allocations separately (avoids the inner-join RLS block)
      const { data: allocations } = await supabase
        .from("allocation")
        .select("student_id, room_id, status, room(room_code)")
        .eq("status", "active");

      // Build a map: student_id -> room_code
      const map: Record<string, string> = {};
      for (const a of allocations || []) {
        const alloc = a as Record<string, unknown>;
        const room = alloc.room as Record<string, string> | null;
        if (room?.room_code) {
          map[alloc.student_id as string] = room.room_code;
        }
      }

      setAllStudents(students || []);
      setAllocMap(map);
      setLoading(false);
    }
    loadData();
  }, []);

  const boys = allStudents.filter(s => s.gender === "M");
  const girls = allStudents.filter(s => s.gender === "F");
  const filteredStudents = genderFilter === "All" ? allStudents
    : genderFilter === "M" ? boys : girls;

  return (
    <>
      <div className="page-header">
        <h2>Student Directory</h2>
        <p>All registered students with their current room assignments.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <button className={`filter-chip ${genderFilter === "All" ? "active" : ""}`} onClick={() => setGenderFilter("All")}>
          All Students ({allStudents.length})
        </button>
        <button className={`filter-chip ${genderFilter === "M" ? "active" : ""}`} onClick={() => setGenderFilter("M")}>
          Boys ({boys.length})
        </button>
        <button className={`filter-chip ${genderFilter === "F" ? "active" : ""}`} onClick={() => setGenderFilter("F")}>
          Girls ({girls.length})
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
              ) : filteredStudents.map((s) => {
                const roomCode = allocMap[s.student_id as string];
                return (
                  <tr key={s.student_id as string}>
                    <td style={{ fontWeight: 500 }}>{s.name as string}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{s.roll_no as string}</td>
                    <td>{s.program as string}</td>
                    <td>{s.batch as string}</td>
                    <td>{s.hostel_code as string}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                      {roomCode
                        ? <span style={{ color: "var(--text-primary)" }}>{roomCode}</span>
                        : <span style={{ color: "var(--text-tertiary)" }}>—</span>}
                    </td>
                    <td>{s.gender as string}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
