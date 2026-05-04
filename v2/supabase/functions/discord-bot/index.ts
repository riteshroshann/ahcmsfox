import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nacl from "https://cdn.skypack.dev/tweetnacl@1.0.3?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;

const SEVERITY_KEYWORDS: Record<string, string[]> = {
  Critical: ["flood", "fire", "electric shock", "gas leak", "collapse", "electrocution", "smoke"],
  High: ["no water", "broken", "sewage", "power outage", "sparking", "short circuit"],
  Medium: ["leaking", "slow", "clogged", "flickering", "dripping", "noisy"],
};

function classifySeverity(text: string): string {
  const lower = text.toLowerCase();
  for (const [level, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return level;
  }
  return "Low";
}

const CATEGORY_MAP: Record<string, string> = {
  plumbing: "Plumbing",
  electricity: "Electricity",
  wifi: "WiFi",
  cleanliness: "Cleanliness",
  carpentry: "Carpentry",
  pest: "Pest",
  structural: "Structural",
  other: "Other",
};

function verifySignature(request: Request, body: string): boolean {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) return false;

  return nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8(signature),
    hexToUint8(DISCORD_PUBLIC_KEY)
  );
}

function hexToUint8(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

serve(async (req) => {
  const body = await req.text();

  if (!verifySignature(req, body)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const interaction = JSON.parse(body);

  // PING verification
  if (interaction.type === 1) {
    return Response.json({ type: 1 });
  }

  // slash command
  if (interaction.type === 2) {
    const { name, options } = interaction.data;
    const userId = interaction.member?.user?.id || interaction.user?.id;

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (name === "report") {
      const category = options?.find((o: { name: string }) => o.name === "category")?.value || "other";
      const description = options?.find((o: { name: string }) => o.name === "description")?.value || "";
      const roomCode = options?.find((o: { name: string }) => o.name === "room_code")?.value || "";

      const { data: student } = await sb
        .from("STUDENT_PROFILE")
        .select("student_id, hostel_code")
        .eq("discord_id", userId)
        .single();

      if (!student) {
        return Response.json({
          type: 4,
          data: { content: "Your Discord account is not linked to an AHCMS student profile. Contact admin.", flags: 64 },
        });
      }

      const { data: catRow } = await sb
        .from("COMPLAINT_CATEGORY")
        .select("category_id")
        .eq("name", CATEGORY_MAP[category] || "Other")
        .single();

      let roomId = null;
      if (roomCode) {
        const { data: room } = await sb.from("ROOM").select("room_id").eq("room_code", roomCode).single();
        roomId = room?.room_id || null;
      }

      const severity = classifySeverity(description);

      const { data: ticket, error } = await sb.from("COMPLAINT").insert({
        student_id: student.student_id,
        room_id: roomId,
        category_id: catRow?.category_id || 8,
        description,
        severity,
      }).select("ticket_id").single();

      if (error) {
        return Response.json({
          type: 4,
          data: { content: `Failed to create ticket: ${error.message}`, flags: 64 },
        });
      }

      return Response.json({
        type: 4,
        data: {
          content: `✅ Ticket created\n**ID:** \`${ticket.ticket_id}\`\n**Severity:** ${severity}\n**Category:** ${CATEGORY_MAP[category] || "Other"}\n\nStaff will be notified shortly.`,
          flags: 64,
        },
      });
    }

    if (name === "status") {
      const ticketId = options?.find((o: { name: string }) => o.name === "ticket_id")?.value;
      const { data: ticket } = await sb.from("COMPLAINT")
        .select("ticket_id, status, severity, created_at, resolved_at, COMPLAINT_CATEGORY(name)")
        .eq("ticket_id", ticketId)
        .single();

      if (!ticket) {
        return Response.json({ type: 4, data: { content: "Ticket not found.", flags: 64 } });
      }

      const cat = (ticket.COMPLAINT_CATEGORY as Record<string, string>)?.name || "—";
      return Response.json({
        type: 4,
        data: {
          content: `**Ticket** \`${ticket.ticket_id}\`\n**Status:** ${ticket.status}\n**Severity:** ${ticket.severity}\n**Category:** ${cat}\n**Filed:** ${ticket.created_at}${ticket.resolved_at ? `\n**Resolved:** ${ticket.resolved_at}` : ""}`,
          flags: 64,
        },
      });
    }

    if (name === "my-tickets") {
      const { data: student } = await sb.from("STUDENT_PROFILE").select("student_id").eq("discord_id", userId).single();
      if (!student) {
        return Response.json({ type: 4, data: { content: "Account not linked.", flags: 64 } });
      }

      const { data: tickets } = await sb.from("COMPLAINT")
        .select("ticket_id, status, severity, created_at")
        .eq("student_id", student.student_id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!tickets || tickets.length === 0) {
        return Response.json({ type: 4, data: { content: "No tickets found.", flags: 64 } });
      }

      const lines = tickets.map((t) => `\`${t.ticket_id.slice(0, 8)}\` | ${t.severity} | ${t.status} | ${new Date(t.created_at).toLocaleDateString()}`);
      return Response.json({
        type: 4,
        data: { content: `**Your recent tickets:**\n${lines.join("\n")}`, flags: 64 },
      });
    }

    return Response.json({ type: 4, data: { content: "Unknown command.", flags: 64 } });
  }

  return Response.json({ error: "Unhandled interaction type" }, { status: 400 });
});
