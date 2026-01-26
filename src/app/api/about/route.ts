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
    .from('about_info')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({
      id: null,
      artist_name: 'Jungwhan',
      artist_name_en: null,
      bio_paragraphs: ['작가 소개 텍스트를 여기에 입력하세요.'],
      bio_paragraphs_en: [],
      footer_bio: null,
      footer_bio_en: null,
      education: [],
      contact_email: null,
      contact_phone: null,
      phone_visible: false,
      studio_address: null,
      studio_address_en: null,
      social_links: [],
      profile_image_url: null,
      updated_at: null,
    });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data: existing } = await supabaseAdmin
    .from('about_info')
    .select('id')
    .single();

  let result;
  if (existing) {
    result = await supabaseAdmin
      .from('about_info')
      .update({
        artist_name: body.artist_name,
        artist_name_en: body.artist_name_en || null,
        bio_paragraphs: body.bio_paragraphs,
        bio_paragraphs_en: body.bio_paragraphs_en || [],
        footer_bio: body.footer_bio || null,
        footer_bio_en: body.footer_bio_en || null,
        education: body.education,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        phone_visible: body.phone_visible || false,
        studio_address: body.studio_address || null,
        studio_address_en: body.studio_address_en || null,
        social_links: body.social_links || [],
        profile_image_url: body.profile_image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    result = await supabaseAdmin
      .from('about_info')
      .insert([{
        artist_name: body.artist_name,
        artist_name_en: body.artist_name_en || null,
        bio_paragraphs: body.bio_paragraphs,
        bio_paragraphs_en: body.bio_paragraphs_en || [],
        footer_bio: body.footer_bio || null,
        footer_bio_en: body.footer_bio_en || null,
        education: body.education,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        phone_visible: body.phone_visible || false,
        studio_address: body.studio_address || null,
        studio_address_en: body.studio_address_en || null,
        social_links: body.social_links || [],
        profile_image_url: body.profile_image_url || null,
      }])
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
