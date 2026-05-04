CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE TABLE IF NOT EXISTS HOSTEL (
  hostel_id   SERIAL PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  gender      gender_enum NOT NULL,
  total_rooms INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ROOM_TYPE (
  type_id     SERIAL PRIMARY KEY,
  label       TEXT NOT NULL UNIQUE,
  capacity    INT NOT NULL CHECK (capacity BETWEEN 1 AND 6),
  base_score  INT NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS COMPLAINT_CATEGORY (
  category_id     SERIAL PRIMARY KEY,
  name            complaint_cat NOT NULL UNIQUE,
  default_role    staff_role_enum NOT NULL,
  sla_minutes     INT NOT NULL DEFAULT 1440,
  escalation_role staff_role_enum NOT NULL DEFAULT 'Supervisor',
  severity_floor  severity_enum NOT NULL DEFAULT 'Low'
);

CREATE TABLE IF NOT EXISTS ROUTING_RULE (
  rule_id         SERIAL PRIMARY KEY,
  category_id     INT NOT NULL REFERENCES COMPLAINT_CATEGORY(category_id),
  hostel_code     TEXT REFERENCES HOSTEL(code),
  priority_order  INT NOT NULL DEFAULT 1,
  role_target     staff_role_enum NOT NULL,
  escalation_role staff_role_enum NOT NULL,
  sla_minutes     INT NOT NULL
);

CREATE TABLE IF NOT EXISTS STUDENT_PROFILE (
  student_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roll_no       TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  gender        gender_enum NOT NULL,
  adm_year      INT NOT NULL,
  pass_year     INT NOT NULL,
  program       TEXT NOT NULL,
  batch         TEXT NOT NULL,
  contact       TEXT,
  hostel_code   TEXT NOT NULL REFERENCES HOSTEL(code),
  discord_id    TEXT UNIQUE,
  noise_pref    INT CHECK (noise_pref BETWEEN 1 AND 5) DEFAULT 3,
  sleep_pref    TEXT CHECK (sleep_pref IN ('early','normal','late')) DEFAULT 'normal',
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS STAFF (
  staff_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  role            staff_role_enum NOT NULL,
  hostel_code     TEXT REFERENCES HOSTEL(code),
  contact         TEXT,
  discord_tag     TEXT,
  discord_id      TEXT UNIQUE,
  twilio_phone    TEXT,
  availability    BOOLEAN NOT NULL DEFAULT true,
  active_tickets  INT NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ADMIN_PROFILE (
  admin_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hostel_code TEXT REFERENCES HOSTEL(code),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ROOM (
  room_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code         TEXT NOT NULL UNIQUE,
  hostel_code       TEXT NOT NULL REFERENCES HOSTEL(code),
  floor             INT NOT NULL,
  type_id           INT NOT NULL REFERENCES ROOM_TYPE(type_id),
  capacity          INT NOT NULL,
  current_occupancy INT NOT NULL DEFAULT 0 CHECK (current_occupancy >= 0),
  status            room_status_enum NOT NULL DEFAULT 'available',
  noise_level       INT CHECK (noise_level BETWEEN 1 AND 5) DEFAULT 3,
  features          TEXT[],
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT occupancy_cap CHECK (current_occupancy <= capacity)
);

CREATE TABLE IF NOT EXISTS ALLOCATION (
  allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES STUDENT_PROFILE(student_id),
  room_id       UUID NOT NULL REFERENCES ROOM(room_id),
  start_date    DATE NOT NULL,
  end_date      DATE,
  status        alloc_status_enum NOT NULL DEFAULT 'active',
  allocated_by  UUID REFERENCES ADMIN_PROFILE(admin_id),
  solver_run_id UUID,
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

CREATE TABLE IF NOT EXISTS ROOM_BOOKING_REQUEST (
  request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES STUDENT_PROFILE(student_id),
  preferred_rooms UUID[],
  intent_text     TEXT,
  parsed_prefs    JSONB,
  peer_ids        UUID[],
  status          booking_status NOT NULL DEFAULT 'pending',
  admin_note      TEXT,
  reviewed_by     UUID REFERENCES ADMIN_PROFILE(admin_id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS SOLVER_RUN (
  run_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_code     TEXT NOT NULL REFERENCES HOSTEL(code),
  initiated_by    UUID REFERENCES ADMIN_PROFILE(admin_id),
  status          TEXT CHECK (status IN ('queued','running','completed','failed')) DEFAULT 'queued',
  student_count   INT,
  room_count      INT,
  feasible        BOOLEAN,
  objective_value FLOAT,
  alpha           FLOAT DEFAULT 1.0,
  beta            FLOAT DEFAULT 0.5,
  gamma           FLOAT DEFAULT 0.3,
  ef1_violations  INT,
  min_satisfaction INT,
  solver_log      TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  discord_thread_id TEXT,
  discord_channel_id TEXT,
  photo_url         TEXT,
  sla_deadline      TIMESTAMPTZ,
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
  actor_id    UUID,
  discord_msg_id TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS COMPLAINT_FAIRNESS_LOG (
  log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id         UUID NOT NULL REFERENCES COMPLAINT(ticket_id),
  hostel_code       TEXT NOT NULL,
  student_group     TEXT,
  response_time_min INT,
  sla_minutes       INT,
  sla_met           BOOLEAN GENERATED ALWAYS AS (response_time_min <= sla_minutes) STORED,
  envy_flag         BOOLEAN DEFAULT false,
  priority_rank     INT,
  worker_load_at_assign INT,
  iau_score         FLOAT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS NOTIFICATION (
  notif_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  channel       notif_channel NOT NULL,
  payload       JSONB NOT NULL,
  delivery_status TEXT CHECK (delivery_status IN ('pending','sent','failed','delivered')) DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at       TIMESTAMPTZ
);

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

CREATE OR REPLACE FUNCTION auth_role() RETURNS TEXT LANGUAGE sql STABLE AS
  $$ SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'anon') $$;

CREATE OR REPLACE FUNCTION auth_hostel() RETURNS TEXT LANGUAGE sql STABLE AS
  $$ SELECT auth.jwt() -> 'app_metadata' ->> 'hostel_code' $$;

ALTER TABLE STUDENT_PROFILE ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_own_read"   ON STUDENT_PROFILE FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "student_own_update" ON STUDENT_PROFILE FOR UPDATE TO authenticated
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

ALTER TABLE ROOM ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_public_read"  ON ROOM FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_admin_write"  ON ROOM FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

ALTER TABLE ALLOCATION ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alloc_student_read" ON ALLOCATION FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "alloc_admin_write"  ON ALLOCATION FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

ALTER TABLE COMPLAINT ENABLE ROW LEVEL SECURITY;
CREATE POLICY "complaint_student_own" ON COMPLAINT FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() IN ('admin','staff'));
CREATE POLICY "complaint_student_insert" ON COMPLAINT FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND auth_role() = 'student');
CREATE POLICY "complaint_staff_update" ON COMPLAINT FOR UPDATE TO authenticated
  USING (auth_role() IN ('admin','staff'));

ALTER TABLE TICKET_EVENT ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_event_read" ON TICKET_EVENT FOR SELECT TO authenticated
  USING (
    auth_role() IN ('admin','staff')
    OR EXISTS (
      SELECT 1 FROM COMPLAINT c WHERE c.ticket_id = TICKET_EVENT.ticket_id AND c.student_id = auth.uid()
    )
  );

ALTER TABLE COMPLAINT_FAIRNESS_LOG ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fairness_log_staff" ON COMPLAINT_FAIRNESS_LOG FOR SELECT TO authenticated
  USING (auth_role() IN ('admin','staff'));

ALTER TABLE ROOM_BOOKING_REQUEST ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_student_own" ON ROOM_BOOKING_REQUEST FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR auth_role() = 'admin');
CREATE POLICY "booking_student_insert" ON ROOM_BOOKING_REQUEST FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

ALTER TABLE SOLVER_RUN ENABLE ROW LEVEL SECURITY;
CREATE POLICY "solver_admin_only" ON SOLVER_RUN FOR ALL TO authenticated
  USING (auth_role() = 'admin') WITH CHECK (auth_role() = 'admin');

ALTER TABLE NOTIFICATION ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_own" ON NOTIFICATION FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR auth_role() IN ('admin','staff'));

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
