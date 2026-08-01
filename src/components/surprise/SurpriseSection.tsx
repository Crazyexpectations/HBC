import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Section from '../layout/Section';
import SceneCanvas from '../three/SceneCanvas';
import RingReveal3D from './RingReveal3D';
import { useAppStore } from '../../store/useAppStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import { SURPRISE } from '../../content';

export default function SurpriseSection() {
  const revealed = useAppStore((s) => s.ringRevealed);
  const isMobile = useIsMobile();

  return (
    <Section id="surprise" bgClassName="bg-gradient-to-b from-midnight via-[#2a0e2e] to-midnight-deep">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-4 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.h2
            key={revealed ? 'reveal' : 'title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="font-display text-glow text-4xl font-bold text-cream sm:text-5xl"
          >
            {revealed ? SURPRISE.revealTitle : SURPRISE.title}
          </motion.h2>
        </AnimatePresence>
        <p className="mt-3 text-sm text-cream/60">{revealed ? SURPRISE.revealText : SURPRISE.subtitle}</p>
      </motion.div>

      <div className="relative z-10 h-[420px] w-full max-w-lg sm:h-[480px]" data-cursor="hover">
        <SceneCanvas camera={{ position: [0, 0.4, 5.2], fov: 42 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1.1} color="#ffb6c9" />
            <pointLight position={[-3, 1, -2]} intensity={0.5} color="#8a4fff" />
            <directionalLight position={[0, 4, 4]} intensity={0.4} />
            <RingReveal3D />
            {!isMobile && (
              <EffectComposer>
                <Bloom intensity={0.5} luminanceThreshold={0.3} mipmapBlur />
              </EffectComposer>
            )}
          </Suspense>
        </SceneCanvas>
      </div>
    </Section>
  );
}
