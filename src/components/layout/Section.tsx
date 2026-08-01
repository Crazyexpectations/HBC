import type { ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
  bgClassName?: string;
}

// Common full-viewport-minimum section shell shared by every scene on the
// page, so backgrounds, padding, and overflow behavior stay consistent.
export default function Section({ id, children, className = '', bgClassName = '' }: Props) {
  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24 ${bgClassName} ${className}`}
    >
      {children}
    </section>
  );
}
