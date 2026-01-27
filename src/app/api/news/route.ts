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
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

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

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert({
        title: body.title,
        title_en: body.title_en || null,
        content: body.content,
        content_en: body.content_en || null,
        thumbnail_url: body.thumbnail_url || null,
        link_url: body.link_url || null,
        pdf_url: body.pdf_url || null,
        type: body.type || 'article',
        published_at: body.published_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('News insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('News POST error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
