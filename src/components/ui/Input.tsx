import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-md border bg-white px-3.5 py-2.5
          text-[15px] text-ink placeholder:text-ink-muted
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          ${error ? 'border-level-low' : 'border-ink/15'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-level-low">{error}</p>}
    </div>
  );
}
