"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

interface RoomInfo {
  room_id: string;
  room_code: string;
  floor: number;
  hostel_code: string;
  capacity: number;
  current_occupancy: number;
  noise_level: number;
  features: string[] | null;
}

interface RoommateInfo {
  student_id: string;
  name: string;
  roll_no: string;
  program: string;
  noise_pref: number;
  sleep_pref: string;
}

interface CompatibilityResult {
  score: number;
  reasons: string[];
}

function computeCompatibility(myNoise: number, mySleep: string, roommate: RoommateInfo): CompatibilityResult {
  const reasons: string[] = [];
  let score = 50;

  const noiseDiff = Math.abs(myNoise - roommate.noise_pref);
  if (noiseDiff === 0) { score += 30; reasons.push("Perfect noise preference match"); }
  else if (noiseDiff === 1) { score += 15; reasons.push("Similar noise preferences"); }
  else if (noiseDiff >= 3) { score -= 20; reasons.push("Different noise preferences — may need adjustment"); }

  if (mySleep === roommate.sleep_pref) {
    score += 20;
    const label = mySleep === "early" ? "early risers" : mySleep === "late" ? "night owls" : "normal sleep schedule";
    reasons.push(`Both ${label}`);
  } else {
    score -= 10;
    reasons.push(`Different sleep schedules (you: ${mySleep}, them: ${roommate.sleep_pref})`);
  }

  return { score: Math.min(100, Math.max(0, score)), reasons };
}

export default function BookingPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [myProfile, setMyProfile] = useState<Record<string, unknown> | null>(null);
  const [allocation, setAllocation] = useState<Record<string, unknown> | null>(null);
  const [bestRoom, setBestRoom] = useState<RoomInfo | null>(null);
  const [roommate, setRoommate] = useState<RoommateInfo | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directAssigned, setDirectAssigned] = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load my profile
    const { data: profile } = await supabase
      .from("student_profile")
      .select("*")
      .eq("student_id", user.id)
      .single();
    setMyProfile(profile);

    // Check if already allocated
    const { data: alloc } = await supabase
      .from("allocation")
      .select("*, room(room_code, floor, hostel_code, capacity, current_occupancy, noise_level, features)")
      .eq("student_id", user.id)
      .eq("status", "active")
      .single();

    if (alloc) {
      setAllocation(alloc);
      setLoading(false);
      return;
    }

    // No allocation — find best room based on stored prefs
    if (!profile) { setLoading(false); return; }

    const hostel = profile.hostel_code as string;
    const myNoise = (profile.noise_pref as number) || 3;

    const { data: rooms } = await supabase
      .from("room")
      .select("*, room_type(label)")
      .eq("hostel_code", hostel)
      .neq("status", "maintenance")
      .order("floor");

    const available = (rooms || []).filter(
      (r: Record<string, unknown>) => (r.current_occupancy as number) < (r.capacity as number)
    );

    if (available.length === 0) { setLoading(false); return; }

    // Score rooms by noise match + vacancy
    const scored = available.map((r: Record<string, unknown>) => ({
      ...r,
      _score: 100 - Math.abs((r.noise_level as number || 3) - myNoise) * 15 + (r.current_occupancy as number === 0 ? 5 : 0)
    }));
    scored.sort((a, b) => (b._score as number) - (a._score as number));
    const top = scored[0] as RoomInfo & { _score: number };
    setBestRoom(top);

    // Check if this room already has a roommate
    if ((top.current_occupancy as unknown as number) > 0) {
      const { data: existingAllocs } = await supabase
        .from("allocation")
        .select("student_id, student_profile(name, roll_no, program, noise_pref, sleep_pref)")
        .eq("room_id", top.room_id)
        .eq("status", "active")
        .limit(1);

      if (existingAllocs && existingAllocs.length > 0) {
        const sp = (existingAllocs[0] as Record<string, unknown>).student_profile as Record<string, unknown>;
        const rm: RoommateInfo = {
          student_id: existingAllocs[0].student_id as string,
          name: sp.name as string,
          roll_no: sp.roll_no as string,
          program: sp.program as string,
          noise_pref: sp.noise_pref as number || 3,
          sleep_pref: sp.sleep_pref as string || "normal",
        };
        setRoommate(rm);
        setCompatibility(computeCompatibility(myNoise, profile.sleep_pref as string || "normal", rm));
      }
    }

    setLoading(false);
  }

  async function directAssign() {
    if (!bestRoom || !myProfile) return;
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("allocation").insert({
      student_id: user!.id,
      room_id: bestRoom.room_id,
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
    });
    if (err) { setError(err.message); setSubmitting(false); return; }
    setDirectAssigned(true);
    setSubmitting(false);
  }

  async function sendRequest() {
    if (!bestRoom || !myProfile) return;
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("room_booking_request").insert({
      student_id: user!.id,
      preferred_rooms: [bestRoom.room_id],
      intent_text: `Auto-matched: noise pref ${myProfile.noise_pref}, sleep ${myProfile.sleep_pref}. Compatibility with ${roommate?.name}: ${compatibility?.score}%.`,
      parsed_prefs: { noise_pref: myProfile.noise_pref, sleep_pref: myProfile.sleep_pref },
      peer_ids: roommate ? [roommate.student_id] : [],
    });
    if (err) { setError(err.message); setSubmitting(false); return; }
    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) return <div className="loading-spinner" />;

  // ── ALREADY ALLOCATED ──────────────────────────────────────────────────────
  if (allocation) {
    const room = allocation.room as Record<string, unknown>;
    return (
      <>
        <div className="page-header">
          <h2>My Room</h2>
          <p>Your current room allocation.</p>
        </div>
        <div className="form-section" style={{ maxWidth: 520 }}>
          <div className="form-section-title">Active Allocation</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", padding: "var(--space-4) 0" }}>
            <div>
              <div className="form-label">Room</div>
              <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, fontFamily: "var(--font-mono)", marginTop: "var(--space-1)" }}>{String(room?.room_code)}</div>
            </div>
            <div>
              <div className="form-label">Floor</div>
              <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-1)" }}>{String(room?.floor)}</div>
            </div>
            <div>
              <div className="form-label">Hostel</div>
              <div style={{ marginTop: "var(--space-1)", fontSize: "var(--text-sm)" }}>{String(room?.hostel_code)}</div>
            </div>
            <div>
              <div className="form-label">Occupancy</div>
              <div style={{ marginTop: "var(--space-1)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>{String(room?.current_occupancy)}/{String(room?.capacity)}</div>
            </div>
          </div>
          <div style={{ marginTop: "var(--space-2)", display: "flex", gap: "var(--space-2)" }}>
            <span className="badge badge-active">Active</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}>
              Since {String(allocation.start_date)}
            </span>
          </div>
        </div>
        <div style={{ marginTop: "var(--space-4)" }}>
          <Link href="/dashboard/rooms" className="btn btn-secondary btn-sm">View full room details →</Link>
        </div>
      </>
    );
  }

  // ── NO ALLOCATION, DIRECT ASSIGN DONE ────────────────────────────────────
  if (directAssigned) return (
    <>
      <div className="page-header"><h2>Room Assigned!</h2></div>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          You've been assigned to <strong style={{ fontFamily: "var(--font-mono)" }}>{bestRoom?.room_code}</strong> (Floor {bestRoom?.floor}).
          Head to the My Room tab for full details.
        </p>
      </div>
      <div style={{ marginTop: "var(--space-4)" }}>
        <Link href="/dashboard/rooms" className="btn btn-primary btn-sm">View My Room →</Link>
      </div>
    </>
  );

  // ── NO ALLOCATION, REQUEST SUBMITTED ─────────────────────────────────────
  if (submitted) return (
    <>
      <div className="page-header"><h2>Request Submitted</h2></div>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Your room request for <strong style={{ fontFamily: "var(--font-mono)" }}>{bestRoom?.room_code}</strong> has been sent to the Warden for approval.
          You'll be notified once it's confirmed.
        </p>
      </div>
    </>
  );

  // ── NO ALLOCATION FOUND ───────────────────────────────────────────────────
  if (!bestRoom) return (
    <>
      <div className="page-header"><h2>Room Allocation</h2></div>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          No available rooms found in your hostel right now. Please contact the Warden.
        </p>
      </div>
    </>
  );

  // ── BEST ROOM FOUND, EMPTY (no roommate) → direct assign ─────────────────
  if (!roommate) return (
    <>
      <div className="page-header">
        <h2>Room Allocation</h2>
        <p>We found the best available room based on your preferences.</p>
      </div>
      <div className="form-section" style={{ maxWidth: 480 }}>
        <div className="form-section-title">Best Match</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", padding: "var(--space-4) 0" }}>
          <div>
            <div className="form-label">Room</div>
            <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, fontFamily: "var(--font-mono)", marginTop: "var(--space-1)" }}>{bestRoom.room_code}</div>
          </div>
          <div>
            <div className="form-label">Floor</div>
            <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-1)" }}>{bestRoom.floor}</div>
          </div>
          <div>
            <div className="form-label">Noise Level</div>
            <div style={{ marginTop: "var(--space-1)", fontSize: "var(--text-sm)" }}>
              {"●".repeat(bestRoom.noise_level || 3)}{"○".repeat(5 - (bestRoom.noise_level || 3))}
            </div>
          </div>
          <div>
            <div className="form-label">Occupancy</div>
            <div style={{ marginTop: "var(--space-1)", fontSize: "var(--text-sm)" }}>Single room — you'll be alone</div>
          </div>
        </div>
        <div style={{ marginTop: "var(--space-2)", padding: "var(--space-3)", background: "var(--surface-2)", borderRadius: "var(--radius-md)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
          Matched based on your noise preference ({String(myProfile?.noise_pref)}/5) and sleep schedule ({String(myProfile?.sleep_pref)})
        </div>
      </div>
      {error && <p style={{ color: "red", fontSize: "var(--text-sm)", marginTop: "var(--space-3)" }}>{error}</p>}
      <div style={{ marginTop: "var(--space-5)" }}>
        <button className="btn btn-primary" onClick={directAssign} disabled={submitting}>
          {submitting ? "Assigning…" : "Confirm & Move In →"}
        </button>
      </div>
    </>
  );

  // ── BEST ROOM HAS A ROOMMATE → show compatibility + request ──────────────
  const compatColor = (compatibility?.score || 0) >= 70 ? "var(--color-success)" : (compatibility?.score || 0) >= 45 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <>
      <div className="page-header">
        <h2>Room Allocation</h2>
        <p>Best room found — it has an existing roommate. Review compatibility before confirming.</p>
      </div>

      <div style={{ display: "grid", gap: "var(--space-5)", maxWidth: 540 }}>
        <div className="form-section">
          <div className="form-section-title">Assigned Room</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", padding: "var(--space-3) 0" }}>
            <div>
              <div className="form-label">Room</div>
              <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, fontFamily: "var(--font-mono)", marginTop: "var(--space-1)" }}>{bestRoom.room_code}</div>
            </div>
            <div>
              <div className="form-label">Floor</div>
              <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-1)" }}>{bestRoom.floor}</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Roommate Compatibility</div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4) 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "var(--text-lg)", fontWeight: 700, color: "#fff",
              background: compatColor, flexShrink: 0,
            }}>
              {compatibility?.score}%
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{roommate.name}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{roommate.roll_no}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{roommate.program}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {compatibility?.reasons.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "var(--space-2)",
                fontSize: "var(--text-xs)", color: "var(--text-secondary)",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--surface-2)", borderRadius: "var(--radius-sm)"
              }}>
                <span style={{ color: compatColor }}>●</span> {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red", fontSize: "var(--text-sm)", marginTop: "var(--space-3)" }}>{error}</p>}

      <div style={{ marginTop: "var(--space-5)", display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <button className="btn btn-primary" onClick={sendRequest} disabled={submitting}>
          {submitting ? "Sending…" : "Send Request to Warden →"}
        </button>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Warden will review and confirm your placement
        </span>
      </div>
    </>
  );
}
