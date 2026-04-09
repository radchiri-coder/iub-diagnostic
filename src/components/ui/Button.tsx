import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent',
  secondary:
    'bg-ink text-surface hover:bg-ink/90 focus-visible:ring-ink',
  ghost:
    'bg-transparent text-ink hover:bg-ink/5 focus-visible:ring-ink/30',
};

export function Button({ variant = 'primary', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md px-6 py-3
        font-sans text-[15px] font-medium leading-tight
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
