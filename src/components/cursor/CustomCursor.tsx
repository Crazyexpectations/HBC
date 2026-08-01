import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// A small heart dot glued to the pointer + a lagging ring around it. Grows
// over anything interactive (data-cursor="hover"). Desktop (fine pointer)
// only — untouched on mobile/tablet, where it never mounts.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor-active');

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const setDot = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power3.out' });
    const setRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      setDot(e.clientX);
      setDotY(e.clientY);
      setRing(e.clientX);
      setRingY(e.clientY);

      const target = (e.target as HTMLElement)?.closest('[data-cursor="hover"]');
      ring.classList.toggle('scale-[2.2]', !!target);
      ring.classList.toggle('bg-rose/10', !!target);
      dot.classList.toggle('scale-150', !!target);
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('mouseenter', onEnterWindow);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose/60 transition-transform transition-colors duration-200"
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose transition-transform duration-150"
      />
    </div>
  );
}
