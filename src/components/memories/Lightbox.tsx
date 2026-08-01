import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { MEMORIES } from '../../content';

interface Props {
  index: number | null;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}

const BASE = import.meta.env.BASE_URL;

export default function Lightbox({ index, onClose, onNav }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  const item = index !== null ? MEMORIES[index] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <motion.button
            data-cursor="hover"
            onClick={onClose}
            className="glass absolute right-5 top-5 z-10 rounded-full px-4 py-2 text-sm text-cream"
          >
            close ✕
          </motion.button>

          <button
            data-cursor="hover"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            className="glass absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-4 py-3 text-cream sm:left-6"
          >
            ‹
          </button>
          <button
            data-cursor="hover"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            className="glass absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-4 py-3 text-cream sm:right-6"
          >
            ›
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-sm bg-cream p-3 pb-8 shadow-2xl sm:max-w-md"
          >
            <img
              src={`${BASE}${item.src}`}
              alt={item.caption}
              className="max-h-[70vh] w-full rounded-[2px] object-contain"
            />
            <p className="font-script mt-3 text-center text-2xl text-midnight/80">{item.caption}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
