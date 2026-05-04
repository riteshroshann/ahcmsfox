export type UserRole = "student" | "admin" | "staff";

export interface StudentProfile {
  student_id: string;
  roll_no: string;
  name: string;
  gender: "M" | "F" | "Other";
  adm_year: number;
  pass_year: number;
  program: string;
  batch: string;
  contact: string | null;
  hostel_code: string;
  discord_id: string | null;
  noise_pref: number;
  sleep_pref: "early" | "normal" | "late";
}

export interface Room {
  room_id: string;
  room_code: string;
  hostel_code: string;
  floor: number;
  type_id: number;
  capacity: number;
  current_occupancy: number;
  status: "available" | "full" | "maintenance" | "reserved";
  noise_level: number;
  features: string[];
}

export interface Allocation {
  allocation_id: string;
  student_id: string;
  room_id: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "pending" | "expired" | "cancelled";
  satisfaction: number | null;
}

export interface Complaint {
  ticket_id: string;
  student_id: string;
  room_id: string | null;
  category_id: number;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: string;
  priority_score: number;
  assigned_to: string | null;
  discord_thread_id: string | null;
  sla_deadline: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface BookingRequest {
  request_id: string;
  student_id: string;
  preferred_rooms: string[] | null;
  intent_text: string | null;
  parsed_prefs: Record<string, unknown> | null;
  peer_ids: string[] | null;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  admin_note: string | null;
  created_at: string;
}

export interface Staff {
  staff_id: string;
  name: string;
  role: string;
  hostel_code: string | null;
  contact: string | null;
  availability: boolean;
  active_tickets: number;
}

export interface SolverRun {
  run_id: string;
  hostel_code: string;
  status: "queued" | "running" | "completed" | "failed";
  student_count: number | null;
  room_count: number | null;
  feasible: boolean | null;
  objective_value: number | null;
  ef1_violations: number | null;
  min_satisfaction: number | null;
  created_at: string;
}
