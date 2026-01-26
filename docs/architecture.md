# Architecture: Jungwhan 미술작품 포트폴리오

> **버전**: 1.0
> **작성일**: 2026-01-24
> **기준 문서**: [PRD v1.0](./prd.md)

---

## 1. 시스템 개요

### 1.1 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                         CONTEXT LEVEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐         ┌──────────────────┐         ┌────────┐  │
│   │ Visitor  │────────▶│  Portfolio Site  │◀────────│ Admin  │  │
│   └──────────┘         └────────┬─────────┘         └────────┘  │
│                                 │                                │
│                                 ▼                                │
│                        ┌────────────────┐                        │
│                        │    Supabase    │                        │
│                        │  (DB + Storage)│                        │
│                        └────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 컨테이너 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                       CONTAINER LEVEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js Application                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │    │
│  │  │   Public    │  │    Admin    │  │   API Routes    │  │    │
│  │  │   Pages     │  │   Pages     │  │   /api/*        │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                       Supabase                           │    │
│  │  ┌─────────────────┐      ┌─────────────────────────┐   │    │
│  │  │   PostgreSQL    │      │    Storage (Images)     │   │    │
│  │  │   - portfolio   │      │    - originals/         │   │    │
│  │  └─────────────────┘      │    - thumbnails/        │   │    │
│  │                           └─────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 기술 스택

| 레이어 | 기술 | 버전 | 역할 |
|--------|------|------|------|
| Framework | Next.js | 14.x | App Router, SSG, 이미지 최적화 |
| Language | TypeScript | 5.x | 타입 안정성 |
| Styling | Tailwind CSS | 3.x | 유틸리티 기반 스타일링 |
| UI Component | Headless UI | 2.x | 접근성 준수 모달/드롭다운 |
| Image Zoom | react-zoom-pan-pinch | 3.x | 확대/축소/패닝 |
| Database | Supabase (PostgreSQL) | - | 작품 메타데이터 저장 |
| Storage | Supabase Storage | - | 이미지 파일 저장 |
| Deployment | Vercel | - | 호스팅, CDN, Edge Functions |

---

## 3. 디렉토리 구조

```
jungwhan_paintings/
├── docs/                          # 문서
│   ├── prd.md
│   └── architecture.md
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # 루트 레이아웃
│   │   ├── page.tsx               # 랜딩 페이지 (/)
│   │   ├── gallery/
│   │   │   └── page.tsx           # 갤러리 페이지 (/gallery)
│   │   ├── admin/
│   │   │   ├── page.tsx           # 관리자 페이지 (/admin)
│   │   │   └── login/
│   │   │       └── page.tsx       # 로그인 페이지 (/admin/login)
│   │   └── api/
│   │       ├── auth/
│   │       │   └── route.ts       # 인증 API
│   │       └── portfolio/
│   │           └── route.ts       # 작품 CRUD API
│   │
│   ├── components/
│   │   ├── common/                # 공통 컴포넌트
│   │   │   ├── Modal.tsx
│   │   │   └── Button.tsx
│   │   ├── artwork/               # 작품 관련 컴포넌트
│   │   │   ├── ArtworkCard.tsx
│   │   │   ├── ArtworkModal.tsx
│   │   │   ├── ArtworkGrid.tsx
│   │   │   └── ZoomableImage.tsx
│   │   ├── landing/               # 랜딩 페이지 컴포넌트
│   │   │   ├── Hero.tsx
│   │   │   └── FeaturedWorks.tsx
│   │   └── admin/                 # 관리자 컴포넌트
│   │       ├── ArtworkTable.tsx
│   │       ├── ArtworkForm.tsx
│   │       └── ImageUploader.tsx
│   │
│   ├── lib/                       # 유틸리티/설정
│   │   ├── supabase/
│   │   │   ├── client.ts          # Supabase 클라이언트
│   │   │   └── server.ts          # 서버용 클라이언트
│   │   └── utils/
│   │       └── image.ts           # 이미지 처리 유틸
│   │
│   └── types/                     # TypeScript 타입 정의
│       └── artwork.ts
│
├── public/
│   └── fonts/                     # 커스텀 폰트
│
├── .env.local                     # 환경변수 (로컬)
├── .env.example                   # 환경변수 예시
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 4. 컴포넌트 설계

### 4.1 컴포넌트 계층도

```
App (layout.tsx)
├── LandingPage (page.tsx)
│   ├── Hero
│   │   └── ScrollIndicator
│   └── FeaturedWorks
│       └── ArtworkCard[]
│
├── GalleryPage (/gallery/page.tsx)
│   ├── ArtworkGrid
│   │   └── ArtworkCard[]
│   └── ArtworkModal
│       └── ZoomableImage
│
└── AdminPage (/admin/page.tsx)
    ├── ArtworkTable
    │   └── ArtworkRow[]
    ├── ArtworkForm (모달)
    │   └── ImageUploader
    └── DeleteConfirmModal
```

### 4.2 핵심 컴포넌트 명세

#### 4.2.1 ZoomableImage

| 항목 | 내용 |
|------|------|
| 역할 | 이미지 확대/축소/패닝 기능 제공 |
| Props | `src: string`, `alt: string`, `onClose?: () => void` |
| 라이브러리 | react-zoom-pan-pinch |
| 기능 | 데스크톱: 클릭/휠 줌, 드래그 패닝 / 모바일: 핀치줌, 터치 패닝 |

#### 4.2.2 ArtworkModal

| 항목 | 내용 |
|------|------|
| 역할 | 작품 상세 보기 모달 |
| Props | `artwork: Artwork`, `onClose: () => void`, `onPrev?: () => void`, `onNext?: () => void` |
| 구성 | ZoomableImage + 작품 정보 (제목, 연도, 크기, 재료) |
| 인터랙션 | ESC 키로 닫기, 좌우 화살표로 이동 |

#### 4.2.3 ArtworkGrid

| 항목 | 내용 |
|------|------|
| 역할 | 작품 목록을 그리드로 표시 |
| Props | `artworks: Artwork[]`, `onSelect: (artwork: Artwork) => void` |
| 레이아웃 | CSS Grid (반응형 컬럼) |
| 최적화 | Lazy loading, 썸네일 사용 |

#### 4.2.4 ImageUploader

| 항목 | 내용 |
|------|------|
| 역할 | 드래그앤드롭 이미지 업로드 |
| Props | `onUpload: (file: File) => Promise<string>` |
| 기능 | 파일 선택/드래그앤드롭, 미리보기, 진행률 표시 |
| 제한 | 최대 10MB, JPEG/PNG/WebP만 허용 |

---

## 5. 데이터 흐름

### 5.1 작품 조회 (Public)

```
[방문자] ──▶ [Next.js Page] ──▶ [Supabase Client] ──▶ [PostgreSQL]
                 │                                          │
                 │◀───────── artworks[] ◀──────────────────┘
                 │
                 ▼
         [이미지 URL 사용] ──▶ [Supabase Storage CDN]
```

### 5.2 작품 추가 (Admin)

```
[관리자] ──▶ [ImageUploader] ──▶ [API Route] ──▶ [Supabase Storage]
                                      │                   │
                                      │◀── imageUrl ◀────┘
                                      │
                                      ▼
                              [Supabase DB] ──▶ 작품 레코드 생성
```

### 5.3 인증 흐름

```
[관리자] ──▶ [Login Page] ──▶ [API /api/auth] ──▶ 비밀번호 검증
                                    │                    │
                              [Set Cookie] ◀── 성공 ◀───┘
                                    │
                                    ▼
                            [Admin Page 접근 허용]
```

---

## 6. API 설계

### 6.1 인증 API

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/auth` | POST | 로그인 (비밀번호 검증) |
| `/api/auth` | DELETE | 로그아웃 (쿠키 삭제) |

**POST /api/auth**
```typescript
// Request
{ password: string }

// Response (200)
{ success: true }

// Response (401)
{ error: "Invalid password" }
```

### 6.2 작품 API

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/portfolio` | GET | 작품 목록 조회 |
| `/api/portfolio` | POST | 작품 추가 (인증 필요) |
| `/api/portfolio/[id]` | PUT | 작품 수정 (인증 필요) |
| `/api/portfolio/[id]` | DELETE | 작품 삭제 (인증 필요) |
| `/api/portfolio/upload` | POST | 이미지 업로드 (인증 필요) |

---

## 7. 데이터베이스 스키마

### 7.1 portfolio 테이블

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

-- 인덱스
CREATE INDEX idx_portfolio_featured ON portfolio(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_portfolio_order ON portfolio("order");
```

### 7.2 Storage 버킷 구조

```
portfolio/
├── originals/          # 원본 고해상도 이미지
│   └── {uuid}.webp
└── thumbnails/         # 썸네일 (800px 너비)
    └── {uuid}.webp
```

---

## 8. 보안 설계

### 8.1 인증 방식

| 항목 | 구현 |
|------|------|
| 인증 방식 | HTTP-only 쿠키 기반 세션 |
| 세션 유효기간 | 브라우저 종료 시 만료 |
| 비밀번호 저장 | 환경변수 `ADMIN_PASSWORD` |

### 8.2 API 보호

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.redirect('/admin/login');
    }
  }
}
```

### 8.3 Supabase RLS (Row Level Security)

```sql
-- 공개 읽기 허용
CREATE POLICY "Anyone can view portfolio"
  ON portfolio FOR SELECT
  TO anon
  USING (true);

-- 수정/삭제는 서비스 역할만 (API Route에서 처리)
```

---

## 9. 성능 최적화

### 9.1 이미지 최적화

| 전략 | 구현 |
|------|------|
| 포맷 | WebP 자동 변환 (업로드 시) |
| 썸네일 | 800px 너비로 리사이즈 |
| Lazy Loading | `loading="lazy"` + Intersection Observer |
| CDN | Supabase Storage CDN 활용 |

### 9.2 렌더링 전략

| 페이지 | 전략 | 이유 |
|--------|------|------|
| 랜딩 (/) | SSG + ISR | 빠른 초기 로드, 주기적 갱신 |
| 갤러리 (/gallery) | SSG + ISR | 작품 목록 캐싱 |
| 관리자 (/admin) | CSR | 동적 CRUD 작업 |

```typescript
// app/gallery/page.tsx
export const revalidate = 3600; // 1시간마다 재생성
```

---

## 10. 환경변수

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ADMIN_PASSWORD=your-secure-password
```

---

## 11. 의존성 방향

```
┌─────────────────────────────────────────────────────────────┐
│                      의존성 흐름 (단방향)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Pages ──▶ Components ──▶ Lib (utils, supabase)            │
│     │            │               │                           │
│     │            │               ▼                           │
│     │            └─────────▶ Types                          │
│     │                            ▲                           │
│     └────────────────────────────┘                          │
│                                                              │
│   ※ 순환 의존 금지                                           │
│   ※ Components 간 직접 import 금지 (Props로 전달)            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. 설계 원칙 준수

| 원칙 | 적용 |
|------|------|
| SRP | 각 컴포넌트는 단일 책임 (ZoomableImage는 확대만, Modal은 표시만) |
| SSOT | Artwork 타입은 `types/artwork.ts`에서만 정의 |
| DRY | 공통 컴포넌트는 `components/common/`에 중앙화 |
| KISS | 복잡한 상태관리 라이브러리 없이 React 내장 기능 사용 |
| YAGNI | PRD에 없는 기능 미구현 (검색, 필터 등) |
| SoC | 페이지(라우팅) / 컴포넌트(UI) / API(데이터) 분리 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-24 | 초안 작성 |
