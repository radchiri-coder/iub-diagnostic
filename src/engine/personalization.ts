import type {
  CategoryId,
  CategoryResult,
  CompanyContext,
  ResultLevel,
  CompanyStage,
  BenchmarkComparison,
  DiagnosticResult,
  AnswerRecord,
} from './types';
import { buildCategoryResults, calculateOverallScore, resolveLevel } from './scoring';
import { detectControlDiscrepancies, findTopLeverage, buildSummaryBlocks } from './analysis';
import { CATEGORIES } from '@/config/categories';

// ── Interpretation selection ──────────────────────────────────────────

/**
 * Build an interpretation key for looking up text in interpretations config.
 * Format: "{categoryId}_{level}_{stage}"
 */
export function buildInterpretationKey(
  categoryId: CategoryId,
  level: ResultLevel,
  stage: CompanyStage
): string {
  return `${categoryId}_${level}_${stage}`;
}

// ── Benchmark comparison ──────────────────────────────────────────────

export function compareToBenchmark(
  categoryResults: CategoryResult[],
  benchmarkScores: Record<CategoryId, number> | null,
  label: string
): BenchmarkComparison[] {
  if (!benchmarkScores) return [];

  return categoryResults.map((result) => {
    const benchScore = benchmarkScores[result.categoryId] ?? 5.0;
    return {
      categoryId: result.categoryId,
      userScore: result.normalizedScore,
      benchmarkScore: benchScore,
      delta: Math.round((result.normalizedScore - benchScore) * 10) / 10,
      label,
    };
  });
}

// ── Full result assembly ──────────────────────────────────────────────

/**
 * Assemble the complete DiagnosticResult from raw answers and context.
 * This is the main orchestration function for the engine layer.
 */
export function assembleDiagnosticResult(
  answers: AnswerRecord[],
  context: CompanyContext | null,
  benchmarkScores: Record<CategoryId, number> | null,
  benchmarkLabel: string
): DiagnosticResult {
  const stage = context?.stage ?? 'stabilization';

  // 1. Calculate category scores
  const categoryResults = buildCategoryResults(answers);

  // 2. Enrich with interpretation keys
  for (const result of categoryResults) {
    result.interpretationKey = buildInterpretationKey(result.categoryId, result.level, stage);
  }

  // 3. Calculate overall
  const overallScore = calculateOverallScore(categoryResults);
  const overallLevel = resolveLevel(overallScore);

  // 4. Control discrepancies
  const controlWarnings = detectControlDiscrepancies(answers, categoryResults);

  // 5. Benchmark comparison
  const benchmarkComparison = compareToBenchmark(categoryResults, benchmarkScores, benchmarkLabel);

  // Enrich category results with benchmark deltas
  for (const result of categoryResults) {
    const bench = benchmarkComparison.find((b) => b.categoryId === result.categoryId);
    if (bench) {
      result.benchmarkDelta = bench.delta;
    }
  }

  // Enrich with control deltas
  for (const warning of controlWarnings) {
    const result = categoryResults.find((r) => r.categoryId === warning.categoryId);
    if (result) {
      result.controlDelta = warning.delta;
    }
  }

  // 6. Top leverage
  const topLeverage = findTopLeverage(categoryResults, context);

  return {
    overallScore,
    overallLevel,
    categoryResults,
    topLeverage,
    controlWarnings,
    benchmarkComparison,
    assessmentDate: Date.now(),
  };
}
