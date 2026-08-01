import { useEffect, useRef, useState } from 'react';
import Cat, { CAT_PALETTES, type CatMode } from './Cat';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  bottom?: number | string;
  duration?: number;
  delay?: number;
  size?: number;
}

// A stray cat that strolls across the bottom of a section — but doesn't just
// walk in a straight line forever. Partway across each lap it stops, sits
// (sometimes naps), then carries on. Works on touch too (tap to pounce/pet),
// unlike the cursor-following companion. Pure CSS position animation
// (`left`), so it costs nothing to have several running at once.
export default function RoamingCat({ palette = 'charcoal', bottom = 24, duration = 22, delay = 2, size = 48 }: Props) {
  const [mode, setMode] = useState<CatMode>('walking');
  const [paused, setPaused] = useState(false);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const wrapRef = useRef<HTMLDivElement>(null);
  const petHoldRef = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let pauseT: number | null = null;
    let resumeT: number | null = null;

    const takeABreak = () => {
      if (petHoldRef.current) return; // don't nap while being petted
      const pauseAt = duration * (0.28 + Math.random() * 0.35) * 1000;
      pauseT = window.setTimeout(() => {
        setPaused(true);
        setMode(Math.random() < 0.35 ? 'sleeping' : 'idle');
        const napFor = 2200 + Math.random() * 3600;
        resumeT = window.setTimeout(() => {
          setPaused(false);
          setMode('walking');
        }, napFor);
      }, pauseAt);
    };

    takeABreak(); // first lap gets a break too
    el.addEventListener('animationiteration', takeABreak);
    return () => {
      el.removeEventListener('animationiteration', takeABreak);
      if (pauseT) window.clearTimeout(pauseT);
      if (resumeT) window.clearTimeout(resumeT);
    };
  }, [duration]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute z-20"
      style={{
        bottom,
        left: -80,
        animation: `cat-walk-across ${duration}s linear ${delay}s infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      <div className="pointer-events-auto">
        <Cat
          palette={palette}
          size={size}
          mode={mode}
          muted={!musicPlaying}
          onPetStart={() => {
            petHoldRef.current = true;
            window.setTimeout(() => (petHoldRef.current = false), 4000);
          }}
        />
      </div>
    </div>
  );
}
