// ═══════════════════════════════════════════════════════════════════════
// IUB Diagnostic — Expert Benchmarks
// 16 base entries: 4 sizes x 4 stages
// Scores calibrated for Russian SMB reality (typical mid-range 4.5–6.5)
// ═══════════════════════════════════════════════════════════════════════

import type {
  BenchmarkEntry,
  CompanySize,
  CompanyStage,
  CategoryId,
} from '@/engine/types';

// ── Helper type for concise definitions ───────────────────────────────

type Scores = Record<CategoryId, number>;

function entry(
  size: CompanySize,
  stage: CompanyStage,
  scores: Scores,
  label: string,
): BenchmarkEntry {
  const values = Object.values(scores);
  const overallScore =
    Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;

  return {
    size,
    stage,
    categoryScores: scores,
    overallScore,
    benchmarkType: 'expert',
    sampleSize: undefined,
    label,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Benchmark matrix
//
// Design principles:
// - Small companies: faster decisions, weaker structure/people systems
// - Large companies: stronger structure, slower decisions, better people
// - Survival: lowest overall, execution under stress
// - Stabilization: moderate, building foundations
// - Growth: strong clarity/vision but execution & people stretched
// - Rebuild: mixed — clarity recovering, old structure partially broken
// ═══════════════════════════════════════════════════════════════════════

export const BENCHMARKS: BenchmarkEntry[] = [
  // ── up_to_15 (micro, 1–15 человек) ──────────────────────────────────

  entry(
    'up_to_15',
    'survival',
    { clarity: 3.5, decisions: 5.5, execution: 4.0, structure: 2.5, teamwork: 4.5, people: 2.0 },
    'Микробизнес, выживание',
  ),
  entry(
    'up_to_15',
    'stabilization',
    { clarity: 5.0, decisions: 6.0, execution: 5.5, structure: 3.5, teamwork: 5.5, people: 3.5 },
    'Микробизнес, стабилизация',
  ),
  entry(
    'up_to_15',
    'growth',
    { clarity: 6.0, decisions: 6.5, execution: 5.0, structure: 3.5, teamwork: 5.0, people: 3.0 },
    'Микробизнес, рост',
  ),
  entry(
    'up_to_15',
    'rebuild',
    { clarity: 4.5, decisions: 5.5, execution: 4.5, structure: 3.0, teamwork: 4.0, people: 3.0 },
    'Микробизнес, перестройка',
  ),

  // ── 15_to_50 (малый бизнес) ─────────────────────────────────────────

  entry(
    '15_to_50',
    'survival',
    { clarity: 3.0, decisions: 4.5, execution: 3.5, structure: 3.0, teamwork: 3.5, people: 2.5 },
    'Малый бизнес, выживание',
  ),
  entry(
    '15_to_50',
    'stabilization',
    { clarity: 5.0, decisions: 5.5, execution: 5.0, structure: 4.5, teamwork: 5.0, people: 4.0 },
    'Малый бизнес, стабилизация',
  ),
  entry(
    '15_to_50',
    'growth',
    { clarity: 6.5, decisions: 5.5, execution: 4.5, structure: 4.0, teamwork: 5.0, people: 3.5 },
    'Малый бизнес, рост',
  ),
  entry(
    '15_to_50',
    'rebuild',
    { clarity: 4.5, decisions: 4.5, execution: 4.0, structure: 4.0, teamwork: 3.5, people: 3.5 },
    'Малый бизнес, перестройка',
  ),

  // ── 50_to_150 (средний бизнес) ──────────────────────────────────────

  entry(
    '50_to_150',
    'survival',
    { clarity: 3.0, decisions: 3.5, execution: 3.5, structure: 3.5, teamwork: 3.0, people: 3.0 },
    'Средний бизнес, выживание',
  ),
  entry(
    '50_to_150',
    'stabilization',
    { clarity: 5.5, decisions: 5.0, execution: 5.5, structure: 5.5, teamwork: 5.0, people: 4.5 },
    'Средний бизнес, стабилизация',
  ),
  entry(
    '50_to_150',
    'growth',
    { clarity: 6.5, decisions: 5.0, execution: 4.5, structure: 5.0, teamwork: 4.5, people: 4.0 },
    'Средний бизнес, рост',
  ),
  entry(
    '50_to_150',
    'rebuild',
    { clarity: 4.5, decisions: 4.0, execution: 4.0, structure: 4.5, teamwork: 3.5, people: 4.0 },
    'Средний бизнес, перестройка',
  ),

  // ── 150_plus (крупный бизнес) ───────────────────────────────────────

  entry(
    '150_plus',
    'survival',
    { clarity: 3.5, decisions: 3.0, execution: 3.5, structure: 4.0, teamwork: 3.0, people: 3.5 },
    'Крупный бизнес, выживание',
  ),
  entry(
    '150_plus',
    'stabilization',
    { clarity: 5.5, decisions: 4.5, execution: 5.5, structure: 6.0, teamwork: 5.0, people: 5.5 },
    'Крупный бизнес, стабилизация',
  ),
  entry(
    '150_plus',
    'growth',
    { clarity: 7.0, decisions: 4.5, execution: 5.0, structure: 5.5, teamwork: 4.5, people: 4.5 },
    'Крупный бизнес, рост',
  ),
  entry(
    '150_plus',
    'rebuild',
    { clarity: 5.0, decisions: 3.5, execution: 4.0, structure: 5.0, teamwork: 3.5, people: 4.5 },
    'Крупный бизнес, перестройка',
  ),
];

// ── Lookup helper ─────────────────────────────────────────────────────

export function findBenchmark(
  size: CompanySize,
  stage: CompanyStage,
): BenchmarkEntry | undefined {
  return BENCHMARKS.find((b) => b.size === size && b.stage === stage);
}
