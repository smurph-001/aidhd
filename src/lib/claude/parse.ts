import { z } from 'zod';

export const CategorisationSchema = z.object({
  category: z.enum(['task', 'thought', 'reminder', 'question']),
  summary: z.string(),
  priority: z.number().int().min(1).max(4),
  tasks: z.array(
    z.object({
      title: z.string(),
      priority: z.number().int().min(1).max(4),
      due_date: z.string().nullable(),
    }),
  ),
});

export const DailyPlanSchema = z.object({
  briefing: z.string(),
  task_order: z.array(z.string()),
  reasoning: z.string(),
  suggested_defer: z.array(z.string()),
  defer_reason: z.string(),
});

export function parseJSON<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return schema.parse(parsed);
}
