import { useRef } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import StarsCss from '../ui/StarsCss';
import FloatingEmojis from '../ui/FloatingEmojis';
import RoamingCat from '../cats/RoamingCat';
import { useLenisInstance } from '../../lib/LenisProvider';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { ENDING } from '../../content';

export default function EndingSection() {
  const lenis = useLenisInstance();
  const isMobile = useIsMobile();
  const moonRef = useRef<HTMLDivElement>(null);
  useScrollParallax(moonRef, -50, isMobile);

  const replay = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Section id="ending" bgClassName="bg-gradient-to-b from-midnight-deep via-[#140a26] to-black">
      <StarsCss count={100} />

      {/* moon */}
      <div
        ref={moonRef}
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full sm:-right-10 sm:-top-10 sm:h-56 sm:w-56 md:h-72 md:w-72"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fff6f0, #ffe3a3 45%, transparent 70%)',
          boxShadow: '0 0 120px 40px rgba(255,227,163,0.25)',
        }}
      />

      <FloatingEmojis
        items={['🏮']}
        count={isMobile ? 4 : 8}
        minSize={26}
        maxSize={40}
        minDuration={16}
        maxDuration={26}
        className="opacity-70"
      />
      <FloatingEmojis
        items={['❤️', '💕', '💗', '💫']}
        count={isMobile ? 10 : 22}
        minSize={14}
        maxSize={26}
        minDuration={9}
        maxDuration={18}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-5xl"
        >
          🌙💗
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-glow font-display animate-pulse-heart text-4xl font-bold text-cream sm:text-5xl md:text-6xl"
        >
          {ENDING.title} ❤️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-script mt-5 max-w-md text-2xl text-gold-soft sm:text-3xl"
        >
          {ENDING.subtitle}
        </motion.p>

        <motion.button
          data-cursor="hover"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          onClick={replay}
          className="glass mt-10 rounded-full px-7 py-3 text-sm font-medium text-cream"
        >
          {ENDING.replay} ↑
        </motion.button>
      </div>

      <RoamingCat palette="charcoal" bottom={20} duration={28} delay={6} size={44} />
    </Section>
  );
}
