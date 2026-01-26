-- =====================================================
-- Migration: Remove exhibitions from about_info
-- Description: about_info의 exhibitions 필드 삭제 (exhibitions 테이블로 SSOT 통합)
-- =====================================================

-- about_info 테이블에서 exhibitions 컬럼 삭제
-- 주의: 이 작업은 되돌릴 수 없으므로, 백업 후 실행하세요
ALTER TABLE about_info DROP COLUMN IF EXISTS exhibitions;

-- 참고: 전시 정보는 이제 exhibitions 테이블에서 관리됩니다
-- 메인메뉴 Exhibitions 페이지와 About 페이지가 같은 데이터(SSOT)를 사용합니다
