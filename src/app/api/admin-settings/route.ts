import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

// GET: 현재 힌트 조회 (비밀번호는 제외)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('admin_settings')
    .select('password_hint')
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    password_hint: data?.password_hint || null,
    has_db_password: !!data,
  });
}

// PUT: 비밀번호 또는 힌트 변경
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { current_password, new_password, password_hint } = body;

  // 현재 비밀번호 확인
  const { data: settings } = await supabaseAdmin
    .from('admin_settings')
    .select('*')
    .single();

  // 현재 비밀번호 검증
  if (settings) {
    const isValid = await bcrypt.compare(current_password, settings.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다' }, { status: 400 });
    }
  } else {
    // DB에 설정이 없으면 환경변수로 확인
    if (current_password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다' }, { status: 400 });
    }
  }

  // 새 비밀번호 해싱
  const passwordHash = new_password
    ? await bcrypt.hash(new_password, 10)
    : settings?.password_hash;

  if (!passwordHash) {
    return NextResponse.json({ error: '비밀번호가 필요합니다' }, { status: 400 });
  }

  // 업서트
  let result;
  if (settings) {
    result = await supabaseAdmin
      .from('admin_settings')
      .update({
        password_hash: passwordHash,
        password_hint: password_hint ?? settings.password_hint,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id)
      .select()
      .single();
  } else {
    result = await supabaseAdmin
      .from('admin_settings')
      .insert([{
        password_hash: passwordHash,
        password_hint: password_hint || null,
      }])
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
