export type CaptureSource = 'voice' | 'text';
export type CaptureCategory = 'task' | 'thought' | 'reminder' | 'question';
export type TaskStatus = 'pending' | 'done' | 'deferred' | 'cancelled';

export interface Capture {
  id: string;
  raw_text: string;
  source: CaptureSource;
  created_at: string;
  category: CaptureCategory | null;
  summary: string | null;
  priority: number | null;
  processed_at: string | null;
  archived: boolean;
}

export interface Task {
  id: string;
  capture_id: string | null;
  title: string;
  priority: number;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  deferred_to: string | null;
}

export interface DailyPlan {
  id: string;
  plan_date: string;
  task_order: string[];
  ai_summary: string | null;
  created_at: string;
  regenerated_at: string | null;
}

export interface CategorisationResult {
  category: CaptureCategory;
  summary: string;
  priority: number;
  tasks: {
    title: string;
    priority: number;
    due_date: string | null;
  }[];
}

export interface DailyPlanResult {
  briefing: string;
  task_order: string[];
  reasoning: string;
  suggested_defer: string[];
  defer_reason: string;
}

export interface OfflineCapture {
  id: string;
  raw_text: string;
  source: CaptureSource;
  client_created_at: string;
  synced: boolean;
}
