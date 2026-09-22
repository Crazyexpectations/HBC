import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MEMORIES } from '../../content';

interface Props {
  index: number | null;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}

const BASE = import.meta.env.BASE_URL;
const SWIPE_THRESHOLD = 60;

export default function Lightbox({ index, onClose, onNav }: Props) {
  const reduced = useReducedMotion();
  const open = index !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Remembers what was focused before opening so focus can be handed back on
  // close — without this, keyboard users get dumped at the top of the document.
  const restoreRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
      // Minimal focus trap: the dialog only contains buttons, so cycling
      // between the first and last is enough to keep focus inside.
      if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onNav]);

  // Lock background scroll while open. Lenis drives a virtual scroll, so
  // without this the page keeps gliding underneath the photo.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Warm the neighbouring full-size images so arrowing through the album
  // doesn't flash a blank frame on every step.
  useEffect(() => {
    if (index === null) return;
    for (const d of [1, -1]) {
      const n = MEMORIES[(index + d + MEMORIES.length) % MEMORIES.length];
      const img = new Image();
      img.src = `${BASE}${n.src}`;
    }
  }, [index]);

  const item = index !== null ? MEMORIES[index] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${(index ?? 0) + 1} of ${MEMORIES.length}: ${item.caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > SWIPE_THRESHOLD) onNav(dx < 0 ? 1 : -1);
          }}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
        >
          <button
            ref={closeRef}
            data-cursor="hover"
            onClick={onClose}
            aria-label="Close photo"
            className="glass absolute right-5 top-5 z-10 rounded-full px-4 py-2 text-sm text-cream"
          >
            close ✕
          </button>

          <button
            data-cursor="hover"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); onNav(-1); }}
            className="glass absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-4 py-3 text-xl text-cream sm:left-6"
          >
            ‹
          </button>
          <button
            data-cursor="hover"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); onNav(1); }}
            className="glass absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-4 py-3 text-xl text-cream sm:right-6"
          >
            ›
          </button>

          <motion.figure
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88, rotate: -2 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="m-0 max-h-[85vh] max-w-[90vw] rounded-sm bg-cream p-3 pb-6 shadow-2xl sm:max-w-lg"
          >
            <img
              src={`${BASE}${item.src}`}
              alt={item.caption}
              className="max-h-[68vh] w-full rounded-[2px] object-contain"
            />
            <figcaption className="mt-3 text-center">
              <span className="font-script block text-[length:var(--text-step-1)] text-midnight/85">
                {item.caption}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-midnight/35">
                {(index ?? 0) + 1} / {MEMORIES.length}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
