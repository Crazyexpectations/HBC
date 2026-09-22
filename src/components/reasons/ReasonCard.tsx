import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../lib/motion';

interface Props {
  emoji: string;
  title: string;
  text: string;
  index: number;
  featured?: boolean;
}

const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });

function burst(x: number, y: number) {
  confetti({
    particleCount: 26,
    spread: 70,
    startVelocity: 28,
    scalar: 0.9,
    shapes: [heart],
    colors: ['#e83e63', '#9c1f3f', '#f7b3c1'],
    origin: { x, y },
    gravity: 0.9,
    ticks: 130,
  });
}

export default function ReasonCard({ emoji, title, text, index, featured = false }: Props) {
  const reduced = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Skipped under reduced motion: a burst of physics-driven particles is
    // exactly the kind of thing the preference is asking us not to do.
    if (reduced) return;
    burst(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
  };

  return (
    <motion.button
      type="button"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.94 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: EASE }}
      whileHover={reduced ? undefined : { y: -8, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
      onClick={handleClick}
      data-cursor="hover"
      className={[
        'surface group relative flex cursor-pointer flex-col rounded-2xl p-5 text-left transition-shadow hover:shadow-rose/20 sm:p-6',
        featured ? 'col-span-2 sm:col-span-2' : '',
      ].join(' ')}
    >
      {/* Index numeral — gives the set a sense of being a real enumerated list
          instead of a scatter of emoji tiles. */}
      <span className="font-display absolute right-4 top-3 text-[length:var(--text-step-1)] leading-none text-gold-soft/20">
        {String(index + 1).padStart(2, '0')}
      </span>

      <motion.span
        className="mb-3 block text-3xl"
        whileHover={reduced ? undefined : { scale: 1.25, rotate: [0, -9, 9, 0] }}
        transition={{ duration: 0.5 }}
        aria-hidden
      >
        {emoji}
      </motion.span>

      <h3 className="font-display mb-1.5 text-[length:var(--text-step-1)] font-semibold leading-snug text-rose-light">
        {title}
      </h3>
      <p className="text-[length:var(--text-step--1)] leading-relaxed text-cream/72">{text}</p>
    </motion.button>
  );
}
