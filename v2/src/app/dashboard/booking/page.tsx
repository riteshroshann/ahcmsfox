"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function BookingPage() {
  const supabase = createClient();
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([]);
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [peerRoll, setPeerRoll] = useState("");
  const [toast, setToast] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    const { data } = await supabase
      .from("ROOM")
      .select("*")
      .eq("status", "available")
      .order("hostel_code")
      .order("floor")
      .order("room_code");

    // filter client-side for rooms with space
    const available = (data || []).filter((r) => r.current_occupancy < r.capacity);
    setRooms(available);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!selectedRoom) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("ROOM_BOOKING_REQUEST").insert({
      student_id: user!.id,
      preferred_rooms: [selectedRoom],
      intent_text: intent || null,
      parsed_prefs: intent ? { raw: intent, peer_roll: peerRoll || null } : null,
      peer_ids: null,
      status: "pending",
    });

    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: "Booking request submitted" });
      setSelectedRoom(null);
      setIntent("");
      setPeerRoll("");
    }
    setSubmitting(false);
    setTimeout(() => setToast(null), 3000);
  }

  if (loading) return <div className="loading-spinner" />;

  return (
    <>
      <div className="page-header">
        <h2>Book a Room</h2>
        <p>Browse available rooms and submit a booking request for admin approval.</p>
      </div>

      <div className="form-section" style={{ maxWidth: "100%", marginBottom: "var(--space-8)" }}>
        <div className="form-section-title">Your Preferences</div>
        <div className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Describe your ideal room (optional)</label>
            <textarea
              className="form-textarea"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Quiet room on a higher floor, preferably single occupancy near the study area…"
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred roommate roll number</label>
            <input
              className="form-input"
              value={peerRoll}
              onChange={(e) => setPeerRoll(e.target.value)}
              placeholder="e.g. DL.BT.U4AID24124"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-title">Available Rooms ({rooms.length})</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Hostel</th>
              <th>Floor</th>
              <th>Occupancy</th>
              <th>Noise</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr><td colSpan={6} className="table-empty">No rooms available right now.</td></tr>
            ) : rooms.map((room) => (
              <tr key={String(room.room_id)}>
                <td style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{String(room.room_code)}</td>
                <td>{String(room.hostel_code)}</td>
                <td>{String(room.floor)}</td>
                <td>
                  <div className="occupancy-bar">
                    <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}>
                      {String(room.current_occupancy)}/{String(room.capacity)}
                    </span>
                    <div className="occupancy-track">
                      <div
                        className={`occupancy-fill ${Number(room.current_occupancy) / Number(room.capacity) > 0.5 ? "mid" : "low"}`}
                        style={{ width: `${(Number(room.current_occupancy) / Number(room.capacity)) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  {"●".repeat(Number(room.noise_level) || 3)}
                  {"○".repeat(5 - (Number(room.noise_level) || 3))}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${selectedRoom === String(room.room_id) ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setSelectedRoom(String(room.room_id))}
                  >
                    {selectedRoom === String(room.room_id) ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRoom && (
        <div className="form-actions" style={{ borderTop: "none", paddingTop: "var(--space-6)" }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Booking Request"}
          </button>
          <button className="btn btn-secondary" onClick={() => setSelectedRoom(null)}>
            Cancel
          </button>
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
