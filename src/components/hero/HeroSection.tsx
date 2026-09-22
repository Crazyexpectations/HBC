import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from '@react-three/drei';
import Section from '../layout/Section';
import Reveal from '../layout/Reveal';
import SceneCanvas from '../three/SceneCanvas';
import GiftBoxDecorative from '../three/GiftBoxDecorative';
import RoamingCat from '../cats/RoamingCat';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { letterIn, reduceVariants, riseIn } from '../../lib/motion';
import { HERO, HER_NAME } from '../../content';

const TITLE = HERO.title;

// Pre-compute each character's index across the whole title so the stagger
// runs continuously through the line rather than restarting per word.
const TITLE_CHARS = (() => {
  let i = 0;
  return TITLE.split(' ').map((word) => ({
    word,
    chars: word.split('').map((ch) => ({ ch, index: i++ })),
  }));
})();

export default function HeroSection() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  useScrollParallax(sceneRef, reduced ? 0 : 90, isMobile);

  const chars = reduceVariants(letterIn, reduced);

  return (
    <Section id="hero" tone="arrival" density="full" label="Happy birthday">
      <div ref={sceneRef} className="absolute inset-0">
        <SceneCanvas camera={{ position: [0, 0.3, 5.2], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.45} />
            <pointLight position={[3, 3, 4]} intensity={1.4} color="#e0708a" />
            <pointLight position={[-4, -2, -2]} intensity={0.6} color="#9c5cc4" />
            <directionalLight position={[0, 5, 5]} intensity={0.5} color="#fff4e8" />

            {/* Sits low and pushed back so it reads as scenery behind the copy.
                Offset to one side on mobile: dead-centre put it directly under
                the scroll cue, which then rendered on top of the lid. */}
            <GiftBoxDecorative
              position={isMobile ? [-1.15, -2.6, -1.8] : [0, -1.95, -1.9]}
              scale={isMobile ? 0.36 : 0.55}
            />

            <Sparkles count={isMobile ? 22 : 46} scale={9} size={2} speed={reduced ? 0 : 0.25} color="#fff4e8" opacity={0.55} />
            <Sparkles count={isMobile ? 8 : 16} scale={6} size={4} speed={reduced ? 0 : 0.6} color="#ffdfa0" opacity={0.75} />
          </Suspense>
        </SceneCanvas>
      </div>

      {/* Horizon glow — grounds the composition so the title isn't floating in
          an undifferentiated void. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(232,62,99,0.2), transparent 70%)' }}
      />

      <RoamingCat palette="ginger" size={44} startDelay={3} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Reveal variants={riseIn(-10)} immediate as="p" className="eyebrow mb-5 text-rose-light/80">
          {HERO.eyebrow}
        </Reveal>

        <h1
          className="heading-hero text-glow flex flex-wrap justify-center gap-x-[0.26em] text-cream"
          style={{ perspective: 800 }}
        >
          {TITLE_CHARS.map(({ word, chars: wordChars }) => (
            <span key={word} className="inline-flex whitespace-nowrap">
              {wordChars.map(({ ch, index }) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={chars}
                  initial="hidden"
                  animate="show"
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ delay: reduced ? 0.4 : 1.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-script gold-glow mt-2 text-[length:var(--text-step-4)] leading-[0.9] text-gold"
        >
          {HER_NAME}
        </motion.h2>

        {/* Hairline rule + heart, instead of an emoji tacked onto the name. */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: reduced ? 0.5 : 1.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex w-full max-w-xs items-center gap-3"
          aria-hidden
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-rose/60" />
          <span className="text-sm text-rose">♥</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-rose/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.6 : 2.2, duration: 0.9 }}
          className="measure-tight mt-6 text-balance text-[length:var(--text-step-0)] text-cream/70"
        >
          {HERO.scrollHint}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0.8 : 2.7, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, 9, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-cream/55"
        >
          <span className="eyebrow text-[10px]">scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-cream/50 to-transparent" />
        </motion.div>
      </motion.div>
    </Section>
  );
}
