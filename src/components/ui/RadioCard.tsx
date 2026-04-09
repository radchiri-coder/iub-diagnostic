interface RadioCardProps {
  label: string;
  description?: string;
  selected: boolean;
  accentColor?: string;
  onClick: () => void;
}

export function RadioCard({ label, description, selected, accentColor, onClick }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-lg border-2 px-4 py-3.5
        transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        ${
          selected
            ? 'border-current bg-ink/[0.03] shadow-sm'
            : 'border-transparent bg-surface-dark hover:border-ink/10 hover:bg-surface-dark/80'
        }
      `}
      style={selected && accentColor ? { borderColor: accentColor, color: accentColor } : undefined}
    >
      <span className={`block font-sans text-[15px] leading-relaxed ${selected ? 'font-medium' : 'text-ink'}`}>
        {label}
      </span>
      {description && (
        <span className="block mt-0.5 text-[13px] text-ink-secondary">{description}</span>
      )}
    </button>
  );
}
