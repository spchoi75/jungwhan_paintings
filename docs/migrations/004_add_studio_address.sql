-- =====================================================
-- Migration: Add studio_address fields
-- Description: 작업실 주소 필드 추가 (한/영)
-- =====================================================

-- about_info 테이블에 studio_address 필드 추가
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS studio_address TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS studio_address_en TEXT;

COMMENT ON COLUMN about_info.studio_address IS '작업실 주소 (한글)';
COMMENT ON COLUMN about_info.studio_address_en IS '작업실 주소 (영문)';
