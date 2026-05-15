'use client';

import type { Task } from '@/types';

const priorityColors: Record<number, string> = {
  1: 'border-l-red-400',
  2: 'border-l-orange-400',
  3: 'border-l-blue-400',
  4: 'border-l-slate-300',
};

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDefer: (id: string) => void;
}

export function TaskCard({ task, onComplete, onDefer }: TaskCardProps) {
  const isDone = task.status === 'done';

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-l-4 transition-all ${
        priorityColors[task.priority] || 'border-l-slate-300'
      } ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onComplete(task.id)}
          disabled={isDone}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            isDone
              ? 'bg-green-500 border-green-500'
              : 'border-slate-300 hover:border-green-400 hover:bg-green-50 active:scale-90'
          }`}
          aria-label={isDone ? 'Completed' : 'Mark as done'}
        >
          {isDone && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {task.title}
          </p>
          {task.due_date && (
            <p className="text-xs text-slate-400 mt-0.5">Due: {task.due_date}</p>
          )}
        </div>

        {!isDone && (
          <button
            onClick={() => onDefer(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors active:scale-95"
          >
            Later
          </button>
        )}
      </div>
    </div>
  );
}
