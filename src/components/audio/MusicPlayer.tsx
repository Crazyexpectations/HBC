import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const BASE = import.meta.env.BASE_URL;

// Persistent floating pill that plays the song across the whole site once
// the gate has been passed. Audio can only start from a real user gesture
// (browser autoplay policy) — that gesture is the "Yes" click, which calls
// startMusic() and sets musicPlaying true; this component just reacts to it.
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const phase = useAppStore((s) => s.phase);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const toggleMusic = useAppStore((s) => s.toggleMusic);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.volume = 0;
      audio.play().catch(() => {});
      let v = 0;
      const fade = setInterval(() => {
        v = Math.min(1, v + 0.08);
        audio.volume = v;
        if (v >= 1) clearInterval(fade);
      }, 60);
      return () => clearInterval(fade);
    } else {
      audio.pause();
    }
  }, [musicPlaying]);

  if (phase !== 'site') return null;

  return (
    <>
      <audio ref={audioRef} src={`${BASE}audio/song.mp3`} loop preload="auto" />
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
                  height: musicPlaying ? undefined : 6,
                  animation: musicPlaying ? `eq 0.8s ease-in-out ${i * 0.15}s infinite` : 'none',
                }}
              />
            ))}
          </span>
          <span className="hidden text-xs font-medium tracking-wide sm:inline">
            {musicPlaying ? 'playing for you' : 'muted'}
          </span>
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
