import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LetterPaper from './LetterPaper';
import { LETTER } from '../../content';

type Stage = 'closed' | 'opening' | 'expanded';

interface Props {
  /** Fires once the paper has actually unfolded, so the section can stop
   *  centring itself in one viewport and let the letter run as long as it is. */
  onExpand?: () => void;
}

export default function Envelope({ onExpand }: Props) {
  const [stage, setStage] = useState<Stage>('closed');

  const open = () => {
    if (stage !== 'closed') return;
    setStage('opening');
    setTimeout(() => {
      setStage('expanded');
      onExpand?.();
    }, 750);
  };

  return (
    <div className="relative z-10 flex w-full flex-col items-center" style={{ perspective: 1400 }}>
      <AnimatePresence mode="wait">
        {stage !== 'expanded' ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
            className="relative"
          >
            {/* A real button, not a clickable div — this is the single most
                important thing to open on the page, and it used to be
                unreachable by keyboard entirely. */}
            <motion.button
              type="button"
              onClick={open}
              aria-label="Open the letter"
              data-cursor="hover"
              whileHover={stage === 'closed' ? { y: -6, scale: 1.02 } : {}}
              className="relative block h-52 w-72 cursor-pointer sm:h-64 sm:w-96"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* envelope body */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#7a1830] to-[#4a1220] shadow-2xl shadow-black/60" />

              {/* letter peeking out */}
              <motion.div
                layoutId="letter-paper"
                className="absolute left-3 right-3 top-3 rounded-md bg-cream shadow-inner"
                style={{ bottom: 10 }}
                animate={{ y: stage === 'opening' ? -26 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* bottom fold */}
              <div
                className="absolute inset-x-0 bottom-0 rounded-b-lg"
                style={{
                  height: '55%',
                  background: 'linear-gradient(315deg,#9c1f3f,#4a1220)',
                  clipPath: 'polygon(0 100%, 100% 100%, 50% 20%)',
                  zIndex: 3,
                }}
              />

              {/* flap */}
              <motion.div
                className="absolute left-0 top-0 w-full"
                style={{
                  height: '58%',
                  background: 'linear-gradient(135deg,#e0355c,#9c1f3f)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: 4,
                }}
                animate={{ rotateX: stage === 'opening' ? 180 : 0 }}
                transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* wax seal */}
              <motion.div
                animate={{ opacity: stage === 'closed' ? 1 : 0, scale: stage === 'closed' ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 top-[38%] z-[5] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-lg shadow-lg"
              >
                ❤
              </motion.div>
            </motion.button>

            {stage === 'closed' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {LETTER.openHint}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <LetterPaper key="letter" />
        )}
      </AnimatePresence>
    </div>
  );
}
