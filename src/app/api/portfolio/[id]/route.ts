import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

// GET /api/portfolio/[id] - 작품 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Artwork fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Artwork GET error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Partial update: 전달된 필드만 업데이트
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // 각 필드가 명시적으로 전달된 경우에만 updateData에 추가
    if (body.title !== undefined) updateData.title = body.title;
    if (body.title_en !== undefined) updateData.title_en = body.title_en || null;
    if (body.year !== undefined) updateData.year = body.year;
    if (body.width !== undefined) updateData.width = body.width || null;
    if (body.height !== undefined) updateData.height = body.height || null;
    if (body.medium !== undefined) updateData.medium = body.medium || null;
    if (body.medium_en !== undefined) updateData.medium_en = body.medium_en || null;
    if (body.collection !== undefined) updateData.collection = body.collection || null;
    if (body.collection_en !== undefined) updateData.collection_en = body.collection_en || null;
    if (body.variable_size !== undefined) updateData.variable_size = body.variable_size;
    if (body.category_id !== undefined) updateData.category_id = body.category_id || null;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.thumbnail_url !== undefined) updateData.thumbnail_url = body.thumbnail_url;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.show_watermark !== undefined) updateData.show_watermark = body.show_watermark;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.description_en !== undefined) updateData.description_en = body.description_en || null;
    if (body.dominant_color !== undefined) updateData.dominant_color = body.dominant_color || null;

    const { data, error } = await supabaseAdmin
      .from('portfolio')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Artwork update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Artwork PUT error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data: artwork } = await supabaseAdmin
      .from('portfolio')
      .select('image_url, thumbnail_url')
      .eq('id', id)
      .single();

    if (artwork) {
      const extractPath = (url: string) => {
        const match = url.match(/portfolio\/(.+)$/);
        return match ? match[1] : null;
      };

      const imagePath = extractPath(artwork.image_url);
      const thumbnailPath = extractPath(artwork.thumbnail_url);

      const pathsToDelete = [imagePath, thumbnailPath].filter(Boolean) as string[];

      if (pathsToDelete.length > 0) {
        await supabaseAdmin.storage.from('portfolio').remove(pathsToDelete);
      }
    }

    const { error } = await supabaseAdmin
      .from('portfolio')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
