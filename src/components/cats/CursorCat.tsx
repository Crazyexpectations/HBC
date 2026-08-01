import { useEffect, useRef, useState } from 'react';
import Cat from './Cat';

const OFFSET_Y = 56; // sits just below-right of the real cursor
const OFFSET_X = 34;
const LERP = 0.09;
const MOVE_THRESHOLD = 4;

// A little cat that follows your cursor around like a pet — chases it when
// you move, sits and blinks when you stop. Desktop only (no persistent
// pointer to chase on touch). Position is mutated directly via a ref every
// frame (no React state per-frame) to keep this essentially free; `moving`
// and `flip` only become React state changes when they actually flip.
export default function CursorCat() {
  const [enabled, setEnabled] = useState(false);
  const [moving, setMoving] = useState(false);
  const [flip, setFlip] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const catPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX - OFFSET_X, y: e.clientY + OFFSET_Y };
      if (!initialized.current) {
        catPos.current = { ...mousePos.current };
        initialized.current = true;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let lastFlip = false;
    const tick = () => {
      const dx = mousePos.current.x - catPos.current.x;
      const dy = mousePos.current.y - catPos.current.y;
      const dist = Math.hypot(dx, dy);

      catPos.current.x += dx * LERP;
      catPos.current.y += dy * LERP;

      if (elRef.current) {
        elRef.current.style.transform = `translate(${catPos.current.x}px, ${catPos.current.y}px)`;
      }

      setMoving(dist > MOVE_THRESHOLD);
      if (Math.abs(dx) > 3) {
        const nextFlip = dx < 0;
        if (nextFlip !== lastFlip) {
          lastFlip = nextFlip;
          setFlip(nextFlip);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={elRef} className="pointer-events-none fixed left-0 top-0 z-[9997] -translate-x-1/2 -translate-y-1/2">
      <div className="pointer-events-auto">
        <Cat palette="ginger" size={52} bouncing={moving} flip={flip} />
      </div>
    </div>
  );
}
