import Anthropic from '@anthropic-ai/sdk';
import {
  CATEGORISATION_SYSTEM_PROMPT,
  DAILY_PLAN_SYSTEM_PROMPT,
  buildCategorisationPrompt,
  buildDailyPlanPrompt,
} from './prompts';
import { CategorisationSchema, DailyPlanSchema, parseJSON } from './parse';
import type { CategorisationResult, DailyPlanResult } from '@/types';

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function categoriseCapture(
  rawText: string,
  createdAt: string,
): Promise<CategorisationResult> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: CATEGORISATION_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildCategorisationPrompt(rawText, createdAt) },
    ],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  return parseJSON(text, CategorisationSchema);
}

export async function generateDailyPlan(
  date: string,
  dayOfWeek: string,
  pendingTasks: string,
  recentCaptures: string,
  yesterdayCompleted: string,
): Promise<DailyPlanResult> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: DAILY_PLAN_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildDailyPlanPrompt(
          date,
          dayOfWeek,
          pendingTasks,
          recentCaptures,
          yesterdayCompleted,
        ),
      },
    ],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  return parseJSON(text, DailyPlanSchema);
}
