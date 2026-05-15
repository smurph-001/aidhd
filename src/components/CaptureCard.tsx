'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Capture } from '@/types';

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  task: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Task' },
  thought: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Thought' },
  reminder: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Reminder' },
  question: { bg: 'bg-green-100', text: 'text-green-700', label: 'Question' },
};

const priorityLabels: Record<number, string> = {
  1: 'Urgent',
  2: 'Important',
  3: 'Normal',
  4: 'Someday',
};

interface CaptureCardProps {
  capture: Capture;
}

export function CaptureCard({ capture }: CaptureCardProps) {
  const style = capture.category ? categoryStyles[capture.category] : null;
  const timeAgo = formatDistanceToNow(new Date(capture.created_at), { addSuffix: true });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {capture.summary ? (
            <>
              <p className="text-slate-800 font-medium">{capture.summary}</p>
              <p className="text-slate-400 text-sm mt-1 truncate">{capture.raw_text}</p>
            </>
          ) : (
            <p className="text-slate-800">{capture.raw_text}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {style && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
              {style.label}
            </span>
          )}
          {capture.priority && (
            <span className="text-xs text-slate-400">{priorityLabels[capture.priority]}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <span>{capture.source === 'voice' ? '🎤' : '⌨️'}</span>
        <span>{timeAgo}</span>
        {!capture.processed_at && (
          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 animate-pulse">
            Processing...
          </span>
        )}
      </div>
    </div>
  );
}
