-- =============================================
-- JassuCafe - Supabase Database Setup (REQUIRED)
-- =============================================
-- This app REQUIRES Supabase for all data storage.
--
-- HOW TO USE:
-- 1. Create a free project at https://supabase.com
-- 2. Go to SQL Editor in your Supabase dashboard
-- 3. Paste this entire SQL and click "Run"
-- 4. Go to Settings > API and copy your Project URL and Anon Key
-- 5. Paste them into .env file in your project root
--
-- REQUIRED ENV VARIABLES (in .env):
--   SUPABASE_URL=https://xxxxx.supabase.co
--   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
-- =============================================

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  last_date TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  apply_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slot_configs (
  id TEXT PRIMARY KEY,
  slot TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_message TEXT,
  bot_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot ON appointments(date, time_slot);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_slot_configs" ON slot_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_admins" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_chats" ON chats FOR ALL USING (true) WITH CHECK (true);

INSERT INTO admins (id, email, password, name, role, created_at)
VALUES ('admin_001', 'admin@jassucafe.com', 'admin123', 'Jassu Admin', 'admin', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO slot_configs (id, slot, enabled) VALUES
  ('slot_10_00_AM', '10:00 AM', true),
  ('slot_10_30_AM', '10:30 AM', true),
  ('slot_11_00_AM', '11:00 AM', true),
  ('slot_11_30_AM', '11:30 AM', true),
  ('slot_12_00_PM', '12:00 PM', true),
  ('slot_12_30_PM', '12:30 PM', true),
  ('slot_01_00_PM', '01:00 PM', true),
  ('slot_01_30_PM', '01:30 PM', true),
  ('slot_02_00_PM', '02:00 PM', true),
  ('slot_02_30_PM', '02:30 PM', true),
  ('slot_03_00_PM', '03:00 PM', true),
  ('slot_03_30_PM', '03:30 PM', true),
  ('slot_04_00_PM', '04:00 PM', true),
  ('slot_04_30_PM', '04:30 PM', true),
  ('slot_05_00_PM', '05:00 PM', true)
ON CONFLICT (id) DO NOTHING;
