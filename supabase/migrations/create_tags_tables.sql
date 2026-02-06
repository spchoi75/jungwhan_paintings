-- Tags table for mindmap connections
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artwork-Tag junction table
CREATE TABLE IF NOT EXISTS artwork_tags (
  artwork_id UUID NOT NULL REFERENCES portfolio(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (artwork_id, tag_id)
);

-- Add dominant_color column to portfolio if not exists
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS dominant_color TEXT;

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies (public read, authenticated write)
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Tags are insertable by authenticated users" ON tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tags are updatable by authenticated users" ON tags
  FOR UPDATE USING (true);

CREATE POLICY "Tags are deletable by authenticated users" ON tags
  FOR DELETE USING (true);

CREATE POLICY "Artwork tags are viewable by everyone" ON artwork_tags
  FOR SELECT USING (true);

CREATE POLICY "Artwork tags are insertable by authenticated users" ON artwork_tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Artwork tags are deletable by authenticated users" ON artwork_tags
  FOR DELETE USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_artwork_tags_artwork_id ON artwork_tags(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_tags_tag_id ON artwork_tags(tag_id);
