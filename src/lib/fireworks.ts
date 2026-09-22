import confetti from 'canvas-confetti';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

// A few seconds of randomized bursts across the width of the screen, capped
// with one big center blast — used after the birthday candles go out.
export function launchFireworks(durationMs = 2600) {
  // Two and a half seconds of screen-wide particle motion is precisely what
  // prefers-reduced-motion exists to prevent. The wish still lands; it just
  // lands quietly.
  if (prefersReducedMotion()) return;

  const end = Date.now() + durationMs;
  const colors = ['#e83e63', '#f2bc5c', '#f7b3c1', '#9c1f3f', '#ffdfa0'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors,
      startVelocity: 45,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors,
      startVelocity: 45,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  setTimeout(() => {
    confetti({
      particleCount: 160,
      spread: 100,
      startVelocity: 40,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  }, 300);
}
