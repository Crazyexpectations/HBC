import { useEffect, useRef, useState } from 'react';
import Cat, { type CatMode } from './Cat';
import { useAppStore } from '../../store/useAppStore';

const OFFSET_Y = 16; // sits right next to the real cursor, not trailing far below it
const OFFSET_X = 10;
const LERP = 0.16;
const MOVE_THRESHOLD = 4;
const SLEEP_AFTER_MS = 20000;
const PAW_PRINT_INTERVAL_MS = 260;
const CATCH_MIN_MS = 16000;
const CATCH_MAX_MS = 30000;
const CATCH_DURATION_MS = 700;

let printId = 0;

// A little cat that follows your cursor around like a pet — chases it when
// you move, sits and blinks when you stop, naps if you leave it alone long
// enough (move the mouse again to wake it), and every so often makes a
// genuine playful lunge to "catch" the cursor tip before settling back down
// — like a real cat pouncing at a moving hand. Position is mutated directly
// via a ref every frame (no React state per-frame) to keep this essentially
// free; `mode`/`flip` only become React state changes when they actually
// flip. Desktop only (no persistent pointer on touch).
export default function CursorCat() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CatMode>('idle');
  const [flip, setFlip] = useState(false);
  const [pounceSignal, setPounceSignal] = useState(0);
  const [prints, setPrints] = useState<{ id: number; x: number; y: number; side: number }[]>([]);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const elRef = useRef<HTMLDivElement>(null);
  const catPos = useRef({ x: 0, y: 0 });
  const rawMouse = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const lastPrintAt = useRef(0);
  const catching = useRef(false);
  const modeRef = useRef<CatMode>(mode);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!enabled) return;

    let sleepTimer: number | null = null;
    let catchTimer: number | null = null;
    const wake = () => setMode((m) => (m === 'sleeping' ? 'idle' : m));
    const scheduleSleep = () => {
      if (sleepTimer) window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => setMode('sleeping'), SLEEP_AFTER_MS);
    };

    const applyOffset = () => {
      const [ox, oy] = catching.current ? [0, -6] : [OFFSET_X, OFFSET_Y];
      mousePos.current = { x: rawMouse.current.x - ox, y: rawMouse.current.y + oy };
    };

    const scheduleCatch = () => {
      const delay = CATCH_MIN_MS + Math.random() * (CATCH_MAX_MS - CATCH_MIN_MS);
      catchTimer = window.setTimeout(() => {
        if (document.hidden || modeRef.current === 'sleeping') {
          scheduleCatch();
          return;
        }
        catching.current = true;
        applyOffset();
        window.setTimeout(() => {
          setPounceSignal((s) => s + 1);
          catching.current = false;
          applyOffset();
          scheduleCatch();
        }, CATCH_DURATION_MS);
      }, delay);
    };

    const onMove = (e: PointerEvent) => {
      rawMouse.current = { x: e.clientX, y: e.clientY };
      applyOffset();
      if (!initialized.current) {
        catPos.current = { ...mousePos.current };
        initialized.current = true;
      }
      wake();
      scheduleSleep();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    scheduleSleep();
    scheduleCatch();

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
        return isMoving || catching.current ? 'walking' : 'idle';
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
      if (catchTimer) window.clearTimeout(catchTimer);
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
          <Cat palette="ginger" size={52} mode={mode} flip={flip} pounceSignal={pounceSignal} muted={!musicPlaying} />
        </div>
      </div>
    </>
  );
}
