import type {
  AnswerRecord,
  CategoryId,
  CategoryResult,
  CompanyContext,
  ControlWarning,
  LeverageRecommendation,
} from './types';
import { CONTROL_QUESTIONS } from '@/config/questions';
import { CATEGORIES, CATEGORY_MAP } from '@/config/categories';
import { resolveLevel } from './scoring';

// ── Control discrepancy detection ─────────────────────────────────────

/** Threshold: delta >= 3 on 0–10 scale triggers a warning */
const CONTROL_THRESHOLD = 3;

/**
 * Compare control question scores with their target categories.
 * Control questions provide indirect signals; discrepancy suggests
 * the respondent may be seeing things more optimistically than reality.
 */
export function detectControlDiscrepancies(
  answers: AnswerRecord[],
  categoryResults: CategoryResult[]
): ControlWarning[] {
  const warnings: ControlWarning[] = [];

  for (const controlQ of CONTROL_QUESTIONS) {
    const answer = answers.find((a) => a.questionId === controlQ.id);
    if (!answer || !controlQ.controlForCategoryIds) continue;

    // Normalize control answer to 0–10 scale (single answer: score is already 1–10)
    const indirectScore = answer.selectedScore;

    for (const targetCategoryId of controlQ.controlForCategoryIds) {
      const catResult = categoryResults.find((r) => r.categoryId === targetCategoryId);
      if (!catResult) continue;

      const delta = catResult.normalizedScore - indirectScore;

      if (delta >= CONTROL_THRESHOLD) {
        const cat = CATEGORY_MAP[targetCategoryId];
        warnings.push({
          categoryId: targetCategoryId,
          directScore: catResult.normalizedScore,
          indirectScore,
          delta: Math.round(delta * 10) / 10,
          message: `По категории «${cat?.name ?? targetCategoryId}» ваши прямые ответы заметно выше, чем косвенные индикаторы. Возможно, стоит проверить — не выдаёте ли желаемое за действительное.`,
        });
      }
    }
  }

  return warnings;
}

// ── Confidence flags ──────────────────────────────────────────────────

export function buildConfidenceFlags(
  controlWarnings: ControlWarning[]
): { hasWarnings: boolean; affectedCategories: CategoryId[] } {
  return {
    hasWarnings: controlWarnings.length > 0,
    affectedCategories: controlWarnings.map((w) => w.categoryId),
  };
}

// ── Top leverage detection ────────────────────────────────────────────

/**
 * Find the category with the highest leverage — not just the weakest,
 * but the one where improvement gives the best ROI given company context.
 *
 * Formula (explicit and documented):
 *   leverageScore = gapWeight * gapToStrong
 *                 + stagePriorityWeight * stagePriority
 *                 + dependencyWeight * systemicDependency
 *
 * Where:
 *   gapToStrong = 10 - normalizedScore (how far from "high")
 *   stagePriority = category.stagePriorityMap[stage] (0–1)
 *   systemicDependency = category.systemicDependencyWeight (0–1)
 *
 * Weights: gap=0.4, stagePriority=0.35, dependency=0.25
 */
const GAP_WEIGHT = 0.4;
const STAGE_PRIORITY_WEIGHT = 0.35;
const DEPENDENCY_WEIGHT = 0.25;

export function findTopLeverage(
  categoryResults: CategoryResult[],
  context: CompanyContext | null
): LeverageRecommendation {
  const stage = context?.stage ?? 'stabilization';

  let best: { categoryId: CategoryId; score: number } = {
    categoryId: 'clarity',
    score: -Infinity,
  };

  for (const result of categoryResults) {
    const cat = CATEGORY_MAP[result.categoryId];
    if (!cat) continue;

    const gapToStrong = 10 - result.normalizedScore;
    const stagePriority = cat.stagePriorityMap[stage] ?? 0.5;
    const systemicDep = cat.systemicDependencyWeight;

    const leverageScore =
      GAP_WEIGHT * gapToStrong +
      STAGE_PRIORITY_WEIGHT * stagePriority * 10 + // scale to ~0-10 range
      DEPENDENCY_WEIGHT * systemicDep * 10;

    if (leverageScore > best.score) {
      best = { categoryId: result.categoryId, score: leverageScore };
    }
  }

  const cat = CATEGORY_MAP[best.categoryId];
  const result = categoryResults.find((r) => r.categoryId === best.categoryId);

  return {
    categoryId: best.categoryId,
    leverageScore: Math.round(best.score * 10) / 10,
    reason: buildLeverageReason(best.categoryId, result?.normalizedScore ?? 0, stage),
    firstStep: buildLeverageFirstStep(best.categoryId, result?.level ?? 'low'),
    expectedEffect: buildLeverageEffect(best.categoryId),
  };
}

// ── Leverage text builders ────────────────────────────────────────────

function buildLeverageReason(categoryId: CategoryId, score: number, stage: string): string {
  const reasons: Record<CategoryId, string> = {
    clarity: `Ясность курса — фундамент, от которого зависят все остальные управленческие процессы. При текущем балле ${score} команда тратит энергию на согласования, которые могли бы не возникать.`,
    decisions: `Скорость и качество решений — узкое место, которое прямо влияет на операционную эффективность. Каждое «зависшее» решение замедляет всю систему.`,
    execution: `Разрыв между «договорились» и «сделали» — один из самых дорогих управленческих дефектов. Он обесценивает совещания и подрывает доверие внутри команды.`,
    structure: `Нечёткие роли и «ничьи» задачи создают постоянное трение. Это не просто неудобство — это системная потеря скорости и энергии.`,
    teamwork: `Качество командного взаимодействия определяет, будет ли компания работать как система или как набор отдельных людей. Это невозможно «купить» повышением зарплат.`,
    people: `Работа с людьми — критический рычаг на текущем рынке труда. Дефицит кадров делает каждого сотрудника ценнее, а потерю — дороже.`,
  };
  return reasons[categoryId] ?? '';
}

function buildLeverageFirstStep(categoryId: CategoryId, level: string): string {
  const steps: Record<CategoryId, Record<string, string>> = {
    clarity: {
      low: 'Сформулируйте одну главную цель на ближайший квартал и убедитесь, что три ключевых человека её назовут одинаково.',
      medium: 'Проведите сессию каскадирования: от годовой цели — к квартальным приоритетам отделов.',
      high: 'Введите еже��вартальный стратегический чек-ин для проверки актуальности курса.',
    },
    decisions: {
      low: 'Составьте матрицу решений: какие решения может принимать каждый уровень без согласования.',
      medium: 'Определите топ-5 типовых решений, которые «застревают», и делегируйте их.',
      high: 'Внедрите ретроспективы по ключевым решениям — для обучения, не для контроля.',
    },
    execution: {
      low: 'Введите 15-минутный ежедневный стендап: что сделано, что буксует, что нужно.',
      medium: 'Создайте единую доску задач (Trello, Notion) и добейтесь, чтобы команда обновляла её сама.',
      high: 'Добавьте еженедельный обзор результатов с фокусом на отклонения от плана.',
    },
    structure: {
      low: 'Опишите 5 ключевых процессов и назначьте владельца для каждого.',
      medium: 'Проведите аудит «серых зон» — задач, которые регулярно оказываются «ничьими».',
      high: 'Создайте план замещения для каждой ключевой роли.',
    },
    teamwork: {
      low: 'Начните с одного формата: еженедельный кроссфункциональный синхрон на 20 минут.',
      medium: 'Введите практику безвинных разборов ошибок — фокус на процессе, не на человеке.',
      high: 'Запустите формат peer-feedback — регулярная обратная связь между руководителями.',
    },
    people: {
      low: 'Создайте чек-лист первой недели для новичка: 5 обязательных шагов адаптации.',
      medium: 'Введите ежемесячные one-on-one между руководителем и каждым прямым подчинённым.',
      high: 'Внедрите exit-интервью и квартальный анализ причин увольнений.',
    },
  };
  return steps[categoryId]?.[level] ?? steps[categoryId]?.['low'] ?? '';
}

function buildLeverageEffect(categoryId: CategoryId): string {
  const effects: Record<CategoryId, string> = {
    clarity: 'Снижение количества «ненужных» инициатив и согласований, ускорение принятия решений на всех уровнях.',
    decisions: 'Сокращение времени от проблемы до решения, снижение нагрузки на собственника/директора.',
    execution: 'Рост предсказуемости результатов, снижение «потерянных» задач и невыполненных обещаний.',
    structure: 'Снижение за��исимости от конкретных людей, меньше «пожаров» из-за неясных ответственностей.',
    teamwork: 'Ускорение горизонтального взаимодействия, снижение внутренних конфликтов и информационных потерь.',
    people: 'Ускорение адаптации новичков, снижение текучести, рост вовлечённости.',
  };
  return effects[categoryId] ?? '';
}

// ── Summary blocks for results page ───────────────────────────────────

export function buildSummaryBlocks(
  categoryResults: CategoryResult[]
): { strong: CategoryId[]; attention: CategoryId[]; critical: CategoryId[] } {
  return {
    strong: categoryResults.filter((r) => r.level === 'high').map((r) => r.categoryId),
    attention: categoryResults.filter((r) => r.level === 'medium').map((r) => r.categoryId),
    critical: categoryResults.filter((r) => r.level === 'low').map((r) => r.categoryId),
  };
}
