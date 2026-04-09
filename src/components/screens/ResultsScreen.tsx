import { useMemo } from 'react';
import type {
  DiagnosticResult,
  DiagnosticSession,
  ResultUnlockLevel,
  CategoryId,
} from '@/engine/types';
import { assembleDiagnosticResult } from '@/engine/personalization';
import { findBenchmark } from '@/config/benchmarks';
import { CATEGORY_MAP, CATEGORIES } from '@/config/categories';
import { useViewport } from '@/hooks/useViewport';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WarningBox } from '@/components/ui/WarningBox';
import { RadarChart } from '@/components/charts/RadarChart';
import { CategoryBars } from '@/components/charts/CategoryBars';

interface ResultsScreenProps {
  session: DiagnosticSession;
  onRestart: () => void;
}

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: 'Зрелая система', color: '#0F6E56' },
  medium: { label: 'Есть фундамент, но есть и дыры', color: '#854F0B' },
  low: { label: 'Система в ручном режиме', color: '#993C1D' },
};

export function ResultsScreen({ session, onRestart }: ResultsScreenProps) {
  const { isMobile } = useViewport();
  const unlockLevel = session.resultUnlockLevel;

  // Compute results
  const result: DiagnosticResult | null = useMemo(() => {
    if (session.answers.length === 0) return null;

    let benchmarkScores: Record<CategoryId, number> | null = null;
    let benchmarkLabel = '';

    if (session.context) {
      const bench = findBenchmark(session.context.size, session.context.stage);
      if (bench) {
        benchmarkScores = bench.categoryScores;
        benchmarkLabel = bench.label;
      }
    }

    return assembleDiagnosticResult(
      session.answers,
      session.context,
      benchmarkScores,
      benchmarkLabel
    );
  }, [session.answers, session.context]);

  if (!result) {
    return (
      <Container>
        <p className="text-ink-secondary">Недостаточно данных для расчёта результатов.</p>
        <Button onClick={onRestart} variant="ghost" className="mt-4">
          Начать заново
        </Button>
      </Container>
    );
  }

  const levelInfo = LEVEL_LABELS[result.overallLevel] ?? LEVEL_LABELS['medium']!;

  const contextLabel = session.context
    ? `${sizeLabel(session.context.size)} · ${stageLabel(session.context.stage)}`
    : '';

  const benchmarkMap = result.benchmarkComparison.length > 0
    ? Object.fromEntries(result.benchmarkComparison.map((b) => [b.categoryId, b.benchmarkScore]))
    : undefined;

  return (
    <Container className="pb-16">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">
          Ваша карта управляемости
        </h1>
        {contextLabel && (
          <p className="mt-1.5 text-sm text-ink-secondary">{contextLabel}</p>
        )}
      </div>

      {/* Overall score */}
      <div className="mt-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-end gap-3">
          <span
            className="text-5xl font-serif font-bold"
            style={{ color: levelInfo.color }}
          >
            {result.overallScore.toFixed(1)}
          </span>
          <span className="text-lg text-ink-muted mb-1">/ 10</span>
        </div>
        <p className="mt-1 text-sm font-medium" style={{ color: levelInfo.color }}>
          {levelInfo.label}
        </p>
      </div>

      {/* Chart: radar on desktop, bars on mobile */}
      <div className="mt-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
        {isMobile ? (
          <CategoryBars results={result.categoryResults} benchmarkScores={benchmarkMap} />
        ) : (
          <RadarChart results={result.categoryResults} benchmarkScores={benchmarkMap} />
        )}
      </div>

      {/* Benchmark label */}
      {result.benchmarkComparison.length > 0 && (
        <p className="mt-3 text-xs text-ink-muted text-center">
          Пунктир — экспертный ориентир для компаний вашего профиля
        </p>
      )}

      {/* Top leverage (full unlock only) */}
      {unlockLevel === 'full' && (
        <div
          className="mt-10 rounded-xl border-2 border-accent/20 bg-accent/[0.03] p-5 animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          <h3 className="font-serif text-lg font-bold text-accent">
            Главный рычаг: {CATEGORY_MAP[result.topLeverage.categoryId]?.name}
          </h3>
          <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
            {result.topLeverage.reason}
          </p>
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="text-sm font-medium text-ink">Первый шаг</p>
            <p className="mt-1 text-sm text-ink-secondary leading-relaxed">
              {result.topLeverage.firstStep}
            </p>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Ожидаемый эффект: {result.topLeverage.expectedEffect}
          </p>
        </div>
      )}

      {/* Category details */}
      <div className="mt-10 space-y-6">
        {result.categoryResults
          .sort((a, b) => {
            const catA = CATEGORY_MAP[a.categoryId];
            const catB = CATEGORY_MAP[b.categoryId];
            return (catA?.order ?? 0) - (catB?.order ?? 0);
          })
          .map((cr, idx) => {
            const cat = CATEGORY_MAP[cr.categoryId];
            if (!cat) return null;
            const lv = LEVEL_LABELS[cr.level] ?? LEVEL_LABELS['medium']!;

            return (
              <div
                key={cr.categoryId}
                className="animate-fade-up"
                style={{ animationDelay: `${400 + idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium" style={{ color: cat.color }}>
                    {cat.name}
                  </h3>
                  <span className="text-sm font-medium">{cr.normalizedScore.toFixed(1)}</span>
                </div>
                <ProgressBar
                  value={(cr.normalizedScore / 10) * 100}
                  color={cat.color}
                  height="h-2"
                />
                {unlockLevel === 'full' && (
                  <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                    {lv.label}
                    {cr.benchmarkDelta != null && cr.benchmarkDelta !== 0 && (
                      <span className="ml-2 text-xs text-ink-muted">
                        ({cr.benchmarkDelta > 0 ? '+' : ''}{cr.benchmarkDelta.toFixed(1)} от ориентира)
                      </span>
                    )}
                  </p>
                )}
              </div>
            );
          })}
      </div>

      {/* Control warnings */}
      {result.controlWarnings.length > 0 && unlockLevel === 'full' && (
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium text-ink-secondary">Обратите внимание</h3>
          {result.controlWarnings.map((w) => (
            <WarningBox key={w.categoryId}>
              {w.message}
            </WarningBox>
          ))}
        </div>
      )}

      {/* CTA blocks */}
      <div className="mt-12 space-y-4">
        <div className="rounded-xl bg-surface-dark p-5">
          <h3 className="font-serif text-base font-bold">
            Это ваш взгляд. А как видит команда?
          </h3>
          <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
            Отправьте укороченную версию ключевым сотрудникам. Самое ценное — не баллы,
            а разрыв между вашей картиной и их.
          </p>
          <Button variant="primary" className="mt-4" disabled>
            Получить ссылку для команды
          </Button>
          <p className="mt-1 text-xs text-ink-muted">Доступно в следующей версии</p>
        </div>

        <div className="rounded-xl bg-surface-dark p-5">
          <p className="text-sm text-ink-secondary leading-relaxed">
            Хотите разобрать карту с экспертом? 30 минут, бесплатно, без продажи.
          </p>
          <Button variant="secondary" className="mt-3" disabled>
            Записаться на разбор
          </Button>
          <p className="mt-1 text-xs text-ink-muted">Доступно в следующей версии</p>
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-ink-muted">Поделиться:</span>
          <button
            type="button"
            onClick={() => {
              const text = `Мой Индекс Управляемости — ${result.overallScore.toFixed(1)}/10. А какой у вас?`;
              navigator.clipboard?.writeText(text);
            }}
            className="text-xs text-accent hover:underline"
          >
            Скопировать результат
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-xs text-ink-muted leading-relaxed">
        Это экспертный инструмент рефлексии, а не валидированный психометрический тест.
        Результаты основаны на вашем субъективном восприятии и предназначены для выявления
        зон внимания. Для глубокой диагностики рекомендуется опрос команды и работа с экспертом.
        Методология: Ирина Радченко, irinaradchenko.ru
      </p>

      {/* Restart */}
      <div className="mt-6">
        <Button variant="ghost" onClick={onRestart} className="text-sm">
          Пройти заново
        </Button>
      </div>
    </Container>
  );
}

// ── Helpers ──

function sizeLabel(size: string): string {
  const map: Record<string, string> = {
    up_to_15: 'До 15 человек',
    '15_to_50': '15–50 человек',
    '50_to_150': '50–150 человек',
    '150_plus': '150+ человек',
  };
  return map[size] ?? size;
}

function stageLabel(stage: string): string {
  const map: Record<string, string> = {
    survival: 'Выживание',
    stabilization: 'Стабилизация',
    growth: 'Рост',
    rebuild: 'Перестройка',
  };
  return map[stage] ?? stage;
}
