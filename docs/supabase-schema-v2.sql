-- Categories 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks 테이블에 category_id 추가 (기존 테이블이 있다면)
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS description TEXT;

-- Categories RLS 정책
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Categories are editable by authenticated users"
  ON categories FOR ALL
  USING (true);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_artworks_category_id ON artworks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
