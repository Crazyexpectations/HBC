import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, EASE_POP } from '../../lib/motion';
import { WISHES } from '../../content';

const ORDINALS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * Five wishes, sealed. She opens them one at a time and the last one pops the
 * lid off the gift box underneath.
 *
 * This replaced a "how well do you know us" trivia quiz. The quiz had a
 * failure state — a wrong answer scored her out of the gift — which is the
 * one thing the letter it sits under explicitly promises today won't have.
 * There's nothing to get wrong here; the only thing gating the box is
 * whether she's read all five.
 */
export default function WishList() {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState<boolean[]>(() => WISHES.items.map(() => false));

  const total = WISHES.items.length;
  const openCount = opened.filter(Boolean).length;
  const allOpen = openCount === total;

  const open = (i: number) => {
    setOpened((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  return (
    <section className="surface w-full rounded-2xl p-5 sm:p-7" aria-labelledby="wishes-title">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h3 id="wishes-title" className="font-display text-[length:var(--text-step-1)] text-cream">
          {WISHES.title}
        </h3>
        <span className="shrink-0 text-xs tabular-nums text-cream/55">
          {openCount} / {total}
        </span>
      </div>

      <p className="mb-5 text-xs uppercase tracking-[0.2em] text-rose-light/70">{WISHES.subtitle}</p>

      {/* The fifth card spans both columns, so five items land as a composed
          block instead of a 2×2 grid with an orphan stuck under it. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WISHES.items.map((wish, i) => (
          <WishCard
            key={wish.title}
            wish={wish}
            index={i}
            isOpen={opened[i]}
            onOpen={() => open(i)}
            reduced={reduced}
            className={i === total - 1 && total % 2 === 1 ? 'sm:col-span-2' : ''}
          />
        ))}
      </div>

      <GiftBoxReveal unlocked={allOpen} reduced={reduced} />
    </section>
  );
}

interface CardProps {
  wish: { emoji: string; title: string; text: string };
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  reduced: boolean;
  className?: string;
}

function WishCard({ wish, index, isOpen, onOpen, reduced, className = '' }: CardProps) {
  const label = `Wish ${ORDINALS[index] ?? index + 1}`;

  return (
    <motion.button
      type="button"
      layout={!reduced}
      data-cursor="hover"
      onClick={onOpen}
      aria-expanded={isOpen}
      aria-label={isOpen ? undefined : `${label}, tap to open`}
      whileHover={reduced || isOpen ? undefined : { y: -3 }}
      whileTap={reduced || isOpen ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`flex min-h-[112px] flex-col justify-center rounded-xl border px-4 py-4 text-left transition-colors ${
        isOpen
          ? 'cursor-default border-gold/35 bg-gold/10'
          : 'border-cream/15 bg-cream/5 hover:bg-cream/10'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="open"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
            className="block"
          >
            <span className="mb-1.5 block text-xl leading-none" aria-hidden>
              {wish.emoji}
            </span>
            <span className="block font-display text-[length:var(--text-step-0)] leading-snug text-gold-soft">
              {wish.title}
            </span>
            <span className="mt-1.5 block text-[length:var(--text-step--1)] leading-relaxed text-cream/75">
              {wish.text}
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="sealed"
            initial={false}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <motion.span
              aria-hidden
              className="text-2xl leading-none"
              animate={reduced ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 }}
            >
              🎁
            </motion.span>
            <span className="eyebrow text-[10px] text-cream/45">{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Carried over from the quiz this replaced — the lid pops off and drifts away
 * rather than hinging open, which at this size just read as a flat slab
 * rotating through the box.
 */
function GiftBoxReveal({ unlocked, reduced }: { unlocked: boolean; reduced: boolean }) {
  useEffect(() => {
    if (!unlocked || reduced) return;
    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 32,
      origin: { y: 0.7 },
      colors: ['#e83e63', '#f2bc5c', '#f7b3c1'],
    });
  }, [unlocked, reduced]);

  return (
    <div className="mt-6 flex flex-col items-center border-t border-cream/10 pt-6">
      <div className="relative h-24 w-28">
        <svg viewBox="0 0 120 100" width="100%" height="100%" aria-hidden>
          <ellipse cx="60" cy="92" rx="38" ry="6" fill="#000" opacity="0.25" />
          <rect x="22" y="48" width="76" height="42" rx="4" fill="var(--color-rose-deep)" />
          <rect x="52" y="48" width="16" height="42" fill="var(--color-gold)" />
          <motion.g
            animate={
              unlocked
                ? reduced
                  ? { opacity: 0 }
                  : { y: -46, x: 10, rotate: -18, opacity: 0 }
                : { y: 0, x: 0, rotate: 0, opacity: 1 }
            }
            transition={reduced ? { duration: 0.2 } : { type: 'spring', stiffness: 170, damping: 15 }}
          >
            <rect x="16" y="36" width="88" height="16" rx="4" fill="var(--color-gold)" />
            <g transform="translate(60 32)">
              <path d="M0 0 L-10 -7 L-10 6 Z" fill="var(--color-rose)" />
              <path d="M0 0 L10 -7 L10 6 Z" fill="var(--color-rose)" />
              <circle cx="0" cy="0" r="3.5" fill="var(--color-rose)" />
            </g>
          </motion.g>
        </svg>
        {!unlocked && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-lg" aria-hidden>
            🔒
          </span>
        )}
      </div>

      <div aria-live="polite">
        {unlocked ? (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: EASE_POP }}
            className="mt-3 text-center"
          >
            <p className="font-script text-[length:var(--text-step-1)] text-gold-soft">{WISHES.doneTitle}</p>
            <p className="measure-tight mt-1 text-[length:var(--text-step--1)] text-cream/85">
              {WISHES.doneText}
            </p>
          </motion.div>
        ) : (
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-cream/40">
            {WISHES.lockedHint}
          </p>
        )}
      </div>
    </div>
  );
}
