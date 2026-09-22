import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function readPreference() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

// Single source of truth for "this person asked the OS to calm things down".
// Read synchronously on first render so the very first paint is already
// correct — a reduced-motion user should never catch a frame of the full
// animation before an effect has a chance to switch it off.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// Non-reactive read for imperative code (GSAP timelines, confetti, canvas
// loops) that runs outside React's render cycle and just needs a yes/no.
export function prefersReducedMotion() {
  return readPreference();
}
