import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { LOADING_LINES, MEMORIES } from '../../content';

const BASE = import.meta.env.BASE_URL;
const PRELOAD_COUNT = 6; // first few thumbnails, enough to feel instant

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

// Rendered by App while phase === 'loading'; App wraps the whole phase switch
// in its own <AnimatePresence>, so this component's `exit` prop is honored
// automatically when it gets swapped out for the gate screen.
export default function LoadingScreen() {
  const setPhase = useAppStore((s) => s.setPhase);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((i) => (i + 1) % LOADING_LINES.length);
    }, 900);
    return () => clearInterval(lineTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const assets = [
      document.fonts.ready.catch(() => {}),
      ...MEMORIES.slice(0, PRELOAD_COUNT).map((m) => preloadImage(`${BASE}${m.thumb}`)),
    ];

    let loaded = 0;
    const total = assets.length;

    assets.forEach((p) => {
      Promise.resolve(p).then(() => {
        loaded += 1;
        if (!cancelled) setProgress(Math.round((loaded / total) * 100));
      });
    });

    Promise.all(assets).then(async () => {
      const elapsed = performance.now() - started;
      const minDuration = 1800; // keep it cinematic even on a fast connection
      if (elapsed < minDuration) {
        await new Promise((r) => setTimeout(r, minDuration - elapsed));
      }
      if (!cancelled) {
        setProgress(100);
        setTimeout(() => !cancelled && setPhase('gate'), 400);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [setPhase]);

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
      className="grain fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-night-deep"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(232,62,99,0.15),transparent_60%)]"
      />

      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8 text-5xl"
        aria-hidden
      >
        💗
      </motion.div>

      <h1 className="font-script mb-2 text-3xl text-rose-light md:text-4xl">for Cherry</h1>

      <div className="mt-6 h-[3px] w-56 overflow-hidden rounded-full bg-white/10 md:w-72">
        <motion.div
          className="h-full bg-gradient-to-r from-rose via-rose-light to-gold"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="mt-4 text-xs uppercase tracking-[0.25em] text-cream/50"
        >
          {LOADING_LINES[lineIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
