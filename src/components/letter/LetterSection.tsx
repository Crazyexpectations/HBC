import { motion } from 'framer-motion';
import Section from '../layout/Section';
import RosePetals from './RosePetals';
import Envelope from './Envelope';

export default function LetterSection() {
  return (
    <Section id="letter" bgClassName="bg-gradient-to-b from-midnight via-[#3b0f2e] to-midnight-deep">
      <RosePetals />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-10 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-rose-light/70">a letter, for you</p>
        <h2 className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl">Love Letter</h2>
      </motion.div>

      <Envelope />
    </Section>
  );
}
