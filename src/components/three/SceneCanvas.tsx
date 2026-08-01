import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props extends Omit<CanvasProps, 'children'> {
  children: ReactNode;
  className?: string;
}

// Wraps every 3D scene on the page. Pauses the render loop (frameloop="never")
// whenever the canvas scrolls out of view instead of unmounting it, so we
// keep WebGL context creation cheap while still saving GPU/battery on scenes
// that aren't currently on screen — important since the page has several.
export default function SceneCanvas({ children, className = '', dpr, ...rest }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.05,
      rootMargin: '10% 0px 10% 0px',
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr ?? (isMobile ? 1 : [1, 1.75])}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
        {...rest}
      >
        {children}
      </Canvas>
    </div>
  );
}
