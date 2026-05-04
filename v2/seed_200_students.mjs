import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://nhdvmcwxohonzntoojvp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZHZtY3d4b2hvbnpudG9vanZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkwNjYzNSwiZXhwIjoyMDkzNDgyNjM1fQ.iUiIfsUBLuteBwWw7qpuRsI69i83V9ci6JlIZ-1Ls08";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const firstNamesMale = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Rudra", "Ritesh", "Om", "Dev", "Atharva", "Kabir", "Rishi", "Samar", "Neel"];
const firstNamesFemale = ["Saanvi", "Aadya", "Kiara", "Diya", "Pihu", "Prisha", "Ananya", "Avni", "Kavya", "Sneha", "Isha", "Riya", "Myra", "Aashvi", "Navya", "Aditi", "Meera", "Zara", "Tara", "Naina"];
const lastNames = ["Sharma", "Verma", "Gupta", "Kumar", "Singh", "Das", "Patel", "Reddy", "Rao", "Nair", "Iyer", "Jain", "Bose", "Sahoo", "Mishra", "Pandey", "Tiwari", "Yadav", "Chauhan", "Bhat"];
const hostels = ["SmB", "KB", "SBB", "SJB", "SDB"]; // assuming these are valid
const programs = ["B.Tech", "M.Tech", "MBA", "Ph.D"];
const batches = ["CSE", "ECE", "ME", "CE", "EEE"];

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randPhone() {
  return "+91" + Math.floor(6000000000 + Math.random() * 3999999999).toString();
}

async function run() {
  console.log("Starting seed of 200 users...");
  let created = 0;
  
  for (let i = 0; i < 200; i++) {
    const isMale = Math.random() > 0.4;
    const gender = isMale ? "M" : "F";
    const fname = isMale ? randItem(firstNamesMale) : randItem(firstNamesFemale);
    const lname = randItem(lastNames);
    const name = `${fname} ${lname}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@ahcms.edu.in`;
    
    // Create auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: "password123",
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: "student" }
    });

    if (authErr) {
      console.error(`Error creating ${email}:`, authErr.message);
      continue;
    }

    const userId = authData.user.id;
    const admYear = 2020 + Math.floor(Math.random() * 4);
    const passYear = admYear + 4;
    
    // Create profile
    const { error: profErr } = await supabase.from('student_profile').insert({
      student_id: userId,
      roll_no: `${admYear % 100}${randItem(batches)}${String(i + 1).padStart(4, '0')}`,
      name: name,
      gender: gender,
      adm_year: admYear,
      pass_year: passYear,
      program: randItem(programs),
      batch: randItem(batches),
      contact: randPhone(),
      hostel_code: isMale ? 'SmB' : 'SmG',
      noise_pref: 1 + Math.floor(Math.random() * 5),
      sleep_pref: randItem(['early', 'normal', 'late'])
    });

    if (profErr) {
      console.error(`Error profiling ${email}:`, profErr.message);
    } else {
      created++;
      if (created % 20 === 0) console.log(`Created ${created}/200...`);
    }
    
    // sleep a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 50));
  }
  
  console.log(`✅ Finished seeding ${created} users.`);
}

run();
