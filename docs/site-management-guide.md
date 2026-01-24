# Jungwhan 포트폴리오 사이트 관리 가이드

## 사이트 접속 정보

| 항목 | URL |
|------|-----|
| 메인 사이트 | https://jungwhanpaintings.vercel.app |
| 갤러리 | https://jungwhanpaintings.vercel.app/gallery |
| 작가 소개 | https://jungwhanpaintings.vercel.app/about |
| 관리자 페이지 | https://jungwhanpaintings.vercel.app/admin |

**관리자 비밀번호**: `jungwhan2024`

---

## 1. 작품 관리

### 작품 추가하기

1. `/admin` 접속 → 비밀번호 입력
2. **"작품 추가"** 버튼 클릭
3. 정보 입력:
   - **제목** (필수)
   - **연도** (필수)
   - **크기**: 가로 × 세로 (cm, 선택)
   - **재료**: 예) Oil on canvas (선택)
   - **설명**: 작품에 대한 긴 설명 (선택)
   - **이미지**: 드래그앤드롭 또는 클릭해서 업로드
   - **대표작 설정**: 체크하면 메인 페이지에 표시
4. **"저장"** 클릭

### 작품 수정하기

1. 관리자 페이지에서 수정할 작품의 **"수정"** 버튼 클릭
2. 내용 수정 후 **"저장"**

### 작품 삭제하기

1. 삭제할 작품의 **"삭제"** 버튼 클릭
2. 확인 메시지에서 승인

### 작품 순서 변경

- 작품 목록은 `order` 값 기준으로 정렬됨
- Supabase 대시보드에서 직접 `order` 값 수정 가능

---

## 2. 작가 소개 페이지 수정

About 페이지(`/about`)는 코드에서 직접 수정해야 합니다.

**파일 위치**: `src/app/about/page.tsx`

### 수정 가능한 항목

```
- 프로필 이미지: public 폴더에 이미지 추가 후 주석 해제
- 작가 이름: "Jungwhan" 부분
- 소개글: <p> 태그 내용
- 학력 (Education): <li> 항목들
- 전시 이력 (Exhibitions): <li> 항목들
- 연락처: email@example.com 부분
```

### 프로필 이미지 추가 방법

1. `public/profile.jpg` 파일 추가
2. 코드에서 주석 해제:
```tsx
<Image
  src="/profile.jpg"
  alt="Jungwhan"
  fill
  className="object-cover"
  priority
/>
```

---

## 3. Supabase 관리

### 대시보드 접속

https://supabase.com/dashboard → 프로젝트 선택

### 직접 데이터 수정

1. **Table Editor** 메뉴
2. `artworks` 테이블 선택
3. 행 클릭 후 직접 수정

### 이미지 저장소 확인

1. **Storage** 메뉴
2. `artworks` 버킷에서 업로드된 이미지 확인/삭제

---

## 4. 사이트 재배포

코드 수정 후 재배포가 필요할 때:

```bash
# 프로젝트 폴더에서
git add .
git commit -m "변경 내용 설명"
vercel --prod
```

또는 GitHub 연동 시 push만 하면 자동 배포됩니다.

---

## 5. 비밀번호 변경

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `ADMIN_PASSWORD` 값 수정
3. 재배포 (Deployments → 최신 배포 → Redeploy)

---

## 6. 문제 해결

### 이미지가 안 보여요
- Supabase Storage 정책 확인
- 이미지 URL이 올바른지 확인

### 작품이 안 나와요
- Supabase `artworks` 테이블에 데이터 있는지 확인
- 브라우저 콘솔에서 에러 확인

### 관리자 로그인이 안 돼요
- 비밀번호 확인: `jungwhan2024`
- Vercel 환경변수 `ADMIN_PASSWORD` 확인

---

## 빠른 참조

| 작업 | 위치 |
|------|------|
| 작품 추가/수정/삭제 | `/admin` |
| 작가 소개 수정 | `src/app/about/page.tsx` |
| 데이터 직접 수정 | Supabase Table Editor |
| 환경변수 수정 | Vercel Dashboard |
| 재배포 | `vercel --prod` |
