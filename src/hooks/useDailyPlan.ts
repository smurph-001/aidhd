'use client';

import { useState, useCallback } from 'react';
import type { Task } from '@/types';

interface DailyPlanData {
  plan_date: string;
  ai_summary: string | null;
  task_order: string[];
  tasks: Task[];
  suggested_defer?: string[];
  defer_reason?: string;
}

export function useDailyPlan() {
  const [plan, setPlan] = useState<DailyPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = date ? `?date=${date}` : '';
      const res = await fetch(`/api/daily-plan${params}`);
      if (!res.ok) throw new Error('Failed to fetch plan');
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generatePlan = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/daily-plan', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate plan');
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const updateTask = useCallback(
    async (taskId: string, status: string, deferredTo?: string) => {
      try {
        const res = await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: taskId, status, deferred_to: deferredTo }),
        });
        if (!res.ok) throw new Error('Failed to update task');

        setPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId ? { ...t, status: status as Task['status'] } : t,
            ),
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [],
  );

  return {
    plan,
    isLoading,
    isGenerating,
    error,
    fetchPlan,
    generatePlan,
    updateTask,
  };
}
