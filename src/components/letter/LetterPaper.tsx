import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { LETTER, LOVE_LETTER, YOUR_SIGNATURE } from '../../content';

/**
 * The letter, as an actual sheet of paper, written word by word.
 *
 * This used to type itself out character by character. That was charming for
 * the six-paragraph draft it was written for; the real letter is forty-odd
 * blocks long, and at 14ms a character it would have been well over a minute
 * of watching a cursor before she could read a word of it — with no way to
 * scroll back over a line that landed.
 *
 * So the pacing follows her scroll instead. Each block's words fly up into
 * place, staggered, the moment that block comes into view: the letter writes
 * itself down the page at exactly the speed she's reading it, and nothing
 * ever makes her wait. The animation itself lives in `index.css` (see "THE
 * LETTER"); all this does is add `.is-visible` at the right moment.
 *
 * Two conventions come from `content.ts` (documented there):
 *   - a block containing newlines is a run of short lines that stack tightly
 *   - a block starting with `## ` is a line that should land, set in the
 *     handwritten face and given room to breathe
 */

const EMPHASIS = '## ';

// The first few blocks are up from the moment the envelope opens — she just
// tapped it, so the top of the letter is already in front of her and waiting
// for a scroll event would leave it blank.
const IMMEDIATE_BLOCKS = 3;

/** Splits a line into word spans, each carrying its own stagger index. */
function words(line: string, next: () => number) {
  return line.split(' ').map((word, i) => {
    if (!word) return null;
    return (
      // The space between spans is a real text node, not padding: inline-block
      // elements with no whitespace between them give the browser nowhere to
      // wrap, which on a phone would push every line off the edge of the page.
      <Fragment key={i}>
        <span className="word" style={{ '--i': next() } as CSSProperties}>
          {word}
        </span>{' '}
      </Fragment>
    );
  });
}

function Block({ text, index }: { text: string; index: number }) {
  const isEmphasis = text.startsWith(EMPHASIS);
  const body = isEmphasis ? text.slice(EMPHASIS.length) : text;

  // Runs across every line in the block, so a stacked stanza staggers as one
  // continuous sweep rather than restarting on each line.
  let cursor = 0;
  const next = () => cursor++;

  const className = [
    'letter-block',
    isEmphasis ? 'is-emphasis my-9 first:mt-0' : 'mb-6 last:mb-0',
    index < IMMEDIATE_BLOCKS ? 'is-visible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (isEmphasis) {
    return (
      <div className={className}>
        <p className="font-script text-center text-[length:var(--text-step-2)] leading-tight text-rose-deep">
          {words(body, next)}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {body.split('\n').map((line, i) => (
        <p
          key={i}
          className="font-display text-[length:var(--text-step-0)] leading-[1.75] text-midnight/90 sm:text-[length:var(--text-step-1)] sm:leading-[1.7]"
        >
          {words(line, next)}
        </p>
      ))}
    </div>
  );
}

export default function LetterPaper() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>('.letter-block'));

    // If the browser can't observe, show everything rather than leaving her
    // with a blank sheet of paper. Failing open matters more than the effect.
    if (typeof IntersectionObserver === 'undefined') {
      blocks.forEach((b) => b.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          // One-shot: a block that has been read shouldn't re-animate if she
          // scrolls back up over it.
          observer.unobserve(entry.target);
        }
      },
      // Fires a little before the block reaches the bottom edge, so the words
      // are already arriving by the time her eye gets there.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    blocks.forEach((block) => {
      if (block.classList.contains('is-visible')) return;
      observer.observe(block);
    });

    // Note on `is-visible` being set straight on the DOM node rather than
    // held in React state: React only writes `className` when the *rendered*
    // value changes between renders, and a Block's className is derived from
    // props that never change — so a re-render won't clobber the class. The
    // alternative, a Set in state, would re-render every block and all ~600
    // word spans each time one more block scrolled into view, which is the
    // exact cost this whole approach exists to avoid.

    return () => observer.disconnect();
  }, []);

  return (
    <motion.article
      ref={rootRef}
      layoutId="letter-paper"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-2xl rounded-md bg-cream px-6 py-12 shadow-2xl shadow-black/50 sm:px-14 sm:py-16"
    >
      {/* Paper: a soft light falloff from the top-left, plus the creases from
          being folded down small enough to fit in the envelope. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md bg-[radial-gradient(circle_at_18%_4%,rgba(0,0,0,0.05),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md opacity-[0.45]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, transparent 0, transparent 419px, rgba(90,50,40,0.09) 419px, rgba(90,50,40,0.09) 420px, rgba(255,255,255,0.5) 421px, transparent 423px)',
        }}
      />

      <div className="relative">
        {LOVE_LETTER.map((block, i) => (
          <Fragment key={i}>
            <Block text={block} index={i} />
            {/* The letter is long and nothing else on the page says so. One
                nudge, placed where the opening lines run out. */}
            {i === IMMEDIATE_BLOCKS - 1 && (
              <p className="mb-8 mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-midnight/30">
                {LETTER.readHint}
              </p>
            )}
          </Fragment>
        ))}

        <div className="letter-block mt-12">
          <div aria-hidden className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-deep/25" />
            <span className="text-xs text-rose-deep/50">🐦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-deep/25" />
          </div>
          <p className="font-script text-right text-[length:var(--text-step-2)] leading-none text-rose-deep">
            <span className="word" style={{ '--i': 0 } as CSSProperties}>
              {YOUR_SIGNATURE}
            </span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}
