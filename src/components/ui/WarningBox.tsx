import type { ReactNode } from 'react';

interface WarningBoxProps {
  children: ReactNode;
  className?: string;
}

export function WarningBox({ children, className = '' }: WarningBoxProps) {
  return (
    <div className={`rounded-lg border border-level-medium/30 bg-level-medium/5 px-4 py-3 ${className}`}>
      <div className="flex gap-2.5">
        <span className="shrink-0 text-level-medium text-sm mt-0.5">&#9650;</span>
        <div className="text-sm text-ink-secondary leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
