import type { ReactNode } from 'react';

/** Where in the night this scene sits. Drives the background wash so the
 *  scroll actually travels somewhere instead of eight variations on brown. */
export type Tone = 'arrival' | 'inside' | 'warm' | 'lit' | 'dawn' | 'close';

/** Vertical rhythm. Not every scene deserves a full viewport — forcing
 *  `min-h-screen` on all eight was what made the page feel like a slideshow
 *  of identical panels. */
export type Density = 'full' | 'tall' | 'natural' | 'compact';

interface Props {
  id: string;
  children: ReactNode;
  tone?: Tone;
  density?: Density;
  /** Horizontal alignment of the section's content column. */
  align?: 'center' | 'left';
  className?: string;
  /** Escape hatch: pass a raw background and skip the tone wash entirely. */
  bgClassName?: string;
  /** Lets a section opt out of the vignette (e.g. full-bleed photo grids). */
  vignette?: boolean;
  label?: string;
}

// Each tone is a two-layer wash: a base vertical gradient plus an off-centre
// radial "light source". The radial is what keeps these from reading flat —
// it implies something in the room is actually emitting light.
const TONE_BASE: Record<Tone, string> = {
  arrival: 'linear-gradient(180deg, #0a050c 0%, #120a14 55%, #1c0f1e 100%)',
  inside: 'linear-gradient(180deg, #1c0f1e 0%, #2a1420 50%, #3d1523 100%)',
  warm: 'linear-gradient(180deg, #3d1523 0%, #4d1a2a 45%, #3d1523 100%)',
  lit: 'linear-gradient(180deg, #3d1523 0%, #6d1f30 50%, #4a1726 100%)',
  dawn: 'linear-gradient(180deg, #4a1726 0%, #7d3350 55%, #2b1526 100%)',
  close: 'linear-gradient(180deg, #2b1526 0%, #150912 60%, #06030a 100%)',
};

const TONE_LIGHT: Record<Tone, string> = {
  arrival: 'radial-gradient(ellipse 70% 50% at 50% 18%, rgba(120, 60, 140, 0.22), transparent 70%)',
  inside: 'radial-gradient(ellipse 65% 45% at 22% 30%, rgba(232, 62, 99, 0.16), transparent 70%)',
  warm: 'radial-gradient(ellipse 60% 50% at 78% 40%, rgba(184, 69, 47, 0.24), transparent 72%)',
  lit: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(242, 188, 92, 0.26), transparent 68%)',
  dawn: 'radial-gradient(ellipse 80% 55% at 50% 85%, rgba(232, 146, 126, 0.3), transparent 72%)',
  close: 'radial-gradient(ellipse 60% 40% at 50% 15%, rgba(255, 223, 160, 0.14), transparent 72%)',
};

const DENSITY: Record<Density, string> = {
  full: 'min-h-screen py-24',
  tall: 'min-h-[85vh] py-28',
  natural: 'py-24 sm:py-32',
  compact: 'py-16 sm:py-20',
};

/**
 * Shell shared by every scene. Handles the atmospheric wash, grain, vignette
 * and rhythm so individual sections only describe their own content.
 */
export default function Section({
  id,
  children,
  tone = 'inside',
  density = 'full',
  align = 'center',
  className = '',
  bgClassName,
  vignette = true,
  label,
}: Props) {
  const useTone = !bgClassName;

  return (
    <section
      id={id}
      aria-label={label}
      className={[
        'relative w-full overflow-hidden px-6 grain',
        vignette ? 'vignette' : '',
        'flex flex-col',
        align === 'center' ? 'items-center' : 'items-stretch',
        density === 'full' || density === 'tall' ? 'justify-center' : '',
        DENSITY[density],
        bgClassName ?? '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        useTone
          ? { backgroundImage: `${TONE_LIGHT[tone]}, ${TONE_BASE[tone]}` }
          : undefined
      }
    >
      {children}
    </section>
  );
}
