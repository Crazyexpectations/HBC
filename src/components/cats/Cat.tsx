import { useState, useRef } from 'react';

export interface CatPalette {
  fur: string;
  furDark: string;
  ear: string;
  bow: string;
}

export const CAT_PALETTES: Record<string, CatPalette> = {
  ginger: { fur: '#e8935a', furDark: '#c9713b', ear: '#ffc9a8', bow: '#ff5c8a' },
  charcoal: { fur: '#4a4652', furDark: '#312e38', ear: '#8b7d8f', bow: '#f6c453' },
  cream: { fur: '#fff0dc', furDark: '#e8c9a0', ear: '#ffd9c2', bow: '#ff5c8a' },
  tuxedo: { fur: '#2c2a30', furDark: '#18171a', ear: '#5a5560', bow: '#f6c453' },
};

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  size?: number;
  bouncing?: boolean;
  flip?: boolean;
  interactive?: boolean;
  className?: string;
  onPounce?: () => void;
}

// A small flat-illustration cat: sitting, blinking, tail swishing, all pure
// CSS/SVG (no WebGL) so we can scatter several around the page for free.
// Click/tap makes it hop and squeak — that's the "playable" part.
export default function Cat({
  palette = 'ginger',
  size = 64,
  bouncing = false,
  flip = false,
  interactive = true,
  className = '',
  onPounce,
}: Props) {
  const p = CAT_PALETTES[palette];
  const [pounce, setPounce] = useState(false);
  const [showMeow, setShowMeow] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleClick = () => {
    if (!interactive) return;
    setPounce(true);
    setShowMeow(true);
    onPounce?.();
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setPounce(false);
      setShowMeow(false);
    }, 650);
  };

  return (
    <div
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'A cat. Pet it!' : undefined}
      data-cursor={interactive ? 'hover' : undefined}
      onClick={handleClick}
      className={`cat-root relative select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      {showMeow && (
        <span
          className="font-script pointer-events-none absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-sm text-rose-light"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
        >
          mrow~ 💗
        </span>
      )}
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={[bouncing ? 'cat-bounce' : 'cat-idle-bob', pounce ? 'cat-pounce' : ''].join(' ')}
      >
        {/* tail */}
        <path
          d="M 70 68 C 92 68 96 46 84 34"
          fill="none"
          stroke={p.fur}
          strokeWidth="10"
          strokeLinecap="round"
          className="cat-tail"
          style={{ transformOrigin: '70px 68px' }}
        />
        {/* body */}
        <ellipse cx="46" cy="70" rx="26" ry="20" fill={p.fur} />
        {/* front paws */}
        <ellipse cx="34" cy="88" rx="7" ry="6" fill={p.fur} />
        <ellipse cx="54" cy="88" rx="7" ry="6" fill={p.fur} />
        {/* head */}
        <circle cx="42" cy="42" r="22" fill={p.fur} />
        {/* ears */}
        <path d="M 24 30 L 20 10 L 38 24 Z" fill={p.fur} />
        <path d="M 27 26 L 25 14 L 35 23 Z" fill={p.ear} />
        <path d="M 56 26 L 66 8 L 62 30 Z" fill={p.fur} />
        <path d="M 58 24 L 64 14 L 60 27 Z" fill={p.ear} />
        {/* bow */}
        <g transform="translate(58 20)">
          <path d="M0 0 L-8 -5 L-8 5 Z" fill={p.bow} />
          <path d="M0 0 L8 -5 L8 5 Z" fill={p.bow} />
          <circle cx="0" cy="0" r="3" fill={p.bow} />
        </g>
        {/* face */}
        <g className="cat-eyes">
          <ellipse cx="34" cy="42" rx="3" ry="4" fill={p.furDark} />
          <ellipse cx="50" cy="42" rx="3" ry="4" fill={p.furDark} />
        </g>
        <path d="M40 50 Q42 53 44 50" fill="none" stroke={p.furDark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M42 50 L42 47" fill="none" stroke={p.furDark} strokeWidth="1.5" strokeLinecap="round" />
        {/* whiskers */}
        <g stroke={p.furDark} strokeWidth="1" opacity="0.55" strokeLinecap="round">
          <line x1="18" y1="44" x2="30" y2="43" />
          <line x1="18" y1="50" x2="30" y2="48" />
          <line x1="54" y1="43" x2="66" y2="44" />
          <line x1="54" y1="48" x2="66" y2="50" />
        </g>
      </svg>
    </div>
  );
}
