'use client';

import { useEffect } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { useDailyPlan } from '@/hooks/useDailyPlan';

export default function TodayPage() {
  const { plan, isLoading, isGenerating, error, fetchPlan, generatePlan, updateTask } =
    useDailyPlan();

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  function handleComplete(taskId: string) {
    updateTask(taskId, 'done');
  }

  function handleDefer(taskId: string) {
    updateTask(taskId, 'deferred');
  }

  const orderedTasks =
    plan?.tasks && plan.task_order
      ? plan.task_order
          .map((id) => plan.tasks.find((t) => t.id === id))
          .filter((t): t is NonNullable<typeof t> => !!t && t.status !== 'deferred' && t.status !== 'cancelled')
      : [];

  const completedCount = plan?.tasks?.filter((t) => t.status === 'done').length || 0;
  const totalCount = orderedTasks.length + completedCount;

  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Today</h1>
          {totalCount > 0 && (
            <p className="text-sm text-slate-400 mt-0.5">
              {completedCount}/{totalCount} done
            </p>
          )}
        </div>
        <button
          onClick={generatePlan}
          disabled={isGenerating}
          className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 active:scale-95"
        >
          {isGenerating ? 'Generating...' : plan ? 'Refresh Plan' : 'Generate Plan'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm mb-4">
          {error}
        </div>
      )}

      {isLoading && !plan && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading plan...</p>
        </div>
      )}

      {plan?.ai_summary && (
        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <p className="text-blue-800 text-sm leading-relaxed">{plan.ai_summary}</p>
        </div>
      )}

      {orderedTasks.length > 0 && (
        <div className="flex flex-col gap-3">
          {orderedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDefer={handleDefer}
            />
          ))}
        </div>
      )}

      {plan?.tasks?.some((t) => t.status === 'done') && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
            Completed
          </h2>
          <div className="flex flex-col gap-2">
            {plan.tasks
              .filter((t) => t.status === 'done')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onDefer={handleDefer}
                />
              ))}
          </div>
        </div>
      )}

      {!plan && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="w-16 h-16 text-slate-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-slate-500 font-medium">No plan yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Capture some thoughts first, then generate your daily plan.
          </p>
        </div>
      )}
    </div>
  );
}
