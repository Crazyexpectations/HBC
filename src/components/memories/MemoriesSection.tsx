import { useState, useCallback } from 'react';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import PolaroidCard from './PolaroidCard';
import Lightbox from './Lightbox';
import RoamingCat from '../cats/RoamingCat';
import { MEMORIES, MEMORIES_HEADING, MEMORIES_HINT } from '../../content';

const BASE = import.meta.env.BASE_URL;

export default function MemoriesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const nav = useCallback((dir: 1 | -1) => {
    setOpenIndex((i) => (i === null ? i : (i + dir + MEMORIES.length) % MEMORIES.length));
  }, []);

  return (
    <Section id="memories" tone="inside" density="natural" label="Our memories">
      {/* Left-aligned, with the count set opposite — deliberately breaks the
          centred rhythm the rest of the page uses, so this reads as a spread
          in a photo book rather than another centred slide. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading
            align="left"
            eyebrow={MEMORIES_HEADING.eyebrow}
            title={MEMORIES_HEADING.title}
            sub={MEMORIES_HEADING.sub}
          />
          {/* Stacked big-number block only once there's a column to put it in.
              On a phone it just created a screen-tall gap between the heading
              and the first photo, so there it collapses into the hint row. */}
          <div className="hidden shrink-0 text-right sm:block">
            <p className="font-display text-[length:var(--text-step-2)] leading-none text-gold-soft">
              {MEMORIES.length}
            </p>
            <p className="eyebrow mt-2 text-cream/45">moments</p>
          </div>
        </div>

        <p className="mb-6 flex items-baseline gap-2 text-[length:var(--text-step--1)] text-rose-light/80">
          {MEMORIES_HINT}
          <span className="text-cream/40 sm:hidden">· {MEMORIES.length} moments</span>
        </p>

        <div className="columns-2 gap-4 sm:columns-3 sm:gap-5 lg:columns-4">
          {MEMORIES.map((m, i) => (
            <PolaroidCard
              key={m.src}
              src={`${BASE}${m.src}`}
              thumb={`${BASE}${m.thumb}`}
              caption={m.caption}
              index={i}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </div>

      <Lightbox index={openIndex} onClose={() => setOpenIndex(null)} onNav={nav} />

      <RoamingCat palette="tuxedo" size={44} startDelay={5} />
    </Section>
  );
}
