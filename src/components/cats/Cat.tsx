import { useEffect, useId, useRef, useState } from 'react';
import { playChirp, playMeow } from '../../lib/meow';

export interface CatPalette {
  fur: string;
  furLight: string;
  furDark: string;
  ear: string;
  bow: string;
}

export const CAT_PALETTES: Record<string, CatPalette> = {
  ginger: { fur: '#e8935a', furLight: '#f3ae7c', furDark: '#a85a2c', ear: '#ffc9a8', bow: '#ff5c8a' },
  charcoal: { fur: '#4a4652', furLight: '#615c6c', furDark: '#252330', ear: '#8b7d8f', bow: '#f6c453' },
  cream: { fur: '#fff0dc', furLight: '#fffaf0', furDark: '#dcb686', ear: '#ffd9c2', bow: '#ff5c8a' },
  tuxedo: { fur: '#2c2a30', furLight: '#413e47', furDark: '#121114', ear: '#5a5560', bow: '#f6c453' },
};

export type CatMode = 'idle' | 'walking' | 'sleeping';
type Expression = 'normal' | 'happy' | 'sleepy' | 'excited';

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  size?: number;
  mode?: CatMode;
  flip?: boolean;
  interactive?: boolean;
  muted?: boolean;
  className?: string;
  onPounce?: () => void;
  onPetStart?: () => void;
}

// A hand-drawn but shaded/animated cat: walks with an actual leg cycle,
// purrs and blushes when you hover over it (petting), naps with drooped ears
// and "z"s when its mode is 'sleeping', and squeaks a tiny synthesized meow
// when you click it. Reused for both the cursor-following companion and the
// roaming section cats, so improving it here improves every cat on the site.
export default function Cat({
  palette = 'ginger',
  size = 64,
  mode = 'idle',
  flip = false,
  interactive = true,
  muted = false,
  className = '',
  onPounce,
  onPetStart,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const p = CAT_PALETTES[palette];

  const [pounce, setPounce] = useState(false);
  const [petted, setPetted] = useState(false);
  const [stretching, setStretching] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const pounceTimeout = useRef<number | null>(null);
  const heartIdRef = useRef(0);

  // Occasional idle flourish: stretches every so often when just sitting.
  useEffect(() => {
    if (mode !== 'idle' || petted) return;
    let cancelled = false;
    const schedule = () => {
      const delay = 6000 + Math.random() * 9000;
      window.setTimeout(() => {
        if (cancelled) return;
        setStretching(true);
        window.setTimeout(() => !cancelled && setStretching(false), 900);
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, [mode, petted]);

  // Little hearts trickle up while being petted.
  useEffect(() => {
    if (!petted) {
      setHearts([]);
      return;
    }
    const interval = window.setInterval(() => {
      heartIdRef.current += 1;
      const id = heartIdRef.current;
      setHearts((h) => [...h, id]);
      window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 900);
    }, 450);
    return () => window.clearInterval(interval);
  }, [petted]);

  const handleClick = () => {
    if (!interactive) return;
    setPounce(true);
    onPounce?.();
    if (!muted) playMeow(palette === 'cream' ? 'high' : 'normal');
    if (pounceTimeout.current) window.clearTimeout(pounceTimeout.current);
    pounceTimeout.current = window.setTimeout(() => setPounce(false), 600);
  };

  const handlePetStart = () => {
    if (!interactive || mode === 'sleeping') return;
    setPetted(true);
    onPetStart?.();
    if (!muted) playChirp();
  };
  const handlePetEnd = () => setPetted(false);

  const expression: Expression = pounce
    ? 'excited'
    : mode === 'sleeping'
      ? 'sleepy'
      : petted
        ? 'happy'
        : 'normal';

  const walking = mode === 'walking';
  const sleeping = mode === 'sleeping';

  return (
    <div
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'A cat. Pet it, or click it!' : undefined}
      data-cursor={interactive ? 'hover' : undefined}
      onClick={handleClick}
      onMouseEnter={handlePetStart}
      onMouseLeave={handlePetEnd}
      className={`cat-root relative select-none ${interactive ? 'cursor-pointer' : ''} ${petted ? 'cat-glow' : ''} ${className}`}
      style={{ width: size, height: size, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {pounce && (
        <span
          className="font-script pointer-events-none absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-sm text-rose-light"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
        >
          mrow~ 💗
        </span>
      )}
      {sleeping && (
        <span
          className="cat-zzz pointer-events-none absolute -top-4 right-0 z-10 text-xs text-cream/70"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
          aria-hidden
        >
          z z Z
        </span>
      )}
      {hearts.map((id) => (
        <span
          key={id}
          className="cat-pet-heart pointer-events-none absolute left-1/2 top-1 z-10 text-xs"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
          aria-hidden
        >
          💗
        </span>
      ))}

      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={[
          walking ? 'cat-walk-bob' : sleeping ? 'cat-sleep-breathe' : 'cat-idle-bob',
          pounce ? 'cat-pounce' : '',
          stretching ? 'cat-stretch' : '',
        ].join(' ')}
        style={{ transformOrigin: '50% 85%' }}
      >
        <defs>
          <radialGradient id={`fur-${uid}`} cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor={p.furLight} />
            <stop offset="100%" stopColor={p.fur} />
          </radialGradient>
          <linearGradient id={`tail-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.fur} />
            <stop offset="100%" stopColor={p.furDark} />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="46" cy="93" rx={sleeping ? 30 : 24} ry={sleeping ? 6 : 4.5} fill="#000" opacity="0.28" />

        {/* tail */}
        <path
          d={sleeping ? 'M 70 74 C 84 72 88 62 82 54' : 'M 70 68 C 92 68 96 46 84 34'}
          fill="none"
          stroke={`url(#tail-${uid})`}
          strokeWidth="9"
          strokeLinecap="round"
          className={sleeping ? '' : walking ? 'cat-tail-fast' : 'cat-tail'}
          style={{ transformOrigin: '70px 68px', animationPlayState: sleeping ? 'paused' : 'running' }}
        />

        {/* back leg peek (depth) */}
        {!sleeping && <ellipse cx="60" cy="86" rx="6.5" ry="5.5" fill={p.furDark} opacity="0.7" />}

        {/* body */}
        <ellipse
          cx="46"
          cy={sleeping ? 78 : 70}
          rx={sleeping ? 30 : 26}
          ry={sleeping ? 13 : 20}
          fill={`url(#fur-${uid})`}
        />

        {/* front paws — animated stepping when walking */}
        {!sleeping && (
          <>
            <ellipse
              cx="34"
              cy="88"
              rx="7"
              ry="6"
              fill={p.fur}
              className={walking ? 'cat-paw-a' : stretching ? 'cat-paw-stretch' : ''}
              style={{ transformOrigin: '34px 84px' }}
            />
            <ellipse
              cx="54"
              cy="88"
              rx="7"
              ry="6"
              fill={p.fur}
              className={walking ? 'cat-paw-b' : ''}
              style={{ transformOrigin: '54px 84px' }}
            />
          </>
        )}

        {/* head */}
        <circle cx="42" cy={sleeping ? 58 : 42} r="22" fill={`url(#fur-${uid})`} />

        {/* ears — droop a little while asleep */}
        <g style={{ transform: sleeping ? 'rotate(14deg)' : undefined, transformOrigin: '24px 30px' }} className={!sleeping ? 'cat-ear-twitch' : ''}>
          <path d={sleeping ? 'M 22 46 L 18 28 L 34 40 Z' : 'M 24 30 L 20 10 L 38 24 Z'} fill={p.fur} />
          <path d={sleeping ? 'M 25 42 L 23 32 L 31 39 Z' : 'M 27 26 L 25 14 L 35 23 Z'} fill={p.ear} />
        </g>
        <g style={{ transform: sleeping ? 'rotate(-10deg)' : undefined, transformOrigin: '56px 26px' }}>
          <path d={sleeping ? 'M 54 44 L 62 26 L 60 46 Z' : 'M 56 26 L 66 8 L 62 30 Z'} fill={p.fur} />
          <path d={sleeping ? 'M 55 41 L 60 30 L 58 43 Z' : 'M 58 24 L 64 14 L 60 27 Z'} fill={p.ear} />
        </g>

        {/* bow */}
        <g transform={`translate(${sleeping ? 60 : 58} ${sleeping ? 38 : 20})`}>
          <path d="M0 0 L-8 -5 L-8 5 Z" fill={p.bow} />
          <path d="M0 0 L8 -5 L8 5 Z" fill={p.bow} />
          <circle cx="0" cy="0" r="3" fill={p.bow} />
        </g>

        {/* blush */}
        {(expression === 'happy' || expression === 'excited') && (
          <>
            <ellipse cx="27" cy={sleeping ? 62 : 48} rx="4" ry="2.6" fill={p.bow} opacity="0.5" />
            <ellipse cx="57" cy={sleeping ? 62 : 48} rx="4" ry="2.6" fill={p.bow} opacity="0.5" />
          </>
        )}

        {/* face */}
        <CatFace expression={expression} sleeping={sleeping} furDark={p.furDark} />

        {/* whiskers */}
        <g stroke={p.furDark} strokeWidth="1" opacity={sleeping ? 0.35 : 0.55} strokeLinecap="round">
          <line x1="18" y1={sleeping ? 60 : 44} x2="30" y2={sleeping ? 59 : 43} />
          <line x1="18" y1={sleeping ? 66 : 50} x2="30" y2={sleeping ? 64 : 48} />
          <line x1="54" y1={sleeping ? 59 : 43} x2="66" y2={sleeping ? 60 : 44} />
          <line x1="54" y1={sleeping ? 64 : 48} x2="66" y2={sleeping ? 66 : 50} />
        </g>
      </svg>
    </div>
  );
}

function CatFace({ expression, sleeping, furDark }: { expression: Expression; sleeping: boolean; furDark: string }) {
  const hy = sleeping ? 58 : 42; // vertical anchor follows head position

  if (expression === 'sleepy') {
    return (
      <g stroke={furDark} strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1={hy} x2="38" y2={hy} />
        <line x1="46" y1={hy} x2="54" y2={hy} />
        <path d={`M40 ${hy + 8} Q42 ${hy + 10} 44 ${hy + 8}`} fill="none" strokeWidth="1.5" />
      </g>
    );
  }

  if (expression === 'happy') {
    return (
      <g>
        <path d={`M30 ${hy} Q34 ${hy - 5} 38 ${hy}`} fill="none" stroke={furDark} strokeWidth="2" strokeLinecap="round" />
        <path d={`M46 ${hy} Q50 ${hy - 5} 54 ${hy}`} fill="none" stroke={furDark} strokeWidth="2" strokeLinecap="round" />
        <path d={`M39 ${8 + hy} Q42 ${11 + hy} 45 ${8 + hy}`} fill="none" stroke={furDark} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
  }

  if (expression === 'excited') {
    return (
      <g>
        <circle cx="34" cy={hy} r="4.2" fill={furDark} />
        <circle cx="35.2" cy={hy - 1.2} r="1.1" fill="#fff" />
        <circle cx="50" cy={hy} r="4.2" fill={furDark} />
        <circle cx="51.2" cy={hy - 1.2} r="1.1" fill="#fff" />
        <circle cx="42" cy={hy + 8} r="2.4" fill={furDark} opacity="0.85" />
      </g>
    );
  }

  return (
    <g>
      <g className="cat-eyes" style={{ transformOrigin: `${34}px ${hy}px` }}>
        <ellipse cx="34" cy={hy} rx="3" ry="4" fill={furDark} />
        <circle cx="35" cy={hy - 1.4} r="0.9" fill="#fff" opacity="0.85" />
        <ellipse cx="50" cy={hy} rx="3" ry="4" fill={furDark} />
        <circle cx="51" cy={hy - 1.4} r="0.9" fill="#fff" opacity="0.85" />
      </g>
      <path d={`M40 ${8 + hy} Q42 ${11 + hy} 44 ${8 + hy}`} fill="none" stroke={furDark} strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M42 ${8 + hy} L42 ${5 + hy}`} fill="none" stroke={furDark} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}
