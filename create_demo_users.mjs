import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log("Creating demo Admin user...");
  const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
    email: "admin@ahcms.edu.in",
    password: "Admin@123",
    email_confirm: true,
    user_metadata: { name: "Chief Warden Admin" },
    app_metadata: { role: "admin" }
  });

  if (adminErr) console.error("Admin error:", adminErr.message);
  else {
    await supabase.from("admin_profile").insert({
      admin_id: adminAuth.user.id,
      name: "Chief Warden Admin"
    });
    console.log("Admin created!");
  }

  console.log("Creating demo Student user...");
  const studentEmail = "dl.mbbs.u4aid24120@ahcms.edu.in";
  const { data: studentAuth, error: studentErr } = await supabase.auth.admin.createUser({
    email: studentEmail,
    password: "Student@123",
    email_confirm: true,
    user_metadata: { name: "Demo Student" },
    app_metadata: { role: "student" }
  });

  if (studentErr) console.error("Student error:", studentErr.message);
  else {
    await supabase.from("student_profile").insert({
      student_id: studentAuth.user.id,
      roll_no: "DL.MBBS.U4AID24120",
      name: "Demo Student",
      gender: "M",
      adm_year: 2024,
      pass_year: 2028,
      program: "MBBS",
      batch: "AID",
      contact: "+919876543210",
      hostel_code: "SmB",
      noise_pref: 3,
      sleep_pref: "normal"
    });
    console.log("Student created!");
  }
}

run();
