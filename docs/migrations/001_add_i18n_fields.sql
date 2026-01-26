-- =====================================================
-- Migration: Add i18n (English) fields
-- Description: 다국어 지원을 위한 영문 필드 추가
-- =====================================================

-- 1. portfolio 테이블 영문 필드 추가
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN portfolio.title_en IS '작품 제목 (영문)';
COMMENT ON COLUMN portfolio.description_en IS '작품 설명 (영문)';

-- 2. categories 테이블 영문 필드 추가
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR(100);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN categories.name_en IS '카테고리 이름 (영문)';
COMMENT ON COLUMN categories.description_en IS '카테고리 설명 (영문)';

-- 3. exhibitions 테이블 영문 필드 추가
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS venue_en VARCHAR(255);
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS location_en VARCHAR(100);

COMMENT ON COLUMN exhibitions.title_en IS '전시명 (영문)';
COMMENT ON COLUMN exhibitions.venue_en IS '전시 장소 (영문)';
COMMENT ON COLUMN exhibitions.location_en IS '전시 지역 (영문)';

-- 4. about_info 테이블 영문 필드 추가
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS artist_name_en VARCHAR(100);
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS bio_paragraphs_en JSONB DEFAULT '[]'::jsonb;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS footer_bio_en TEXT;

COMMENT ON COLUMN about_info.artist_name_en IS '작가명 (영문)';
COMMENT ON COLUMN about_info.bio_paragraphs_en IS '소개글 문단 배열 (영문)';
COMMENT ON COLUMN about_info.footer_bio_en IS 'Footer 소개문 (영문)';

-- =====================================================
-- 5. about_info.education / about_info.exhibitions JSONB 구조 변경
-- (스키마 변경 불필요 - JSONB는 유연한 구조 지원)
-- =====================================================
--
-- 기존 구조:
-- education: [{ "year": "2020", "description": "학력내용" }]
-- exhibitions: [{ "year": "2020", "description": "전시내용" }]
--
-- 변경된 구조 (description_en 필드 추가):
-- education: [{ "year": "2020", "description": "학력내용", "description_en": "Education in English" }]
-- exhibitions: [{ "year": "2020", "description": "전시내용", "description_en": "Exhibition in English" }]
--
-- 참고: JSONB 컬럼이므로 별도의 ALTER TABLE 문이 필요하지 않습니다.
-- 애플리케이션에서 새 필드를 포함하여 저장하면 자동으로 반영됩니다.
