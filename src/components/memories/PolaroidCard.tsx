import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  src: string;
  thumb: string;
  caption: string;
  index: number;
  onOpen: () => void;
}

// A deterministic "scatter" so the grid looks like photos tossed onto a
// table rather than a rigid grid, but stays stable across re-renders.
function scatterFor(index: number) {
  const seed = (index * 137.5) % 360;
  const rot = ((seed % 14) - 7) * 1.4;
  return rot;
}

export default function PolaroidCard({ src, thumb, caption, index, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const baseRotate = scatterFor(index);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 220, damping: 18 });
  const springY = useSpring(ry, { stiffness: 220, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      initial={{ opacity: 0, y: 60, rotate: baseRotate * 2.2, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: baseRotate, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mb-6 break-inside-avoid"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        data-cursor="hover"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onOpen}
        whileHover={{ scale: 1.05, zIndex: 20 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative cursor-pointer rounded-sm bg-cream p-3 pb-14 shadow-xl shadow-black/40"
      >
        <div className="overflow-hidden rounded-[2px] bg-midnight/10">
          <img
            src={thumb}
            srcSet={`${thumb} 700w, ${src} 1920w`}
            sizes="(max-width: 640px) 45vw, 320px"
            alt={caption}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ transform: 'translateZ(20px)' }}
          />
        </div>
        <p
          className="font-script absolute bottom-3 left-0 right-0 text-center text-lg text-midnight/80"
          style={{ transform: 'translateZ(20px)' }}
        >
          {caption}
        </p>
      </motion.div>
    </motion.div>
  );
}
