-- AIDhd v1 Schema
-- Run this in your Supabase SQL Editor to set up the database.

-- Raw captures: the source of truth. Never dropped, never modified (except soft delete).
CREATE TABLE captures (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text      TEXT NOT NULL,
  source        TEXT NOT NULL DEFAULT 'voice',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  category      TEXT,
  summary       TEXT,
  priority      SMALLINT CHECK (priority BETWEEN 1 AND 4),
  processed_at  TIMESTAMPTZ,
  archived      BOOLEAN NOT NULL DEFAULT false
);

-- Tasks: extracted actionable items. One capture can produce zero or many tasks.
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id    UUID REFERENCES captures(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  priority      SMALLINT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 4),
  status        TEXT NOT NULL DEFAULT 'pending',
  due_date      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  deferred_to   DATE
);

-- Daily plans: one per day. Stores the AI-generated plan.
CREATE TABLE daily_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_date       DATE NOT NULL UNIQUE,
  task_order      UUID[] NOT NULL,
  ai_summary      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  regenerated_at  TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_captures_created_at ON captures(created_at DESC) WHERE NOT archived;
CREATE INDEX idx_captures_unprocessed ON captures(id) WHERE processed_at IS NULL AND NOT archived;
CREATE INDEX idx_tasks_status ON tasks(status) WHERE status = 'pending';
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE status = 'pending';
CREATE INDEX idx_daily_plans_date ON daily_plans(plan_date DESC);
