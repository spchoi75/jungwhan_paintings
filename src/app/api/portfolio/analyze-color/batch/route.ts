import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sharp from 'sharp';
import { supabaseAdmin } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

// RGB → HSL 변환
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function quantizeHue(h: number): number {
  return Math.floor(h / 30) * 30;
}

async function extractDominantColor(imageUrl: string): Promise<{ h: number; s: number; l: number; isAchromatic: boolean }> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Failed to fetch image');
  
  const buffer = Buffer.from(await response.arrayBuffer());
  
  const { data, info } = await sharp(buffer)
    .resize(30, 30, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets: Map<number, { hSum: number; sSum: number; lSum: number; weight: number }> = new Map();
  let achromaticWeight = 0;
  let achromaticLSum = 0;
  let totalWeight = 0;
  const ACHROMATIC_THRESHOLD = 8; // 더 타이트하게

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const hsl = rgbToHsl(r, g, b);
    
    // 명도 기반 가중치
    let weight = 1.0;
    if (hsl.l < 20) {
      weight = 0.3;
    } else if (hsl.l < 35) {
      weight = 0.7;
    } else if (hsl.l > 70) {
      weight = 1.5;
    } else if (hsl.l > 55) {
      weight = 1.2;
    }
    
    // 채도 기반 가중치
    if (hsl.s > 50) {
      weight *= 1.3;
    } else if (hsl.s > 30) {
      weight *= 1.1;
    }
    
    totalWeight += weight;
    
    if (hsl.s < ACHROMATIC_THRESHOLD) {
      achromaticWeight += weight;
      achromaticLSum += hsl.l * weight;
      continue;
    }
    
    const bucket = quantizeHue(hsl.h);
    const existing = buckets.get(bucket) || { hSum: 0, sSum: 0, lSum: 0, weight: 0 };
    
    buckets.set(bucket, {
      hSum: existing.hSum + hsl.h * weight,
      sSum: existing.sSum + hsl.s * weight,
      lSum: existing.lSum + hsl.l * weight,
      weight: existing.weight + weight,
    });
  }

  if (achromaticWeight > totalWeight * 0.6) {
    const avgL = Math.round(achromaticLSum / achromaticWeight);
    return { h: 0, s: 0, l: avgL, isAchromatic: true };
  }

  let maxBucket = 0;
  let maxWeight = 0;
  
  buckets.forEach((data, bucket) => {
    if (data.weight > maxWeight) {
      maxWeight = data.weight;
      maxBucket = bucket;
    }
  });

  const dominant = buckets.get(maxBucket);
  if (!dominant || dominant.weight === 0) {
    const avgL = achromaticWeight > 0
      ? Math.round(achromaticLSum / achromaticWeight)
      : 50;
    return { h: 0, s: 0, l: avgL, isAchromatic: true };
  }

  return {
    h: Math.round(dominant.hSum / dominant.weight),
    s: Math.round(dominant.sSum / dominant.weight),
    l: Math.round(dominant.lSum / dominant.weight),
    isAchromatic: false,
  };
}

// POST /api/portfolio/analyze-color/batch
// 모든 작품의 대표색 일괄 추출
export async function POST() {
  // TODO: 프로덕션에서는 인증 활성화
  // if (!(await isAuthenticated())) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // dominant_color가 null인 작품들만 처리
    const { data: artworks, error: fetchError } = await supabaseAdmin
      .from('portfolio')
      .select('id, title, thumbnail_url')
      .is('dominant_color', null);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!artworks || artworks.length === 0) {
      return NextResponse.json({ 
        message: '처리할 작품이 없습니다.',
        processed: 0,
      });
    }

    const results: { id: string; title: string; success: boolean; color?: object; error?: string }[] = [];

    for (const artwork of artworks) {
      try {
        if (!artwork.thumbnail_url) {
          results.push({ id: artwork.id, title: artwork.title, success: false, error: 'No thumbnail' });
          continue;
        }

        const color = await extractDominantColor(artwork.thumbnail_url);
        
        const dominantColor = {
          h: color.h,
          s: color.s,
          l: color.l,
          isAchromatic: color.isAchromatic,
        };

        const { error: updateError } = await supabaseAdmin
          .from('portfolio')
          .update({ 
            dominant_color: dominantColor,
            updated_at: new Date().toISOString(),
          })
          .eq('id', artwork.id);

        if (updateError) {
          results.push({ id: artwork.id, title: artwork.title, success: false, error: updateError.message });
        } else {
          results.push({ id: artwork.id, title: artwork.title, success: true, color: dominantColor });
        }
      } catch (err) {
        results.push({ 
          id: artwork.id, 
          title: artwork.title, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      message: `${successCount}/${artworks.length}개 작품 처리 완료`,
      processed: successCount,
      total: artworks.length,
      results,
    });
  } catch (error) {
    console.error('Batch analyze error:', error);
    return NextResponse.json({ error: 'Failed to process batch' }, { status: 500 });
  }
}
