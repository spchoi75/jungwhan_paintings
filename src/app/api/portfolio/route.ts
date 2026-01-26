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
  const { data, error } = await supabaseAdmin
    .from('portfolio')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
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
        description: body.description || null,
        description_en: body.description_en || null,
        category_id: body.category_id || null,
        image_url: body.image_url,
        thumbnail_url: body.thumbnail_url,
        is_featured: body.is_featured || false,
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
