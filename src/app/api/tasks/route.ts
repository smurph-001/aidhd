import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*, captures(raw_text, source)')
    .eq('status', status)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status, deferred_to } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }

  const validStatuses = ['pending', 'done', 'deferred', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const supabase = createServerClient();
  const update: Record<string, string | null> = { status };

  if (status === 'done') {
    update.completed_at = new Date().toISOString();
  }
  if (status === 'deferred' && deferred_to) {
    update.deferred_to = deferred_to;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
