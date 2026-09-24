import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const BASE = import.meta.env.BASE_URL;
const START_AT = 5; // seconds — skips the quiet intro, every time it (re)starts

// Persistent floating pill that plays the song across the whole site once
// the gate has been passed. Audio can only start from a real user gesture
// (browser autoplay policy) — that gesture is the "Yes" click, which calls
// startMusic() and sets musicPlaying true; this component just reacts to it.
// Looping is handled manually (no `loop` attribute) so every repeat also
// skips back to START_AT instead of replaying the intro each time.
//
// `audioHolds` lets other parts of the page duck the song without touching
// her own play/mute choice: the video holds it while it plays, and the cake
// holds it while the mic is listening for a blow. When the last hold clears,
// the song fades back in from where it left off.
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);
  const phase = useAppStore((s) => s.phase);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const toggleMusic = useAppStore((s) => s.toggleMusic);
  // A derived boolean, not the array: this re-renders only when the song
  // actually changes between held and free, not on every hold/release.
  const held = useAppStore((s) => s.audioHolds.length > 0);

  const shouldPlay = musicPlaying && !held;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      audio.currentTime = START_AT;
      audio.play().catch(() => {});
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay && audio.paused) {
      if (!startedRef.current) {
        startedRef.current = true;
        audio.currentTime = START_AT;
      }
      audio.volume = 0;
      audio.play().catch(() => {});
    }

    // Fade toward the target rather than cutting. Ducking out is quicker than
    // coming back: the video's first second shouldn't have the song still
    // audible under it, but the song returning afterwards should feel gentle.
    const target = shouldPlay ? 1 : 0;
    const step = shouldPlay ? 0.06 : 0.14;
    const fade = setInterval(() => {
      const current = audio.volume;
      const next =
        target > current ? Math.min(target, current + step) : Math.max(target, current - step);
      audio.volume = next;
      if (next === target) {
        clearInterval(fade);
        // Pause only once silent, so there's no audible clip at the cut.
        if (!shouldPlay) audio.pause();
      }
    }, 60);

    return () => clearInterval(fade);
  }, [shouldPlay]);

  if (phase !== 'site') return null;

  const label = !musicPlaying ? 'muted' : held ? 'paused for this' : 'playing for you';

  return (
    <>
      <audio ref={audioRef} src={`${BASE}audio/song.mp3`} preload="auto" />
      <AnimatePresence>
        <motion.button
          data-cursor="hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onClick={toggleMusic}
          className="glass fixed bottom-5 right-5 z-[200] flex items-center gap-2 rounded-full px-4 py-3 text-cream shadow-lg shadow-black/30 md:bottom-8 md:right-8"
          aria-label={musicPlaying ? 'Mute music' : 'Play music'}
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="mx-[1px] w-[3px] rounded-full bg-rose-light"
                style={{
                  height: shouldPlay ? undefined : 6,
                  animation: shouldPlay ? `eq 0.8s ease-in-out ${i * 0.15}s infinite` : 'none',
                }}
              />
            ))}
          </span>
          <span className="hidden text-xs font-medium tracking-wide sm:inline">{label}</span>
          <style>{`
            @keyframes eq {
              0%, 100% { height: 4px; }
              50% { height: 14px; }
            }
          `}</style>
        </motion.button>
      </AnimatePresence>
    </>
  );
}
