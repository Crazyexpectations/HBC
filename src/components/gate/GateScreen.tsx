import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GATE } from '../../content';
import MagneticButton from '../ui/MagneticButton';
import StarsCss from '../ui/StarsCss';

const SAFE_RADIUS = 130; // px — how close is "too close" for the No button
const BUTTON_W = 140;
const BUTTON_H = 56;
const MARGIN = 24;

function randomPos() {
  const maxX = window.innerWidth - BUTTON_W - MARGIN * 2;
  const maxY = window.innerHeight - BUTTON_H - MARGIN * 2;
  return {
    x: MARGIN + Math.random() * Math.max(maxX, 0),
    y: MARGIN + Math.random() * Math.max(maxY, 0),
  };
}

export default function GateScreen() {
  const setPhase = useAppStore((s) => s.setPhase);
  const startMusic = useAppStore((s) => s.startMusic);
  const reduced = useReducedMotion();

  const noRef = useRef<HTMLButtonElement>(null);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [tease, setTease] = useState('');
  const lastDodgeRef = useRef(0);

  const bumpTease = useCallback(() => {
    setDodgeCount((c) => {
      const next = c + 1;
      setTease(GATE.teases[next % GATE.teases.length]);
      return next;
    });
  }, []);

  const flee = useCallback(() => {
    const now = performance.now();
    if (now - lastDodgeRef.current < 150) return; // debounce rapid-fire triggers
    lastDodgeRef.current = now;
    // Under reduced motion the button stays put and just refuses — the joke
    // still lands, without a control teleporting around the viewport.
    if (!reduced) setNoPos(randomPos());
    bumpTease();
  }, [reduced, bumpTease]);

  useEffect(() => {
    // initial resting spot, right next to where Yes will be
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 90;
    setNoPos({ x: centerX + 90, y: centerY - BUTTON_H / 2 });
  }, []);

  useEffect(() => {
    if (reduced) return; // no proximity chasing when motion is dialled down

    const checkProximity = (clientX: number, clientY: number) => {
      const el = noRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) < SAFE_RADIUS) flee();
    };

    const onMouseMove = (e: MouseEvent) => checkProximity(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) checkProximity(t.clientX, t.clientY);
    };
    // Previously registered inline and never removed, so every gate mount
    // leaked a resize listener holding the old setState closure.
    const onResize = () => setNoPos((p) => p ?? randomPos());

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
    };
  }, [flee, reduced]);

  const handleYes = () => {
    startMusic();
    setPhase('site');
  };

  const yesScale = Math.min(1 + dodgeCount * 0.035, 1.5);

  return (
    <motion.div
      key="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 1.05, transition: { duration: 0.6, ease: 'easeInOut' } }}
      transition={{ duration: 0.8 }}
      className="grain fixed inset-0 z-[250] flex flex-col items-center justify-center overflow-hidden bg-night-deep px-6 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(160deg,#0a050c,#241432 45%,#120a14 100%)' }}
      />
      <StarsCss />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 32%, rgba(232,62,99,0.22), transparent 62%)' }}
      />

      <motion.h1
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="heading-section text-glow relative z-10 text-cream"
      >
        {GATE.question}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 mt-4 text-[length:var(--text-step--1)] text-cream/60"
      >
        (there's only one correct answer, just so you know)
      </motion.p>

      <div className="relative z-10 mt-12 flex items-center gap-8">
        <MagneticButton
          onClick={handleYes}
          strength={reduced ? 0 : 0.5}
          style={{ scale: yesScale }}
          className="rounded-full bg-gradient-to-r from-rose to-rose-deep px-10 py-4 text-lg font-semibold text-white shadow-2xl shadow-rose/30 transition-[scale,box-shadow] duration-300 hover:shadow-rose/50"
        >
          {GATE.yes} 💗
        </MagneticButton>
      </div>

      {noPos && (
        <button
          ref={noRef}
          data-cursor="hover"
          onMouseEnter={flee}
          onClick={(e) => {
            e.preventDefault();
            flee();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            flee();
          }}
          style={reduced ? undefined : { left: noPos.x, top: noPos.y }}
          className={
            reduced
              ? 'relative z-20 mt-6 rounded-full border border-white/20 bg-white/5 px-9 py-4 text-lg font-semibold text-cream/80 backdrop-blur'
              : 'fixed z-20 rounded-full border border-white/20 bg-white/5 px-9 py-4 text-lg font-semibold text-cream/80 backdrop-blur transition-all duration-300 ease-out'
          }
        >
          {GATE.no}
        </button>
      )}

      <div className="relative z-10 mt-16 h-6" aria-live="polite">
        {dodgeCount > 0 && (
          <motion.p
            key={tease}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-script text-[length:var(--text-step-1)] text-gold-soft"
          >
            {tease}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
