-- Create test users
-- Note: In a real production scenario, passwords should be securely hashed.
-- Supabase handles this natively via their Auth API, but we can insert them with crypt() directly.
-- Wait, creating auth users requires interacting with auth.users.
-- Doing this directly in SQL might require pgcrypto and some specific formats.
-- Let's just create the Webhook for now via pg_net and triggers.

-- Webhook for COMPLAINT inserts
-- Requires pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION notify_staff_webhook()
RETURNS trigger AS $$
DECLARE
  request_id bigint;
BEGIN
  -- We assume the edge function URL is known, or can be passed.
  -- Hardcoding for the current project: https://nhdvmcwxohonzntoojvp.supabase.co/functions/v1/notify-staff
  -- We pass the new record as JSON payload
  SELECT net.http_post(
      url:='https://nhdvmcwxohonzntoojvp.supabase.co/functions/v1/notify-staff',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.claim.role', true) || '"}'::jsonb,
      body:=json_build_object('type', 'INSERT', 'table', 'COMPLAINT', 'record', row_to_json(NEW))::jsonb
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_staff ON complaint;
CREATE TRIGGER trg_notify_staff
AFTER INSERT ON complaint
FOR EACH ROW
EXECUTE FUNCTION notify_staff_webhook();

-- Insert dummy test users in STUDENT_PROFILE and STAFF directly
-- Assuming auth.users will be populated manually via dashboard, but we can link them later.
-- Just add some initial staff to receive tickets.
INSERT INTO staff (staff_id, name, role, hostel_code, contact, twilio_phone, active_tickets, availability) VALUES 
('00000000-0000-0000-0000-000000000001', 'Plumber Joe', 'Plumber', 'SmB', '1234567890', '+1234567890', 0, true),
('00000000-0000-0000-0000-000000000002', 'Electrician Spark', 'Electrician', 'SmB', '1234567891', '+1234567891', 0, true)
ON CONFLICT DO NOTHING;
