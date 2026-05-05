"use server";

export interface ParsedRoomPrefs {
  floor_pref: number | null;
  noise_pref: 1 | 2 | 3 | 4 | 5 | null;
  features: string[];
  peer_roll_nos: string[];
  hostel_pref: string | null;
}

const FALLBACK: ParsedRoomPrefs = {
  floor_pref: null,
  noise_pref: null,
  features: [],
  peer_roll_nos: [],
  hostel_pref: null,
};

export async function parseRoomIntent(intentText: string): Promise<ParsedRoomPrefs> {
  if (!intentText.trim()) return FALLBACK;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return FALLBACK;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 300,
        system: `You are a room preference parser for a university hostel system.
Extract structured preferences from the student's natural language request.
Return ONLY valid JSON, no other text. Schema:
{
  "floor_pref": number | null,
  "noise_pref": 1|2|3|4|5 | null,
  "features": string[],
  "peer_roll_nos": string[],
  "hostel_pref": string | null
}
noise_pref: 1=very quiet, 5=very lively. features can include: AC, Attached Bath, Window, Corner Room, Ground Floor.`,
        messages: [{ role: "user", content: intentText }],
      }),
    });

    const data = await res.json();
    const raw = data?.content?.[0]?.text ?? "";
    const parsed = JSON.parse(raw);
    return {
      floor_pref: parsed.floor_pref ?? null,
      noise_pref: parsed.noise_pref ?? null,
      features: Array.isArray(parsed.features) ? parsed.features : [],
      peer_roll_nos: Array.isArray(parsed.peer_roll_nos) ? parsed.peer_roll_nos : [],
      hostel_pref: parsed.hostel_pref ?? null,
    };
  } catch {
    return FALLBACK;
  }
}
