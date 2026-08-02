import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MemoryMatchGame from './MemoryMatchGame';
import CatchGame from './CatchGame';

// No roaming cat in this section on purpose — it would wander over the
// falling hearts and get in the way of actually playing the game.
export default function GamesSection() {
  return (
    <Section id="games" bgClassName="bg-gradient-to-b from-midnight via-[#241019] to-midnight-deep" className="gap-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-4 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-rose-light/70">okay, one more thing before cake</p>
        <h2 className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl">Play With Me</h2>
        <p className="mt-3 text-sm text-cream/60">two tiny games, made just for you</p>
      </motion.div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <MemoryMatchGame />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <CatchGame />
        </motion.div>
      </div>
    </Section>
  );
}
