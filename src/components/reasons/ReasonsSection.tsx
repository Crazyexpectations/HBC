import { motion } from 'framer-motion';
import Section from '../layout/Section';
import ReasonCard from './ReasonCard';
import { REASONS } from '../../content';

export default function ReasonsSection() {
  return (
    <Section id="reasons" bgClassName="bg-gradient-to-b from-midnight-deep via-midnight-soft to-midnight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-14 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-rose-light/70">just a few, out of infinite</p>
        <h2 className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl">Reasons I Love You</h2>
        <p className="mt-3 text-sm text-cream/60">tap a card 💥</p>
      </motion.div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <ReasonCard key={r.title} index={i} {...r} />
        ))}
      </div>
    </Section>
  );
}
