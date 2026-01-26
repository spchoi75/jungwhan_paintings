-- =====================================================
-- Migration: Add show_watermark field
-- Description: 작품별 워터마크 표시 여부 필드 추가
-- =====================================================

-- portfolio 테이블에 show_watermark 필드 추가
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS show_watermark BOOLEAN DEFAULT true;

COMMENT ON COLUMN portfolio.show_watermark IS '저작권 워터마크 표시 여부';

-- 기존 작품들은 기본적으로 워터마크 표시
UPDATE portfolio SET show_watermark = true WHERE show_watermark IS NULL;
