import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

// GET: Generate signed URLs for direct upload (bypasses Vercel body size limit)
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const contentType = searchParams.get('contentType');

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
      { status: 400 }
    );
  }

  const fileId = crypto.randomUUID();
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const originalPath = `originals/${fileId}.${ext}`;
  const thumbnailPath = `thumbnails/${fileId}.${ext}`;

  // Create signed URLs for upload (valid for 5 minutes)
  const { data: originalSignedUrl, error: originalError } = await supabaseAdmin.storage
    .from('portfolio')
    .createSignedUploadUrl(originalPath);

  if (originalError) {
    return NextResponse.json({ error: originalError.message }, { status: 500 });
  }

  const { data: thumbnailSignedUrl, error: thumbnailError } = await supabaseAdmin.storage
    .from('portfolio')
    .createSignedUploadUrl(thumbnailPath);

  if (thumbnailError) {
    return NextResponse.json({ error: thumbnailError.message }, { status: 500 });
  }

  // Get public URLs
  const { data: { publicUrl: imageUrl } } = supabaseAdmin.storage
    .from('portfolio')
    .getPublicUrl(originalPath);

  const { data: { publicUrl: thumbnailUrl } } = supabaseAdmin.storage
    .from('portfolio')
    .getPublicUrl(thumbnailPath);

  return NextResponse.json({
    originalUploadUrl: originalSignedUrl.signedUrl,
    originalUploadToken: originalSignedUrl.token,
    originalPath,
    thumbnailUploadUrl: thumbnailSignedUrl.signedUrl,
    thumbnailUploadToken: thumbnailSignedUrl.token,
    thumbnailPath,
    imageUrl,
    thumbnailUrl,
    contentType,
  });
}

// POST: Legacy fallback (kept for backward compatibility, but limited by Vercel)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 30MB.' },
        { status: 400 }
      );
    }

    const fileId = crypto.randomUUID();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const originalPath = `originals/${fileId}.${ext}`;
    const thumbnailPath = `thumbnails/${fileId}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('portfolio')
      .upload(originalPath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: thumbnailError } = await supabaseAdmin.storage
      .from('portfolio')
      .upload(thumbnailPath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (thumbnailError) {
      await supabaseAdmin.storage.from('portfolio').remove([originalPath]);
      return NextResponse.json({ error: thumbnailError.message }, { status: 500 });
    }

    const { data: { publicUrl: imageUrl } } = supabaseAdmin.storage
      .from('portfolio')
      .getPublicUrl(originalPath);

    const { data: { publicUrl: thumbnailUrl } } = supabaseAdmin.storage
      .from('portfolio')
      .getPublicUrl(thumbnailPath);

    return NextResponse.json({
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
