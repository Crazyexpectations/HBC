import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

const ROUND_SECONDS = 30;
const ITEMS = [
  { emoji: '💗', points: 10 },
  { emoji: '🎈', points: 10 },
  { emoji: '🎁', points: 25 },
  { emoji: '⭐', points: 15 },
  { emoji: '🐾', points: 5 },
];

interface FallingItem {
  id: number;
  emoji: string;
  points: number;
  left: number;
  duration: number;
}

let itemId = 0;
let popupId = 0;

// A little arcade round: catch the falling hearts/gifts before they hit the
// ground. Simple, satisfying, 30 seconds long.
export default function CatchGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [popups, setPopups] = useState<{ id: number; left: number; top: number; points: number }[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const spawn = window.setInterval(() => {
      itemId += 1;
      const pick = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const item: FallingItem = {
        id: itemId,
        emoji: pick.emoji,
        points: pick.points,
        left: 6 + Math.random() * 84,
        duration: 3 + Math.random() * 1.6,
      };
      setItems((it) => [...it, item]);
      window.setTimeout(() => setItems((it) => it.filter((x) => x.id !== item.id)), item.duration * 1000 + 60);
    }, 550);
    return () => window.clearInterval(spawn);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      setPlaying(false);
      setItems([]);
      if (score > 0) confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 }, colors: ['#ff5c8a', '#f6c453', '#ffb6c9'] });
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [playing, timeLeft, score]);

  const start = () => {
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setItems([]);
    setPlaying(true);
  };

  const catchItem = (item: FallingItem, e: React.MouseEvent) => {
    setItems((it) => it.filter((x) => x.id !== item.id));
    setScore((s) => s + item.points);
    const rect = areaRef.current?.getBoundingClientRect();
    if (rect) {
      popupId += 1;
      const id = popupId;
      setPopups((p) => [...p, { id, left: e.clientX - rect.left, top: e.clientY - rect.top, points: item.points }]);
      window.setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 700);
    }
  };

  const tier =
    score >= 300
      ? "you're basically a professional heart-catcher 🏆"
      : score >= 150
        ? 'so cute, so fast 💕'
        : score > 0
          ? 'not bad at all!'
          : '';

  return (
    <div className="glass w-full max-w-xl rounded-2xl p-5 sm:p-7">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl text-cream sm:text-2xl">Catch My Love</h3>
        <span className="text-xs text-cream/60">{playing ? `${timeLeft}s left · ${score} pts` : score > 0 ? `score: ${score}` : ''}</span>
      </div>

      <div ref={areaRef} className="relative h-72 w-full overflow-hidden rounded-xl bg-midnight-deep/60 sm:h-80">
        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-cream/70">
              {score > 0 ? `final score: ${score} — ${tier}` : 'tap the hearts and gifts before they fall 💗'}
            </p>
            <button data-cursor="hover" onClick={start} className="glass rounded-full px-6 py-2.5 text-sm font-medium text-cream">
              {score > 0 ? 'play again' : 'start'}
            </button>
          </div>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            data-cursor="hover"
            onClick={(e) => catchItem(item, e)}
            className="absolute top-0 text-2xl leading-none"
            style={{ left: `${item.left}%`, animation: `catch-fall ${item.duration}s linear forwards` }}
            aria-label={`catch ${item.emoji}`}
          >
            {item.emoji}
          </button>
        ))}
        {popups.map((p) => (
          <span
            key={p.id}
            className="catch-popup pointer-events-none absolute text-sm font-semibold text-gold-soft"
            style={{ left: p.left, top: p.top }}
          >
            +{p.points}
          </span>
        ))}
      </div>
    </div>
  );
}
