import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MEMORIES } from '../../content';

const BASE = import.meta.env.BASE_URL;
const PAIR_COUNT = 6;

interface CardData {
  id: number;
  photoIndex: number;
  matched: boolean;
}

function buildDeck(): CardData[] {
  const total = MEMORIES.length;
  const step = Math.max(1, Math.floor(total / PAIR_COUNT));
  const seen = new Set<number>();
  const indices: number[] = [];
  for (let i = 0; i < PAIR_COUNT; i++) {
    let idx = Math.min(total - 1, i * step + Math.floor(Math.random() * step));
    while (seen.has(idx)) idx = (idx + 1) % total;
    seen.add(idx);
    indices.push(idx);
  }
  const deck: CardData[] = [];
  indices.forEach((photoIndex, i) => {
    deck.push({ id: i * 2, photoIndex, matched: false });
    deck.push({ id: i * 2 + 1, photoIndex, matched: false });
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Classic concentration game, played with real photos of the two of you
// instead of generic icons — flip two cards, find the matching pair.
export default function MemoryMatchGame() {
  const [deck, setDeck] = useState<CardData[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [won, setWon] = useState(false);

  const matchedCount = deck.filter((c) => c.matched).length;

  useEffect(() => {
    if (deck.length > 0 && matchedCount === deck.length && !won) {
      setWon(true);
      confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 }, colors: ['#ff5c8a', '#f6c453', '#ffb6c9'] });
    }
  }, [matchedCount, deck.length, won]);

  const handleFlip = (card: CardData) => {
    if (busy || card.matched || flipped.includes(card.id)) return;
    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [aId, bId] = nextFlipped;
      const a = deck.find((c) => c.id === aId)!;
      const b = deck.find((c) => c.id === bId)!;
      setBusy(true);
      if (a.photoIndex === b.photoIndex) {
        window.setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === aId || c.id === bId ? { ...c, matched: true } : c)));
          setFlipped([]);
          setBusy(false);
        }, 500);
      } else {
        window.setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 850);
      }
    }
  };

  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setBusy(false);
    setWon(false);
  };

  return (
    <div className="glass w-full max-w-xl rounded-2xl p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl text-cream sm:text-2xl">Match Our Memories</h3>
        <span className="text-xs text-cream/60">{moves} moves</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card) => {
          const isFaceUp = card.matched || flipped.includes(card.id);
          const photo = MEMORIES[card.photoIndex];
          return (
            <button
              key={card.id}
              data-cursor="hover"
              onClick={() => handleFlip(card)}
              disabled={card.matched}
              className="aspect-square"
              style={{ perspective: 600 }}
              aria-label="memory card"
            >
              <div
                className="relative h-full w-full rounded-lg duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s',
                  transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-rose to-rose-deep text-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  💗
                </div>
                <div
                  className="absolute inset-0 overflow-hidden rounded-lg"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <img src={`${BASE}${photo.thumb}`} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center">
            <p className="font-script text-2xl text-gold-soft">you found them all in {moves} moves! 💕</p>
            <button data-cursor="hover" onClick={reset} className="glass mt-3 rounded-full px-5 py-2 text-sm text-cream">
              play again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
