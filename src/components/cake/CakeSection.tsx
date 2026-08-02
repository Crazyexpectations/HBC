import { Suspense, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from '@react-three/drei';
import Section from '../layout/Section';
import SceneCanvas from '../three/SceneCanvas';
import Cake3D from './Cake3D';
import { useAppStore } from '../../store/useAppStore';
import { useMicBlow } from '../../hooks/useMicBlow';
import { launchFireworks } from '../../lib/fireworks';
import { useIsMobile } from '../../hooks/useIsMobile';
import RoamingCat from '../cats/RoamingCat';
import { CAKE } from '../../content';

export default function CakeSection() {
  const isMobile = useIsMobile();
  const candlesLit = useAppStore((s) => s.candlesLit);
  const extinguishAll = useAppStore((s) => s.extinguishAll);
  const cakeCompleted = useAppStore((s) => s.cakeCompleted);
  const markCakeCompleted = useAppStore((s) => s.markCakeCompleted);

  const [sectionInView, setSectionInView] = useState(false);
  const litCount = candlesLit.filter(Boolean).length;
  const allLit = litCount === candlesLit.length;

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
    <Section id="cake" bgClassName="bg-gradient-to-b from-midnight-deep via-[#241019] to-midnight">
      <motion.div
        onViewportEnter={() => setSectionInView(true)}
        onViewportLeave={() => setSectionInView(false)}
        viewport={{ amount: 0.3 }}
        className="pointer-events-none absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-6 text-center"
      >
        <h2 className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl">{CAKE.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-cream/60">{CAKE.subtitle}</p>
      </motion.div>

      <div className="relative z-10 h-[380px] w-full max-w-lg sm:h-[440px]">
        <SceneCanvas camera={{ position: [0, 1.6, 4.2], fov: 42 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 4, 3]} intensity={0.9} color="#e3c993" />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#c97a8a" />
            <directionalLight position={[-2, 3, 2]} intensity={0.5} />
            <Sparkles count={isMobile ? 12 : 25} scale={4} size={2.5} speed={0.3} color="#e3c993" opacity={0.5} />
            <Cake3D />
          </Suspense>
        </SceneCanvas>
      </div>

      <div className="relative z-10 mt-4 flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
          {litCount} / {candlesLit.length} candles lit
        </p>

        <AnimatePresence mode="wait">
          {allLit && !cakeCompleted && (
            <motion.div
              key="blow-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="font-script text-2xl text-gold-soft">
                {status === 'listening' ? 'blow into your mic 🎙️' : 'make a wish, then blow 🎂'}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-sm text-center text-base text-cream/85"
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
