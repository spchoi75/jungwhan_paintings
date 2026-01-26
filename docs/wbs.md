# WBS: Jungwhan 미술작품 포트폴리오

> **버전**: 2.0
> **작성일**: 2026-01-24
> **최종 수정**: 2026-01-26
> **기준 문서**: [PRD v2.0](./prd.md), [Architecture v1.0](./architecture.md)

---

## 작업 개요

| 항목 | 내용 |
|------|------|
| 총 Phase | 7개 |
| 핵심 기능 | 랜딩, Portfolio(카테고리), 작품상세(확대), About, Exhibitions, Contact, 관리자, 인증, i18n |
| 기술 스택 | Next.js 16 + Supabase + Tailwind CSS 4 |

---

## Phase 1: 개발 환경 설정 ✅

### 1.1 프로젝트 초기화
- [x] Next.js 14 프로젝트 생성 (App Router, TypeScript)
- [x] Tailwind CSS 설정
- [x] 디렉토리 구조 생성 (`src/app`, `src/components`, `src/lib`, `src/types`)
- [x] ESLint 설정

### 1.2 Supabase 설정
- [x] Supabase 프로젝트 생성
- [x] `portfolio` 테이블 생성 (스키마 적용)
- [x] `categories` 테이블 생성
- [x] `about_info` 테이블 생성
- [x] `exhibitions` 테이블 생성
- [x] Storage 버킷 생성 (`portfolio/originals`, `portfolio/thumbnails`)
- [x] RLS 정책 설정 (공개 읽기)
- [x] 환경변수 설정 (`.env.local`, `.env.example`)

### 1.3 코드 표준화
- [x] TypeScript 타입 정의 (`types/artwork.ts`)
- [x] Supabase 클라이언트 설정 (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [x] Tailwind 커스텀 설정 (폰트, 색상)

---

## Phase 2: 공통 컴포넌트 및 레이아웃 ✅

### 2.1 루트 레이아웃
- [x] `app/layout.tsx` 작성 (메타데이터, 폰트 설정)
- [x] 전역 스타일 설정 (`globals.css`)

### 2.2 공통 컴포넌트
- [x] `components/common/Button.tsx` 작성
- [x] `components/common/Modal.tsx` 작성 (Headless UI Dialog)

---

## Phase 3: Public 페이지 구현 ✅

### 3.1 랜딩 페이지 (F1)
- [x] `app/page.tsx` 작성
- [x] `components/landing/Hero.tsx` 작성 (풀스크린 히어로)
- [x] `components/landing/FeaturedWorks.tsx` 작성 (대표작 그리드)
- [x] `components/landing/Slideshow.tsx` 작성 (캐러셀)
- [x] 스크롤 인디케이터 애니메이션 추가

### 3.2 Portfolio 페이지 (F2) - 구 Gallery
- [x] `app/portfolio/page.tsx` 작성 (카테고리 그리드)
- [x] `app/portfolio/[slug]/page.tsx` 작성 (카테고리별 작품 목록)
- [x] `components/artwork/ArtworkCard.tsx` 작성 (썸네일 카드)
- [x] `components/artwork/ArtworkGrid.tsx` 작성 (반응형 그리드)
- [x] `components/portfolio/ArtworkList.tsx` 작성
- [x] Lazy loading 적용

### 3.3 작품 상세 모달 (F3)
- [x] `components/artwork/ArtworkModal.tsx` 작성
- [x] `components/artwork/ZoomableImage.tsx` 작성 (react-zoom-pan-pinch)
- [x] 키보드 네비게이션 (ESC 닫기, 좌우 화살표)
- [x] 작품 정보 표시 (제목, 연도, 크기, 재료, 다국어)
- [x] 워터마크 토글 지원

### 3.4 About 페이지 (F4)
- [x] `app/about/page.tsx` 작성
- [x] `components/about/AboutContent.tsx` 작성
- [x] 작가 소개글 (다국어)
- [x] 학력 정보 표시
- [x] 스튜디오 주소 표시

### 3.5 Exhibitions 페이지 (F5)
- [x] `app/exhibitions/page.tsx` 작성
- [x] `components/exhibitions/ExhibitionContent.tsx` 작성
- [x] 전시 유형 구분 (Solo/Group)
- [x] 연도별 정렬

### 3.6 Contact 페이지 (F6)
- [x] `app/contact/page.tsx` 작성
- [x] `components/contact/ContactContent.tsx` 작성
- [x] 소셜 링크 표시

---

## Phase 4: 관리자 기능 구현 ✅

### 4.1 인증 (F10)
- [x] `app/api/auth/route.ts` 작성 (POST: 로그인, DELETE: 로그아웃)
- [x] `app/admin/login/page.tsx` 작성 (로그인 폼)
- [x] `middleware.ts` 작성 (관리자 페이지 보호)
- [x] HTTP-only 쿠키 설정

### 4.2 작품 API
- [x] `app/api/portfolio/route.ts` 작성 (GET, POST)
- [x] `app/api/portfolio/[id]/route.ts` 작성 (PUT, DELETE)
- [x] `app/api/portfolio/upload/route.ts` 작성 (이미지 업로드)

### 4.3 카테고리 API
- [x] `app/api/categories/route.ts` 작성 (GET, POST)
- [x] `app/api/categories/[id]/route.ts` 작성 (PUT, DELETE)

### 4.4 About API
- [x] `app/api/about/route.ts` 작성 (GET, PUT)

### 4.5 Exhibitions API
- [x] `app/api/exhibitions/route.ts` 작성 (GET, POST)
- [x] `app/api/exhibitions/[id]/route.ts` 작성 (PUT, DELETE)

### 4.6 관리자 페이지 (F9)
- [x] `app/admin/page.tsx` 작성 (탭 기반 대시보드)
- [x] `components/admin/ArtworkTable.tsx` 작성 (작품 목록)
- [x] `components/admin/ArtworkForm.tsx` 작성 (추가/수정 폼 + 다국어 필드)
- [x] `components/admin/CategoryForm.tsx` 작성 (카테고리 관리)
- [x] `components/admin/AboutForm.tsx` 작성 (작가 정보 관리)
- [x] `components/admin/ExhibitionForm.tsx` 작성 (전시 관리)
- [x] `components/admin/ImageUploader.tsx` 작성 (드래그앤드롭)
- [x] 삭제 확인 모달

---

## Phase 5: 다국어 지원 (i18n) ✅

### 5.1 i18n 인프라 구축
- [x] `src/i18n/index.tsx` 작성 (LocaleProvider, useLocale 훅)
- [x] `src/i18n/translations/ko.ts` 작성 (한글 번역)
- [x] `src/i18n/translations/en.ts` 작성 (영문 번역)
- [x] `lib/i18n-utils.ts` 작성 (getLocalizedValue 유틸)

### 5.2 UI 다국어 적용
- [x] `components/common/LanguageSwitch.tsx` 작성
- [x] Header/Footer 다국어 적용
- [x] 모든 Public 페이지 다국어 적용
- [x] 관리자 폼에 영문 필드 추가

### 5.3 DB 스키마 마이그레이션
- [x] `001_add_i18n_fields.sql` 적용 (영문 필드 추가)
- [x] `002_add_watermark_field.sql` 적용 (워터마크 토글)
- [x] `003_remove_about_exhibitions.sql` 적용 (SSOT 통합)
- [x] `004_add_studio_address.sql` 적용 (스튜디오 주소)

---

## Phase 6: UI/UX 개선 ✅

### 6.1 다크 테마 적용
- [x] 전체 사이트 다크 테마 적용
- [x] 관리자 페이지 다크 테마 적용
- [x] 커스텀 색상 변수 설정 (globals.css)

### 6.2 레이아웃 개선
- [x] `components/common/Header.tsx` 리팩토링
- [x] `components/common/Footer.tsx` 리팩토링
- [x] `components/common/SidePanel.tsx` 작성 (모바일 네비게이션)
- [x] `contexts/SidePanelContext.tsx` 작성 (Context API 상태 관리)

### 6.3 애니메이션 추가
- [x] 페이지 전환 애니메이션 (fadeIn, scaleIn)
- [x] 스크롤 인디케이터 애니메이션 (bounce, float)
- [x] 커스텀 스크롤바 스타일

---

## Phase 7: 최적화 및 배포

### 7.1 성능 최적화
- [x] ISR 설정 (`revalidate = 3600`)
- [x] 이미지 최적화 (Next.js Image 컴포넌트)
- [x] SEO 최적화 (`app/sitemap.ts` 작성)
- [ ] Lighthouse 점수 확인 (목표: 90+)

### 7.2 배포
- [x] Vercel 프로젝트 생성
- [x] 환경변수 설정 (Vercel Dashboard)
- [x] 프로덕션 배포
- [ ] 커스텀 도메인 연결 (선택)

### 7.3 최종 검증
- [ ] 프로덕션 환경에서 전체 기능 테스트
- [ ] 모바일 실기기 테스트 (핀치줌)
- [ ] 관리자 기능 E2E 테스트

---

## 남은 작업

### 최종 검증 (Phase 7.3)
- [ ] Lighthouse 성능 점수 확인 (목표: 90+)
- [ ] 모바일 실기기에서 핀치줌 테스트
- [ ] 프로덕션 환경 전체 기능 테스트
- [ ] (선택) 커스텀 도메인 연결

---

## 마이그레이션 스크립트

DB 스키마 변경이 필요한 경우 `docs/migrations/` 폴더의 SQL 파일을 순서대로 실행:

```bash
# 순서대로 실행
001_add_i18n_fields.sql      # 다국어 필드 추가
002_add_watermark_field.sql  # 워터마크 토글 추가
003_remove_about_exhibitions.sql  # exhibitions 필드 분리
004_add_studio_address.sql   # 스튜디오 주소 추가
```

전체 스키마: `docs/supabase-schema-v2.sql`

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-24 | 초안 작성 |
| 1.1 | 2026-01-24 | Phase 1~4 구현 완료 |
| 2.0 | 2026-01-26 | Phase 5~6 추가 (i18n, UI/UX), Phase 7로 배포 이동, 구현 완료 반영 |
