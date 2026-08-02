import confetti from 'canvas-confetti';

// A few seconds of randomized bursts across the width of the screen, capped
// with one big center blast — used after the birthday candles go out.
export function launchFireworks(durationMs = 2600) {
  const end = Date.now() + durationMs;
  const colors = ['#a3243f', '#c9a15a', '#e0a8a0', '#6e1728', '#e3c993'];

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
