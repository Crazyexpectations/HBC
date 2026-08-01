import { useMemo } from 'react';

// Small CSS petals drifting down + swaying, looping forever. Cheap DOM/CSS
// animation rather than canvas or WebGL — this section doesn't need a 3D
// scene, and petals in the background shouldn't compete for GPU budget.
export default function RosePetals({ count = 22 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 7 + Math.random() * 8,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 200,
        spin: 180 + Math.random() * 360,
        hue: Math.random() > 0.5 ? '#ff5c8a' : '#c9184a',
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-8%] block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            background: `radial-gradient(ellipse at 30% 30%, ${p.hue}, transparent 70%), ${p.hue}`,
            borderRadius: '0% 70% 0% 70%',
            opacity: 0.75,
            // @ts-expect-error custom properties consumed by keyframes
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes petal-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.75; }
          92% { opacity: 0.75; }
          100% { transform: translate(var(--drift), 115vh) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
