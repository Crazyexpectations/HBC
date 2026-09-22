import { Suspense, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from '@react-three/drei';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import SceneCanvas from '../three/SceneCanvas';
import Cake3D from './Cake3D';
import { useAppStore } from '../../store/useAppStore';
import { useMicBlow } from '../../hooks/useMicBlow';
import { launchFireworks } from '../../lib/fireworks';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { crossFade } from '../../lib/motion';
import RoamingCat from '../cats/RoamingCat';
import { CAKE } from '../../content';

export default function CakeSection() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const candlesLit = useAppStore((s) => s.candlesLit);
  const extinguishAll = useAppStore((s) => s.extinguishAll);
  const cakeCompleted = useAppStore((s) => s.cakeCompleted);
  const markCakeCompleted = useAppStore((s) => s.markCakeCompleted);

  const [sectionInView, setSectionInView] = useState(false);
  const litCount = candlesLit.filter(Boolean).length;
  const total = candlesLit.length;
  const allLit = litCount === total;

  const handleBlow = useCallback(() => {
    extinguishAll();
    markCakeCompleted();
    launchFireworks();
  }, [extinguishAll, markCakeCompleted]);

  const { status } = useMicBlow({
    active: sectionInView && allLit && !cakeCompleted,
    onBlow: handleBlow,
  });

  return (
    <Section id="cake" tone="lit" density="full" label="Make a wish">
      <motion.div
        onViewportEnter={() => setSectionInView(true)}
        onViewportLeave={() => setSectionInView(false)}
        viewport={{ amount: 0.3 }}
        className="pointer-events-none absolute inset-0"
      />

      <SectionHeading title={CAKE.title} sub={CAKE.subtitle} className="mb-6" />

      <div className="relative z-10 h-[380px] w-full max-w-lg sm:h-[440px]">
        <SceneCanvas camera={{ position: [0, 1.6, 4.2], fov: 42 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} />
            <pointLight position={[3, 4, 3]} intensity={0.9} color="#ffdfa0" />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#e0708a" />
            <directionalLight position={[-2, 3, 2]} intensity={0.5} />
            <Sparkles
              count={isMobile ? 12 : 25}
              scale={4}
              size={2.5}
              speed={reduced ? 0 : 0.3}
              color="#ffdfa0"
              opacity={0.5}
            />
            <Cake3D />
          </Suspense>
        </SceneCanvas>
      </div>

      <div className="relative z-10 mt-4 flex flex-col items-center gap-3">
        {/* Progress as a row of dots rather than "2 / 5 candles lit" — you can
            read it at a glance without parsing text, and it mirrors the actual
            candles on the cake. */}
        <div className="flex items-center gap-2" role="status" aria-label={`${litCount} of ${total} candles lit`}>
          {candlesLit.map((lit, i) => (
            <span
              key={i}
              aria-hidden
              className="h-1.5 w-1.5 rounded-full transition-all duration-500"
              style={{
                background: lit ? 'var(--color-gold-soft)' : 'rgba(255,244,232,0.2)',
                boxShadow: lit ? '0 0 10px var(--color-gold)' : 'none',
                transform: lit ? 'scale(1.35)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {allLit && !cakeCompleted && (
            <motion.div
              key="blow-prompt"
              variants={crossFade}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col items-center gap-3"
            >
              <p className="font-script text-[length:var(--text-step-1)] text-gold-soft">
                {status === 'listening' ? 'blow into your mic 🎙️' : 'make a wish, then blow'}
              </p>
              <button
                data-cursor="hover"
                onClick={handleBlow}
                className="glass rounded-full px-6 py-3 text-sm font-medium text-cream"
              >
                {status === 'denied' || status === 'unsupported' ? "can't blow? tap to extinguish" : 'or just tap here'}
              </button>
            </motion.div>
          )}

          {cakeCompleted && (
            <motion.p
              key="after"
              variants={crossFade}
              initial="hidden"
              animate="show"
              className="measure mt-1 text-center text-[length:var(--text-step-0)] text-cream/85"
            >
              {CAKE.afterMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <RoamingCat palette="cream" size={40} startDelay={4} />
    </Section>
  );
}
