import { NextResponse } from 'next/server';
import { format, subDays } from 'date-fns';
import { createServerClient } from '@/lib/supabase/server';
import { generateDailyPlan } from '@/lib/claude/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('plan_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(null, { status: 200 });
  }

  const taskIds: string[] = data.task_order || [];
  let tasks: Record<string, unknown>[] = [];
  if (taskIds.length > 0) {
    const { data: taskData } = await supabase
      .from('tasks')
      .select('*')
      .in('id', taskIds);
    tasks = taskData || [];
  }

  return NextResponse.json({ ...data, tasks });
}

export async function POST() {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const dayOfWeek = format(today, 'EEEE');
  const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');

  const supabase = createServerClient();

  const [pendingResult, recentResult, completedResult] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, priority, due_date, created_at')
      .eq('status', 'pending')
      .order('priority', { ascending: true }),
    supabase
      .from('captures')
      .select('id, raw_text, category, summary, created_at')
      .eq('archived', false)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('id, title, completed_at')
      .eq('status', 'done')
      .gte('completed_at', `${yesterday}T00:00:00`)
      .lte('completed_at', `${yesterday}T23:59:59`),
  ]);

  const pendingTasks = JSON.stringify(pendingResult.data || [], null, 2);
  const recentCaptures = JSON.stringify(recentResult.data || [], null, 2);
  const yesterdayCompleted = JSON.stringify(completedResult.data || [], null, 2);

  if (!pendingResult.data?.length && !recentResult.data?.length) {
    return NextResponse.json({
      plan_date: dateStr,
      ai_summary: "Nothing on the board yet — capture a thought or task to get started!",
      task_order: [],
      tasks: [],
    });
  }

  try {
    const result = await generateDailyPlan(
      dateStr,
      dayOfWeek,
      pendingTasks,
      recentCaptures,
      yesterdayCompleted,
    );

    const { data: plan, error } = await supabase
      .from('daily_plans')
      .upsert(
        {
          plan_date: dateStr,
          task_order: result.task_order,
          ai_summary: result.briefing,
          regenerated_at: new Date().toISOString(),
        },
        { onConflict: 'plan_date' },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const taskIds = result.task_order;
    let tasks: Record<string, unknown>[] = [];
    if (taskIds.length > 0) {
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .in('id', taskIds);
      tasks = taskData || [];
    }

    return NextResponse.json({
      ...plan,
      tasks,
      suggested_defer: result.suggested_defer,
      defer_reason: result.defer_reason,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Plan generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
