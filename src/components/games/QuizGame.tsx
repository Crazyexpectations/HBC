import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QUIZ } from '../../content';

type Phase = 'quiz' | 'results';

// "How well do you know us" — answer a few personal questions, and a
// perfect score pops the lid off the gift box underneath. Replaces the
// falling-hearts arcade game with something that rewards actually knowing
// each other instead of reflexes.
export default function QuizGame() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [everUnlocked, setEverUnlocked] = useState(false);

  const total = QUIZ.questions.length;
  const current = QUIZ.questions[index];
  const isPerfect = correctCount === total;

  useEffect(() => {
    if (phase === 'results' && isPerfect && !everUnlocked) {
      setEverUnlocked(true);
    }
  }, [phase, isPerfect, everUnlocked]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const wasCorrect = i === current.correctIndex;
    if (wasCorrect) setCorrectCount((c) => c + 1);

    window.setTimeout(() => {
      if (index + 1 < total) {
        setIndex((n) => n + 1);
        setSelected(null);
      } else {
        setPhase('results');
      }
    }, 850);
  };

  const reset = () => {
    setPhase('quiz');
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
  };

  return (
    <div className="glass w-full max-w-xl rounded-2xl p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl text-cream sm:text-2xl">{QUIZ.title}</h3>
        {phase === 'quiz' && (
          <span className="text-xs text-cream/60">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {phase === 'quiz' && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-rose-light/70">{QUIZ.subtitle}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4 text-base font-medium text-cream sm:text-lg">{current.question}</p>
              <div className="flex flex-col gap-2.5">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === current.correctIndex;
                  const showState = selected !== null;
                  return (
                    <button
                      key={i}
                      data-cursor="hover"
                      disabled={selected !== null}
                      onClick={() => handleAnswer(i)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        showState && isCorrect
                          ? 'border-gold bg-gold/15 text-gold-soft'
                          : showState && isSelected
                            ? 'border-rose bg-rose/15 text-rose-light'
                            : 'border-cream/15 bg-cream/5 text-cream/85 hover:bg-cream/10'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === 'results' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="font-script text-3xl text-gold-soft">
            {correctCount} / {total}
          </p>
          <p className="mt-2 text-sm text-cream/75">{isPerfect ? QUIZ.perfectTitle : QUIZ.tryAgainText}</p>
          <button data-cursor="hover" onClick={reset} className="glass mt-4 rounded-full px-5 py-2 text-sm text-cream">
            play again
          </button>
        </motion.div>
      )}

      <GiftBoxReveal unlocked={everUnlocked} />
    </div>
  );
}

function GiftBoxReveal({ unlocked }: { unlocked: boolean }) {
  useEffect(() => {
    if (!unlocked) return;
    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 32,
      origin: { y: 0.7 },
      colors: ['#e0355c', '#f0b854', '#f5a8b8'],
    });
  }, [unlocked]);

  return (
    <div className="mt-6 flex flex-col items-center border-t border-cream/10 pt-6">
      <div className="relative h-24 w-28">
        <svg viewBox="0 0 120 100" width="100%" height="100%">
          {/* shadow */}
          <ellipse cx="60" cy="92" rx="38" ry="6" fill="#000" opacity="0.25" />
          {/* box body */}
          <rect x="22" y="48" width="76" height="42" rx="4" fill="var(--color-rose-deep)" />
          <rect x="52" y="48" width="16" height="42" fill="var(--color-gold)" />
          {/* lid + bow — pops off and fades when unlocked */}
          <motion.g
            animate={unlocked ? { y: -46, x: 10, rotate: -18, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 170, damping: 15 }}
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

      <AnimatePresence>
        {unlocked ? (
          <motion.p
            key="unlocked"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-3 max-w-sm text-center text-sm text-cream/85"
          >
            {QUIZ.perfectText}
          </motion.p>
        ) : (
          <p key="locked" className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-cream/40">
            perfect score to open
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
