import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record;

  if (!record?.ticket_id) {
    return Response.json({ error: "No ticket in payload" }, { status: 400 });
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: ticket } = await sb.from("COMPLAINT")
    .select("*, COMPLAINT_CATEGORY(name, default_role, sla_minutes), STUDENT_PROFILE(name, hostel_code)")
    .eq("ticket_id", record.ticket_id)
    .single();

  if (!ticket) return Response.json({ error: "Ticket not found" });

  const category = ticket.COMPLAINT_CATEGORY as Record<string, unknown>;
  const student = ticket.STUDENT_PROFILE as Record<string, unknown>;
  const hostelCode = String(student?.hostel_code || "");

  // route: find least-loaded staff matching role + hostel
  const { data: staffList } = await sb.from("STAFF")
    .select("*")
    .eq("role", String(category?.default_role || "Supervisor"))
    .eq("hostel_code", hostelCode)
    .eq("availability", true)
    .is("deleted_at", null)
    .order("active_tickets", { ascending: true })
    .limit(1);

  const assignee = staffList?.[0];

  if (assignee) {
    await sb.from("COMPLAINT").update({
      assigned_to: assignee.staff_id,
      status: "assigned",
      updated_at: new Date().toISOString(),
    }).eq("ticket_id", record.ticket_id);
  }

  // create Discord thread
  const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
  const channelId = Deno.env.get("DISCORD_COMPLAINTS_CHANNEL_ID");

  if (botToken && channelId) {
    try {
      const msgRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `🎫 **New ${ticket.severity} Complaint**\n**Student:** ${student?.name}\n**Category:** ${category?.name}\n**Description:** ${ticket.description}\n${assignee ? `**Assigned to:** ${assignee.name}` : "⚠️ No staff available"}`,
        }),
      });

      if (msgRes.ok) {
        const msg = await msgRes.json();
        // create thread from message
        const threadRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${msg.id}/threads`, {
          method: "POST",
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${category?.name} — ${String(record.ticket_id).slice(0, 8)}`,
            auto_archive_duration: 1440,
          }),
        });

        if (threadRes.ok) {
          const thread = await threadRes.json();
          await sb.from("COMPLAINT").update({
            discord_thread_id: thread.id,
            discord_channel_id: channelId,
          }).eq("ticket_id", record.ticket_id);
        }
      }
    } catch (e) {
      console.error("Discord thread creation failed:", e);
    }
  }

  // Twilio SMS for Critical severity
  if (ticket.severity === "Critical") {
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
    const smsTo = assignee?.twilio_phone;

    if (twilioSid && twilioAuth && twilioFrom && smsTo) {
      try {
        const smsBody = `🚨 CRITICAL: ${category?.name} complaint in ${hostelCode}. ${ticket.description.slice(0, 100)}`;
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ To: smsTo, From: twilioFrom, Body: smsBody }),
        });
      } catch (e) {
        console.error("Twilio SMS failed:", e);
      }
    }
  }

  // log fairness
  await sb.from("COMPLAINT_FAIRNESS_LOG").insert({
    ticket_id: record.ticket_id,
    hostel_code: hostelCode,
    student_group: String(student?.hostel_code || ""),
    sla_minutes: Number(category?.sla_minutes || 1440),
    worker_load_at_assign: assignee?.active_tickets || 0,
    iau_score: assignee ? 1.0 / (1.0 + (assignee.active_tickets || 0) * 0.1) : 0,
  });

  // log notification
  if (assignee) {
    await sb.from("NOTIFICATION").insert({
      user_id: assignee.staff_id,
      channel: ticket.severity === "Critical" ? "sms" : "discord",
      payload: { ticket_id: record.ticket_id, severity: ticket.severity, category: category?.name },
      delivery_status: "sent",
      sent_at: new Date().toISOString(),
    });
  }

  return Response.json({ ok: true, assigned_to: assignee?.name || null });
});
