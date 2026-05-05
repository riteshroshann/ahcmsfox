"use server";

import { createClient } from "@supabase/supabase-js";

export async function getRoomsForHostel(hostelCode: string) {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("Missing Supabase credentials in getRoomsForHostel");
      return [];
    }

    // Bypass RLS by using the service role key server-side
    const supabaseAdmin = createClient(url, key);

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
  } catch (err) {
    console.error("Crash in getRoomsForHostel:", err);
    return [];
  }
}
