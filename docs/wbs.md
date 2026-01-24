# WBS: Jungwhan 미술작품 포트폴리오

> **버전**: 1.0
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

## Phase 1: 개발 환경 설정

### 1.1 프로젝트 초기화
- [ ] Next.js 14 프로젝트 생성 (App Router, TypeScript)
- [ ] Tailwind CSS 설정
- [ ] 디렉토리 구조 생성 (`src/app`, `src/components`, `src/lib`, `src/types`)
- [ ] ESLint, Prettier 설정

### 1.2 Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] `artworks` 테이블 생성 (스키마 적용)
- [ ] Storage 버킷 생성 (`artworks/originals`, `artworks/thumbnails`)
- [ ] RLS 정책 설정 (공개 읽기)
- [ ] 환경변수 설정 (`.env.local`, `.env.example`)

### 1.3 코드 표준화
- [ ] TypeScript 타입 정의 (`types/artwork.ts`)
- [ ] Supabase 클라이언트 설정 (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [ ] Tailwind 커스텀 설정 (폰트, 색상)

### 1.4 검증
- [ ] `npm run dev`로 로컬 서버 실행 확인
- [ ] Supabase 연결 테스트 (데이터 조회)

---

## Phase 2: 공통 컴포넌트 및 레이아웃

### 2.1 루트 레이아웃
- [ ] `app/layout.tsx` 작성 (메타데이터, 폰트 설정)
- [ ] 전역 스타일 설정 (`globals.css`)

### 2.2 공통 컴포넌트
- [ ] `components/common/Button.tsx` 작성
- [ ] `components/common/Modal.tsx` 작성 (Headless UI Dialog)

### 2.3 검증
- [ ] 레이아웃 렌더링 확인
- [ ] 모달 열기/닫기 동작 확인

---

## Phase 3: Public 페이지 구현

### 3.1 랜딩 페이지 (F1)
- [ ] `app/page.tsx` 작성
- [ ] `components/landing/Hero.tsx` 작성 (풀스크린 히어로)
- [ ] `components/landing/FeaturedWorks.tsx` 작성 (대표작 그리드)
- [ ] 스크롤 인디케이터 애니메이션 추가

### 3.2 갤러리 페이지 (F2)
- [ ] `app/gallery/page.tsx` 작성
- [ ] `components/artwork/ArtworkCard.tsx` 작성 (썸네일 카드)
- [ ] `components/artwork/ArtworkGrid.tsx` 작성 (반응형 그리드)
- [ ] Lazy loading 적용

### 3.3 작품 상세 모달 (F3)
- [ ] `components/artwork/ArtworkModal.tsx` 작성
- [ ] `components/artwork/ZoomableImage.tsx` 작성 (react-zoom-pan-pinch)
- [ ] 키보드 네비게이션 (ESC 닫기, 좌우 화살표)
- [ ] 작품 정보 표시 (제목, 연도, 크기, 재료)

### 3.4 검증
- [ ] 랜딩 페이지: 히어로 이미지, 대표작 그리드 렌더링
- [ ] 갤러리: 전체 작품 표시, 클릭 시 모달 열림
- [ ] 모달: 확대/축소/패닝 동작, 좌우 이동
- [ ] 반응형: 모바일/태블릿/데스크톱 레이아웃

---

## Phase 4: 관리자 기능 구현

### 4.1 인증 (F5)
- [ ] `app/api/auth/route.ts` 작성 (POST: 로그인, DELETE: 로그아웃)
- [ ] `app/admin/login/page.tsx` 작성 (로그인 폼)
- [ ] `middleware.ts` 작성 (관리자 페이지 보호)
- [ ] HTTP-only 쿠키 설정

### 4.2 작품 API
- [ ] `app/api/artworks/route.ts` 작성 (GET, POST)
- [ ] `app/api/artworks/[id]/route.ts` 작성 (PUT, DELETE)
- [ ] `app/api/artworks/upload/route.ts` 작성 (이미지 업로드)
- [ ] 썸네일 자동 생성 로직 (`lib/utils/image.ts`)

### 4.3 관리자 페이지 (F4)
- [ ] `app/admin/page.tsx` 작성
- [ ] `components/admin/ArtworkTable.tsx` 작성 (작품 목록)
- [ ] `components/admin/ArtworkForm.tsx` 작성 (추가/수정 폼)
- [ ] `components/admin/ImageUploader.tsx` 작성 (드래그앤드롭)
- [ ] 삭제 확인 모달

### 4.4 검증
- [ ] 로그인: 올바른 비밀번호로만 접근 가능
- [ ] 작품 추가: 이미지 업로드 → 갤러리에 표시
- [ ] 작품 수정: 정보 변경 → 반영 확인
- [ ] 작품 삭제: 삭제 → 갤러리에서 제거

---

## Phase 5: 최적화 및 배포

### 5.1 성능 최적화
- [ ] ISR 설정 (`revalidate = 3600`)
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
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

## 의존성 관계

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
  │            │            │            │
  │            │            │            └── 관리자 기능
  │            │            └── Public 페이지
  │            └── 공통 컴포넌트
  └── 개발 환경
```

---

## 작업 우선순위

| 우선순위 | 작업 | 이유 |
|----------|------|------|
| 1 | Phase 1 (환경 설정) | 모든 작업의 기반 |
| 2 | Phase 2 (공통 컴포넌트) | 재사용 가능한 기반 구축 |
| 3 | Phase 3 (Public 페이지) | 핵심 사용자 경험 |
| 4 | Phase 4 (관리자 기능) | 콘텐츠 관리 |
| 5 | Phase 5 (배포) | 서비스 공개 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-24 | 초안 작성 |
