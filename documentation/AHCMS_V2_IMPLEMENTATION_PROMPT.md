# AHCMS v2 — Sovereign Implementation Prompt

**For:** Claude Code / Cursor Agent  
**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Edge Functions + Realtime) · Vercel · Discord Bot · Twilio · Python CP-SAT  
**Repo:** `https://github.com/riteshroshann/ahcmsfox`  
**Time constraint:** Complete in ~2 hours  

---

## 0. GROUND RULES

You are a principal-level full-stack engineer rewriting `ahcmsfox` — a SQLite/Express hostel portal — into a production-grade platform.

**Non-negotiables:**
- Every file must be complete and runnable — no `// TODO`, no `...rest`
- TypeScript everywhere except the Python allocation service
- Never expose `service_role` key to any client
- All DB mutations via Supabase Edge Functions or Next.js Server Actions
- Every SQL migration must be idempotent
- Remove the community forum / anonymous chat entirely — replace with Discord integration
- ACID properties enforced via Postgres transactions with `FOR UPDATE` row locks
- Schema must be 3NF/BCNF — no transitive dependencies

**UI RULES (CRITICAL — READ THIS FIRST):**
- **KEEP THE EXISTING UI.** The current frontend design in `src/style.css`, `src/pages/`, and `src/components/` is the baseline. Do NOT redesign pages from scratch. Port the existing layouts, components, and visual language into the Next.js app.
- **Light mode ONLY.** Remove ALL dark mode code, dark theme toggles, `prefers-color-scheme` media queries, and dark CSS variables. The entire app must be white/light background everywhere — no exceptions.
- **Minor polish only.** You may make small refinements (spacing, alignment, hover states) but the overall look, navigation structure, and page layouts must remain recognizable from the current version.
- **No theme switchers.** No dark/light toggle in the nav or settings. The app ships with one theme: white.

---

## 1. CURRENT CODEBASE (What Exists)

```
ahcmsfox/
├── src/                    # Vanilla JS frontend
│   ├── pages/
│   │   ├── login.js
│   │   ├── forum.js        ← DELETE (replacing with Discord)
│   │   ├── admin/
│   │   └── student/
│   ├── components/
│   │   ├── nav.js
│   │   ├── hostelStore.js
│   │   └── toast.js
│   ├── style.css           # 40KB monolithic CSS
│   ├── auth.js
│   ├── api.js
│   └── main.js
├── server/                 # Express + better-sqlite3
│   ├── index.js            # Express app with 8 route modules
│   ├── db.js               # SQLite init + seed
│   ├── routes/
│   │   ├── auth.js, complaints.js, dashboard.js
│   │   ├── forum.js        ← DELETE
│   │   ├── rooms.js        # 422 lines, has booking + change requests
│   │   ├── resources.js, students.js, wardens.js
│   │   └── ...
│   └── middleware/auth.js
├── sql/schema.sql          # SQLite schema (146 lines)
├── vite.config.js
├── vercel.json
└── package.json
```

**Current schema tables:** ADMIN, STUDENT, ROOM, ALLOCATION, ROOM_BOOKING_REQUEST, COMPLAINT, WARDEN, FORUM_POST, FORUM_REPLY, RESOURCE, ROOM_CHANGE_REQUEST

**What works:** Login (student/admin), room listing, direct allocation, booking requests, change requests, complaints CRUD, forum (being removed), warden/guard directory, resources directory.

---

## 2. DATABASE SCHEMA (Supabase Postgres)

Create `supabase/migrations/00001_ahcms_v2_schema.sql`. Full schema below — implement exactly as specified.

### Design Principles
- **3NF/BCNF enforced** — room type metadata in `ROOM_TYPE`, not denormalized
- **ACID via Postgres** — `BEGIN/COMMIT` in every multi-table mutation, `FOR UPDATE` row locks in allocation
- **RLS on every table** — no table without explicit policies
- **Audit trail** — `TICKET_EVENT` and `ALLOCATION_EVENT` are append-only
- **Soft deletes** — `deleted_at TIMESTAMPTZ` on student and staff tables

### Enums

```sql
CREATE TYPE gender_enum       AS ENUM ('M', 'F', 'Other');
CREATE TYPE room_status_enum  AS ENUM ('available', 'full', 'maintenance', 'reserved');
CREATE TYPE alloc_status_enum AS ENUM ('active', 'pending', 'expired', 'cancelled');
CREATE TYPE complaint_cat     AS ENUM ('Plumbing','Electricity','WiFi','Cleanliness','Carpentry','Pest','Structural','Other');
CREATE TYPE severity_enum     AS ENUM ('Low','Medium','High','Critical');
CREATE TYPE ticket_status     AS ENUM ('open','assigned','in_progress','pending_review','resolved','closed','escalated');
CREATE TYPE staff_role_enum   AS ENUM ('Warden','Deputy_Warden','Electrician','Plumber','Carpenter','Pest_Control','WiFi_Tech','Supervisor','Guard');
CREATE TYPE notif_channel     AS ENUM ('discord','sms','email','push');
CREATE TYPE booking_status    AS ENUM ('pending','approved','rejected','waitlisted');
CREATE TYPE event_type_enum   AS ENUM ('created','assigned','status_change','escalated','resolved','closed','note_added','sla_breached');
```

### Core Tables

Implement these tables with exact columns as specified in `AHCMS_V2_AGENT_PROMPT.md` Section 1.2:
- `HOSTEL` — hostel registry with code, name, gender, total_rooms
- `ROOM_TYPE` — Single/Double/Triple with capacity and base_score
- `COMPLAINT_CATEGORY` — category → default_role → SLA → escalation mapping
- `ROUTING_RULE` — per-category, per-hostel routing with priority order
- `STUDENT_PROFILE` — extends auth.users, includes discord_id, noise_pref, sleep_pref
- `STAFF` — roles, discord_tag, twilio_phone, active_tickets counter
- `ADMIN_PROFILE` — extends auth.users
- `ROOM` — room_code, hostel_code FK, floor, type_id FK, capacity, occupancy, noise_level, features[]
- `ALLOCATION` — student→room mapping with solver_run_id, satisfaction score, partial unique index on active
- `ALLOCATION_EVENT` — immutable audit log
- `ROOM_BOOKING_REQUEST` — with intent_text, parsed_prefs JSONB, peer_ids UUID[]
- `SOLVER_RUN` — tracks CP-SAT runs with alpha/beta/gamma weights, ef1_violations, min_satisfaction
- `COMPLAINT` — with priority_score GENERATED, discord_thread_id, sla_deadline
- `TICKET_EVENT` — immutable complaint audit log
- `COMPLAINT_FAIRNESS_LOG` — per-ticket fairness: response_time, sla_met (generated), envy_flag, iau_score
- `NOTIFICATION` — multi-channel delivery tracking

### Triggers (implement all 4)
1. `fn_set_sla_deadline` — auto-set SLA on complaint INSERT
2. `fn_sync_occupancy` — keep ROOM.current_occupancy consistent on allocation change
3. `fn_sync_staff_load` — keep STAFF.active_tickets consistent
4. `fn_log_ticket_event` — auto-log status changes to TICKET_EVENT

### RLS Policies
- Students read own profile, own complaints, own allocations
- Staff/admin read all within their hostel scope
- TICKET_EVENT: students see events for their own tickets only
- COMPLAINT_FAIRNESS_LOG: admin/staff only
- SOLVER_RUN: admin only

---

## 3. SCHEDULING ALGORITHM — CP-SAT ALLOCATION SERVICE

Create standalone Python microservice at `services/allocator/`.

### Files
```
services/allocator/
  main.py           # FastAPI entry
  solver.py          # CP-SAT model
  fairness.py        # EF1 + Max-Min + Group fairness
  models.py          # Pydantic schemas
  requirements.txt
  Dockerfile
```

### Algorithm (from research paper `our_algo_for_project (3).pdf`)

The paper by Ritesh Roshan Sahoo recommends **OR-Tools CP-SAT** as the primary solver for room allocation. Key requirements:

**Hard Constraints:**
1. Each student assigned to exactly one room: `∑_j x[i,j] = 1 ∀i`
2. Room capacity: `∑_i x[i,j] ≤ C_j ∀j`
3. Gender segregation: students of different genders cannot share a room

**Soft Objectives (multi-objective):**
```
Maximize J = α·∑s_i + peer_bonus - β·∑envy_ij + γ·z_min
```
Where:
- `s_i` = satisfaction score (noise compatibility + peer bonus + feature match)
- `z_min` = minimum satisfaction across all students (Max-Min fairness)
- `α=1.0, β=0.5, γ=0.3` (configurable per solver run)

**Satisfaction scoring:**
- Noise compatibility: `max(0, 20 - |student.noise_pref - room.noise_level| × 8)`
- Peer co-assignment bonus: 15 points when preferred roommates placed together
- Baseline: 50 points

### Fairness Module (`fairness.py`)

Implements (based on Gan, Li, Wu — JAIR 2023 "Fair dorm assignment"):

1. **EF1 (Envy-Free up to 1 item):** For every pair (i,k), check if student i envies k's assignment even after removing the best component. Removable component value = 15 (peer bonus equivalent).

2. **Max-Min satisfaction:** Track min and max satisfaction scores.

3. **Group disparity:** Batch-level average satisfaction difference.

4. **IAU score (Inequity Aversion Utility):** Gini coefficient approximation — `1.0 - |gini|`, where 1.0 = perfectly equal.

### Key references for implementation:
- `ariel-research/fairpyx` — production EF1 algorithms (pip install fairpyx)
- `d-krupke/cpsat-primer` — definitive CP-SAT guide
- Barman, Krishnamurthy, Vaish (IJCAI 2018) — EF1 under cardinality constraints

### Deploy
Deploy to **Railway** or **Fly.io** (NOT Vercel — needs persistent Python process). Call from Next.js admin panel via Server Action.

---

## 4. DISCORD BOT + COMPLAINT INTEGRATION

### Architecture Flow
```
Student runs /report in Discord
     │
     ▼
Discord HTTP POST → Supabase Edge Function: discord-bot/index.ts
     │  Ed25519 signature verified (tweetnacl)
     │
     ├─ INSERT into COMPLAINT (via service_role client)
     ├─ Returns ephemeral response with ticket ID
     ▼
Supabase DB Webhook on COMPLAINT INSERT
     │
     ▼
Edge Function: notify-staff/index.ts
     ├─ Routes to correct staff via ROUTING_RULE (least loaded)
     ├─ Creates Discord thread in #complaints channel
     ├─ If severity = 'Critical': POST to Twilio SMS API
     └─ INSERT into NOTIFICATION + COMPLAINT_FAIRNESS_LOG
```

### Discord Bot Edge Function (`supabase/functions/discord-bot/index.ts`)

Must implement:
- Ed25519 signature verification using `tweetnacl`
- Slash commands: `/report`, `/status`, `/my-tickets`
- Severity classifier: keyword-based (Critical: flood/fire/electric shock/gas leak; High: no water/broken/sewage; Medium: leaking/slow/clogged; Low: everything else)
- Student lookup via `discord_id` in STUDENT_PROFILE
- Ephemeral responses with ticket IDs

### Staff Notification Function (`supabase/functions/notify-staff/index.ts`)

Triggered by DB webhook on COMPLAINT INSERT:
- Route using ROUTING_RULE table (category → role → least active_tickets)
- Create Discord thread in complaints channel
- Send Twilio SMS for Critical severity
- Log to COMPLAINT_FAIRNESS_LOG with IAU score

### Slash Command Registration (`scripts/register-discord-commands.ts`)

Three commands: `report` (category + description + room_code), `status` (ticket_id), `my-tickets`

### Secrets (set via `supabase secrets set`)
```
DISCORD_PUBLIC_KEY, DISCORD_BOT_TOKEN, DISCORD_APP_ID
DISCORD_COMPLAINTS_CHANNEL_ID
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
SUPABASE_SERVICE_ROLE_KEY
```

---

## 5. COMPLAINT FAIRNESS TRACKING

### Phase 1 (Build Now): Rule-based classifier + priority scorer

Priority scoring function (IAU-based) for staff routing:
```
PriorityScore(ticket) = w1 × severity_score
                      + w2 × time_since_creation_hours
                      + w3 × (1 if SLA_breached else 0)
                      - w4 × (distance_to_assignee_block)
```
Default weights: `w1=40, w2=20, w3=30, w4=10`

### Phase 2 (Research Extension): GA Hyperparameter Tuner

Standalone script `services/ga-tuner/tune.py` — NOT production code:
- Population: 50 weight vectors [w1, w2, w3, w4, threshold_critical, threshold_high]
- Fitness: weighted F1-score on labeled complaint data
- Evolution: 200 generations, single-point crossover, Gaussian mutation (σ=0.1, p=0.15)
- Run offline when >500 labeled historical complaints exist

### Fairness Dashboard (Admin)

Create Supabase view `v_complaint_fairness_summary` joining COMPLAINT + STUDENT_PROFILE + COMPLAINT_CATEGORY + COMPLAINT_FAIRNESS_LOG.

Display using **Recharts** (no Chart.js, no D3):
- SLA compliance rate per category (bar chart)
- Average response time per hostel (comparison)
- IAU score trend over 30 days (line chart)
- EF1 violation count per solver run

---

## 6. ROOM BOOKING — REFINEMENTS

### Enhancement to existing booking flow
Keep the current room booking page structure. Add these improvements on top:
1. **Add an optional intent field:** "Describe your ideal room" — freeform text input above the existing room list
2. **AI parses intent** via Server Action calling Claude API → structured prefs JSON → auto-filters the room list
3. **"Best Match" badges** on rooms that score highest against parsed preferences
4. **Peer co-request:** "Add a roommate" — link by roll number (inline field)
5. Existing submit flow stays the same → creates ROOM_BOOKING_REQUEST with parsed_prefs added

### Intent Parser Server Action (`app/actions/parseRoomIntent.ts`)

Call Claude API to extract: `{ floor_pref, noise_pref, features[], peer_roll_nos[], hostel_pref }`

### Design Rules
- **Keep the existing UI.** The current `style.css` is the source of truth for colors, spacing, typography.
- **Light mode ONLY.** Strip every dark mode variable, media query, and toggle. White backgrounds everywhere.
- Background: white (`#FFFFFF` or `#FAFAFA` as currently used)
- Keep existing fonts, colors, card styles — only minor spacing/alignment polish
- No new icon libraries or design system overhauls
- Match scores can be shown as simple percentage text or subtle progress indicator

---

## 7. WHAT TO DELETE FROM EXISTING CODEBASE

Remove entirely:
- `src/pages/forum.js`
- `server/routes/forum.js`
- Schema tables: `FORUM_POST`, `FORUM_REPLY` — do NOT port to Supabase
- All forum references in nav.js, main.js

Replace forum nav item with Discord CTA component linking to server invite.

---

## 8. ENVIRONMENT VARIABLES

`.env.local` (never commit):
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server-only
ANTHROPIC_API_KEY=                   # server-only (intent parsing)
DISCORD_PUBLIC_KEY=
DISCORD_BOT_TOKEN=
DISCORD_APP_ID=
DISCORD_COMPLAINTS_CHANNEL_ID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
ALLOCATOR_SERVICE_URL=               # Railway/Fly.io URL
ALLOCATOR_SERVICE_API_KEY=
```

---

## 9. VERCEL DEPLOYMENT

```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**": { "maxDuration": 30 }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }]
    }
  ]
}
```

- NEVER set `SUPABASE_SERVICE_ROLE_KEY` as `NEXT_PUBLIC_`
- Deploy allocator separately on Railway
- Deploy Edge Functions via Supabase CLI

---

## 10. IMPLEMENTATION ORDER (EXACT SEQUENCE)

1. Run `00001_ahcms_v2_schema.sql` migration on Supabase
2. Seed reference tables: HOSTEL, ROOM_TYPE, COMPLAINT_CATEGORY, ROUTING_RULE
3. Initialize Next.js 14 app with App Router + Supabase auth
4. **Port existing UI into Next.js** — keep the same layouts, components, and styles. Strip ALL dark mode code. Light/white theme only.
5. Implement room booking enhancements with intent parser (Section 6)
6. Deploy `discord-bot` Edge Function + register slash commands
7. Deploy `notify-staff` Edge Function + create DB webhook
8. Build the allocator FastAPI service + deploy to Railway
9. Build admin fairness dashboard with Recharts
10. Remove forum routes + components, add Discord CTA
11. Connect Twilio + test Critical severity flow end-to-end
12. Final: Vercel deploy with all env vars

---

## 11. REFERENCES

- **fairpyx** (`ariel-research/fairpyx`) — production EF1/MMS algorithms
- **CP-SAT Primer** (`d-krupke/cpsat-primer`) — definitive OR-Tools guide
- **Supabase Discord Bot docs** — Ed25519 verification pattern
- Gan, Li, Wu (JAIR 2023) — "Fair dorm assignment" — EF1 in hostel context
- Barman, Krishnamurthy, Vaish (IJCAI 2018) — EF1 under cardinality constraints
- Fehr & Schmidt (1999) — Inequity Aversion utility model
- Aziz, Li, Moulin, Wu (SIGecom 2022) — Fair allocation survey
- Twilio Programmable SMS API
