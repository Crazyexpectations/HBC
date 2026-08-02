import { Suspense, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Sparkles } from '@react-three/drei';
import Section from '../layout/Section';
import SceneCanvas from '../three/SceneCanvas';
import GiftBoxDecorative from '../three/GiftBoxDecorative';
import FloatingEmojis from '../ui/FloatingEmojis';
import RoamingCat from '../cats/RoamingCat';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { HER_NAME } from '../../content';

const title = 'Happy Birthday';
const titleWords = title.split(' ').reduce<{ word: string; startIndex: number }[]>((acc, word) => {
  const startIndex = acc.length ? acc[acc.length - 1].startIndex + acc[acc.length - 1].word.length + 1 : 0;
  acc.push({ word, startIndex });
  return acc;
}, []);

const letterVariants: Variants = {
  hidden: { y: 40, opacity: 0, rotateX: -60 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { delay: 0.5 + i * 0.045, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroSection() {
  const isMobile = useIsMobile();
  const sceneRef = useRef<HTMLDivElement>(null);
  useScrollParallax(sceneRef, 90, isMobile);

  return (
    <Section id="hero" bgClassName="bg-gradient-to-b from-midnight-deep via-midnight-soft to-midnight">
      <div ref={sceneRef} className="absolute inset-0">
        <SceneCanvas camera={{ position: [0, 0.3, 5.2], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 3, 4]} intensity={1.4} color="#e0708a" />
            <pointLight position={[-4, -2, -2]} intensity={0.6} color="#d9803f" />
            <directionalLight position={[0, 5, 5]} intensity={0.5} color="#fff3e6" />

            <GiftBoxDecorative position={isMobile ? [0, -2.3, -1.4] : [0, -1.35, -0.8]} scale={isMobile ? 0.4 : 0.6} />

            <Sparkles count={isMobile ? 25 : 50} scale={9} size={2} speed={0.25} color="#fff3e6" opacity={0.6} />
            <Sparkles count={isMobile ? 8 : 18} scale={6} size={4} speed={0.6} color="#ffdb94" opacity={0.8} />
          </Suspense>
        </SceneCanvas>
      </div>

      <FloatingEmojis items={['🎈', '🎈', '🎈']} count={isMobile ? 6 : 12} minSize={30} maxSize={54} minDuration={12} maxDuration={22} />

      <RoamingCat palette="ginger" size={44} startDelay={3} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-3 text-xs uppercase tracking-[0.4em] text-rose-light/80"
        >
          a little universe, just for you
        </motion.p>

        <h1
          className="text-glow font-display flex flex-wrap justify-center gap-x-[0.25em] text-4xl font-extrabold text-cream sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ perspective: 800 }}
        >
          {titleWords.map(({ word, startIndex }) => (
            <span key={word} className="inline-flex whitespace-nowrap">
              {word.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  custom={startIndex + i}
                  variants={letterVariants}
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
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-script gold-glow mt-1 text-6xl text-gold sm:text-7xl md:text-8xl"
        >
          {HER_NAME} ❤️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.9 }}
          className="mt-6 max-w-md text-balance text-sm text-cream/70 sm:text-base"
        >
          Scroll down. I made you something that took a lot longer than picking out a gift.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-cream/60"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">scroll</span>
          <span className="text-lg">↓</span>
        </motion.div>
      </motion.div>
    </Section>
  );
}
