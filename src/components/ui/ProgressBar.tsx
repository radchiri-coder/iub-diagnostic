interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: string;
  className?: string;
}

export function ProgressBar({ value, color = '#0F6E56', height = 'h-1', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-ink/10 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-400 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
