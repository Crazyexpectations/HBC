import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../layout/Reveal';
import SceneCanvas from '../three/SceneCanvas';
import LanternRelease3D from './LanternRelease3D';
import RoamingCat from '../cats/RoamingCat';
import { useAppStore } from '../../store/useAppStore';
import { crossFade, riseIn } from '../../lib/motion';
import { SURPRISE } from '../../content';

export default function SurpriseSection() {
  const released = useAppStore((s) => s.lanternReleased);
  const releaseLantern = useAppStore((s) => s.releaseLantern);

  return (
    <Section id="surprise" tone="dawn" density="full" label="One last thing">
      <RoamingCat palette="tuxedo" size={40} startDelay={5} />

      <Reveal variants={riseIn(24)} className="relative z-10 mb-4 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={released ? 'reveal' : 'title'}
            variants={crossFade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="heading-section text-glow text-cream"
          >
            {released ? SURPRISE.revealTitle : SURPRISE.title}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={released ? 'reveal-sub' : 'sub'}
            variants={crossFade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="measure mt-4 text-[length:var(--text-step-0)] text-cream/70"
          >
            {released ? SURPRISE.revealText : SURPRISE.subtitle}
          </motion.p>
        </AnimatePresence>
      </Reveal>

      <div className="relative z-10 h-[420px] w-full max-w-lg sm:h-[480px]" data-cursor="hover">
        {/* Aura behind the lantern so it reads as the light source of the scene. */}
        <div
          aria-hidden
          className="motion-decorative animate-aura pointer-events-none absolute inset-0 m-auto h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,180,92,0.4), transparent 68%)' }}
        />
        <SceneCanvas camera={{ position: [0, 0.4, 5.2], fov: 42 }}>
          <Suspense fallback={null}>
            {/* Deliberately dim: the lantern's own point light is what should
                be lighting this scene, not a studio rig. */}
            <ambientLight intensity={0.25} />
            <pointLight position={[-3, 2, -2]} intensity={0.35} color="#e8927e" />
            <directionalLight position={[0, 4, 4]} intensity={0.2} color="#ffd9a0" />
            <LanternRelease3D />
          </Suspense>
        </SceneCanvas>
      </div>

      {/* The lantern itself is a 3D object, so it can't be tabbed to or tapped
          reliably on a phone. This is the same action, reachable. */}
      {!released && (
        <Reveal variants={riseIn(14, 0.2)} className="relative z-10 mt-2">
          <button
            type="button"
            data-cursor="hover"
            onClick={releaseLantern}
            className="glass rounded-full px-7 py-3 text-sm font-medium text-cream"
          >
            let it go 🏮
          </button>
        </Reveal>
      )}
    </Section>
  );
}
