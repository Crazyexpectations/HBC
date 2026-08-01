import { useEffect, useRef, useState } from 'react';

interface Props {
  paragraphs: string[];
  active: boolean;
  msPerChar?: number;
  onDone?: () => void;
}

// Reveals paragraphs one at a time, character by character. Clicking
// anywhere on it (via the `skip` ref exposed through onClick in the parent)
// fast-forwards straight to the full text for anyone too impatient to wait.
export default function Typewriter({ paragraphs, active, msPerChar = 16, onDone }: Props) {
  const [paraIndex, setParaIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || skipped) return;
    if (paraIndex >= paragraphs.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const current = paragraphs[paraIndex];
    if (charCount < current.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), msPerChar);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setParaIndex((p) => p + 1);
      setCharCount(0);
    }, 420);
    return () => clearTimeout(t);
  }, [active, skipped, paraIndex, charCount, paragraphs, msPerChar, onDone]);

  useEffect(() => {
    if (skipped && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [skipped, onDone]);

  const handleSkip = () => setSkipped(true);

  return (
    <div onClick={handleSkip} className="cursor-pointer select-none" data-cursor="hover">
      {paragraphs.map((p, i) => {
        const isPast = skipped || i < paraIndex;
        const isCurrent = !skipped && i === paraIndex;
        const text = isPast ? p : isCurrent ? p.slice(0, charCount) : '';
        if (!isPast && !isCurrent) return null;
        return (
          <p key={i} className="mb-4 font-display text-lg leading-relaxed text-midnight/90 last:mb-0 sm:text-xl">
            {text}
            {isCurrent && !skipped && <span className="animate-pulse-heart inline-block">▍</span>}
          </p>
        );
      })}
      {!skipped && paraIndex < paragraphs.length && (
        <p className="mt-4 text-right text-[10px] uppercase tracking-widest text-midnight/40">tap to skip ahead</p>
      )}
    </div>
  );
}
