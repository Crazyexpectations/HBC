import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'requesting' | 'listening' | 'denied' | 'unsupported';

interface Options {
  active: boolean;
  threshold?: number; // 0-255 average amplitude to count as a "blow"
  sustainMs?: number; // how long the level must stay above threshold
  onBlow: () => void;
}

// Listens to the mic while `active`, and fires onBlow() once volume stays
// above `threshold` for `sustainMs` (a blown breath reads as a sustained
// low-frequency-heavy loud burst, unlike a short clap or click).
export function useMicBlow({ active, threshold = 38, sustainMs = 260, onBlow }: Options) {
  const [status, setStatus] = useState<Status>('idle');
  const [level, setLevel] = useState(0);
  const aboveSinceRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return;
    }

    let cancelled = false;
    setStatus('requesting');
    firedRef.current = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AudioCtx();
        ctxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        setStatus('listening');

        const tick = () => {
          analyser.getByteFrequencyData(data);
          // blowing is heavy in the low frequency bins
          const lowBins = data.slice(0, 24);
          const avg = lowBins.reduce((a, b) => a + b, 0) / lowBins.length;
          setLevel(avg);

          if (avg > threshold) {
            if (aboveSinceRef.current === null) aboveSinceRef.current = performance.now();
            else if (!firedRef.current && performance.now() - aboveSinceRef.current > sustainMs) {
              firedRef.current = true;
              onBlow();
            }
          } else {
            aboveSinceRef.current = null;
          }

          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        if (!cancelled) setStatus('denied');
      });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      ctxRef.current?.close().catch(() => {});
      streamRef.current = null;
      ctxRef.current = null;
      aboveSinceRef.current = null;
    };
  }, [active, threshold, sustainMs, onBlow]);

  return { status, level };
}
