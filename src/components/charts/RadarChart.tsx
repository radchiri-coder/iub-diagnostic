import type { CategoryResult } from '@/engine/types';
import { CATEGORIES } from '@/config/categories';

interface RadarChartProps {
  results: CategoryResult[];
  benchmarkScores?: Record<string, number>;
  size?: number;
}

const GRID_LEVELS = [2.5, 5, 7.5, 10];
const LABEL_PADDING = 30;

export function RadarChart({ results, benchmarkScores, size = 380 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - LABEL_PADDING * 2) / 2;
  const n = CATEGORIES.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const polarToXY = (i: number, value: number) => {
    const a = angle(i);
    const r = (value / 10) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Grid polygons
  const gridPolygons = GRID_LEVELS.map((level) => {
    const points = Array.from({ length: n }, (_, i) => {
      const { x, y } = polarToXY(i, level);
      return `${x},${y}`;
    }).join(' ');
    return { level, points };
  });

  // Data polygon
  const orderedResults = CATEGORIES.map((cat) =>
    results.find((r) => r.categoryId === cat.id)
  );
  const dataPoints = orderedResults
    .map((r, i) => {
      const { x, y } = polarToXY(i, r?.normalizedScore ?? 0);
      return `${x},${y}`;
    })
    .join(' ');

  // Benchmark polygon
  const benchmarkPoints = benchmarkScores
    ? CATEGORIES.map((cat, i) => {
        const score = benchmarkScores[cat.id] ?? 5;
        const { x, y } = polarToXY(i, score);
        return `${x},${y}`;
      }).join(' ')
    : null;

  // Axis labels
  const labels = CATEGORIES.map((cat, i) => {
    const { x, y } = polarToXY(i, 10.8);
    return { cat, x, y };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[420px] mx-auto"
      role="img"
      aria-label="Радарная диаграмма результатов"
    >
      {/* Grid */}
      {gridPolygons.map(({ level, points }) => (
        <polygon
          key={level}
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-ink/10"
        />
      ))}

      {/* Axes */}
      {CATEGORIES.map((_, i) => {
        const { x, y } = polarToXY(i, 10);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-ink/10"
          />
        );
      })}

      {/* Benchmark area */}
      {benchmarkPoints && (
        <polygon
          points={benchmarkPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-ink/20"
        />
      )}

      {/* Data area */}
      <polygon
        points={dataPoints}
        fill="#0F6E56"
        fillOpacity="0.12"
        stroke="#0F6E56"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {orderedResults.map((r, i) => {
        if (!r) return null;
        const { x, y } = polarToXY(i, r.normalizedScore);
        const cat = CATEGORIES[i];
        return (
          <circle
            key={r.categoryId}
            cx={x}
            cy={y}
            r="5"
            fill={cat?.color ?? '#0F6E56'}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Labels */}
      {labels.map(({ cat, x, y }) => (
        <text
          key={cat.id}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-ink-secondary text-[11px] font-sans"
        >
          {cat.shortName}
        </text>
      ))}
    </svg>
  );
}
