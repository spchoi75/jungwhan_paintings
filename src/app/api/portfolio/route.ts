import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

export async function GET() {
  // 작품 목록 조회
  const { data: artworks, error } = await supabaseAdmin
    .from('portfolio')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 각 작품의 태그 조회
  const artworkIds = artworks?.map(a => a.id) || [];
  
  if (artworkIds.length > 0) {
    const { data: artworkTags } = await supabaseAdmin
      .from('artwork_tags')
      .select('artwork_id, tags(id, name, created_at)')
      .in('artwork_id', artworkIds);

    // 태그를 작품에 매핑
    const tagsByArtwork = new Map<string, { id: string; name: string; created_at: string }[]>();
    artworkTags?.forEach(at => {
      if (at.tags) {
        const tags = tagsByArtwork.get(at.artwork_id) || [];
        const tagData = at.tags as unknown as { id: string; name: string; created_at: string };
        tags.push(tagData);
        tagsByArtwork.set(at.artwork_id, tags);
      }
    });

    // 작품에 태그 추가
    artworks?.forEach(artwork => {
      artwork.tags = tagsByArtwork.get(artwork.id) || [];
    });
  }

  return NextResponse.json(artworks);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data: maxOrderData } = await supabaseAdmin
      .from('portfolio')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const newOrder = (maxOrderData?.order ?? -1) + 1;

    const { data, error } = await supabaseAdmin
      .from('portfolio')
      .insert({
        title: body.title,
        title_en: body.title_en || null,
        year: body.year,
        width: body.width || null,
        height: body.height || null,
        medium: body.medium || null,
        medium_en: body.medium_en || null,
        description: body.description || null,
        description_en: body.description_en || null,
        collection: body.collection || null,
        collection_en: body.collection_en || null,
        variable_size: body.variable_size || false,
        category_id: body.category_id || null,
        image_url: body.image_url,
        thumbnail_url: body.thumbnail_url,
        is_featured: body.is_featured || false,
        show_watermark: body.show_watermark ?? true,
        order: newOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Artwork insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Artwork POST error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
