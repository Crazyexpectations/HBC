import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

// Drives the whole site's smooth scroll and keeps GSAP ScrollTrigger synced
// with Lenis's virtual scroll position. Also exposes the instance via
// context so components (e.g. the "watch it again" button) can call
// lenis.scrollTo(...) instead of fighting Lenis with native scrollTo.
export function LenisProvider({ active, children }: { active: boolean; children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (!active) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    setLenis(instance);

    instance.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const resize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', resize);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

// NOTE: this returns whatever the instance was at last render. Good enough
// for click handlers (they read it fresh at call time via the hook return),
// since consumers only call methods on it, not depend on referential updates.
export function useLenisInstance() {
  return useContext(LenisContext);
}
