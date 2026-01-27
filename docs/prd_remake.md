# PRD: About/Exhibitions 통합 및 News 섹션 추가

**버전**: 2.1.1
**작성일**: 2025-01-27
**상태**: 승인 대기

---

## 1. 개요

### 1.1 목적
화가 정환 포트폴리오 웹사이트의 About 페이지를 국제 표준 CV(Curriculum Vitae) 형식으로 재구성하고, News 섹션을 추가하며, Artwork 입력 폼을 개선한다.

### 1.2 배경
- 현재 About과 Exhibitions가 별도 페이지로 분리되어 있음
- 국제 갤러리/미술관 제출용 CV 형식 필요
- 전시 관련 기사, 인터뷰 등을 통합 관리할 News 섹션 부재
- Artwork 입력 시 inch 단위, 소장처 등 추가 정보 필요

### 1.3 참고 사이트
- CV 형식: https://www.jisanahn.com/cv
- News 레이아웃: https://www.jisanahn.com/blog1
- Contact 폼: https://www.jisanahn.com/contact

---

## 2. 기능 요구사항

### 2.1 About 페이지 CV 형식 재구성

#### 2.1.1 레이아웃
미니멀, A4 출력 스타일. 타이핑해서 출력하듯 깔끔하게 표시.

```
Curriculum Vitae

Born in {도시}, {국가}
Live & Work in {도시}, {국가}

Education (기존 필드 유지)
  {연도}    {내용}

Residency
  {연도}    {주소}

Fellowships
  {연도}    {제목}    {주소}

Awards
  {연도}    {제목}    {주소}

Solo Exhibitions
  {연도}    {제목}    {장소}

Selected Group Exhibitions
  {연도}    {제목}    {장소}

Pop-up Exhibitions
  {연도}    {제목}    {장소}

Published
  {연도}    {제목}
```

**참고**: 기존 bio(소개글)와 프로필 이미지는 CV 화면에서 숨김 처리

#### 2.1.2 Admin 입력 항목
| 항목 | 필드 | 형식 |
|------|------|------|
| 출생지 | birth_city, birth_country (한/영) | 텍스트 |
| 거주/작업지 | live_city, live_country (한/영) | 텍스트 |
| Residency | year, address (한/영) | 배열 |
| Fellowships | year, title (한/영), address (한/영) | 배열 |
| Awards | year, title (한/영), address (한/영) | 배열 |
| Publications | year, title (한/영) | 배열 |

#### 2.1.3 전시 데이터 활용
- 기존 `exhibitions` 테이블의 데이터 그대로 활용
- type: 'solo', 'group', 'popup' (popup 추가)
- **기존 DB 항목 삭제/이동 금지**

### 2.2 Exhibitions 페이지 삭제

#### 2.2.1 삭제 대상
- `/exhibitions` 페이지
- `ExhibitionsContent.tsx` 컴포넌트
- SidePanel 메뉴에서 Exhibitions 항목 제거

#### 2.2.2 이유
- About 페이지에 CV 형식으로 전시 정보 통합됨
- 중복 표시 방지

### 2.3 News 섹션 추가

#### 2.3.1 용도
- 전시 관련 기사
- 인터뷰
- 작가 노트
- 평론가 글
- 외부 링크 및 PDF 통합 관리

#### 2.3.2 레이아웃
```
┌─────────────────────────────────────────┐
│  [큰 썸네일]  │  제목 1                  │
│  (첫 번째    │  글 일부 미리보기...      │
│   뉴스)      │─────────────────────────│
│              │  제목 2                  │
│              │  글 일부 미리보기...      │
│              │─────────────────────────│
│              │  제목 3                  │
│              │  글 일부 미리보기...      │
└─────────────────────────────────────────┘
```
- **Featured/Recent post 섹션 없음**
- 좌측: 첫 번째 뉴스의 큰 썸네일
- 우측: 뉴스 리스트 (제목 + 글 일부)

#### 2.3.3 뉴스 유형
| type | 설명 |
|------|------|
| article | 전시 관련 기사 |
| interview | 인터뷰 |
| artist_note | 작가 노트 |
| review | 평론가 글 |

#### 2.3.4 뉴스 필드
| 필드 | 필수 | 설명 |
|------|------|------|
| title / title_en | 필수 | 제목 |
| content / content_en | 필수 | 본문 |
| thumbnail_url | 선택 | 썸네일 이미지 (외부 URL 허용) |
| link_url | 선택 | 외부 링크 |
| pdf_url | 선택 | PDF 파일 |
| type | 필수 | article/interview/artist_note/review |
| published_at | **수동 선택** | 발행일 (관리자가 날짜 선택)

### 2.4 Artwork 폼 수정

#### 2.4.1 변경 사항

| 항목 | 현재 | 변경 |
|------|------|------|
| a. 크기 순서 | 가로 → 세로 | **세로 → 가로** (세로 x 가로) |
| b. 재료/기법 | 한글만 | **영문 추가** (medium_en) |
| c. 크기 단위 | cm만 | **영문에서 inch 자동 추가** (cm 뒤 괄호 안) |
| d. 작품 설명 | 한/영 존재 | **UI에서 제거** (DB 유지, API에서 기존 값 보존) |
| e. 소장처 | 없음 | **추가** (collection / collection_en) |
| f. 가변크기 | 없음 | **추가** (variable_size 체크박스) |

#### 2.4.2 크기 표시 규칙
- 한글: `80 x 100 cm` (세로 x 가로)
- 영문: `80 x 100 cm (31.5 x 39.4 in)` (cm + inch)
- 가변크기 선택 시: `가변크기` / `Variable dimensions`
- 소장처 없으면 표시 안함

#### 2.4.3 inch 변환 공식
```
inch = cm × 0.3937
소수점 첫째 자리까지 반올림
```

### 2.5 Contact 메일 보내기 폼

#### 2.5.1 현재 상태
- mailto 링크만 존재

#### 2.5.2 변경 사항
- **기존 mailto 링크 유지**
- 폼 기반 이메일 발송 기능 **추가** (별도 섹션)
- Resend API 사용

#### 2.5.3 폼 필드
| 필드 | 필수 | 설명 |
|------|------|------|
| name | 필수 | 이름 |
| email | 필수 | 이메일 주소 |
| subject | 필수 | 제목 |
| message | 필수 | 메시지 |

#### 2.5.4 환경변수
```env
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=artist@example.com
```

---

## 3. 데이터베이스 스키마

### 3.1 about_info 테이블 확장
```sql
-- 출생/거주 정보
birth_city TEXT
birth_city_en TEXT
birth_country TEXT
birth_country_en TEXT
live_city TEXT
live_city_en TEXT
live_country TEXT
live_country_en TEXT

-- CV 배열 필드 (JSONB)
residencies JSONB DEFAULT '[]'
fellowships JSONB DEFAULT '[]'
awards JSONB DEFAULT '[]'
publications JSONB DEFAULT '[]'
```

### 3.2 exhibitions 테이블 확장
```sql
-- type 제약조건 변경
type IN ('solo', 'group', 'popup')
```

### 3.3 portfolio 테이블 확장
```sql
medium_en TEXT
collection TEXT
collection_en TEXT
variable_size BOOLEAN DEFAULT false
```

### 3.4 news 테이블 (신규)
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
title_en TEXT
content TEXT NOT NULL
content_en TEXT
thumbnail_url TEXT
link_url TEXT
pdf_url TEXT
type TEXT CHECK (type IN ('article', 'interview', 'artist_note', 'review'))
published_at TIMESTAMP WITH TIME ZONE
created_at TIMESTAMP WITH TIME ZONE
```

---

## 4. UI/UX 요구사항

### 4.1 About 페이지 (CV)
- 미니멀 디자인, A4 출력 스타일
- 연도 좌측 정렬, 제목/장소 우측 배치
- 다국어 지원 (한/영)

### 4.2 News 페이지
- 좌측 큰 썸네일 (첫 번째 뉴스)
- 우측 리스트 형식
- 클릭 시 상세 페이지 또는 외부 링크 이동

### 4.3 SidePanel 메뉴
```
현재: Home, Portfolio, About, Exhibitions, Contact
변경: Home, Portfolio, About, News, Contact
```

---

## 5. 비기능 요구사항

### 5.1 호환성
- 기존 데이터 마이그레이션 불필요 (확장만)
- 기존 Admin 워크플로우 유지

### 5.2 성능
- News 페이지 ISR 적용 (3600초)
- 이미지 최적화 (Next.js Image)
- 외부 이미지 도메인 허용 패턴 추가 (next.config.ts)

### 5.3 보안
- Contact 폼 rate limiting 고려
- 이메일 주소 수집 CSRF 방지

---

## 6. 제약사항

1. **기존 DB 항목 삭제/이동 금지** - 프론트엔드에서만 통합 표시
2. **Admin 전시 관리 탭 유지** - 기존 입력 방식 그대로
3. **다국어 지원 필수** - 모든 새 필드에 한/영 버전
4. **작품 description 보존** - UI에서 제거해도 API 수정 시 기존 값 유지
5. **News API 인증** - 쿠키 인증 + supabaseAdmin 패턴 (portfolio와 동일)

---

## 7. 성공 지표

- [ ] About 페이지에서 CV 형식 표시 정상 동작
- [ ] Admin에서 모든 CV 항목 입력/수정 가능
- [ ] News CRUD 정상 동작
- [ ] Contact 폼 이메일 발송 성공
- [ ] Artwork 폼 새 필드 정상 동작
- [ ] 한/영 전환 시 모든 데이터 정상 표시
