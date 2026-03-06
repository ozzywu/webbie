-- Bookmarks table for saving external articles/readings
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  author TEXT,
  excerpt TEXT,
  og_image TEXT,
  source TEXT NOT NULL DEFAULT 'web',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_status ON bookmarks(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created ON bookmarks(created_at DESC);

-- RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published bookmarks"
  ON bookmarks FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role has full access to bookmarks"
  ON bookmarks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reuse the trigger function from setup.sql
CREATE TRIGGER set_bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
