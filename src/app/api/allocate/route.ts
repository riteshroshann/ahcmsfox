import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hostel_code, alpha, beta, gamma } = body;

  if (!hostel_code) {
    return NextResponse.json({ error: "hostel_code required" }, { status: 400 });
  }

  const allocatorUrl = process.env.ALLOCATOR_SERVICE_URL;
  if (!allocatorUrl) {
    return NextResponse.json({ error: "ALLOCATOR_SERVICE_URL not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${allocatorUrl}/solve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.ALLOCATOR_SERVICE_API_KEY || "",
      },
      body: JSON.stringify({
        hostel_code,
        alpha: alpha ?? 1.0,
        beta: beta ?? 0.5,
        gamma: gamma ?? 0.3,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.detail || "Solver error" }, { status: res.status });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
