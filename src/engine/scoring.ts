import type { AnswerRecord, CategoryId, CategoryResult, ResultLevel, LevelThresholds } from './types';
import { QUESTIONS, MAIN_QUESTIONS } from '@/config/questions';

// ── Configurable thresholds ───────────────────────────────────────────

export const DEFAULT_THRESHOLDS: LevelThresholds = {
  high: 7.5,
  medium: 5.0,
};

// ── Level resolution ──────────────────────────────────────────────────

export function resolveLevel(score: number, thresholds: LevelThresholds = DEFAULT_THRESHOLDS): ResultLevel {
  if (score >= thresholds.high) return 'high';
  if (score >= thresholds.medium) return 'medium';
  return 'low';
}

// ── Category score calculation ────────────────────────────────────────

/**
 * Calculate normalized score (0–10) for a category.
 * Uses only main questions (not control).
 * Formula: (sum of scores / max possible) * 10
 *   where max possible = count * 10
 */
export function calculateCategoryScore(
  answers: AnswerRecord[],
  categoryId: CategoryId
): { rawScore: number; normalizedScore: number; questionCount: number } {
  const categoryQuestions = MAIN_QUESTIONS.filter((q) => q.categoryId === categoryId);
  const categoryAnswers = answers.filter((a) =>
    categoryQuestions.some((q) => q.id === a.questionId)
  );

  if (categoryAnswers.length === 0) {
    return { rawScore: 0, normalizedScore: 0, questionCount: 0 };
  }

  const rawScore = categoryAnswers.reduce((sum, a) => sum + a.selectedScore, 0);
  const maxPossible = categoryAnswers.length * 10;
  const normalizedScore = Math.round((rawScore / maxPossible) * 100) / 10;

  return { rawScore, normalizedScore, questionCount: categoryAnswers.length };
}

// ── Overall score calculation ─────────────────────────────────────────

/**
 * Simple average of 6 category scores.
 * Context does NOT change the raw score — this is a core rule.
 */
export function calculateOverallScore(categoryScores: Array<{ normalizedScore: number }>): number {
  if (categoryScores.length === 0) return 0;
  const sum = categoryScores.reduce((s, c) => s + c.normalizedScore, 0);
  return Math.round((sum / categoryScores.length) * 10) / 10;
}

// ── Build all category results ────────────────────────────────────────

export function buildCategoryResults(
  answers: AnswerRecord[],
  thresholds?: LevelThresholds
): CategoryResult[] {
  const categoryIds: CategoryId[] = ['clarity', 'decisions', 'execution', 'structure', 'teamwork', 'people'];

  return categoryIds.map((categoryId) => {
    const { rawScore, normalizedScore } = calculateCategoryScore(answers, categoryId);
    const level = resolveLevel(normalizedScore, thresholds);

    return {
      categoryId,
      rawScore,
      normalizedScore,
      level,
      interpretationKey: '', // filled by personalization layer
    };
  });
}
