-- Notes table (same schema as posts, for short-form notes)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_image TEXT,
  cover_image_position TEXT DEFAULT '50% 50%',
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Public can read published notes
CREATE POLICY "Public can read published notes"
  ON notes FOR SELECT
  USING (status = 'published');

-- Service role has full access
CREATE POLICY "Service role has full access to notes"
  ON notes FOR ALL
  USING (true)
  WITH CHECK (true);
