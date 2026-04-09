import type { CategoryResult } from '@/engine/types';
import { CATEGORY_MAP } from '@/config/categories';

interface CategoryBarsProps {
  results: CategoryResult[];
  benchmarkScores?: Record<string, number>;
}

export function CategoryBars({ results, benchmarkScores }: CategoryBarsProps) {
  // Sort by category order
  const sorted = [...results].sort((a, b) => {
    const catA = CATEGORY_MAP[a.categoryId];
    const catB = CATEGORY_MAP[b.categoryId];
    return (catA?.order ?? 0) - (catB?.order ?? 0);
  });

  return (
    <div className="space-y-4">
      {sorted.map((result) => {
        const cat = CATEGORY_MAP[result.categoryId];
        if (!cat) return null;
        const pct = Math.min(100, (result.normalizedScore / 10) * 100);
        const benchPct = benchmarkScores?.[result.categoryId]
          ? Math.min(100, ((benchmarkScores[result.categoryId] ?? 5) / 10) * 100)
          : null;

        return (
          <div key={result.categoryId}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-medium" style={{ color: cat.color }}>
                {cat.shortName}
              </span>
              <span className="text-sm font-medium text-ink">
                {result.normalizedScore.toFixed(1)}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-ink/8 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pct}%`, backgroundColor: cat.color }}
              />
              {benchPct !== null && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-ink/30"
                  style={{ left: `${benchPct}%` }}
                  title="Ориентир"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
