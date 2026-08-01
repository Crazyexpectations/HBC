// Tiny synthesized cat sounds via Web Audio — no audio files needed. Lazily
// creates a single shared AudioContext on first use (satisfies autoplay
// policy since this only ever gets called from a real click, after the
// gate's "Yes" gesture has already unlocked audio on this page anyway).
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** A short, bright "mew" — pitch slides down with a soft attack/decay. */
export function playMeow(pitch: 'normal' | 'high' = 'normal') {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';

  const base = pitch === 'high' ? 1100 : 820;
  osc.frequency.setValueAtTime(base, now);
  osc.frequency.exponentialRampToValueAtTime(base * 0.62, now + 0.16);
  osc.frequency.exponentialRampToValueAtTime(base * 0.5, now + 0.26);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

/** A soft two-note "purr chirp" — used sparingly, e.g. once when petting starts. */
export function playChirp() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  [0, 0.11].forEach((offset, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = 'sine';
    const f = i === 0 ? 700 : 900;
    osc.frequency.setValueAtTime(f, now + offset);
    osc.frequency.exponentialRampToValueAtTime(f * 1.15, now + offset + 0.08);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.06, now + offset + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);
    osc.connect(gain).connect(audioCtx!.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.16);
  });
}
