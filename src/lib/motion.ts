import type { Transition, Variants } from 'framer-motion';

// ============================================================================
//  The site's motion vocabulary.
//
//  Before this file, every section hand-rolled `initial={{ opacity: 0, y: 30 }}
//  whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}` inline.
//  Eight sections, eight near-identical copies, no way to tune the feel of the
//  page as a whole and no way to honour prefers-reduced-motion without editing
//  every one of them. Everything now composes from the curves and builders
//  below instead.
// ============================================================================

/** Main easing curve. Fast out of the gate, long gentle settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;
/** For things that should feel physical — envelope flap, gift lid. */
export const EASE_HEAVY = [0.65, 0, 0.35, 1] as const;
/** Slight overshoot, for anything that "pops" into place. */
export const EASE_POP = [0.34, 1.56, 0.64, 1] as const;

/** Viewport defaults. `amount` is deliberately low so content commits to
 *  animating in before it's fully on screen — waiting until 60% visible
 *  (the old value) meant tall blocks visibly popped after you'd read them. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export const DURATION = {
  quick: 0.35,
  base: 0.6,
  slow: 0.9,
  epic: 1.4,
} as const;

/**
 * Every animated element on the page ultimately routes through here.
 *
 * When `reduced` is true we don't just shorten things — we strip *movement*
 * entirely and keep only opacity. That's the actual contract of
 * prefers-reduced-motion: vestibular triggers are travel, parallax and scale,
 * not the existence of a transition. A cross-fade is still fine, and keeping
 * it means the page never looks broken or abruptly "snapped together".
 */
export function reduceVariants(variants: Variants, reduced: boolean): Variants {
  if (!reduced) return variants;

  const strip = (state: unknown): unknown => {
    if (typeof state === 'function') {
      return (...args: unknown[]) => strip((state as (...a: unknown[]) => unknown)(...args));
    }
    if (!state || typeof state !== 'object') return state;

    const { ...rest } = state as Record<string, unknown>;
    // Drop every transform-ish channel; keep opacity and the transition block.
    for (const key of [
      'x', 'y', 'z',
      'scale', 'scaleX', 'scaleY',
      'rotate', 'rotateX', 'rotateY', 'rotateZ',
      'skew', 'skewX', 'skewY',
    ]) {
      delete rest[key];
    }
    if (rest.transition && typeof rest.transition === 'object') {
      rest.transition = { ...(rest.transition as Transition), duration: DURATION.quick };
    }
    return rest;
  };

  return Object.fromEntries(
    Object.entries(variants).map(([key, value]) => [key, strip(value)])
  ) as Variants;
}

// --- building blocks --------------------------------------------------------

/** Rise up into place. The page's default entrance. */
export const riseIn = (distance = 28, delay = 0): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, delay, ease: EASE },
  },
});

/** Settle in from the side — used to give alternating rows some direction. */
export const slideIn = (from: 'left' | 'right', distance = 40, delay = 0): Variants => ({
  hidden: { opacity: 0, x: from === 'left' ? -distance : distance },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, delay, ease: EASE },
  },
});

/** Grow in from slightly small. For cards, photos, anything with a surface. */
export const scaleIn = (from = 0.94, delay = 0): Variants => ({
  hidden: { opacity: 0, scale: from },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, delay, ease: EASE },
  },
});

/** Parent wrapper that walks its children in one after another. */
export const stagger = (each = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: each, delayChildren },
  },
});

/** Per-character reveal, for the hero headline. */
export const letterIn: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: -55 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.04, duration: DURATION.slow, ease: EASE },
  }),
};

/** Standard "fade through" for swapping two pieces of content in place. */
export const crossFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.quick, ease: EASE } },
};
