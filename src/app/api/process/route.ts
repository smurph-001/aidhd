import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { categoriseCapture } from '@/lib/claude/client';

export async function POST(request: Request) {
  const body = await request.json();
  const { capture_id } = body;

  if (!capture_id) {
    return NextResponse.json({ error: 'capture_id is required' }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: capture, error: fetchError } = await supabase
    .from('captures')
    .select('*')
    .eq('id', capture_id)
    .single();

  if (fetchError || !capture) {
    return NextResponse.json({ error: 'Capture not found' }, { status: 404 });
  }

  if (capture.processed_at) {
    return NextResponse.json({ error: 'Already processed' }, { status: 409 });
  }

  try {
    const result = await categoriseCapture(capture.raw_text, capture.created_at);

    const { error: updateError } = await supabase
      .from('captures')
      .update({
        category: result.category,
        summary: result.summary,
        priority: result.priority,
        processed_at: new Date().toISOString(),
      })
      .eq('id', capture_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (result.tasks.length > 0) {
      const tasksToInsert = result.tasks.map((t) => ({
        capture_id,
        title: t.title,
        priority: t.priority,
        due_date: t.due_date,
      }));

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksToInsert);

      if (tasksError) {
        return NextResponse.json({ error: tasksError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      capture_id,
      ...result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
