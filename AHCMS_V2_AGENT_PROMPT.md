# AHCMS v2 — Sovereign Implementation Prompt
### For: Claude Code / Cursor / Copilot Agent
### Project: Amrita Hostel & Complaint Management System (ahcmsfox → v2)
### Stack: Next.js 14 (App Router) · Supabase (Postgres + Edge Functions + Realtime) · Vercel · Discord Bot · Twilio · Python CP-SAT Microservice

---

## 0. AGENT CONTEXT & GROUND RULES

You are a principal-level full-stack engineer. You are rewriting **ahcmsfox** — a SQLite/Express hostel management portal — into a production-grade platform. You have read the existing codebase at `https://github.com/riteshroshann/ahcmsfox`. You know its schema, routes, and frontend structure.

**Non-negotiables:**
- Every file you write must be complete and immediately runnable — no placeholders, no `// TODO`, no `...rest of implementation`.
- Use TypeScript everywhere except the Python allocation service.
- Never expose `service_role` key to any client or Edge Function that can be called without server auth.
- All database mutations go through Supabase Edge Functions or Next.js Server Actions — never direct client SDK writes on sensitive tables.
- Every SQL migration must be idempotent (`CREATE TABLE IF NOT EXISTS`, `CREATE POLICY IF NOT EXISTS`, etc.).
- Follow the exact schema in Section 1 — do not add columns without justification.

---

## 1. DATABASE SCHEMA (Supabase Postgres — Full Migration)

Create file `supabase/migrations/00001_ahcms_v2_schema.sql`.

### 1.1 Core Design Principles
- **3NF/BCNF enforced**: Every non-key attribute depends on the whole key and nothing but the key. No transitive dependencies. Room type metadata lives in `ROOM_TYPE`, not denormalized into `ROOM`.
- **ACID via Postgres**: Use `BEGIN / COMMIT` in every multi-table mutation function. Use `FOR UPDATE` row locks in allocation transactions.
- **RLS on every table**: No table in `public` schema is left without RLS enabled and explicit policies.
- **Audit trail**: Every state-changing operation appends to `TICKET_EVENT` or `ALLOCATION_EVENT` — immutable, append-only.
- **Soft deletes**: Use `deleted_at TIMESTAMPTZ` on student and staff tables. Never hard delete.

### 1.2 Full Schema

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

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

-- ─── LOOKUP / REFERENCE TABLES (no RLS needed — read-only public data) ───────

CREATE TABLE IF NOT EXISTS HOSTEL (
  hostel_id   SERIAL PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,          -- e.g. "BH1", "GH2"
  name        TEXT NOT NULL,
  gender      gender_enum NOT NULL,
  total_rooms INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ROOM_TYPE (
  type_id     SERIAL PRIMARY KEY,
  label       TEXT NOT NULL UNIQUE,          -- 'Single', 'Double', 'Triple'
  capacity    INT NOT NULL CHECK (capacity BETWEEN 1 AND 6),
  base_score  INT NOT NULL DEFAULT 50        -- satisfaction baseline for fair allocation
);

CREATE TABLE IF NOT EXISTS COMPLAINT_CATEGORY (
  category_id     SERIAL PRIMARY KEY,
  name            complaint_cat NOT NULL UNIQUE,
  default_role    staff_role_enum NOT NULL,
  sla_minutes     INT NOT NULL DEFAULT 1440, -- 24h default
  escalation_role staff_role_enum NOT NULL DEFAULT 'Supervisor',
  severity_floor  severity_enum NOT NULL DEFAULT 'Low'
);

CREATE TABLE IF NOT EXISTS ROUTING_RULE (
  rule_id         SERIAL PRIMARY KEY,
  category_id     INT NOT NULL REFERENCES COMPLAINT_CATEGORY(category_id),
  hostel_code     TEXT REFERENCES HOSTEL(code),  -- NULL = applies to all hostels
  priority_order  INT NOT NULL DEFAULT 1,
  role_target     staff_role_enum NOT NULL,
  escalation_role staff_role_enum NOT NULL,
  sla_minutes     INT NOT NULL
);

-- ─── USERS ───────────────────────────────────────────────────────────────────
-- NOTE: Supabase Auth handles auth.users. We extend with profile tables.
-- student_id = auth.users.id (UUID). This maintains referential integrity
-- with Supabase Auth and is the foundation for all RLS policies.

CREATE TABLE IF NOT EXISTS STUDENT_PROFILE (
  student_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roll_no       TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  gender        gender_enum NOT NULL,
  adm_year      INT NOT NULL,
  pass_year     INT NOT NULL,
  program       TEXT NOT NULL,
  batch         TEXT NOT NULL,               -- e.g. "2023-2027"
  contact       TEXT,
  hostel_code   TEXT NOT NULL REFERENCES HOSTEL(code),
  discord_id    TEXT UNIQUE,                 -- linked Discord user snowflake
  noise_pref    INT CHECK (noise_pref BETWEEN 1 AND 5) DEFAULT 3,  -- 1=quiet, 5=social
  sleep_pref    TEXT CHECK (sleep_pref IN ('early','normal','late')) DEFAULT 'normal',
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS STAFF (
  staff_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  role            staff_role_enum NOT NULL,
  hostel_code     TEXT REFERENCES HOSTEL(code),  -- NULL = cross-hostel
  contact         TEXT,
  discord_tag     TEXT,                           -- Discord @username for bot pings
  discord_id      TEXT UNIQUE,                    -- Discord snowflake for DMs
  twilio_phone    TEXT,                           -- E.164 format for SMS
  availability    BOOLEAN NOT NULL DEFAULT true,
  active_tickets  INT NOT NULL DEFAULT 0,         -- denormalized counter, kept consistent by trigger
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ADMIN_PROFILE (
  admin_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hostel_code TEXT REFERENCES HOSTEL(code),  -- NULL = super admin
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ROOMS ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ROOM (
  room_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code         TEXT NOT NULL UNIQUE,       -- "BH1-302"
  hostel_code       TEXT NOT NULL REFERENCES HOSTEL(code),
  floor             INT NOT NULL,
  type_id           INT NOT NULL REFERENCES ROOM_TYPE(type_id),
  capacity          INT NOT NULL,               -- denormalized from ROOM_TYPE for query perf
  current_occupancy INT NOT NULL DEFAULT 0 CHECK (current_occupancy >= 0),
  status            room_status_enum NOT NULL DEFAULT 'available',
  noise_level       INT CHECK (noise_level BETWEEN 1 AND 5) DEFAULT 3,
  features          TEXT[],                     -- ['AC','Attached Bath','Balcony']
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT occupancy_cap CHECK (current_occupancy <= capacity)
);

-- ─── ALLOCATION ──────────────────────────────────────────────────────────────
-- BCNF note: allocation_id → student_id, room_id, dates. No partial dependencies.
-- One student can have at most one 'active' allocation (enforced by partial unique index).

CREATE TABLE IF NOT EXISTS ALLOCATION (
  allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES STUDENT_PROFILE(student_id),
  room_id       UUID NOT NULL REFERENCES ROOM(room_id),
  start_date    DATE NOT NULL,
  end_date      DATE,
  status        alloc_status_enum NOT NULL DEFAULT 'active',
  allocated_by  UUID REFERENCES ADMIN_PROFILE(admin_id),  -- NULL = auto (CP-SAT)
  solver_run_id UUID,                                      -- links to SOLVER_RUN
  satisfaction  INT CHECK (satisfaction BETWEEN 0 AND 100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_student_alloc
  ON ALLOCATION(student_id)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS ALLOCATION_EVENT (
  event_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id UUID NOT NULL REFERENCES ALLOCATION(allocation_id),
  event_type    TEXT NOT NULL,
  old_value     JSONB,
  new_value     JSONB,
  actor_id      UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ROOM BOOKING ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ROOM_BOOKING_REQUEST (
  request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES STUDENT_PROFILE(student_id),
  preferred_rooms UUID[],                       -- ordered preference list (up to 5)
  intent_text     TEXT,                         -- raw NL input: "quiet room near Rohan"
  parsed_prefs    JSONB,                        -- AI-parsed: {floor_pref, noise_pref, peer_ids[]}
  peer_ids        UUID[],                       -- preferred roommate student_ids
  status          booking_status NOT NULL DEFAULT 'pending',
  admin_note      TEXT,
  reviewed_by     UUID REFERENCES ADMIN_PROFILE(admin_id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── SOLVER (CP-SAT allocation runs) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS SOLVER_RUN (
  run_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_code     TEXT NOT NULL REFERENCES HOSTEL(code),
  initiated_by    UUID REFERENCES ADMIN_PROFILE(admin_id),
  status          TEXT CHECK (status IN ('queued','running','completed','failed')) DEFAULT 'queued',
  student_count   INT,
  room_count      INT,
  feasible        BOOLEAN,
  objective_value FLOAT,
  alpha           FLOAT DEFAULT 1.0,   -- weight: total satisfaction
  beta            FLOAT DEFAULT 0.5,   -- weight: envy penalty
  gamma           FLOAT DEFAULT 0.3,   -- weight: group disparity penalty
  ef1_violations  INT,                 -- count of EF1 violations in solution
  min_satisfaction INT,                -- max-min fairness metric
  solver_log      TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── COMPLAINTS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS COMPLAINT (
  ticket_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES STUDENT_PROFILE(student_id),
  room_id           UUID REFERENCES ROOM(room_id),
  category_id       INT NOT NULL REFERENCES COMPLAINT_CATEGORY(category_id),
  description       TEXT NOT NULL,
  severity          severity_enum NOT NULL DEFAULT 'Medium',
  status            ticket_status NOT NULL DEFAULT 'open',
  priority_score    FLOAT GENERATED ALWAYS AS (
                      CASE severity
                        WHEN 'Critical' THEN 100.0
                        WHEN 'High'     THEN 70.0
                        WHEN 'Medium'   THEN 40.0
                        WHEN 'Low'      THEN 10.0
                      END
                    ) STORED,
  assigned_to       UUID REFERENCES STAFF(staff_id),
  discord_thread_id TEXT,               -- Discord thread snowflake for this ticket
  discord_channel_id TEXT,              -- channel where ticket was filed
  photo_url         TEXT,               -- Supabase Storage URL
  sla_deadline      TIMESTAMPTZ,        -- computed on insert trigger
  resolved_at       TIMESTAMPTZ,
  closed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS TICKET_EVENT (
  event_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES COMPLAINT(ticket_id),
  event_type  event_type_enum NOT NULL,
  old_status  ticket_status,
  new_status  ticket_status,
  note        TEXT,
  actor_id    UUID,                     -- staff_id or student_id or NULL (system)
  discord_msg_id TEXT,                  -- Discord message ID for this event
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FAIRNESS TRACKING ───────────────────────────────────────────────────────
-- Stores per-ticket fairness metadata computed by the complaint routing engine.

CREATE TABLE IF NOT EXISTS COMPLAINT_FAIRNESS_LOG (
  log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id         UUID NOT NULL REFERENCES COMPLAINT(ticket_id),
  hostel_code       TEXT NOT NULL,
  student_group     TEXT,               -- batch / hostel / gender group label
  response_time_min INT,                -- actual response time in minutes
  sla_minutes       INT,
  sla_met           BOOLEAN GENERATED ALWAYS AS (response_time_min <= sla_minutes) STORED,
  envy_flag         BOOLEAN DEFAULT false,  -- flagged if peer got faster service
  priority_rank     INT,               -- rank among open tickets at time of assignment
  worker_load_at_assign INT,           -- assignee's active_tickets count at assignment
  iau_score         FLOAT,             -- Inequity Aversion Utility score (0-1)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS NOTIFICATION (
  notif_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,          -- student_id or staff_id
  channel       notif_channel NOT NULL,
  payload       JSONB NOT NULL,
  delivery_status TEXT CHECK (delivery_status IN ('pending','sent','failed','delivered')) DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at       TIMESTAMPTZ
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_complaint_student    ON COMPLAINT(student_id);
CREATE INDEX IF NOT EXISTS idx_complaint_status     ON COMPLAINT(status);
CREATE INDEX IF NOT EXISTS idx_complaint_severity   ON COMPLAINT(severity);
CREATE INDEX IF NOT EXISTS idx_complaint_assignee   ON COMPLAINT(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaint_sla        ON COMPLAINT(sla_deadline) WHERE status NOT IN ('resolved','closed');
CREATE INDEX IF NOT EXISTS idx_allocation_student   ON ALLOCATION(student_id);
CREATE INDEX IF NOT EXISTS idx_allocation_room      ON ALLOCATION(room_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_ticket_event_ticket  ON TICKET_EVENT(ticket_id);
CREATE INDEX IF NOT EXISTS idx_room_hostel_status   ON ROOM(hostel_code, status);
CREATE INDEX IF NOT EXISTS idx_student_hostel       ON STUDENT_PROFILE(hostel_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_staff_role_hostel    ON STAFF(role, hostel_code) WHERE deleted_at IS NULL;

-- ─── TRIGGERS ────────────────────────────────────────────────────────────────

-- 1. Auto-set SLA deadline on complaint insert
CREATE OR REPLACE FUNCTION fn_set_sla_deadline()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  SELECT now() + (cc.sla_minutes * INTERVAL '1 minute')
  INTO NEW.sla_deadline
  FROM COMPLAINT_CATEGORY cc WHERE cc.category_id = NEW.category_id;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_set_sla ON COMPLAINT;
CREATE TRIGGER trg_set_sla BEFORE INSERT ON COMPLAINT
  FOR EACH ROW EXECUTE FUNCTION fn_set_sla_deadline();

-- 2. Keep ROOM.current_occupancy consistent on allocation change (ACID-safe)
CREATE OR REPLACE FUNCTION fn_sync_occupancy()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE ROOM SET current_occupancy = current_occupancy + 1
    WHERE room_id = NEW.room_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE ROOM SET current_occupancy = current_occupancy - 1
      WHERE room_id = OLD.room_id;
    ELSIF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE ROOM SET current_occupancy = current_occupancy + 1
      WHERE room_id = NEW.room_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sync_occupancy ON ALLOCATION;
CREATE TRIGGER trg_sync_occupancy AFTER INSERT OR UPDATE ON ALLOCATION
  FOR EACH ROW EXECUTE FUNCTION fn_sync_occupancy();

-- 3. Keep STAFF.active_tickets consistent
CREATE OR REPLACE FUNCTION fn_sync_staff_load()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      IF OLD.assigned_to IS NOT NULL THEN
        UPDATE STAFF SET active_tickets = active_tickets - 1 WHERE staff_id = OLD.assigned_to;
      END IF;
      IF NEW.assigned_to IS NOT NULL AND NEW.status NOT IN ('resolved','closed') THEN
        UPDATE STAFF SET active_tickets = active_tickets + 1 WHERE staff_id = NEW.assigned_to;
      END IF;
    END IF;
    IF OLD.status NOT IN ('resolved','closed') AND NEW.status IN ('resolved','closed') AND NEW.assigned_to IS NOT NULL THEN
      UPDATE STAFF SET active_tickets = active_tickets - 1 WHERE staff_id = NEW.assigned_to;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sync_staff_load ON COMPLAINT;
CREATE TRIGGER trg_sync_staff_load AFTER UPDATE ON COMPLAINT
  FOR EACH ROW EXECUTE FUNCTION fn_sync_staff_load();

-- 4. Auto-log ticket events on status change
CREATE OR REPLACE FUNCTION fn_log_ticket_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO TICKET_EVENT(ticket_id, event_type, old_status, new_status, actor_id)
    VALUES (NEW.ticket_id, 'status_change', OLD.status, NEW.status, NEW.assigned_to);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_log_ticket_event ON COMPLAINT;
CREATE TRIGGER trg_log_ticket_event AFTER UPDATE ON COMPLAINT
  FOR EACH ROW EXECUTE FUNCTION fn_log_ticket_event();
```

### 1.3 Row Level Security Policies

Append to the same migration file:

```sql
-- ─── RLS ─────────────────────────────────────────────────────────────────────
-- Rule: helpers stored in auth.jwt() app_metadata: { role: 'student'|'staff'|'admin', hostel_code: 'BH1' }

CREATE OR REPLACE FUNCTION auth_role() RETURNS TEXT LANGUAGE sql STABLE AS
  $$ SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'anon') $$;

CREATE OR REPLACE FUNCTION auth_hostel() RETURNS TEXT LANGUAGE sql STABLE AS
  $$ SELECT auth.jwt() -> 'app_metadata' ->> 'hostel_code' $$;

-- STUDENT_PROFILE
ALTER TABLE STUDENT_PROFILE ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_own_read"   ON STUDENT_PROFILE FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "student_own_update" ON STUDENT_PROFILE FOR UPDATE TO authenticated
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- ROOM
ALTER TABLE ROOM ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_public_read"  ON ROOM FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_admin_write"  ON ROOM FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

-- ALLOCATION
ALTER TABLE ALLOCATION ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alloc_student_read" ON ALLOCATION FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "alloc_admin_write"  ON ALLOCATION FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

-- COMPLAINT
ALTER TABLE COMPLAINT ENABLE ROW LEVEL SECURITY;
CREATE POLICY "complaint_student_own" ON COMPLAINT FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "complaint_student_insert" ON COMPLAINT FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND auth_role() = 'student');
CREATE POLICY "complaint_staff_update" ON COMPLAINT FOR UPDATE TO authenticated
  USING (auth_role() IN ('admin','staff'));

-- TICKET_EVENT (append-only, immutable)
ALTER TABLE TICKET_EVENT ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_event_read" ON TICKET_EVENT FOR SELECT TO authenticated
  USING (
    auth_role() IN ('admin','staff')
    OR EXISTS (
      SELECT 1 FROM COMPLAINT c WHERE c.ticket_id = TICKET_EVENT.ticket_id AND c.student_id = auth.uid()
    )
  );

-- COMPLAINT_FAIRNESS_LOG (admin/staff only — students see aggregate view only)
ALTER TABLE COMPLAINT_FAIRNESS_LOG ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fairness_log_staff" ON COMPLAINT_FAIRNESS_LOG FOR SELECT TO authenticated
  USING (auth_role() IN ('admin','staff'));

-- ROOM_BOOKING_REQUEST
ALTER TABLE ROOM_BOOKING_REQUEST ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_student_own" ON ROOM_BOOKING_REQUEST FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() = 'admin');
CREATE POLICY "booking_student_insert" ON ROOM_BOOKING_REQUEST FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- SOLVER_RUN
ALTER TABLE SOLVER_RUN ENABLE ROW LEVEL SECURITY;
CREATE POLICY "solver_admin_only" ON SOLVER_RUN FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

-- NOTIFICATION
ALTER TABLE NOTIFICATION ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_own" ON NOTIFICATION FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR auth_role() IN ('admin','staff'));
```

---

## 2. SCHEDULING ALGORITHM: CP-SAT ALLOCATION SERVICE

Create a standalone Python microservice at `services/allocator/`.

### 2.1 Files to create

```
services/allocator/
  main.py          # FastAPI entry point
  solver.py        # CP-SAT model
  fairness.py      # EF1 + Max-Min + Group fairness checks
  models.py        # Pydantic schemas
  requirements.txt
  Dockerfile
```

### 2.2 `requirements.txt`

```
fastapi==0.111.0
uvicorn==0.29.0
ortools==9.10.4067
pydantic==2.7.1
fairpyx==0.3.0        # ariel-research/fairpyx — EF1 algorithms
supabase==2.4.3
python-dotenv==1.0.1
```

### 2.3 `models.py`

```python
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class StudentInput(BaseModel):
    student_id: UUID
    gender: str                        # 'M', 'F', 'Other'
    batch: str                         # '2023-2027'
    hostel_code: str
    noise_pref: int = Field(3, ge=1, le=5)
    sleep_pref: str = 'normal'
    peer_ids: list[UUID] = []          # preferred roommates
    preferred_room_ids: list[UUID] = []

class RoomInput(BaseModel):
    room_id: UUID
    room_code: str
    hostel_code: str
    capacity: int
    current_occupancy: int
    noise_level: int = Field(3, ge=1, le=5)
    features: list[str] = []

class SolverConfig(BaseModel):
    alpha: float = 1.0    # weight: aggregate satisfaction
    beta:  float = 0.5    # weight: envy penalty
    gamma: float = 0.3    # weight: group disparity penalty
    time_limit_seconds: int = 60
    max_solutions: int = 1

class AllocationRequest(BaseModel):
    run_id: UUID
    hostel_code: str
    students: list[StudentInput]
    rooms: list[RoomInput]
    config: SolverConfig = SolverConfig()

class StudentAllocation(BaseModel):
    student_id: UUID
    room_id: UUID
    satisfaction_score: int

class FairnessReport(BaseModel):
    ef1_violations: int
    min_satisfaction: int
    max_satisfaction: int
    group_disparity: float
    iau_score: float

class SolverResult(BaseModel):
    run_id: UUID
    feasible: bool
    optimal: bool
    objective_value: float
    allocations: list[StudentAllocation]
    fairness: FairnessReport
    solver_log: str
    elapsed_seconds: float
```

### 2.4 `solver.py`

Write this file in full. The logic must implement:

**Step 1 — Build the CP-SAT model:**

```python
from ortools.sat.python import cp_model
import time
from models import AllocationRequest, SolverResult, StudentAllocation, FairnessReport

SCALE = 100  # CP-SAT requires integers; multiply float scores by SCALE

def run_solver(req: AllocationRequest) -> SolverResult:
    t0 = time.perf_counter()
    model = cp_model.CpModel()

    students = req.students
    rooms = req.rooms
    n = len(students)
    m = len(rooms)

    # Index maps
    s_idx = {s.student_id: i for i, s in enumerate(students)}
    r_idx = {r.room_id: j for j, r in enumerate(rooms)}

    # ── Decision variables x[i][j] = 1 iff student i assigned to room j ──
    x = [[model.new_bool_var(f'x_{i}_{j}') for j in range(m)] for i in range(n)]

    # ── HARD CONSTRAINT 1: Each student assigned to exactly one room ──
    for i in range(n):
        model.add_exactly_one(x[i][j] for j in range(m))

    # ── HARD CONSTRAINT 2: Room capacity ──
    for j, room in enumerate(rooms):
        available = room.capacity - room.current_occupancy
        model.add(sum(x[i][j] for i in range(n)) <= available)

    # ── HARD CONSTRAINT 3: Gender segregation (same hostel block = same gender) ──
    for i1, s1 in enumerate(students):
        for i2, s2 in enumerate(students):
            if i1 >= i2:
                continue
            if s1.gender != s2.gender:
                # They cannot share the same room
                for j in range(m):
                    model.add(x[i1][j] + x[i2][j] <= 1)

    # ── SOFT OBJECTIVE: Satisfaction scores ──
    # Satisfaction = base_noise_match + peer_bonus + feature_bonus
    def compute_pref_score(student, room) -> int:
        score = 50  # baseline
        # Noise compatibility (inverted distance)
        noise_diff = abs(student.noise_pref - room.noise_level)
        score += max(0, 20 - noise_diff * 8)
        # Peer bonus: if any preferred peer already in this room (approximated statically)
        # Full peer co-assignment handled via peer_pair bonus below
        return min(score, 100)

    pref = [[compute_pref_score(students[i], rooms[j]) for j in range(m)] for i in range(n)]

    # Peer co-assignment bonus variables
    peer_pairs = []
    for i1, s1 in enumerate(students):
        for peer_id in s1.peer_ids:
            if peer_id not in s_idx:
                continue
            i2 = s_idx[peer_id]
            if i1 >= i2:
                continue
            # b_ij = 1 iff both s1 and s2 are in the same room
            for j in range(m):
                b = model.new_bool_var(f'peer_{i1}_{i2}_{j}')
                model.add_bool_and([x[i1][j], x[i2][j]]).only_enforce_if(b)
                model.add_bool_or([x[i1][j].negated(), x[i2][j].negated()]).only_enforce_if(b.negated())
                peer_pairs.append((b, 15 * SCALE))  # 15pt peer bonus, scaled

    # Satisfaction sum (scaled integers for CP-SAT)
    total_satisfaction = sum(
        pref[i][j] * SCALE * x[i][j]
        for i in range(n) for j in range(m)
    )
    peer_bonus = sum(b * bonus for b, bonus in peer_pairs)

    # ── SOFT OBJECTIVE: Max-Min fairness ──
    # z = min satisfaction across all students
    z = model.new_int_var(0, 100 * SCALE, 'z_minsat')
    for i in range(n):
        student_sat = sum(pref[i][j] * SCALE * x[i][j] for j in range(m))
        model.add(z <= student_sat)

    # ── COMBINED OBJECTIVE ──
    alpha_i = int(req.config.alpha * SCALE)
    gamma_i = int(req.config.gamma * SCALE)

    model.maximize(
        alpha_i * total_satisfaction
        + sum(b * bonus for b, bonus in peer_pairs)
        + gamma_i * z  # max-min term
    )

    # ── SOLVE ──
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = req.config.time_limit_seconds
    solver.parameters.num_search_workers = 4
    solver.parameters.log_search_progress = True

    import io, contextlib
    log_buffer = io.StringIO()
    with contextlib.redirect_stdout(log_buffer):
        status = solver.solve(model)

    feasible = status in (cp_model.OPTIMAL, cp_model.FEASIBLE)
    optimal  = status == cp_model.OPTIMAL

    allocations = []
    if feasible:
        for i, student in enumerate(students):
            for j, room in enumerate(rooms):
                if solver.boolean_value(x[i][j]):
                    sat = pref[i][j]
                    allocations.append(StudentAllocation(
                        student_id=student.student_id,
                        room_id=room.room_id,
                        satisfaction_score=sat
                    ))
                    break

    # ── FAIRNESS REPORT ──
    fairness = compute_fairness(allocations, students, pref, s_idx, r_idx)

    elapsed = time.perf_counter() - t0
    return SolverResult(
        run_id=req.run_id,
        feasible=feasible,
        optimal=optimal,
        objective_value=solver.objective_value if feasible else 0.0,
        allocations=allocations,
        fairness=fairness,
        solver_log=log_buffer.getvalue(),
        elapsed_seconds=elapsed
    )
```

**Step 2 — EF1 and fairness checker in `fairness.py`:**

```python
# fairness.py
# Implements:
#   - EF1 check: For every pair (i, k), does student i envy student k's room
#                even after removing the best component of k's bundle?
#   - Max-Min satisfaction
#   - Group disparity (batch / hostel)
#   - IAU (Inequity Aversion Utility): penalizes large load variance across staff
#
# For EF1 in room allocation, the "bundle" is:
#   {room features, noise level match, peer co-assignment}
# "Removing one component" = removing the single highest-value feature from k's perceived bundle.

from models import StudentAllocation, StudentInput, FairnessReport

def compute_fairness(
    allocations: list[StudentAllocation],
    students: list[StudentInput],
    pref: list[list[int]],
    s_idx: dict,
    r_idx: dict
) -> FairnessReport:
    if not allocations:
        return FairnessReport(ef1_violations=0, min_satisfaction=0,
                              max_satisfaction=0, group_disparity=0.0, iau_score=1.0)

    sat_map = {a.student_id: a.satisfaction_score for a in allocations}
    room_map = {a.student_id: a.room_id for a in allocations}

    scores = list(sat_map.values())
    min_sat = min(scores)
    max_sat = max(scores)

    # EF1 violations
    ef1_violations = 0
    REMOVABLE_COMPONENT_VALUE = 15  # estimated value of removing best feature (peer bonus equiv.)

    for s_i in students:
        if s_i.student_id not in sat_map:
            continue
        ui_own = sat_map[s_i.student_id]
        for s_k in students:
            if s_i.student_id == s_k.student_id:
                continue
            if s_k.student_id not in sat_map:
                continue
            ui_k = sat_map[s_k.student_id]
            # i envies k if ui(Xi) < ui(Xk)
            if ui_own < ui_k:
                # EF1: is ui_own >= ui_k - removable_component?
                if ui_own < (ui_k - REMOVABLE_COMPONENT_VALUE):
                    ef1_violations += 1

    # Group disparity: batch-level average satisfaction
    batch_scores: dict[str, list[int]] = {}
    for s in students:
        if s.student_id in sat_map:
            batch_scores.setdefault(s.batch, []).append(sat_map[s.student_id])

    group_means = {batch: sum(v)/len(v) for batch, v in batch_scores.items()}
    if len(group_means) >= 2:
        vals = list(group_means.values())
        group_disparity = max(vals) - min(vals)
    else:
        group_disparity = 0.0

    # IAU score (1.0 = perfectly equal, 0.0 = maximum inequity)
    # Simple Gini-coefficient approximation
    if max_sat == min_sat:
        iau_score = 1.0
    else:
        n = len(scores)
        sorted_scores = sorted(scores)
        gini_num = sum((2 * (i + 1) - n - 1) * s for i, s in enumerate(sorted_scores))
        gini = gini_num / (n * sum(sorted_scores))
        iau_score = max(0.0, 1.0 - abs(gini))

    return FairnessReport(
        ef1_violations=ef1_violations,
        min_satisfaction=min_sat,
        max_satisfaction=max_sat,
        group_disparity=round(group_disparity, 2),
        iau_score=round(iau_score, 4)
    )
```

**Step 3 — `main.py` (FastAPI):**

```python
# main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from models import AllocationRequest, SolverResult
from solver import run_solver
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="AHCMS Allocation Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["POST","GET"])

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])

@app.post("/allocate", response_model=SolverResult)
async def allocate(req: AllocationRequest, bg: BackgroundTasks):
    # Mark run as 'running'
    supabase.table("SOLVER_RUN").update({"status": "running", "started_at": "now()"}).eq("run_id", str(req.run_id)).execute()
    try:
        result = run_solver(req)
    except Exception as e:
        supabase.table("SOLVER_RUN").update({"status": "failed", "solver_log": str(e)}).eq("run_id", str(req.run_id)).execute()
        raise HTTPException(status_code=500, detail=str(e))

    # Persist result to Supabase in background
    bg.add_task(persist_result, req, result)
    return result

async def persist_result(req: AllocationRequest, result: SolverResult):
    # Update solver run
    supabase.table("SOLVER_RUN").update({
        "status": "completed" if result.feasible else "failed",
        "feasible": result.feasible,
        "objective_value": result.objective_value,
        "ef1_violations": result.fairness.ef1_violations,
        "min_satisfaction": result.fairness.min_satisfaction,
        "solver_log": result.solver_log[:5000],
        "completed_at": "now()"
    }).eq("run_id", str(req.run_id)).execute()

    if result.feasible:
        # Insert allocations in a single batch
        rows = [{
            "student_id": str(a.student_id),
            "room_id": str(a.room_id),
            "start_date": "today",
            "status": "active",
            "solver_run_id": str(req.run_id),
            "satisfaction": a.satisfaction_score
        } for a in result.allocations]
        supabase.table("ALLOCATION").upsert(rows).execute()

@app.get("/health")
def health():
    return {"status": "ok"}
```

### 2.5 Deploy the allocator service

Deploy this FastAPI service to **Railway** or **Fly.io** (it's a long-running Python process — Vercel's 10s timeout is incompatible). Call it from the Next.js admin panel via a Server Action.

---

## 3. DISCORD BOT + COMPLAINT INTEGRATION

### 3.1 Architecture

```
Student runs /report in Discord
     │
     ▼
Discord HTTP POST → Supabase Edge Function: supabase/functions/discord-bot/index.ts
     │  Ed25519 signature verified (tweetnacl)
     │
     ├─ INSERT into COMPLAINT (via service_role client)
     │
     ├─ Returns ephemeral Discord response with ticket ID
     │
     ▼
Supabase DB Webhook on COMPLAINT INSERT
     │
     ▼
Edge Function: supabase/functions/notify-staff/index.ts
     │
     ├─ Routes to correct staff via ROUTING_RULE
     │
     ├─ Creates Discord thread in #complaints channel
     │
     ├─ If severity = 'Critical': POST to Twilio SMS API
     │
     └─ INSERT into NOTIFICATION table
```

### 3.2 `supabase/functions/discord-bot/index.ts`

```typescript
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
const SUPABASE_URL        = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_BOT_TOKEN   = Deno.env.get("DISCORD_BOT_TOKEN")!;

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));
}

async function verifySignature(req: Request): Promise<{ valid: boolean; body: string }> {
  const signature = req.headers.get("X-Signature-Ed25519")!;
  const timestamp  = req.headers.get("X-Signature-Timestamp")!;
  const body = await req.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(DISCORD_PUBLIC_KEY)
  );
  return { valid, body };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { valid, body } = await verifySignature(req);
  if (!valid) return new Response("Unauthorized", { status: 401 });

  const interaction = JSON.parse(body);

  // PING handshake
  if (interaction.type === 1) {
    return Response.json({ type: 1 });
  }

  // Slash command
  if (interaction.type === 2) {
    const command = interaction.data.name;
    const discordUserId = interaction.member?.user?.id ?? interaction.user?.id;
    const channelId = interaction.channel_id;

    if (command === "report") {
      return await handleReport(interaction, discordUserId, channelId);
    }
    if (command === "status") {
      return await handleStatus(interaction, discordUserId);
    }
    if (command === "my-tickets") {
      return await handleMyTickets(discordUserId);
    }
  }

  return Response.json({ type: 4, data: { content: "Unknown command.", flags: 64 } });
});

async function handleReport(interaction: any, discordUserId: string, channelId: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const options = interaction.data.options ?? [];
  const get = (name: string) => options.find((o: any) => o.name === name)?.value;

  const categoryLabel = get("category");   // e.g. "Plumbing"
  const description   = get("description");
  const roomCode      = get("room_code");

  if (!categoryLabel || !description) {
    return Response.json({
      type: 4,
      data: { content: "❌ Missing required fields: category and description.", flags: 64 }
    });
  }

  // Look up student by discord_id
  const { data: student } = await sb
    .from("STUDENT_PROFILE")
    .select("student_id, name, hostel_code")
    .eq("discord_id", discordUserId)
    .single();

  if (!student) {
    return Response.json({
      type: 4,
      data: { content: "❌ Your Discord account is not linked to an AHCMS account. Visit ahcms.vercel.app to link it.", flags: 64 }
    });
  }

  // Look up category
  const { data: category } = await sb
    .from("COMPLAINT_CATEGORY")
    .select("category_id, sla_minutes")
    .eq("name", categoryLabel)
    .single();

  // Look up room if provided
  let roomId: string | null = null;
  if (roomCode) {
    const { data: room } = await sb.from("ROOM").select("room_id").eq("room_code", roomCode).single();
    roomId = room?.room_id ?? null;
  }

  // Determine severity from keyword matching
  const severity = classifyseverity(description);

  // Insert complaint
  const { data: complaint, error } = await sb.from("COMPLAINT").insert({
    student_id:        student.student_id,
    room_id:           roomId,
    category_id:       category?.category_id ?? 1,
    description,
    severity,
    discord_channel_id: channelId,
    status:            "open"
  }).select("ticket_id").single();

  if (error) {
    return Response.json({ type: 4, data: { content: "❌ Failed to create ticket. Please try again.", flags: 64 } });
  }

  const shortId = complaint.ticket_id.split("-")[0].toUpperCase();

  return Response.json({
    type: 4,
    data: {
      content: `✅ Ticket **#${shortId}** created!\n> **Category:** ${categoryLabel}\n> **Severity:** ${severity}\n> **Status:** Open\n\nYou will receive updates in this channel. Use \`/status ${complaint.ticket_id}\` to check anytime.`,
      flags: 64  // ephemeral
    }
  });
}

async function handleStatus(interaction: any, discordUserId: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const ticketId = interaction.data.options?.find((o: any) => o.name === "ticket_id")?.value;

  const { data: ticket } = await sb
    .from("COMPLAINT")
    .select("ticket_id, status, severity, description, created_at, COMPLAINT_CATEGORY(name), STAFF(name)")
    .eq("ticket_id", ticketId)
    .single();

  if (!ticket) return Response.json({ type: 4, data: { content: "❌ Ticket not found.", flags: 64 } });

  const assignee = (ticket as any).STAFF?.name ?? "Unassigned";
  const category = (ticket as any).COMPLAINT_CATEGORY?.name ?? "Unknown";
  const shortId = ticket.ticket_id.split("-")[0].toUpperCase();

  return Response.json({
    type: 4,
    data: {
      content: `📋 **Ticket #${shortId}**\n> **Category:** ${category}\n> **Severity:** ${ticket.severity}\n> **Status:** ${ticket.status}\n> **Assigned to:** ${assignee}\n> **Filed:** ${new Date(ticket.created_at).toLocaleDateString()}`,
      flags: 64
    }
  });
}

async function handleMyTickets(discordUserId: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: student } = await sb.from("STUDENT_PROFILE").select("student_id").eq("discord_id", discordUserId).single();
  if (!student) return Response.json({ type: 4, data: { content: "❌ Account not linked.", flags: 64 } });

  const { data: tickets } = await sb
    .from("COMPLAINT")
    .select("ticket_id, status, severity, COMPLAINT_CATEGORY(name)")
    .eq("student_id", student.student_id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!tickets?.length) return Response.json({ type: 4, data: { content: "You have no complaints on record.", flags: 64 } });

  const lines = tickets.map(t => {
    const id = t.ticket_id.split("-")[0].toUpperCase();
    const cat = (t as any).COMPLAINT_CATEGORY?.name ?? "Unknown";
    return `• **#${id}** — ${cat} · ${t.severity} · \`${t.status}\``;
  }).join("\n");

  return Response.json({ type: 4, data: { content: `📋 **Your last 5 tickets:**\n${lines}`, flags: 64 } });
}

function classifyseverity(text: string): string {
  const t = text.toLowerCase();
  const critical = ["flood","fire","electric shock","short circuit","structural","collapse","gas leak"];
  const high     = ["no water","no electricity","broken","sewage","overflow","urgent"];
  const medium   = ["leaking","slow","intermittent","clogged"];
  if (critical.some(k => t.includes(k))) return "Critical";
  if (high.some(k => t.includes(k))) return "High";
  if (medium.some(k => t.includes(k))) return "Medium";
  return "Low";
}
```

### 3.3 Register Discord Slash Commands

Create `scripts/register-discord-commands.ts`:

```typescript
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const APP_ID    = process.env.DISCORD_APP_ID!;

const commands = [
  {
    name: "report",
    description: "File a new hostel complaint",
    options: [
      { name: "category",    description: "Type of issue",      type: 3, required: true,
        choices: ["Plumbing","Electricity","WiFi","Cleanliness","Carpentry","Pest","Structural","Other"].map(v => ({ name: v, value: v })) },
      { name: "description", description: "Describe the issue", type: 3, required: true },
      { name: "room_code",   description: "Room code (e.g. BH1-302)", type: 3, required: false }
    ]
  },
  {
    name: "status",
    description: "Check complaint status",
    options: [{ name: "ticket_id", description: "Full ticket UUID", type: 3, required: true }]
  },
  {
    name: "my-tickets",
    description: "View your last 5 complaints"
  }
];

const res = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/commands`, {
  method: "PUT",
  headers: { "Authorization": `Bot ${BOT_TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify(commands)
});
console.log(await res.json());
```

Run with: `npx tsx scripts/register-discord-commands.ts`

### 3.4 Staff Notification Edge Function

`supabase/functions/notify-staff/index.ts` — triggered by DB Webhook on `COMPLAINT INSERT`:

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL         = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_BOT_TOKEN    = Deno.env.get("DISCORD_BOT_TOKEN")!;
const DISCORD_COMPLAINTS_CHANNEL = Deno.env.get("DISCORD_COMPLAINTS_CHANNEL_ID")!;
const TWILIO_ACCOUNT_SID   = Deno.env.get("TWILIO_ACCOUNT_SID")!;
const TWILIO_AUTH_TOKEN    = Deno.env.get("TWILIO_AUTH_TOKEN")!;
const TWILIO_FROM_NUMBER   = Deno.env.get("TWILIO_PHONE_NUMBER")!;

Deno.serve(async (req: Request) => {
  const { record } = await req.json();  // the new COMPLAINT row
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // ── 1. Route to staff using ROUTING_RULE ──
  const { data: rule } = await sb
    .from("ROUTING_RULE")
    .select("role_target, escalation_role, sla_minutes")
    .eq("category_id", record.category_id)
    .order("priority_order")
    .limit(1)
    .single();

  // Find staff with least active_tickets in matching role and hostel
  const { data: staff } = await sb
    .from("STAFF")
    .select("staff_id, name, discord_id, twilio_phone, active_tickets")
    .eq("role", rule?.role_target ?? "Supervisor")
    .eq("availability", true)
    .is("deleted_at", null)
    .order("active_tickets", { ascending: true })
    .limit(1)
    .single();

  // Assign complaint
  if (staff) {
    await sb.from("COMPLAINT").update({
      assigned_to: staff.staff_id,
      status: "assigned"
    }).eq("ticket_id", record.ticket_id);
  }

  // ── 2. Create Discord thread for this ticket ──
  const shortId = record.ticket_id.split("-")[0].toUpperCase();
  const threadRes = await fetch(
    `https://discord.com/api/v10/channels/${DISCORD_COMPLAINTS_CHANNEL}/threads`,
    {
      method: "POST",
      headers: { "Authorization": `Bot ${DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `[${shortId}] ${record.severity} — Ticket`,
        type: 11,  // PUBLIC_THREAD
        auto_archive_duration: 1440,
        message: {
          content: [
            `🎫 **New Complaint #${shortId}**`,
            `> **Severity:** ${record.severity}`,
            `> **Status:** Open`,
            `> **Description:** ${record.description}`,
            `> **Assigned to:** ${staff?.name ?? "Unassigned"}`,
            staff?.discord_id ? `<@${staff.discord_id}> you've been assigned this ticket.` : ""
          ].join("\n")
        }
      })
    }
  );
  const thread = await threadRes.json();

  // Store thread ID on complaint
  await sb.from("COMPLAINT").update({ discord_thread_id: thread.id }).eq("ticket_id", record.ticket_id);

  // ── 3. Twilio SMS for Critical severity ──
  if (record.severity === "Critical" && staff?.twilio_phone) {
    const body = `[AHCMS CRITICAL] Ticket #${shortId} — ${record.description.slice(0, 100)}. Immediate action required.`;
    await sendSMS(staff.twilio_phone, body);
  }

  // ── 4. Log to COMPLAINT_FAIRNESS_LOG ──
  const { data: category } = await sb
    .from("COMPLAINT_CATEGORY")
    .select("sla_minutes")
    .eq("category_id", record.category_id)
    .single();

  await sb.from("COMPLAINT_FAIRNESS_LOG").insert({
    ticket_id: record.ticket_id,
    hostel_code: "BH1",  // derive from student's hostel in prod
    sla_minutes: category?.sla_minutes ?? 1440,
    worker_load_at_assign: staff?.active_tickets ?? 0,
    iau_score: staff ? Math.max(0, 1 - (staff.active_tickets / 20)) : null
  });

  return new Response("ok", { status: 200 });
});

async function sendSMS(to: string, body: string) {
  const creds = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: { "Authorization": `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER, Body: body }).toString()
  });
}
```

### 3.5 Setup Supabase Secrets

```bash
supabase secrets set DISCORD_PUBLIC_KEY=<from Developer Portal>
supabase secrets set DISCORD_BOT_TOKEN=<bot token>
supabase secrets set DISCORD_APP_ID=<app id>
supabase secrets set DISCORD_COMPLAINTS_CHANNEL_ID=<channel snowflake>
supabase secrets set TWILIO_ACCOUNT_SID=<sid>
supabase secrets set TWILIO_AUTH_TOKEN=<token>
supabase secrets set TWILIO_PHONE_NUMBER=<E.164 number>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service key>
```

### 3.6 Deploy Edge Functions

```bash
supabase functions deploy discord-bot --no-verify-jwt
supabase functions deploy notify-staff --no-verify-jwt
```

Set `discord-bot` function URL as your Discord app's Interactions Endpoint URL.

Create a **Database Webhook** in Supabase Dashboard:
- Table: `COMPLAINT`
- Event: `INSERT`
- Target URL: `https://<project>.supabase.co/functions/v1/notify-staff`

---

## 4. REMOVE FORUM — FRONTEND MIGRATION

### 4.1 What to delete from the existing codebase

Remove these files/components entirely:
- `src/pages/forum.js` and all sub-components
- `server/routes/forum.js`
- Schema tables: `FORUM_POST`, `FORUM_REPLY` — drop from migration (keep in old SQLite, do not port)

### 4.2 Replace with Discord CTA Component

In your Next.js app, create `components/DiscordCTA.tsx`:

```tsx
export default function DiscordCTA({ serverInviteUrl }: { serverInviteUrl: string }) {
  return (
    <div className="discord-cta">
      <div className="discord-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          {/* Discord logo path */}
        </svg>
      </div>
      <div className="discord-text">
        <p className="discord-title">Complaints, now in Discord</p>
        <p className="discord-sub">Use <code>/report</code> in your hostel channel. Live updates. No forms.</p>
      </div>
      <a href={serverInviteUrl} target="_blank" rel="noreferrer" className="discord-join">
        Join Server →
      </a>
    </div>
  );
}
```

---

## 5. ROOM BOOKING — IVE-KARPATHY UX

### 5.1 What changes

The old booking flow had students pick a room from a list. The new flow:

1. **Single intent field**: `"Describe your ideal room"` — freeform text.
2. **AI parses intent** via a Next.js Server Action calling Claude API to extract structured prefs.
3. **System shows "Best Match" cards** — top 3 rooms ranked by CP-SAT preference score.
4. **Peer co-request**: `"Add a roommate"` — links by roll number, creates mutual peer_ids.
5. **One-tap submit** — creates `ROOM_BOOKING_REQUEST` with parsed_prefs JSON.

### 5.2 Server Action: `app/actions/parseRoomIntent.ts`

```typescript
"use server";

export async function parseRoomIntent(intentText: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 300,
      system: `You are a room preference parser for a university hostel system.
Extract structured preferences from the student's natural language request.
Return ONLY valid JSON, no other text. Schema:
{
  "floor_pref": number | null,         // preferred floor number
  "noise_pref": 1|2|3|4|5 | null,     // 1=quiet, 5=lively
  "features": string[],                // e.g. ["AC", "Attached Bath"]
  "peer_roll_nos": string[],           // mentioned friend roll numbers
  "hostel_pref": string | null         // hostel name/code if mentioned
}`,
      messages: [{ role: "user", content: intentText }]
    })
  });

  const data = await response.json();
  const raw = data.content[0].text;
  try {
    return JSON.parse(raw);
  } catch {
    return { floor_pref: null, noise_pref: null, features: [], peer_roll_nos: [], hostel_pref: null };
  }
}
```

### 5.3 Room Booking Page Design Spec

The room booking page (`/dashboard/book-room`) must implement exactly this layout:

```
┌──────────────────────────────────────────────────────────┐
│  [← Back]                                                │
│                                                          │
│  Find your room.                                         │  ← 32px, weight 400, no bold
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  What matters to you?                            │   │  ← placeholder text only
│  │                                                  │   │  ← height: 80px, 1px border
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Add a roommate   [roll number field]  [+ Add]           │  ← inline, minimal
│                                                          │
│  ────────────────────────────────────────────────────    │  ← thin divider
│                                                          │
│  Best matches  (shown after intent entry)                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  BH1-302     │  │  BH1-410     │  │  BH1-215     │  │
│  │  Floor 3     │  │  Floor 4     │  │  Floor 2     │  │
│  │  ●●●●○ 82%  │  │  ●●●●○ 79%  │  │  ●●●○○ 68%  │  │
│  │  Double      │  │  Triple      │  │  Double      │  │
│  │  [Select]    │  │  [Select]    │  │  [Select]    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Design rules (non-negotiable):**
- Background: `#FAFAFA`
- Text: `#111111` (primary), `#777777` (secondary)
- Accent: single color only — `#1A1A2E` (deep navy)
- No icons except functional ones (back arrow, plus)
- No card shadows — use `1px solid #EBEBEB` borders
- Font: `Inter`, system-font fallback
- No skeleton loaders with shimmer — use opacity fade-in
- Match scores displayed as filled dots (●) not progress bars
- "Select" button: `border: 1px solid #1A1A2E`, transparent background, hover = filled

---

## 6. COMPLAINT FAIRNESS TRACKING — WHAT "GENETIC ALGORITHM" ACTUALLY MEANS HERE

The Gemini deep research document mentions a "Genetic Algorithm" for complaint classification. Here is the exact implementation:

**There is no GA classifier in v1.** The GA is used to tune the **hyperparameters** of a complaint severity classifier. Implement it as follows:

### 6.1 Phase 1 (build now): Rule-based classifier + priority scorer

The `classifyseverity()` function in `discord-bot/index.ts` (Section 3.2) is the production classifier. It is deterministic, auditable, and instant.

The **priority scoring function** (IAU-based) for staff routing is:

```
PriorityScore(ticket) = w1 × severity_score 
                      + w2 × time_since_creation_hours
                      + w3 × (1 if SLA_breached else 0)
                      - w4 × (distance_to_assignee_block)
```

Default weights: `w1=40, w2=20, w3=30, w4=10`.

### 6.2 Phase 2 (research extension): GA hyperparameter tuner

Create `services/ga-tuner/tune.py`. This is a **standalone script**, not part of production. Run it offline when you have >500 labeled historical complaints.

```python
# GA tunes weights w1, w2, w3, w4 and keyword severity thresholds
# Population: list of weight vectors [w1, w2, w3, w4, threshold_critical, threshold_high]
# Fitness: F1-score on labeled complaint dataset, weighted by severity class
# Crossover: single-point on weight vector
# Mutation: Gaussian noise N(0, 0.1) on each weight with p=0.15
# Run for 200 generations with population size 50

import random, math

POPULATION_SIZE = 50
GENERATIONS     = 200
MUTATION_RATE   = 0.15
MUTATION_SIGMA  = 0.1

def fitness(weights: list[float], labeled_data: list[dict]) -> float:
    """Compute weighted F1 on labeled complaint data."""
    w1, w2, w3, w4, tc, th = weights
    severity_weights = {"Critical": 4.0, "High": 2.0, "Medium": 1.0, "Low": 0.5}
    correct = sum_w = 0.0
    for item in labeled_data:
        score = w1 * item["sev_raw"] + w2 * item["age_h"] + w3 * item["sla_flag"]
        predicted = "Critical" if score > tc else "High" if score > th else "Medium"
        sw = severity_weights.get(item["true_label"], 1.0)
        if predicted == item["true_label"]:
            correct += sw
        sum_w += sw
    return correct / sum_w if sum_w > 0 else 0.0

def crossover(a, b):
    pt = random.randint(1, len(a) - 1)
    return a[:pt] + b[pt:]

def mutate(weights):
    return [w + random.gauss(0, MUTATION_SIGMA) if random.random() < MUTATION_RATE else w for w in weights]

def evolve(labeled_data):
    population = [[random.uniform(0, 100) for _ in range(6)] for _ in range(POPULATION_SIZE)]
    for gen in range(GENERATIONS):
        scored = sorted(population, key=lambda w: -fitness(w, labeled_data))
        population = scored[:10]  # elitism: keep top 10
        while len(population) < POPULATION_SIZE:
            parents = random.sample(scored[:20], 2)
            child = mutate(crossover(parents[0], parents[1]))
            population.append(child)
        if gen % 20 == 0:
            print(f"Gen {gen}: best fitness = {fitness(scored[0], labeled_data):.4f}")
    return scored[0]

# Usage: best_weights = evolve(load_labeled_data("complaints_labeled.json"))
# Then update w1-w4 constants in discord-bot/index.ts accordingly.
```

### 6.3 Fairness dashboard for admins

Create a Supabase view for the admin fairness panel:

```sql
CREATE OR REPLACE VIEW v_complaint_fairness_summary AS
SELECT
  c.ticket_id,
  sp.hostel_code,
  sp.batch,
  sp.gender,
  cc.name AS category,
  c.severity,
  c.status,
  EXTRACT(EPOCH FROM (COALESCE(c.resolved_at, now()) - c.created_at)) / 60 AS response_time_min,
  cc.sla_minutes,
  CASE WHEN EXTRACT(EPOCH FROM (COALESCE(c.resolved_at, now()) - c.created_at)) / 60 <= cc.sla_minutes
       THEN TRUE ELSE FALSE END AS sla_met,
  fl.iau_score,
  fl.worker_load_at_assign
FROM COMPLAINT c
JOIN STUDENT_PROFILE sp ON c.student_id = sp.student_id
JOIN COMPLAINT_CATEGORY cc ON c.category_id = cc.category_id
LEFT JOIN COMPLAINT_FAIRNESS_LOG fl ON fl.ticket_id = c.ticket_id;
```

In the admin dashboard, display:
- SLA compliance rate per category (bar chart)
- Average response time per hostel (comparison)
- IAU score trend over last 30 days (line chart)
- EF1 violation count per solver run (from `SOLVER_RUN.ef1_violations`)

Use **Recharts** for all charts. No Chart.js, no D3.

---

## 7. ENVIRONMENT VARIABLES

Create `.env.local` (never commit):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server-only
ANTHROPIC_API_KEY=                   # server-only
DISCORD_PUBLIC_KEY=
DISCORD_BOT_TOKEN=
DISCORD_APP_ID=
DISCORD_COMPLAINTS_CHANNEL_ID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
ALLOCATOR_SERVICE_URL=               # Railway/Fly.io FastAPI URL
ALLOCATOR_SERVICE_API_KEY=           # internal auth between Next.js and allocator
```

---

## 8. VERCEL DEPLOYMENT CHECKLIST

```
vercel.json:
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

- Set all env vars in Vercel Dashboard → Project Settings → Environment Variables
- NEVER set `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable
- Deploy `allocator` service separately on Railway (not Vercel — needs persistent Python process)
- Deploy `supabase/functions/` via Supabase CLI, not Vercel

---

## 9. IMPLEMENTATION ORDER (DO THIS EXACT SEQUENCE)

1. Run `00001_ahcms_v2_schema.sql` migration on Supabase
2. Seed reference tables: `HOSTEL`, `ROOM_TYPE`, `COMPLAINT_CATEGORY`, `ROUTING_RULE`
3. Deploy `discord-bot` Edge Function + register slash commands
4. Deploy `notify-staff` Edge Function + create DB Webhook
5. Build the allocator FastAPI service + deploy to Railway
6. Build Next.js app (App Router) — auth, student dashboard, admin dashboard
7. Implement room booking with intent parser
8. Build admin fairness dashboard with charts
9. Remove forum routes + components
10. Connect Twilio secrets + test Critical flow end-to-end

---

## 10. REFERENCES (STATE OF THE ART)

- **fairpyx** (`ariel-research/fairpyx`): Production EF1 and MMS algorithms for constrained allocation — use for post-hoc verification of solver output
- **CP-SAT Primer** (`d-krupke/cpsat-primer`): Definitive guide for the OR-Tools model
- **Supabase Discord Bot Example**: `supabase.com/docs/guides/functions/examples/discord-bot` — exact Ed25519 verification pattern used in Section 3.2
- **discord-interactions-js** (`discord/discord-interactions-js`): `verifyKey` reference implementation
- Gan, Li, Wu (2023) — "Your college dorm and dormmates: Fair resource sharing in dorm assignment" — JAIR — theoretical foundation for EF1 in hostel context
- Barman, Krishnamurthy, Vaish (IJCAI 2018) — EF1 under cardinality constraints
- Twilio Programmable SMS API: `api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`
