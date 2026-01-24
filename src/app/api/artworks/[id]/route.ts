import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
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

    const { data, error } = await supabaseAdmin
      .from('artworks')
      .update({
        title: body.title,
        year: body.year,
        width: body.width || null,
        height: body.height || null,
        medium: body.medium || null,
        description: body.description || null,
        category_id: body.category_id || null,
        image_url: body.image_url,
        thumbnail_url: body.thumbnail_url,
        is_featured: body.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
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
      .from('artworks')
      .select('image_url, thumbnail_url')
      .eq('id', id)
      .single();

    if (artwork) {
      const extractPath = (url: string) => {
        const match = url.match(/artworks\/(.+)$/);
        return match ? match[1] : null;
      };

      const imagePath = extractPath(artwork.image_url);
      const thumbnailPath = extractPath(artwork.thumbnail_url);

      const pathsToDelete = [imagePath, thumbnailPath].filter(Boolean) as string[];

      if (pathsToDelete.length > 0) {
        await supabaseAdmin.storage.from('artworks').remove(pathsToDelete);
      }
    }

    const { error } = await supabaseAdmin
      .from('artworks')
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
