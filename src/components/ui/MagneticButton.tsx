import { useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import gsap from 'gsap';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  className?: string;
}

// Button that gently pulls toward the cursor when it's nearby, and settles
// back with an elastic ease on leave. No-op on touch (no persistent pointer).
export default function MagneticButton({ children, strength = 0.4, className = '', ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <button
      ref={ref}
      data-cursor="hover"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
