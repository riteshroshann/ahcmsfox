"use server";

import { createClient } from "@supabase/supabase-js";

// Bypass RLS by using the service role key server-side
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getRoomsForHostel(hostelCode: string) {
  const { data, error } = await supabaseAdmin
    .from("room")
    .select("*, room_type(label)")
    .eq("hostel_code", hostelCode)
    .neq("status", "maintenance")
    .order("floor");
    
  if (error) {
    console.error("Error fetching rooms server-side:", error);
    return [];
  }
  
  return data;
}
