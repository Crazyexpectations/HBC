import { useEffect, useRef, useState } from 'react';
import Cat, { type CatMode } from './Cat';
import { useAppStore } from '../../store/useAppStore';

const OFFSET_Y = 56; // sits just below-right of the real cursor
const OFFSET_X = 34;
const LERP = 0.09;
const MOVE_THRESHOLD = 4;
const SLEEP_AFTER_MS = 20000;
const PAW_PRINT_INTERVAL_MS = 260;

let printId = 0;

// A little cat that follows your cursor around like a pet — chases it when
// you move, sits and blinks when you stop, and if you leave it alone long
// enough it curls up for a nap (move the mouse again to wake it). Position
// is mutated directly via a ref every frame (no React state per-frame) to
// keep this essentially free; `mode`/`flip` only become React state changes
// when they actually flip. Desktop only (no persistent pointer on touch).
export default function CursorCat() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CatMode>('idle');
  const [flip, setFlip] = useState(false);
  const [prints, setPrints] = useState<{ id: number; x: number; y: number; side: number }[]>([]);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const elRef = useRef<HTMLDivElement>(null);
  const catPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const lastPrintAt = useRef(0);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let sleepTimer: number | null = null;
    const wake = () => setMode((m) => (m === 'sleeping' ? 'idle' : m));
    const scheduleSleep = () => {
      if (sleepTimer) window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => setMode('sleeping'), SLEEP_AFTER_MS);
    };

    const onMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX - OFFSET_X, y: e.clientY + OFFSET_Y };
      if (!initialized.current) {
        catPos.current = { ...mousePos.current };
        initialized.current = true;
      }
      wake();
      scheduleSleep();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    scheduleSleep();

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

      const isMoving = dist > MOVE_THRESHOLD;
      setMode((m) => {
        if (m === 'sleeping') return m;
        return isMoving ? 'walking' : 'idle';
      });

      if (isMoving) {
        const now = performance.now();
        if (now - lastPrintAt.current > PAW_PRINT_INTERVAL_MS) {
          lastPrintAt.current = now;
          printId += 1;
          const id = printId;
          const side = printId % 2 === 0 ? 1 : -1;
          setPrints((p) => [...p, { id, x: catPos.current.x, y: catPos.current.y + 18, side }]);
          window.setTimeout(() => setPrints((p) => p.filter((x) => x.id !== id)), 1800);
        }
      }

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
      if (sleepTimer) window.clearTimeout(sleepTimer);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[9996]">
        {prints.map((pr) => (
          <span
            key={pr.id}
            className="paw-print absolute text-[10px]"
            style={{ left: pr.x + pr.side * 10, top: pr.y }}
            aria-hidden
          >
            🐾
          </span>
        ))}
      </div>
      <div ref={elRef} className="pointer-events-none fixed left-0 top-0 z-[9997] -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-auto">
          <Cat palette="ginger" size={52} mode={mode} flip={flip} muted={!musicPlaying} />
        </div>
      </div>
    </>
  );
}
