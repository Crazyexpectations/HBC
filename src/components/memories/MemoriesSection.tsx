import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import PolaroidCard from './PolaroidCard';
import Lightbox from './Lightbox';
import RoamingCat from '../cats/RoamingCat';
import { MEMORIES, MEMORIES_HINT } from '../../content';

const BASE = import.meta.env.BASE_URL;

export default function MemoriesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const nav = useCallback((dir: 1 | -1) => {
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i + dir + MEMORIES.length) % MEMORIES.length;
    });
  }, []);

  return (
    <Section id="memories" bgClassName="bg-gradient-to-b from-midnight via-[#2c1119] to-midnight" className="py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-14 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-rose-light/70">a little time capsule</p>
        <h2 className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl">Our Memories</h2>
        <p className="mt-3 text-sm text-cream/60">every one of these is a day I'd relive on repeat</p>
        <motion.p
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="glass mx-auto mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-rose-light"
        >
          <span aria-hidden>👆</span> {MEMORIES_HINT}
        </motion.p>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl columns-2 gap-5 sm:columns-3 lg:columns-4">
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

      <Lightbox index={openIndex} onClose={() => setOpenIndex(null)} onNav={nav} />

      <RoamingCat palette="tuxedo" size={44} startDelay={5} />
    </Section>
  );
}
