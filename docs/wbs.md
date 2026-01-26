# WBS: Jungwhan 미술작품 포트폴리오

> **버전**: 1.1
> **작성일**: 2026-01-24
> **기준 문서**: [PRD v1.0](./prd.md), [Architecture v1.0](./architecture.md)

---

## 작업 개요

| 항목 | 내용 |
|------|------|
| 총 Phase | 5개 |
| 핵심 기능 | 랜딩, 갤러리, 작품상세(확대), 관리자, 인증 |
| 기술 스택 | Next.js 14 + Supabase + Tailwind CSS |

---

## Phase 1: 개발 환경 설정 ✅

### 1.1 프로젝트 초기화
- [x] Next.js 14 프로젝트 생성 (App Router, TypeScript)
- [x] Tailwind CSS 설정
- [x] 디렉토리 구조 생성 (`src/app`, `src/components`, `src/lib`, `src/types`)
- [x] ESLint 설정

### 1.2 Supabase 설정
- [ ] Supabase 프로젝트 생성 ← **사용자 작업 필요**
- [ ] `portfolio` 테이블 생성 (스키마 적용)
- [ ] Storage 버킷 생성 (`portfolio/originals`, `portfolio/thumbnails`)
- [ ] RLS 정책 설정 (공개 읽기)
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
- [x] 스크롤 인디케이터 애니메이션 추가

### 3.2 갤러리 페이지 (F2)
- [x] `app/gallery/page.tsx` 작성
- [x] `components/artwork/ArtworkCard.tsx` 작성 (썸네일 카드)
- [x] `components/artwork/ArtworkGrid.tsx` 작성 (반응형 그리드)
- [x] Lazy loading 적용

### 3.3 작품 상세 모달 (F3)
- [x] `components/artwork/ArtworkModal.tsx` 작성
- [x] `components/artwork/ZoomableImage.tsx` 작성 (react-zoom-pan-pinch)
- [x] 키보드 네비게이션 (ESC 닫기, 좌우 화살표)
- [x] 작품 정보 표시 (제목, 연도, 크기, 재료)

---

## Phase 4: 관리자 기능 구현 ✅

### 4.1 인증 (F5)
- [x] `app/api/auth/route.ts` 작성 (POST: 로그인, DELETE: 로그아웃)
- [x] `app/admin/login/page.tsx` 작성 (로그인 폼)
- [x] `middleware.ts` 작성 (관리자 페이지 보호)
- [x] HTTP-only 쿠키 설정

### 4.2 작품 API
- [x] `app/api/portfolio/route.ts` 작성 (GET, POST)
- [x] `app/api/portfolio/[id]/route.ts` 작성 (PUT, DELETE)
- [x] `app/api/portfolio/upload/route.ts` 작성 (이미지 업로드)

### 4.3 관리자 페이지 (F4)
- [x] `app/admin/page.tsx` 작성
- [x] `components/admin/ArtworkTable.tsx` 작성 (작품 목록)
- [x] `components/admin/ArtworkForm.tsx` 작성 (추가/수정 폼)
- [x] `components/admin/ImageUploader.tsx` 작성 (드래그앤드롭)
- [x] 삭제 확인 모달

---

## Phase 5: 최적화 및 배포

### 5.1 성능 최적화
- [x] ISR 설정 (`revalidate = 3600`)
- [x] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] Lighthouse 점수 확인 (목표: 90+)

### 5.2 배포
- [ ] Vercel 프로젝트 생성
- [ ] 환경변수 설정 (Vercel Dashboard)
- [ ] 프로덕션 배포
- [ ] 커스텀 도메인 연결 (선택)

### 5.3 최종 검증
- [ ] 프로덕션 환경에서 전체 기능 테스트
- [ ] 모바일 실기기 테스트 (핀치줌)
- [ ] 관리자 기능 E2E 테스트

---

## 다음 단계: Supabase 설정

코드 구현이 완료되었습니다. 사용자가 수행해야 할 작업:

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 접속
2. 새 프로젝트 생성
3. Project URL과 API Keys 확인

### 2. 데이터베이스 테이블 생성
```sql
CREATE TABLE portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  year INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  medium VARCHAR(200),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_featured ON portfolio(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_portfolio_order ON portfolio("order");
```

### 3. Storage 버킷 생성
1. Storage → New Bucket → `portfolio`
2. Public bucket으로 설정
3. 폴더: `originals/`, `thumbnails/`

### 4. 환경변수 설정
`.env.local` 파일 수정:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-password
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-24 | 초안 작성 |
| 1.1 | 2026-01-24 | Phase 1~4 구현 완료 |
