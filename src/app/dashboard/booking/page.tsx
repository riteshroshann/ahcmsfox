"use client";

import { useState, useTransition, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { parseRoomIntent, type ParsedRoomPrefs } from "@/app/actions/parseRoomIntent";
import Link from "next/link";

interface RoomMatch {
  room_id: string;
  room_code: string;
  floor: number;
  label: string;
  capacity: number;
  current_occupancy: number;
  noise_level: number;
  features: string[] | null;
  score: number;
}

function scoreRoom(room: Omit<RoomMatch, "score">, prefs: ParsedRoomPrefs): number {
  let score = 50;
  if (prefs.floor_pref !== null && room.floor === prefs.floor_pref) score += 20;
  if (prefs.noise_pref !== null) score -= Math.abs((room.noise_level ?? 3) - prefs.noise_pref) * 8;
  if (prefs.features.length > 0 && room.features) {
    const matched = prefs.features.filter(f =>
      room.features!.some(rf => rf.toLowerCase().includes(f.toLowerCase()))
    );
    score += matched.length * 10;
  }
  score += Math.max(0, (room.capacity - room.current_occupancy - 1) * 3);
  return Math.min(100, Math.max(0, score));
}

export default function BookingPage() {
  const supabase = createClient();
  const [intent, setIntent] = useState("");
  const [peerRoll, setPeerRoll] = useState("");
  const [peers, setPeers] = useState<string[]>([]);
  const [matches, setMatches] = useState<RoomMatch[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [parsedPrefs, setParsedPrefs] = useState<ParsedRoomPrefs | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMatches = useCallback(() => {
    if (!intent.trim()) return;
    startTransition(async () => {
      setError(null);
      const prefs = await parseRoomIntent(intent);
      setParsedPrefs(prefs);

      const { data: rooms } = await supabase
        .from("room")
        .select("room_id, room_code, floor, capacity, current_occupancy, noise_level, features, room_type(label)")
        .neq("status", "maintenance")
        .filter("current_occupancy", "lt", 999)
        .gt("capacity", 0)
        .limit(40);

      // Client-side filter: only rooms with vacancies
      const availableRooms = (rooms || []).filter(
        (r: Record<string, unknown>) => (r.current_occupancy as number) < (r.capacity as number)
      );

      if (!rooms) return;

      const scored: RoomMatch[] = (availableRooms as Record<string, unknown>[]).map(r => {
        const rt = r.room_type as Record<string, string> | null;
        const base = {
          room_id: r.room_id as string,
          room_code: r.room_code as string,
          floor: r.floor as number,
          label: rt?.label ?? "Room",
          capacity: r.capacity as number,
          current_occupancy: r.current_occupancy as number,
          noise_level: r.noise_level as number ?? 3,
          features: r.features as string[] | null,
        };
        return { ...base, score: scoreRoom(base, prefs) };
      });

      scored.sort((a, b) => b.score - a.score);
      setMatches(scored.slice(0, 3));
    });
  }, [intent, supabase]);

  const addPeer = () => {
    if (peerRoll.trim() && !peers.includes(peerRoll.trim())) {
      setPeers(prev => [...prev, peerRoll.trim()]);
      setPeerRoll("");
    }
  };

  const submitRequest = async () => {
    if (!selectedRoom) return;
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated."); return; }

    let peerIds: string[] = [];
    if (peers.length > 0) {
      const { data: peerProfiles } = await supabase
        .from("student_profile")
        .select("student_id")
        .in("roll_no", peers);
      peerIds = (peerProfiles ?? []).map((p: Record<string, string>) => p.student_id);
    }

    const { error: err } = await supabase.from("room_booking_request").insert({
      student_id: user.id,
      preferred_rooms: [selectedRoom],
      intent_text: intent,
      parsed_prefs: parsedPrefs,
      peer_ids: peerIds,
    });

    if (err) { setError(err.message); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ padding: "48px 32px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <p style={{ fontSize: "13px", color: "#777" }}>Room Booking</p>
      <h2 style={{ fontSize: "24px", fontWeight: 400, color: "#111", marginTop: "8px" }}>Request submitted.</h2>
      <p style={{ color: "#555", marginTop: "8px" }}>The admin team will review and confirm your allocation shortly.</p>
      <Link href="/dashboard" style={{ fontSize: "13px", color: "#1A1A2E" }}>← Back to dashboard</Link>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111111",
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px" }}>
        <Link href="/dashboard" style={{ fontSize: "13px", color: "#777", textDecoration: "none" }}>← Back</Link>

        <h1 style={{ fontSize: "32px", fontWeight: 400, margin: "24px 0 32px", color: "#111" }}>
          Find your room.
        </h1>

        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          onBlur={findMatches}
          placeholder="What matters to you? (e.g. quiet room on a high floor, near my friend Arjun)"
          style={{
            width: "100%",
            height: "80px",
            border: "1px solid #D0D0D0",
            borderRadius: "4px",
            padding: "12px",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "none",
            background: "#fff",
            color: "#111",
            outline: "none",
            boxSizing: "border-box",
          }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); findMatches(); } }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
          <span style={{ fontSize: "13px", color: "#777", whiteSpace: "nowrap" }}>Add a roommate</span>
          <input
            value={peerRoll}
            onChange={e => setPeerRoll(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addPeer()}
            placeholder="Roll number"
            style={{
              flex: 1,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              padding: "6px 10px",
              fontSize: "13px",
              fontFamily: "inherit",
              background: "#fff",
              outline: "none",
            }}
          />
          <button
            onClick={addPeer}
            style={{
              border: "1px solid #1A1A2E",
              background: "transparent",
              color: "#1A1A2E",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >+ Add</button>
        </div>

        {peers.length > 0 && (
          <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
            {peers.map(p => (
              <span key={p} style={{
                fontSize: "12px",
                background: "#EBEBEB",
                padding: "3px 8px",
                borderRadius: "3px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                {p}
                <button
                  onClick={() => setPeers(prev => prev.filter(x => x !== p))}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#777", padding: 0, fontSize: "12px" }}
                >×</button>
              </span>
            ))}
          </div>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #EBEBEB", margin: "24px 0" }} />

        {isPending && (
          <p style={{ fontSize: "13px", color: "#777", opacity: 0.7 }}>Finding best matches...</p>
        )}

        {matches.length > 0 && !isPending && (
          <>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "16px" }}>Best matches</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {matches.map(room => {
                const dots = Math.round(room.score / 20);
                const isSelected = selectedRoom === room.room_id;
                return (
                  <div key={room.room_id} style={{
                    border: `1px solid ${isSelected ? "#1A1A2E" : "#EBEBEB"}`,
                    borderRadius: "6px",
                    padding: "16px",
                    background: "#fff",
                    transition: "border-color 0.15s",
                  }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 500, color: "#111" }}>{room.room_code}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#777" }}>Floor {room.floor}</p>
                    <p style={{ margin: "8px 0 4px", fontSize: "13px", color: "#555" }}>
                      {"●".repeat(dots)}{"○".repeat(5 - dots)} {room.score}%
                    </p>
                    <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#777" }}>
                      {room.label} · {room.current_occupancy}/{room.capacity} occupied
                    </p>
                    <button
                      onClick={() => setSelectedRoom(isSelected ? null : room.room_id)}
                      style={{
                        width: "100%",
                        border: "1px solid #1A1A2E",
                        background: isSelected ? "#1A1A2E" : "transparent",
                        color: isSelected ? "#fff" : "#1A1A2E",
                        padding: "6px 0",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >{isSelected ? "Selected ✓" : "Select"}</button>
                  </div>
                );
              })}
            </div>

            {selectedRoom && (
              <div style={{ marginTop: "24px" }}>
                {error && <p style={{ color: "#c00", fontSize: "13px", marginBottom: "8px" }}>{error}</p>}
                <button
                  onClick={submitRequest}
                  style={{
                    background: "#1A1A2E",
                    color: "#fff",
                    border: "none",
                    padding: "10px 28px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >Submit Request →</button>
              </div>
            )}
          </>
        )}

        {matches.length === 0 && !isPending && intent && (
          <button
            onClick={findMatches}
            style={{
              border: "1px solid #1A1A2E",
              background: "transparent",
              color: "#1A1A2E",
              padding: "8px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >Find matches →</button>
        )}
      </div>
    </div>
  );
}
