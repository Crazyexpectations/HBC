import { useRef } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../layout/Reveal';
import StarsCss from '../ui/StarsCss';
import FloatingEmojis from '../ui/FloatingEmojis';
import RoamingCat from '../cats/RoamingCat';
import { useLenisInstance } from '../../lib/LenisProvider';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { riseIn } from '../../lib/motion';
import { ENDING } from '../../content';

export default function EndingSection() {
  const lenis = useLenisInstance();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const moonRef = useRef<HTMLDivElement>(null);
  useScrollParallax(moonRef, reduced ? 0 : -50, isMobile);

  const replay = () => {
    if (lenis) lenis.scrollTo(0, { duration: reduced ? 0 : 2.2 });
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <Section id="ending" tone="close" density="full" label={ENDING.title} vignette={false}>
      <StarsCss count={110} />

      <div
        ref={moonRef}
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full sm:-right-10 sm:-top-10 sm:h-56 sm:w-56 md:h-72 md:w-72"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fff4e8, #ffdfa0 45%, transparent 70%)',
          boxShadow: '0 0 120px 40px rgba(227,201,147,0.22)',
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
        count={isMobile ? 10 : 20}
        minSize={14}
        maxSize={26}
        minDuration={9}
        maxDuration={18}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Reveal variants={riseIn(20)}>
          <h2 className="heading-hero text-glow text-cream">{ENDING.title}</h2>
        </Reveal>

        <Reveal variants={riseIn(18, 0.15)}>
          <p className="font-script measure mt-6 text-[length:var(--text-step-2)] leading-snug text-gold-soft">
            {ENDING.subtitle}
          </p>
        </Reveal>

        <Reveal variants={riseIn(14, 0.3)}>
          <motion.button
            data-cursor="hover"
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            onClick={replay}
            className="glass mt-12 rounded-full px-8 py-3.5 text-sm font-medium text-cream"
          >
            {ENDING.replay} ↑
          </motion.button>
        </Reveal>
      </div>

      <RoamingCat palette="charcoal" size={44} startDelay={6} chasesCursor />
    </Section>
  );
}
