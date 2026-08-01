import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Ties an element's vertical position to scroll progress through its own
// section, for a bit of depth as the page scrolls — the element (trigger
// defaults to itself) drifts by `distance` px from when it enters the
// viewport to when it leaves. `disabled` lets callers skip it on mobile.
export function useScrollParallax(ref: RefObject<HTMLElement | null>, distance = 60, disabled = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const tween = gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: (distance / (el.offsetHeight || 1)) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, distance, disabled]);
}
