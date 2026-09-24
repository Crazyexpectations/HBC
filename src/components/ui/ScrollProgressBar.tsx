import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Thin progress bar across the top of the page.
 *
 * This used to hold progress in React state and set it from `onUpdate`, which
 * meant a `setState` — and therefore a React render plus a Framer Motion style
 * commit — on *every single scroll frame*, for the entire length of the page.
 * On a long page being smooth-scrolled by Lenis that is a render storm
 * competing with the scroll itself.
 *
 * The bar is one number that never needs to survive a re-render, so it's
 * written straight to the element's transform instead. React renders this once
 * and then never again.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        const el = barRef.current;
        // scaleX on an already-composited layer: no layout, no paint.
        if (el) el.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div aria-hidden className="fixed left-0 top-0 z-[500] h-[3px] w-full bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-rose via-rose-light to-gold"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
