import { useRef, useEffect, type ReactNode, type ButtonHTMLAttributes } from 'react';
import gsap from 'gsap';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  className?: string;
}

// Button that gently pulls toward the cursor when it's nearby, and settles
// back with an elastic ease on leave. Uses gsap.quickTo (a single reusable
// tween) rather than gsap.to on every mousemove, which would spin up a new
// tween per event and fight the previous one — that's what makes a magnetic
// button feel rubber-banded instead of smooth. No-op on touch.
export default function MagneticButton({ children, strength = 0.4, className = '', ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const setX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const setY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setX.current = gsap.quickTo(ref.current, 'x', { duration: 0.4, ease: 'power3.out' });
    setY.current = gsap.quickTo(ref.current, 'y', { duration: 0.4, ease: 'power3.out' });
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setX.current?.((e.clientX - (rect.left + rect.width / 2)) * strength);
    setY.current?.((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    setX.current?.(0);
    setY.current?.(0);
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
