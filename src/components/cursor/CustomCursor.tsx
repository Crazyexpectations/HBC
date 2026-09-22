import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// A small dot glued to the pointer (near-zero lag, so it always feels
// "attached" to the real cursor) + a soft ring trailing slightly behind it
// for a bit of flair. IMPORTANT: position (transform: translate) is driven
// purely by GSAP — no CSS `transition` may ever touch `transform` here, or
// it stacks a second easing curve on top of GSAP's and the cursor turns
// mushy/laggy. Scale + color changes use the independent CSS `scale`
// property instead, which doesn't share a timeline with `transform`.
// Desktop (fine pointer) only — untouched on mobile/tablet, where it never mounts.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The ring trails the pointer on an eased timeline and clicks spawn
    // animated hearts — both are motion, and the whole thing also hides the
    // real system cursor. Anyone who asked for reduced motion keeps their
    // native pointer instead.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor-active');

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.01 });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.01 });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    // Hover state via delegated enter/leave (fires only on actual target
    // changes, not on every pixel of pointer movement like the old code did).
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-cursor="hover"]')) {
        ring.classList.add('cursor-hovering');
        dot.classList.add('cursor-hovering');
      }
    };
    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related?.closest?.('[data-cursor="hover"]')) {
        ring.classList.remove('cursor-hovering');
        dot.classList.remove('cursor-hovering');
      }
    };

    // Little heart burst on click, purely decorative.
    const onClick = (e: MouseEvent) => spawnClickHeart(e.clientX, e.clientY);

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('mouseenter', onEnterWindow);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="cursor-ring fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose/60"
      />
      <div ref={dotRef} className="cursor-dot fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose" />
    </div>
  );
}

let heartId = 0;
function spawnClickHeart(x: number, y: number) {
  const el = document.createElement('div');
  el.className = 'click-heart';
  el.textContent = '💗';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.dataset.id = String(heartId++);
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
