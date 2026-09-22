import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../lib/motion';

interface Props {
  src: string;
  thumb: string;
  caption: string;
  index: number;
  onOpen: () => void;
}

// Deterministic "tossed onto a table" rotation — stable across re-renders so
// photos don't reshuffle themselves whenever React re-renders the grid.
function scatterFor(index: number) {
  const seed = (index * 137.5) % 360;
  return ((seed % 14) - 7) * 1.4;
}

export default function PolaroidCard({ src, thumb, caption, index, onOpen }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const baseRotate = reduced ? 0 : scatterFor(index);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 220, damping: 18 });
  const springY = useSpring(ry, { stiffness: 220, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rx.set((e.clientX - rect.left) / rect.width - 0.5);
    ry.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 50, rotate: baseRotate * 2, scale: 0.92 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: baseRotate, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="group relative mb-5 break-inside-avoid"
      style={{ perspective: 900 }}
    >
      <motion.button
        ref={ref}
        type="button"
        data-cursor="hover"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onOpen}
        aria-label={`Open photo: ${caption}`}
        whileHover={reduced ? undefined : { scale: 1.045, zIndex: 20 }}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative block w-full cursor-pointer rounded-sm bg-cream p-3 pb-12 text-left shadow-xl shadow-black/40"
      >
        <div className="overflow-hidden rounded-[2px] bg-midnight/10">
          <img
            src={thumb}
            srcSet={`${thumb} 700w, ${src} 1920w`}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
            alt={caption}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            style={reduced ? undefined : { transform: 'translateZ(20px)' }}
          />
        </div>
        <span
          className="font-script absolute bottom-2.5 left-0 right-0 block truncate px-3 text-center text-[length:var(--text-step-0)] text-midnight/80"
          style={reduced ? undefined : { transform: 'translateZ(20px)' }}
        >
          {caption}
        </span>
      </motion.button>
    </motion.div>
  );
}
