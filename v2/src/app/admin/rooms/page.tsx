"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AdminRooms() {
  const supabase = createClient();
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([]);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"rooms" | "bookings">("rooms");
  const [toast, setToast] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [{ data: roomData }, { data: bookingData }] = await Promise.all([
      supabase.from("ROOM").select("*").order("hostel_code").order("floor").order("room_code"),
      supabase.from("ROOM_BOOKING_REQUEST").select("*, STUDENT_PROFILE(name, roll_no)").order("created_at", { ascending: false }),
    ]);
    setRooms(roomData || []);
    setBookings(bookingData || []);
    setLoading(false);
  }

  async function handleBookingAction(requestId: string, action: "approved" | "rejected") {
    const { error } = await supabase
      .from("ROOM_BOOKING_REQUEST")
      .update({ status: action, updated_at: new Date().toISOString() })
      .eq("request_id", requestId);

    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: `Booking ${action}` });
      loadData();
    }
    setTimeout(() => setToast(null), 3000);
  }

  if (loading) return <div className="loading-spinner" />;

  return (
    <>
      <div className="page-header">
        <h2>Room Management</h2>
        <p>View all rooms, manage booking requests, and track occupancy.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <button className={`filter-chip ${tab === "rooms" ? "active" : ""}`} onClick={() => setTab("rooms")}>
          All Rooms ({rooms.length})
        </button>
        <button className={`filter-chip ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
          Booking Requests ({bookings.filter((b) => b.status === "pending").length} pending)
        </button>
      </div>

      {tab === "rooms" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Hostel</th>
                <th>Floor</th>
                <th>Occupancy</th>
                <th>Status</th>
                <th>Noise</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={String(r.room_id)}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{String(r.room_code)}</td>
                  <td>{String(r.hostel_code)}</td>
                  <td>{String(r.floor)}</td>
                  <td>
                    <div className="occupancy-bar">
                      <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}>{String(r.current_occupancy)}/{String(r.capacity)}</span>
                      <div className="occupancy-track">
                        <div
                          className={`occupancy-fill ${Number(r.current_occupancy) >= Number(r.capacity) ? "full" : Number(r.current_occupancy) / Number(r.capacity) > 0.5 ? "mid" : "low"}`}
                          style={{ width: `${(Number(r.current_occupancy) / Number(r.capacity)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${r.status === "available" ? "active" : r.status === "full" ? "expired" : "pending"}`}>{String(r.status)}</span></td>
                  <td>{"●".repeat(Number(r.noise_level) || 3)}{"○".repeat(5 - (Number(r.noise_level) || 3))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "bookings" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Intent</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">No booking requests.</td></tr>
              ) : bookings.map((b) => (
                <tr key={String(b.request_id)}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{(b.STUDENT_PROFILE as unknown as Record<string, string>)?.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{(b.STUDENT_PROFILE as unknown as Record<string, string>)?.roll_no}</div>
                  </td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{String(b.intent_text || "—")}</td>
                  <td><span className={`badge badge-${String(b.status)}`}>{String(b.status)}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                    {new Date(String(b.created_at)).toLocaleDateString()}
                  </td>
                  <td>
                    {b.status === "pending" && (
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <button className="btn btn-sm btn-primary" onClick={() => handleBookingAction(String(b.request_id), "approved")}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleBookingAction(String(b.request_id), "rejected")}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
