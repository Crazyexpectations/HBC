import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import Reveal from '../layout/Reveal';
import { useAppStore } from '../../store/useAppStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, riseIn } from '../../lib/motion';
import { VIDEO } from '../../content';

const BASE = import.meta.env.BASE_URL;
const HOLD = 'video';

/**
 * The video, sealed behind a cover until she taps it.
 *
 * Three things are load-bearing here:
 *
 * 1. `preload="none"`. This is a six-to-seven minute file and she will open
 *    the page on mobile data. Nothing is fetched until she asks for it.
 * 2. `play()` is called synchronously inside the click handler, before any
 *    state update. Browsers only allow audio to start from a real gesture,
 *    and deferring the call past a render (or into rAF) loses that gesture —
 *    the video would start muted or not at all.
 * 3. The song is held for as long as this is playing, so she isn't hearing
 *    two things at once, and released when it ends.
 */
export default function VideoSection() {
  const holdAudio = useAppStore((s) => s.holdAudio);
  const releaseAudio = useAppStore((s) => s.releaseAudio);
  const reduced = useReducedMotion();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [opened, setOpened] = useState(false);
  const [failed, setFailed] = useState(false);

  // Whatever happens — she navigates away mid-video, the component unmounts —
  // the song must not stay ducked forever.
  useEffect(() => () => releaseAudio(HOLD), [releaseAudio]);

  const openAndPlay = () => {
    const video = videoRef.current;
    // Synchronous, inside the gesture. See note 2 above.
    video?.play().catch(() => {});
    setOpened(true);
  };

  return (
    <Section id="video" tone="warm" density="full" label={VIDEO.title}>
      <SectionHeading eyebrow={VIDEO.eyebrow} title={VIDEO.title} className="mb-10" />

      <Reveal variants={riseIn(24)} className="relative z-10 w-full max-w-3xl">
        {/* The frame. Gold hairline + corner marks so the black panel reads as
            something presented to her, rather than an empty box on the page. */}
        <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-black shadow-2xl shadow-black/70">
          <Corners />

          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full bg-black object-contain"
              src={`${BASE}${VIDEO.src}`}
              preload="none"
              playsInline
              controls={opened}
              onPlay={() => holdAudio(HOLD)}
              onPause={() => releaseAudio(HOLD)}
              onEnded={() => releaseAudio(HOLD)}
              onError={() => setFailed(true)}
            />

            <AnimatePresence>
              {!opened && (
                <motion.button
                  key="cover"
                  type="button"
                  data-cursor="hover"
                  onClick={openAndPlay}
                  exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.5, ease: EASE } }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 70% at 50% 45%, rgba(109,31,48,0.92), rgba(10,5,12,0.97) 70%)',
                  }}
                  aria-label={`${VIDEO.coverTitle}. ${VIDEO.coverLines.join('. ')}`}
                >
                  <motion.span
                    aria-hidden
                    className="text-3xl leading-none sm:text-4xl"
                    animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🎬
                  </motion.span>

                  <span className="font-script text-[length:var(--text-step-2)] leading-none text-gold-soft">
                    {VIDEO.coverTitle}
                  </span>

                  <span className="flex flex-col gap-1">
                    {VIDEO.coverLines.map((line) => (
                      <span
                        key={line}
                        className="text-[length:var(--text-step--1)] text-cream/80"
                      >
                        {line}
                      </span>
                    ))}
                  </span>

                  <span className="glass mt-2 rounded-full px-7 py-3 text-sm font-semibold text-cream">
                    {VIDEO.coverButton}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p
          className="mt-4 text-center text-[length:var(--text-step--1)] text-cream/55"
          aria-live="polite"
        >
          {failed ? VIDEO.failed : opened ? VIDEO.playingNote : VIDEO.coverLines[1]}
        </p>
      </Reveal>
    </Section>
  );
}

/** Four corner marks, like a frame around something being shown. */
function Corners() {
  const shared = 'pointer-events-none absolute h-5 w-5 border-gold/45 z-10';
  return (
    <span aria-hidden>
      <span className={`${shared} left-2 top-2 rounded-tl-md border-l border-t`} />
      <span className={`${shared} right-2 top-2 rounded-tr-md border-r border-t`} />
      <span className={`${shared} bottom-2 left-2 rounded-bl-md border-b border-l`} />
      <span className={`${shared} bottom-2 right-2 rounded-br-md border-b border-r`} />
    </span>
  );
}
