-- Phase 1: Tags and Colors Schema
-- Run this in Supabase SQL Editor

-- 1. Tags table (관리자만 보는 언어적 태그)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Artwork-Tag junction table (다대다 관계)
CREATE TABLE IF NOT EXISTS artwork_tags (
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (artwork_id, tag_id)
);

-- 3. Add dominant_color to artworks (HSL format for color wheel)
ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS dominant_color TEXT;

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_artwork_tags_artwork ON artwork_tags(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_tags_tag ON artwork_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_artworks_dominant_color ON artworks(dominant_color);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON artworks(year);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_tags ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Allow public read, authenticated write
CREATE POLICY "Tags are viewable by everyone" 
  ON tags FOR SELECT USING (true);

CREATE POLICY "Tags are editable by authenticated users" 
  ON tags FOR ALL USING (true);

CREATE POLICY "Artwork tags are viewable by everyone" 
  ON artwork_tags FOR SELECT USING (true);

CREATE POLICY "Artwork tags are editable by authenticated users" 
  ON artwork_tags FOR ALL USING (true);

-- 7. Helper function: Get artworks by shared tags (for mindmap connections)
CREATE OR REPLACE FUNCTION get_connected_artworks(artwork_id UUID)
RETURNS TABLE (
  connected_id UUID,
  shared_tag_count INT,
  shared_tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    at2.artwork_id as connected_id,
    COUNT(*)::INT as shared_tag_count,
    ARRAY_AGG(t.name) as shared_tags
  FROM artwork_tags at1
  JOIN artwork_tags at2 ON at1.tag_id = at2.tag_id
  JOIN tags t ON t.id = at1.tag_id
  WHERE at1.artwork_id = get_connected_artworks.artwork_id
    AND at2.artwork_id != get_connected_artworks.artwork_id
    -- Exclude tags that ALL artworks have
    AND at1.tag_id NOT IN (
      SELECT tag_id 
      FROM artwork_tags 
      GROUP BY tag_id 
      HAVING COUNT(*) = (SELECT COUNT(*) FROM artworks)
    )
  GROUP BY at2.artwork_id;
END;
$$ LANGUAGE plpgsql;
