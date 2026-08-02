import { useEffect, useRef, useState } from 'react';
import Cat, { CAT_PALETTES, type CatMode } from './Cat';
import Mouse from './Mouse';
import { useAppStore } from '../../store/useAppStore';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  size?: number;
  /** This cat occasionally notices the cursor nearby and makes a short playful dash to "catch" it. */
  chasesCursor?: boolean;
  startDelay?: number;
}

const MAX_WALK_SPEED = 60; // px/sec, top speed once fully accelerated
const MAX_CHASE_SPEED = 115;
const ACCEL = 260; // px/sec^2 — how fast it ramps up to top speed
const DECEL_RADIUS = 46; // start easing off the speed within this many px of target
const ARRIVE_DIST = 5;
const CHASE_GIVE_UP_MS = 4000;
const CHASE_COOLDOWN_MS = 24000;
const CHASE_TRIGGER_RADIUS = 170;
const CHASE_CHECK_MS = 350;

type Activity = 'sit' | 'sleep' | 'lay' | 'dance' | 'hunt';
const ACTIVITY_WEIGHTS: [Activity, number][] = [
  ['sit', 5],
  ['hunt', 3],
  ['dance', 2],
  ['lay', 2],
  ['sleep', 1],
];
function pickActivity(): Activity {
  const total = ACTIVITY_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [a, w] of ACTIVITY_WEIGHTS) {
    if (r < w) return a;
    r -= w;
  }
  return 'sit';
}
function activityToMode(a: Activity): CatMode {
  if (a === 'sleep') return 'sleeping';
  if (a === 'lay') return 'laying';
  if (a === 'dance') return 'dancing';
  return 'idle';
}

// A cat that's free to wander anywhere within its section — not pinned to a
// strip along the bottom. It picks a random spot, walks there (accelerating
// out of a stop and easing to a halt on arrival, not snapping to a constant
// speed), then stops to sit, nap, lounge, dance, or hunt a little scurrying
// mouse before moving on — every cat gets a turn at all of these. Cats
// flagged `chasesCursor` will, every so often, notice your cursor nearby and
// make a genuine dash to catch it (capped so it stays a fun surprise, not a
// constant nuisance). Works on touch too (tap to pounce/pet).
export default function RoamingCat({ palette = 'charcoal', size = 46, chasesCursor = false, startDelay = 2 }: Props) {
  const [mode, setMode] = useState<CatMode>('idle');
  const [flip, setFlip] = useState(false);
  const [ready, setReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [pounceSignal, setPounceSignal] = useState(0);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const catElRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const speedRef = useRef(0);
  const phaseRef = useRef<'walk' | 'pause' | 'chase'>('walk');
  const lastFlipRef = useRef(false);
  const cursorClient = useRef<{ x: number; y: number } | null>(null);
  const lastChaseAt = useRef(0);
  const chaseStartedAt = useRef(0);
  const visibleRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let pauseTimer: number | null = null;
    let startTimer: number | null = null;
    let chaseCheckInterval: number | null = null;
    let lastTime = performance.now();

    // Pause the whole physics loop while this cat's section is scrolled out
    // of view — with several cats on the page, letting all of them keep
    // ticking (and their SVGs re-rendering blink/tail/paw animations) even
    // when nobody can see them adds up fast. Mirrors how SceneCanvas pauses
    // its WebGL render loop off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entry.isIntersecting;
        setIsVisible(entry.isIntersecting);
        if (visibleRef.current && !wasVisible && readyRef.current && raf === 0) {
          lastTime = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const pickWaypoint = (awayFrom?: { x: number; y: number }) => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      let x = rand(w * 0.06, w * 0.94);
      let y = rand(h * 0.35, h * 0.94);
      if (awayFrom) {
        // bias the pick toward whichever half is farther from a given point
        x = awayFrom.x < w / 2 ? rand(w * 0.55, w * 0.94) : rand(w * 0.06, w * 0.45);
      }
      target.current = { x, y };
      speedRef.current = 0; // start each new walk from rest — accelerate into it
    };

    const startPause = () => {
      phaseRef.current = 'pause';
      const activity = pickActivity();
      if (activity === 'hunt') {
        setMode('idle');
        const mx = pos.current.x + rand(-55, 55);
        const my = pos.current.y + rand(-35, 35);
        setMousePos({ x: Math.max(14, mx), y: Math.max(14, my) });
        let pounces = 0;
        const pounceInterval = window.setInterval(() => {
          setPounceSignal((s) => s + 1);
          pounces += 1;
          if (pounces >= 2) window.clearInterval(pounceInterval);
        }, 1100);
        pauseTimer = window.setTimeout(() => {
          window.clearInterval(pounceInterval);
          setMousePos(null);
          pickWaypoint();
          phaseRef.current = 'walk';
        }, 2600);
      } else {
        setMode(activityToMode(activity));
        const dur = 2200 + Math.random() * 4200;
        pauseTimer = window.setTimeout(() => {
          pickWaypoint();
          phaseRef.current = 'walk';
        }, dur);
      }
    };

    // init position + first target
    pos.current = { x: rand(0, container.clientWidth || 300), y: (container.clientHeight || 300) * 0.75 };
    pickWaypoint();

    const onCursorMove = (e: PointerEvent) => {
      cursorClient.current = { x: e.clientX, y: e.clientY };
    };
    if (chasesCursor && !isMobile) {
      window.addEventListener('pointermove', onCursorMove, { passive: true });
      // Throttled check (not per-frame) — a cheap distance test that decides
      // whether to *start* a chase; the chase itself runs in the rAF loop.
      chaseCheckInterval = window.setInterval(() => {
        if (!visibleRef.current || phaseRef.current === 'chase' || !cursorClient.current) return;
        const now = performance.now();
        if (now - lastChaseAt.current < CHASE_COOLDOWN_MS) return;
        const rect = container.getBoundingClientRect();
        const catViewportX = rect.left + pos.current.x;
        const catViewportY = rect.top + pos.current.y;
        const dist = Math.hypot(cursorClient.current.x - catViewportX, cursorClient.current.y - catViewportY);
        if (dist < CHASE_TRIGGER_RADIUS && Math.random() < 0.35) {
          if (pauseTimer) window.clearTimeout(pauseTimer);
          phaseRef.current = 'chase';
          chaseStartedAt.current = now;
          lastChaseAt.current = now;
          speedRef.current = 0;
          setMode('walking');
        }
      }, CHASE_CHECK_MS);
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (phaseRef.current === 'chase') {
        const rect = container.getBoundingClientRect();
        if (cursorClient.current) {
          target.current = { x: cursorClient.current.x - rect.left, y: cursorClient.current.y - rect.top };
        }
        if (now - chaseStartedAt.current > CHASE_GIVE_UP_MS) {
          phaseRef.current = 'walk';
          pickWaypoint(pos.current);
        }
      }

      if (phaseRef.current === 'walk' || phaseRef.current === 'chase') {
        const dx = target.current.x - pos.current.x;
        const dy = target.current.y - pos.current.y;
        const dist = Math.hypot(dx, dy);
        const topSpeed = phaseRef.current === 'chase' ? MAX_CHASE_SPEED : MAX_WALK_SPEED;

        if (dist < ARRIVE_DIST) {
          if (phaseRef.current === 'chase') {
            setPounceSignal((s) => s + 1);
            phaseRef.current = 'walk';
            pickWaypoint();
          } else {
            startPause();
          }
        } else {
          // Real acceleration out of a stop, and easing off as it nears the
          // target, instead of snapping to a constant speed — this is the
          // bit that makes the walk read as physical rather than robotic.
          const desiredSpeed = dist < DECEL_RADIUS ? topSpeed * Math.max(0.22, dist / DECEL_RADIUS) : topSpeed;
          if (speedRef.current < desiredSpeed) {
            speedRef.current = Math.min(desiredSpeed, speedRef.current + ACCEL * dt);
          } else {
            speedRef.current = Math.max(desiredSpeed, speedRef.current - ACCEL * 1.6 * dt);
          }
          pos.current.x += (dx / dist) * speedRef.current * dt;
          pos.current.y += (dy / dist) * speedRef.current * dt;
          if (Math.abs(dx) > 2) {
            const nextFlip = dx < 0;
            if (nextFlip !== lastFlipRef.current) {
              lastFlipRef.current = nextFlip;
              setFlip(nextFlip);
            }
          }
          setMode((m) => (m === 'walking' ? m : 'walking'));
        }
      }

      if (catElRef.current) {
        catElRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      // Stop rescheduling once off-screen; the IntersectionObserver above
      // restarts the loop when this section scrolls back into view.
      raf = visibleRef.current ? requestAnimationFrame(tick) : 0;
    };

    startTimer = window.setTimeout(() => {
      setReady(true);
      readyRef.current = true;
      if (visibleRef.current) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }, startDelay * 1000);

    return () => {
      if (startTimer) window.clearTimeout(startTimer);
      if (pauseTimer) window.clearTimeout(pauseTimer);
      if (chaseCheckInterval) window.clearInterval(chaseCheckInterval);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onCursorMove);
    };
  }, [chasesCursor, isMobile, startDelay]);

  // While scrolled off-screen, skip rendering the cat's (fairly detailed)
  // SVG entirely rather than just hiding it — with 7 of these on the page,
  // the React reconciliation cost of their mode-driven re-renders adds up
  // even when nothing is visibly animating. The position/physics state
  // lives in refs on this component, so nothing is lost by unmounting Cat.
  const shouldRenderCat = ready && isVisible;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {shouldRenderCat && mousePos && <Mouse x={mousePos.x} y={mousePos.y} />}
      <div
        ref={catElRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >
        <div className="pointer-events-auto">
          {shouldRenderCat && (
            <Cat palette={palette} size={size} mode={mode} flip={flip} pounceSignal={pounceSignal} muted={!musicPlaying} />
          )}
        </div>
      </div>
    </div>
  );
}
