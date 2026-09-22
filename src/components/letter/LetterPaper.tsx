import { Fragment } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../layout/Reveal';
import { riseIn } from '../../lib/motion';
import { LETTER, LOVE_LETTER, YOUR_SIGNATURE } from '../../content';

/**
 * The letter, as an actual sheet of paper.
 *
 * This used to type itself out character by character. That was charming for
 * the six-paragraph draft it was written for; the real letter is forty-odd
 * blocks long, and at 14ms a character it would have been well over a minute
 * of watching a cursor before she could read a word of it — with no way to
 * scroll back over a line that landed. So the paper is just paper now: the
 * words are all there, and they fade up as she reaches them.
 *
 * Two conventions come from `content.ts` (documented there):
 *   - a block containing newlines is a run of short lines that stack tightly
 *   - a block starting with `## ` is a line that should land, set in the
 *     handwritten face and given room to breathe
 */

const EMPHASIS = '## ';

// The first few blocks animate on mount rather than on scroll — she just
// tapped the envelope, so the top of the letter is already in front of her
// and waiting for a scroll event would leave it blank.
const IMMEDIATE_BLOCKS = 3;

function Block({ text, index }: { text: string; index: number }) {
  const immediate = index < IMMEDIATE_BLOCKS;
  const variants = riseIn(14, immediate ? 0.15 + index * 0.12 : 0);

  if (text.startsWith(EMPHASIS)) {
    return (
      <Reveal variants={variants} immediate={immediate} className="my-9 first:mt-0">
        <p className="font-script text-center text-[length:var(--text-step-2)] leading-tight text-rose-deep">
          {text.slice(EMPHASIS.length)}
        </p>
      </Reveal>
    );
  }

  return (
    <Reveal variants={variants} immediate={immediate} className="mb-6 last:mb-0">
      {text.split('\n').map((line, i) => (
        <p
          key={i}
          className="font-display text-[length:var(--text-step-0)] leading-[1.75] text-midnight/90 sm:text-[length:var(--text-step-1)] sm:leading-[1.7]"
        >
          {line}
        </p>
      ))}
    </Reveal>
  );
}

export default function LetterPaper() {
  return (
    <motion.article
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
              <Reveal
                variants={riseIn(8, 0.9)}
                immediate
                as="p"
                className="mb-8 mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-midnight/30"
              >
                {LETTER.readHint}
              </Reveal>
            )}
          </Fragment>
        ))}

        <Reveal variants={riseIn(12)} className="mt-12">
          <div aria-hidden className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-deep/25" />
            <span className="text-xs text-rose-deep/50">🐦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-deep/25" />
          </div>
          <p className="font-script text-right text-[length:var(--text-step-2)] leading-none text-rose-deep">
            {YOUR_SIGNATURE}
          </p>
        </Reveal>
      </div>
    </motion.article>
  );
}
