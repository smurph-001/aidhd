import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { raw_text, source, client_created_at } = body;

  if (!raw_text || typeof raw_text !== 'string') {
    return NextResponse.json({ error: 'raw_text is required' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('captures')
    .insert({
      raw_text: raw_text.trim(),
      source: source || 'text',
      created_at: client_created_at || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const category = searchParams.get('category');

  const supabase = createServerClient();
  let query = supabase
    .from('captures')
    .select('*')
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
