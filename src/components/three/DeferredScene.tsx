import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** How early to start loading, in px before the scene enters the viewport. */
  rootMargin?: string;
}

/**
 * Holds a 3D scene back until she's actually near it.
 *
 * Every `<SceneCanvas>` on the page used to mount on first render, so opening
 * the site created three WebGL contexts immediately — the cake's and the
 * lantern's sat there holding GPU memory for the entire time she was reading
 * the letter, several screens above them. `SceneCanvas` paused their render
 * loops, but a paused context is still an allocated context, and on a phone
 * that is the expensive part.
 *
 * Paired with `React.lazy` around each scene, this also keeps Three.js out of
 * the initial download entirely: the chunk isn't fetched until this fires.
 *
 * Once mounted it stays mounted. Tearing a canvas down on scroll-out would
 * mean rebuilding the context (and losing lit candles, or a released lantern)
 * every time she scrolled past.
 */
export default function DeferredScene({ children, rootMargin = '500px' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    // No observer support: just show it. A missing cake is worse than a slow one.
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className="absolute inset-0">
      {show && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
}
