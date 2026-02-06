import { NextRequest, NextResponse } from 'next/server';

// POST /api/portfolio/analyze-color
// Note: node-vibrant는 Turbopack과 호환 문제로 비활성화
// 추후 Webpack 빌드 시 활성화 가능
// Body: { image_url: string }
// Returns: { dominant_color: string | null, message: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    // TODO: node-vibrant 활성화 시 색상 분석 로직 추가
    // 현재는 null 반환 (관리자가 수동 설정)
    return NextResponse.json({
      dominant_color: null,
      message: '자동 색상 분석이 일시적으로 비활성화되어 있습니다. 관리자 페이지에서 수동으로 설정할 수 있습니다.',
    });
  } catch (error) {
    console.error('Error analyzing color:', error);
    return NextResponse.json({ error: 'Failed to analyze color' }, { status: 500 });
  }
}
