'use client';

import { useState, useEffect, useCallback } from 'react';
import { CaptureCard } from '@/components/CaptureCard';
import type { Capture, CaptureCategory } from '@/types';

const filters: { label: string; value: CaptureCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Tasks', value: 'task' },
  { label: 'Thoughts', value: 'thought' },
  { label: 'Reminders', value: 'reminder' },
  { label: 'Questions', value: 'question' },
];

export default function StreamPage() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [activeFilter, setActiveFilter] = useState<CaptureCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCaptures = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (activeFilter !== 'all') {
        params.set('category', activeFilter);
      }
      const res = await fetch(`/api/captures?${params}`);
      if (res.ok) {
        setCaptures(await res.json());
      }
    } catch {
      // Offline
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);

  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Stream</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f.value
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && captures.length === 0 && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {captures.length > 0 && (
        <div className="flex flex-col gap-3">
          {captures.map((capture) => (
            <CaptureCard key={capture.id} capture={capture} />
          ))}
        </div>
      )}

      {!isLoading && captures.length === 0 && (
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
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <p className="text-slate-500 font-medium">Nothing here yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Every thought you capture will appear here. Nothing gets lost.
          </p>
        </div>
      )}
    </div>
  );
}
