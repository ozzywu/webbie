-- Add optional ISBN column to books table (for Open Library cover lookup)
ALTER TABLE books ADD COLUMN IF NOT EXISTS isbn TEXT;
