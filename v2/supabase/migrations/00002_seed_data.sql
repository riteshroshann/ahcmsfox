INSERT INTO HOSTEL (code, name, gender, total_rooms) VALUES
  ('SmB', 'Senior MBBS Boys Hostel', 'M', 20),
  ('SmG', 'Senior MBBS Girls Hostel', 'F', 20)
ON CONFLICT (code) DO NOTHING;

INSERT INTO ROOM_TYPE (label, capacity, base_score) VALUES
  ('Single', 1, 60),
  ('Double', 2, 50),
  ('Triple', 3, 40)
ON CONFLICT (label) DO NOTHING;

INSERT INTO COMPLAINT_CATEGORY (name, default_role, sla_minutes, escalation_role, severity_floor) VALUES
  ('Plumbing',     'Plumber',       720,  'Supervisor', 'Medium'),
  ('Electricity',  'Electrician',   360,  'Supervisor', 'High'),
  ('WiFi',         'WiFi_Tech',     1440, 'Supervisor', 'Low'),
  ('Cleanliness',  'Warden',        1440, 'Supervisor', 'Low'),
  ('Carpentry',    'Carpenter',     2880, 'Supervisor', 'Low'),
  ('Pest',         'Pest_Control',  2880, 'Supervisor', 'Low'),
  ('Structural',   'Supervisor',    720,  'Supervisor', 'High'),
  ('Other',        'Warden',        1440, 'Supervisor', 'Low')
ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
  smb_cc INT; smg_cc INT;
BEGIN
  SELECT category_id INTO smb_cc FROM COMPLAINT_CATEGORY WHERE name = 'Plumbing';

  INSERT INTO ROUTING_RULE (category_id, hostel_code, priority_order, role_target, escalation_role, sla_minutes)
  SELECT cc.category_id, h.code, 1, cc.default_role, cc.escalation_role, cc.sla_minutes
  FROM COMPLAINT_CATEGORY cc
  CROSS JOIN HOSTEL h
  ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  type_double INT; type_single INT;
  i INT; room TEXT;
BEGIN
  SELECT type_id INTO type_double FROM ROOM_TYPE WHERE label = 'Double';
  SELECT type_id INTO type_single FROM ROOM_TYPE WHERE label = 'Single';

  FOR floor IN 8..9 LOOP
    FOR i IN 1..7 LOOP
      room := 'SmB-' || floor || LPAD(i::TEXT, 2, '0');
      INSERT INTO ROOM (room_code, hostel_code, floor, type_id, capacity, noise_level, features)
      VALUES (room, 'SmB', floor, type_double, 2, 3, ARRAY['desk', 'wardrobe'])
      ON CONFLICT (room_code) DO NOTHING;
    END LOOP;
    FOR i IN 8..10 LOOP
      room := 'SmB-' || floor || LPAD(i::TEXT, 2, '0');
      INSERT INTO ROOM (room_code, hostel_code, floor, type_id, capacity, noise_level, features)
      VALUES (room, 'SmB', floor, type_single, 1, 2, ARRAY['desk', 'wardrobe', 'attached_bath'])
      ON CONFLICT (room_code) DO NOTHING;
    END LOOP;
  END LOOP;

  FOR floor IN 7..8 LOOP
    FOR i IN 1..7 LOOP
      room := 'SmG-' || floor || LPAD(i::TEXT, 2, '0');
      INSERT INTO ROOM (room_code, hostel_code, floor, type_id, capacity, noise_level, features)
      VALUES (room, 'SmG', floor, type_double, 2, 3, ARRAY['desk', 'wardrobe'])
      ON CONFLICT (room_code) DO NOTHING;
    END LOOP;
    FOR i IN 8..10 LOOP
      room := 'SmG-' || floor || LPAD(i::TEXT, 2, '0');
      INSERT INTO ROOM (room_code, hostel_code, floor, type_id, capacity, noise_level, features)
      VALUES (room, 'SmG', floor, type_single, 1, 2, ARRAY['desk', 'wardrobe', 'attached_bath'])
      ON CONFLICT (room_code) DO NOTHING;
    END LOOP;
  END LOOP;

  UPDATE HOSTEL SET total_rooms = (SELECT COUNT(*) FROM ROOM WHERE hostel_code = 'SmB') WHERE code = 'SmB';
  UPDATE HOSTEL SET total_rooms = (SELECT COUNT(*) FROM ROOM WHERE hostel_code = 'SmG') WHERE code = 'SmG';
END $$;
