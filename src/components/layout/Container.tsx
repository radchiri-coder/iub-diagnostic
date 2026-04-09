import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-content px-5 py-8 sm:py-12 ${className}`}>
      {children}
    </div>
  );
}
