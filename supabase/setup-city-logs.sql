-- City Logs table: stores travel logs per city
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS city_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL UNIQUE,            -- must match a destination city name exactly
  native_name TEXT NOT NULL DEFAULT '', -- city name in local language, e.g. "København"
  flag_emoji TEXT DEFAULT '',           -- flag emoji, e.g. "🇩🇰"
  one_liner TEXT DEFAULT '',            -- short description
  jots TEXT DEFAULT '',                 -- free-text jots (comma-separated places, notes, etc.)
  images JSONB DEFAULT '[]'::jsonb,     -- array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups by city name
CREATE INDEX IF NOT EXISTS idx_city_logs_city ON city_logs(city);

-- Auto-update updated_at on edits (reuses the function from setup.sql)
DROP TRIGGER IF EXISTS update_city_logs_updated_at ON city_logs;
CREATE TRIGGER update_city_logs_updated_at
  BEFORE UPDATE ON city_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
