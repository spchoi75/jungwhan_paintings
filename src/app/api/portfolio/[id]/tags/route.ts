import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/portfolio/:id/tags - Get tags for an artwork
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('artwork_tags')
      .select('tag_id, tags(id, name, created_at)')
      .eq('artwork_id', id);

    if (error) throw error;

    // Flatten the response
    const tags = data?.map(item => item.tags).filter(Boolean) || [];

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching artwork tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST /api/portfolio/:id/tags - Add tags to an artwork
// Body: { tag_ids: string[] } or { tag_names: string[] } (creates if not exist)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: artwork_id } = await params;
    const body = await request.json();
    const { tag_ids, tag_names } = body;

    let tagsToAdd: string[] = [];

    // Handle tag_ids (existing tags)
    if (tag_ids && Array.isArray(tag_ids)) {
      tagsToAdd = [...tag_ids];
    }

    // Handle tag_names (create new tags if needed)
    if (tag_names && Array.isArray(tag_names)) {
      for (const name of tag_names) {
        if (typeof name !== 'string' || name.trim().length === 0) continue;

        // Try to find existing tag
        const { data: existing } = await supabase
          .from('tags')
          .select('id')
          .eq('name', name.trim())
          .single();

        if (existing) {
          tagsToAdd.push(existing.id);
        } else {
          // Create new tag
          const { data: newTag, error: createError } = await supabase
            .from('tags')
            .insert({ name: name.trim() })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating tag:', createError);
            continue;
          }

          if (newTag) {
            tagsToAdd.push(newTag.id);
          }
        }
      }
    }

    if (tagsToAdd.length === 0) {
      return NextResponse.json({ error: 'No valid tags provided' }, { status: 400 });
    }

    // Insert artwork_tags (ignore duplicates)
    const insertData = tagsToAdd.map(tag_id => ({ artwork_id, tag_id }));

    const { error } = await supabase
      .from('artwork_tags')
      .upsert(insertData, { onConflict: 'artwork_id,tag_id', ignoreDuplicates: true });

    if (error) throw error;

    // Return updated tags list
    const { data: updatedTags } = await supabase
      .from('artwork_tags')
      .select('tags(id, name, created_at)')
      .eq('artwork_id', artwork_id);

    const tags = updatedTags?.map(item => item.tags).filter(Boolean) || [];

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error adding tags:', error);
    return NextResponse.json({ error: 'Failed to add tags' }, { status: 500 });
  }
}

// DELETE /api/portfolio/:id/tags - Remove tags from an artwork
// Body: { tag_ids: string[] }
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: artwork_id } = await params;
    const body = await request.json();
    const { tag_ids } = body;

    if (!tag_ids || !Array.isArray(tag_ids) || tag_ids.length === 0) {
      return NextResponse.json({ error: 'tag_ids array is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('artwork_tags')
      .delete()
      .eq('artwork_id', artwork_id)
      .in('tag_id', tag_ids);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tags:', error);
    return NextResponse.json({ error: 'Failed to remove tags' }, { status: 500 });
  }
}
