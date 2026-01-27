# WBS: About/Exhibitions 통합 및 News 섹션 추가

> **버전**: 2.1
> **작성일**: 2025-01-27
> **기준 문서**: [PRD v2.1](./prd_remake.md), [Architecture v1.0](./architecture.md)

---

## 작업 개요

| 항목 | 내용 |
|------|------|
| 총 Phase | 5개 |
| 핵심 기능 | CV 형식 About, News 섹션, Artwork 폼 개선, Contact 메일 폼 |
| 예상 컨텍스트 | 200k 이내 (Phase별 독립 실행 가능) |
| 기술 스택 | Next.js 16 + Supabase + Tailwind CSS 4 + Resend |

---

## 확정된 설계 결정

| 항목 | 결정 | 비고 |
|------|------|------|
| News API 인증 | 쿠키 인증 + supabaseAdmin | portfolio와 동일 패턴 |
| News 썸네일 | 외부 URL 허용 | next.config 도메인 패턴 추가 필요 |
| News 발행일 | 수동 선택 | NewsForm에 날짜 선택기 추가 |
| CV 기존 필드 | Education만 유지 | bio 숨김 |
| Contact mailto | 유지 + 폼 추가 | 기존 mailto 링크 보존 |
| 작품 설명 | DB 보존 | API에서 undefined 시 기존 값 유지 |

---

## Phase 0: 개발 환경 준비

### 0.1 패키지 설치
- [x] `resend` 패키지 설치 (`npm install resend`)

### 0.2 환경변수 추가
- [x] `.env.local`에 `RESEND_API_KEY` 추가
- [x] `.env.local`에 `CONTACT_TO_EMAIL` 추가
- [x] `.env.example` 업데이트

### 0.3 Next.js 설정 수정
- [x] `next.config.ts` 외부 이미지 도메인 패턴 추가 (News 썸네일용)

### 0.4 데이터베이스 스키마 변경
- [x] `about_info` 테이블 확장 SQL 실행
  - birth_city, birth_city_en, birth_country, birth_country_en
  - live_city, live_city_en, live_country, live_country_en
  - residencies (JSONB), fellowships (JSONB), awards (JSONB), publications (JSONB)
- [x] `exhibitions` 테이블 type 제약조건 변경 ('popup' 추가)
- [x] `portfolio` 테이블 확장 SQL 실행
  - medium_en, collection, collection_en, variable_size
- [x] `news` 테이블 생성 SQL 실행
- [x] RLS 정책 설정 (news 테이블 - 공개 읽기만, 쓰기는 supabaseAdmin 사용)

**의존성**: 없음

---

## Phase 1: 타입 정의 및 i18n 확장

### 1.1 TypeScript 타입 정의 (`src/types/artwork.ts`)
- [x] CV 관련 타입 추가
  - `ResidencyItem` 인터페이스
  - `FellowshipItem` 인터페이스
  - `AwardItem` 인터페이스
  - `PublicationItem` 인터페이스
- [x] `AboutInfo` 인터페이스 확장 (CV 필드 추가)
- [x] `Exhibition` 인터페이스 수정 (type에 'popup' 추가)
- [x] `Artwork` 인터페이스 확장 (medium_en, collection, variable_size)
- [x] `ArtworkFormData` 인터페이스 확장
- [x] `News` 인터페이스 추가
- [x] `NewsFormData` 인터페이스 추가
- [x] `ContactFormData` 인터페이스 추가

### 1.2 i18n 번역 키 추가 (`src/i18n/translations/`)
- [x] `ko.ts` CV 섹션 번역 추가
- [x] `ko.ts` News 섹션 번역 추가
- [x] `ko.ts` Contact 폼 번역 추가
- [x] `ko.ts` Artwork 새 필드 번역 추가
- [x] `en.ts` CV 섹션 번역 추가
- [x] `en.ts` News 섹션 번역 추가
- [x] `en.ts` Contact 폼 번역 추가
- [x] `en.ts` Artwork 새 필드 번역 추가

**의존성**: Phase 0

---

## Phase 2: API 계층 구현

### 2.1 About API 수정 (`src/app/api/about/route.ts`)
- [x] GET: CV 새 필드 반환 추가
- [x] PUT: CV 새 필드 저장 처리

### 2.2 Portfolio API 수정
- [x] `src/app/api/portfolio/route.ts` - medium_en, collection, variable_size 처리
- [x] `src/app/api/portfolio/[id]/route.ts` - 동일하게 수정
- [x] **[Critical]** PUT 요청 시 description/description_en이 undefined면 기존 값 보존 로직 추가

### 2.3 Exhibitions API 수정 (`src/app/api/exhibitions/route.ts`)
- [x] type 'popup' 허용

### 2.4 News API 생성 (신규)
- [x] `src/app/api/news/route.ts` - GET (목록), POST (생성)
- [x] `src/app/api/news/[id]/route.ts` - GET (단일), PUT (수정), DELETE (삭제)
- [x] **[Critical]** POST/PUT/DELETE에 쿠키 인증 + supabaseAdmin 패턴 적용 (portfolio와 동일)

### 2.5 Contact API 생성 (신규)
- [x] `src/app/api/contact/route.ts` - POST (이메일 발송)
  - Resend API 연동
  - 폼 데이터 검증
  - 에러 핸들링

**의존성**: Phase 1

---

## Phase 3: Admin 컴포넌트 구현

### 3.1 AboutForm 수정 (`src/components/admin/AboutForm.tsx`)
- [x] 출생지/거주지 입력 필드 추가 (birth_city, live_city 등)
- [x] Residencies 배열 편집기 추가
- [x] Fellowships 배열 편집기 추가
- [x] Awards 배열 편집기 추가
- [x] Publications 배열 편집기 추가

### 3.2 ArtworkForm 수정 (`src/components/admin/ArtworkForm.tsx`)
- [x] 크기 입력 순서 변경 (세로 → 가로)
- [x] medium_en 필드 추가 (재료/기법 영문)
- [x] description, description_en 필드 UI에서 제거
- [x] collection, collection_en 필드 추가 (소장처)
- [x] variable_size 체크박스 추가 (가변크기)

### 3.3 ExhibitionForm 수정 (`src/components/admin/ExhibitionForm.tsx`)
- [x] type 선택에 'popup' (팝업전) 옵션 추가

### 3.4 News 관리 컴포넌트 생성 (신규)
- [x] `src/components/admin/NewsForm.tsx` 생성
  - title/title_en 입력
  - content/content_en 입력 (textarea)
  - thumbnail URL 입력 (외부 URL 허용) 또는 이미지 업로드
  - link_url, pdf_url 입력
  - type 선택 (article/interview/artist_note/review)
  - **published_at 날짜 선택기** (수동 입력, input type="date")
- [x] `src/components/admin/NewsTable.tsx` 생성
  - 뉴스 목록 테이블
  - 수정/삭제 버튼

### 3.5 Admin 페이지 수정 (`src/app/admin/page.tsx`)
- [x] 'news' 탭 추가
- [x] News 관련 상태 관리 추가
- [x] News CRUD 핸들러 추가

**의존성**: Phase 2

---

## Phase 4: 프론트엔드 페이지 구현

### 4.1 About 페이지 CV 형식 재구성
- [x] `src/app/about/page.tsx` 수정
  - popup 전시 데이터 fetch 추가
- [x] `src/components/about/AboutContent.tsx` 전면 재구성
  - CV 미니멀 레이아웃 구현
  - Born in / Live & Work in 표시
  - **Education 섹션 유지** (기존 education 데이터 활용)
  - Residency 섹션
  - Fellowships 섹션
  - Awards 섹션
  - Solo Exhibitions 섹션 (기존 데이터 활용)
  - Selected Group Exhibitions 섹션
  - Pop-up Exhibitions 섹션
  - Published 섹션
  - **bio 숨김** (프로필 이미지, 소개글 제거)

### 4.2 Exhibitions 페이지 삭제
- [x] `src/app/exhibitions/page.tsx` 삭제
- [x] `src/components/exhibitions/ExhibitionsContent.tsx` 삭제
- [x] **[Medium]** `src/app/sitemap.ts` 수정 - /exhibitions 제거, /news 추가

### 4.3 News 페이지 생성 (신규)
- [x] `src/app/news/page.tsx` 생성 (SSR/ISR)
- [x] `src/app/news/[id]/page.tsx` 생성 (상세 페이지)
- [x] `src/components/news/NewsContent.tsx` 생성
  - 좌측 큰 썸네일 (첫 번째 뉴스)
  - 우측 뉴스 리스트 (제목 + 미리보기)
- [x] `src/components/news/NewsDetail.tsx` 생성
  - 뉴스 상세 표시
  - 외부 링크/PDF 버튼

### 4.4 SidePanel 메뉴 수정 (`src/components/common/SidePanel.tsx`)
- [x] Exhibitions 메뉴 항목 제거
- [x] News 메뉴 항목 추가

### 4.5 Contact 페이지 메일 폼 추가
- [x] `src/components/contact/ContactForm.tsx` 생성 (신규)
  - 이름, 이메일, 제목, 메시지 입력 폼
  - 전송 버튼 및 로딩 상태
  - 성공/에러 메시지 표시
- [x] `src/components/contact/ContactContent.tsx` 수정
  - **기존 mailto 링크 유지**
  - ContactForm 컴포넌트 추가 (별도 섹션)

### 4.6 Artwork 표시 로직 수정
- [x] `src/components/artwork/ArtworkModal.tsx` 수정
  - 크기 표시: 세로 x 가로 순서
  - 영문 모드에서 inch 자동 추가
  - variable_size 처리 ("가변크기" / "Variable dimensions")
  - collection 표시 (값 있을 때만)
  - medium_en 처리

**의존성**: Phase 2, 3

---

## Phase 5: 통합 검증

### 5.1 Admin 기능 검증
- [x] AboutForm에서 CV 항목 입력/수정 테스트
- [x] ArtworkForm 새 필드 입력/수정 테스트
- [x] ExhibitionForm popup type 테스트
- [x] NewsForm CRUD 테스트

### 5.2 프론트엔드 검증
- [x] About 페이지 CV 형식 표시 확인
- [x] News 페이지 레이아웃 확인
- [x] News 상세 페이지 확인
- [x] Contact 폼 이메일 발송 테스트
- [x] Artwork 모달 크기/소장처 표시 확인

### 5.3 다국어 검증
- [x] 한/영 전환 시 CV 데이터 정상 표시
- [x] 한/영 전환 시 News 데이터 정상 표시
- [x] 한/영 전환 시 Artwork inch 변환 확인
- [x] 한/영 전환 시 Contact 폼 번역 확인

### 5.4 반응형 검증
- [x] 모바일에서 CV 레이아웃 확인
- [x] 모바일에서 News 레이아웃 확인
- [x] 모바일에서 Contact 폼 확인

**의존성**: Phase 4

---

## 파일 수정 목록

### 수정 파일
| 파일 경로 | Phase | 변경 내용 |
|----------|-------|----------|
| `next.config.ts` | 0 | 외부 이미지 도메인 패턴 추가 |
| `src/types/artwork.ts` | 1 | 타입 확장 |
| `src/i18n/translations/ko.ts` | 1 | 번역 키 추가 |
| `src/i18n/translations/en.ts` | 1 | 번역 키 추가 |
| `src/app/api/about/route.ts` | 2 | CV 필드 처리 |
| `src/app/api/portfolio/route.ts` | 2 | 새 필드 처리 |
| `src/app/api/portfolio/[id]/route.ts` | 2 | 새 필드 처리 |
| `src/app/api/exhibitions/route.ts` | 2 | popup type |
| `src/components/admin/AboutForm.tsx` | 3 | CV 필드 편집기 |
| `src/components/admin/ArtworkForm.tsx` | 3 | 폼 필드 수정 |
| `src/components/admin/ExhibitionForm.tsx` | 3 | popup 옵션 |
| `src/app/admin/page.tsx` | 3 | News 탭 추가 |
| `src/app/about/page.tsx` | 4 | popup fetch |
| `src/components/about/AboutContent.tsx` | 4 | CV 레이아웃 |
| `src/components/common/SidePanel.tsx` | 4 | 메뉴 변경 |
| `src/components/contact/ContactContent.tsx` | 4 | 폼 추가 |
| `src/components/artwork/ArtworkModal.tsx` | 4 | 표시 로직 |
| `src/app/sitemap.ts` | 4 | /exhibitions 제거, /news 추가 |

### 신규 파일
| 파일 경로 | Phase | 설명 |
|----------|-------|------|
| `src/app/api/news/route.ts` | 2 | News API |
| `src/app/api/news/[id]/route.ts` | 2 | News 개별 API |
| `src/app/api/contact/route.ts` | 2 | Contact API |
| `src/components/admin/NewsForm.tsx` | 3 | News 입력 폼 |
| `src/components/admin/NewsTable.tsx` | 3 | News 목록 |
| `src/app/news/page.tsx` | 4 | News 페이지 |
| `src/app/news/[id]/page.tsx` | 4 | News 상세 |
| `src/components/news/NewsContent.tsx` | 4 | News 목록 UI |
| `src/components/news/NewsDetail.tsx` | 4 | News 상세 UI |
| `src/components/contact/ContactForm.tsx` | 4 | Contact 폼 |

### 삭제 파일
| 파일 경로 | Phase | 이유 |
|----------|-------|------|
| `src/app/exhibitions/page.tsx` | 4 | About으로 통합 |
| `src/components/exhibitions/ExhibitionsContent.tsx` | 4 | 더 이상 사용 안함 |

---

## 마이그레이션 SQL

```sql
-- Phase 0에서 실행

-- 1. about_info 테이블 확장
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS birth_city TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS birth_city_en TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS birth_country TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS birth_country_en TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS live_city TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS live_city_en TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS live_country TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS live_country_en TEXT;
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS residencies JSONB DEFAULT '[]';
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS fellowships JSONB DEFAULT '[]';
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]';
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]';

-- 2. exhibitions 테이블 type 확장
ALTER TABLE exhibitions DROP CONSTRAINT IF EXISTS exhibitions_type_check;
ALTER TABLE exhibitions ADD CONSTRAINT exhibitions_type_check
  CHECK (type IN ('solo', 'group', 'popup'));

-- 3. portfolio 테이블 확장
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS medium_en TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS collection TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS collection_en TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS variable_size BOOLEAN DEFAULT false;

-- 4. news 테이블 생성
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  content TEXT NOT NULL,
  content_en TEXT,
  thumbnail_url TEXT,
  link_url TEXT,
  pdf_url TEXT,
  type TEXT NOT NULL DEFAULT 'article' CHECK (type IN ('article', 'interview', 'artist_note', 'review')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. news RLS 정책 (공개 읽기만, 쓰기는 API에서 supabaseAdmin 사용)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News are viewable by everyone"
  ON news FOR SELECT USING (true);

-- 쓰기는 API Route에서 supabaseAdmin (service_role)으로 처리하므로 별도 정책 불필요

-- 6. news 인덱스
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_type ON news(type);
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 2.1 | 2025-01-27 | PRD v2.1 기반 WBS 작성 |
| 2.1.1 | 2025-01-27 | Codex 리뷰 반영: 인증 패턴, description 보존, sitemap, 외부 이미지 정책 |
