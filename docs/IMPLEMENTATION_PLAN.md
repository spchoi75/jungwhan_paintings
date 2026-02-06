# Portfolio Views 구현 계획

> RALP 2.1 - STEP 1: 계획 수립
> 테스트 레벨: 🔴 FULL

## 변경 요약

### GPT Codex 피드백 반영
1. ✅ Sigma.js 사용 (react-force-graph 대신)
2. ✅ 작품-태그 이분 그래프 구조
3. ✅ pathname 기반 라우팅
4. ✅ 레이아웃 재현성 (좌표 캐싱)
5. ✅ 썸네일 지연 로딩

---

## Phase 1: 의존성 및 라우팅 (예상: 30분)

### 1.1 패키지 설치
```bash
# Sigma.js 직접 사용 (React wrapper 대신) - React 19 호환성 보장
npm install sigma graphology graphology-layout-forceatlas2 node-vibrant
npm install -D @types/node-vibrant
```

> ⚠️ **React 19 호환성**: `@react-sigma/core`는 React 19를 공식 지원하지 않을 수 있음.
> Sigma.js를 직접 인스턴스화하여 사용 (useEffect에서 생성/정리)

### 1.2 라우팅 구조
```
/portfolio              → 기본 뷰 (마인드맵으로 리다이렉트)
/portfolio/mindmap      → 마인드맵 뷰 (신규)
/portfolio/colors       → 색상 휠 뷰 (신규)
/portfolio/years        → 연도별 뷰 (신규)
/portfolio/[slug]       → 카테고리 상세 (기존 유지)
```

### 1.3 파일 생성
```
src/app/portfolio/
├── page.tsx                    # 리다이렉트
├── mindmap/page.tsx            # 마인드맵 뷰
├── colors/page.tsx             # 색상 뷰
├── years/page.tsx              # 연도 뷰
├── [slug]/page.tsx             # 기존 유지
└── layout.tsx                  # 공통 레이아웃 + 탭

src/components/portfolio/
├── ViewTabs.tsx                # 뷰 전환 탭
├── MindmapView.tsx             # Sigma.js 그래프
├── ColorWheelView.tsx          # 색상 휠
├── YearView.tsx                # 연도별 그리드
└── ... (기존 파일)
```

---

## Phase 2: API 수정 (예상: 20분)

### 2.1 마인드맵 API 변경 (`/api/portfolio/mindmap`)

**현재 (작품-작품 연결):**
```json
{
  "nodes": [{ "id": "artwork1", ... }],
  "edges": [{ "source": "artwork1", "target": "artwork2", "shared_tags": [...] }]
}
```

**변경 (이분 그래프):**
```json
{
  "nodes": [
    { "id": "artwork:1", "type": "artwork", "title": "...", "thumbnail_url": "...", "connection_count": 3 },
    { "id": "tag:1", "type": "tag", "name": "인물", "artwork_count": 5 }
  ],
  "edges": [
    { "source": "artwork:1", "target": "tag:1" }
  ]
}
```

**장점:**
- 엣지 수 = 작품 수 × 평균 태그 수 (폭증 방지)
- 태그 노드는 숨김/미니멀 표시 가능

### 2.2 색상 분석 API (`/api/portfolio/upload`)

이미지 업로드 시:
1. sharp로 리사이즈 (64x64)
2. node-vibrant로 팔레트 추출
3. Vibrant 색상 → HSL 변환
4. artworks.dominant_color에 저장

---

## Phase 3: 마인드맵 뷰 (예상: 2시간)

### 3.1 Sigma.js 직접 통합 (React wrapper 없이)

```tsx
// MindmapView.tsx
"use client";

import { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import FA2Layout from "graphology-layout-forceatlas2/worker"; // Web Worker 사용!

interface MindmapViewProps {
  data: MindmapData;
}

const MindmapView = ({ data }: MindmapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const graph = new Graph();
    
    // 노드 추가
    data.nodes.forEach(node => {
      const isArtwork = node.type === 'artwork';
      graph.addNode(node.id, {
        x: node.cached_x || Math.random() * 1000,
        y: node.cached_y || Math.random() * 1000,
        // 태그 노드: 작게 + 낮은 투명도 (완전 hidden 대신)
        size: isArtwork ? 20 * (1 + node.connection_count * 0.1) : 3,
        color: isArtwork ? "#333" : "rgba(150, 150, 150, 0.3)",
        type: node.type,
        image: isArtwork ? node.thumbnail_url : null,
        label: isArtwork ? node.title : "", // 태그 라벨 숨김
      });
    });
    
    // 엣지 추가 (중복 방지)
    data.edges.forEach((edge, i) => {
      const edgeKey = `${edge.source}-${edge.target}`;
      if (!graph.hasEdge(edgeKey)) {
        graph.addEdgeWithKey(edgeKey, edge.source, edge.target, {
          color: "rgba(200, 200, 200, 0.5)",
        });
      }
    });
    
    // ForceAtlas2 Web Worker로 비동기 실행
    const fa2Layout = new FA2Layout(graph, {
      settings: {
        barnesHutOptimize: graph.order > 200,
        gravity: 1,
        scalingRatio: 2,
      },
    });
    
    fa2Layout.start();
    
    // 2초 후 레이아웃 정지
    setTimeout(() => {
      fa2Layout.stop();
    }, 2000);
    
    // Sigma 인스턴스 생성
    sigmaRef.current = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      enableEdgeEvents: false,
    });
    
    // 클릭 이벤트
    sigmaRef.current.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttributes(node);
      if (nodeData.type === "artwork") {
        // 모달 열기 로직
      }
    });
    
    // 클린업
    return () => {
      fa2Layout.kill();
      sigmaRef.current?.kill();
    };
  }, [data]);
  
  return <div ref={containerRef} className="w-full h-[80vh]" />;
};
```

### 3.2 커스텀 노드 렌더러

```tsx
// 이미지 노드 렌더러 (사각형, 비율 유지)
const ImageNodeProgram = /* WebGL shader for image nodes */
```

### 3.3 인터랙션
- 줌/패닝: Sigma.js 기본 제공
- 노드 클릭: 작품 모달 열기
- 드래그: 선택적 (성능 고려)

### 3.4 레이아웃 재현성
- 서버에서 좌표 사전 계산 (cron job 또는 첫 로드 시)
- 좌표를 DB 또는 캐시에 저장
- 새 작품 추가 시만 재계산

---

## Phase 4: 색상 휠 뷰 (예상: 1.5시간)

### 4.1 레이아웃

```
        빨강 (0°)
          ↑
   보라       주황
     ↖     ↗
       [원형 배치]
     ↙     ↘
   파랑       노랑
          ↓
        초록 (180°)
```

### 4.2 구현

```tsx
const ColorWheelView = ({ artworks }) => {
  // Hue 값으로 위치 계산
  const getPosition = (hue, index, total) => {
    const angle = (hue / 360) * 2 * Math.PI - Math.PI / 2; // 12시 = 0°
    const radius = 300 + (index % 3) * 50; // 반경 분산
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };
  
  return (
    <TransformWrapper>
      <TransformComponent>
        <svg viewBox="-500 -500 1000 1000">
          {/* 배경 색상환 */}
          <circle cx="0" cy="0" r="400" fill="url(#colorWheel)" />
          
          {/* 작품 노드 */}
          {artworks.map((art, i) => {
            const pos = getPosition(art.hue, i, artworks.length);
            return (
              <image
                key={art.id}
                href={art.thumbnail_url}
                x={pos.x - 20}
                y={pos.y - 20}
                width={40}
                height={40 * (art.height / art.width)}
                onClick={() => openModal(art)}
              />
            );
          })}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  );
};
```

---

## Phase 5: 연도 뷰 (예상: 30분)

### 5.1 기존 로직 마이그레이션
- CategoryContent에서 연도별 그룹핑 로직 추출
- 연도 선택 UI
- 제목 가나다순 정렬

---

## Phase 6: 관리자 - 태그 UI (예상: 1시간)

### 6.1 ArtworkForm 수정

```tsx
// 태그 입력 섹션
<TagInput
  artworkId={artwork?.id}
  existingTags={artwork?.tags || []}
  onTagsChange={setTags}
/>
```

### 6.2 TagInput 컴포넌트

- 자동완성 (기존 태그 검색)
- 새 태그 생성
- 새 태그 생성 시 → 기존 작품 목록 표시 → 클릭으로 추가

---

## Phase 7: 관리자 - 색상 자동 분석 (예상: 30분)

### 7.1 ImageUploader 수정

업로드 성공 후:
1. 서버에서 색상 분석 API 호출
2. dominant_color 자동 저장

---

## 테스트 계획 (🔴 FULL)

| ID | 테스트 | 확인 사항 |
|----|--------|----------|
| 4-1 | 정적 분석 | TypeScript, ESLint 에러 없음 |
| 4-2 | 빌드 테스트 | npm run build 성공 |
| 4-3 | 개발 서버 | npm run dev 정상 시작 |
| 4-4 | 스모크 테스트 | /portfolio/mindmap, /colors, /years 200 OK |
| 4-5 | 기능 테스트 | 노드 클릭→모달, 줌/패닝, 뷰 전환 |
| 4-6 | 시각적 테스트 | 그래프 렌더링, 색상휠 배치, 반응형 |
| 4-7 | 회귀 테스트 | 기존 /portfolio/[slug] 정상 |
| 4-8 | 콘솔 검증 | JS 에러/경고 없음, 네트워크 오류 없음 |

---

## 예상 위험/사이드이펙트

1. **Sigma.js SSR 이슈**
   - Next.js에서 SSR 시 window 참조 오류 가능
   - 해결: `dynamic(() => import('./MindmapView'), { ssr: false })`
   - MindmapView에 `"use client"` 필수

2. **대량 이미지 로딩**
   - 500개 동시 로딩 시 병목
   - 해결: 
     - 줌 레벨 기반 가시성 체크
     - 저해상도 프리뷰 → 고해상도 지연 로딩
     - 썸네일 URL 사용 (원본 X)

3. **레이아웃 계산 시간**
   - ForceAtlas2 초기 계산 2-3초 소요 가능
   - 해결: 
     - ✅ Web Worker 사용 (메인 스레드 블로킹 방지)
     - 로딩 스피너 표시
     - 노드 수 기반 iterations 동적 조정

4. **태그 노드 표시 정책** (Codex 피드백 반영)
   - 완전 hidden → 연결선도 안 보이는 문제
   - 해결: 태그 노드를 작게(size:3) + 투명하게(alpha:0.3) 표시
   - hover 시 연결된 작품 하이라이트 가능

5. **Sigma 인스턴스 정리**
   - 페이지 이동 시 메모리 누수 가능
   - 해결: useEffect cleanup에서 `sigma.kill()`, `fa2Layout.kill()`

---

## 구현 순서 (권장)

1. Phase 1: 의존성 및 라우팅
2. Phase 2: API 수정
3. Phase 5: 연도 뷰 (가장 단순, 빠른 확인)
4. Phase 3: 마인드맵 뷰 (핵심)
5. Phase 4: 색상 휠 뷰
6. Phase 6-7: 관리자 기능

---

*STEP 2로 Codex 검토 요청*
