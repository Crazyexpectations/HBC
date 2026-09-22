import { useMemo } from 'react';

interface Props {
  items: string[];
  count?: number;
  className?: string;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
}

// Cheap, GPU-friendly ambient decoration: emoji drifting upward forever in
// a CSS loop. Used for balloons, hearts, lanterns etc. — no WebGL needed for
// background flourishes, which keeps the real 3D scenes running smooth.
export default function FloatingEmojis({
  items,
  count = 14,
  className = '',
  minSize = 24,
  maxSize = 48,
  minDuration = 10,
  maxDuration = 20,
}: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: items[Math.floor(Math.random() * items.length)],
        left: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        duration: minDuration + Math.random() * (maxDuration - minDuration),
        delay: Math.random() * maxDuration,
        drift: (Math.random() - 0.5) * 120,
        rotate: (Math.random() - 0.5) * 40,
      })),
    [items, count, minSize, maxSize, minDuration, maxDuration]
  );

  return (
    // `motion-decorative` lets the global reduced-motion rule in index.css
    // remove this outright — a frozen emoji stranded mid-air is worse than none.
    <div aria-hidden className={`motion-decorative pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-10%] select-none opacity-80"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            // @ts-expect-error custom properties consumed by the keyframes below
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
            animation: `rise-drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes rise-drift {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% { transform: translate(var(--drift), -115vh) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
