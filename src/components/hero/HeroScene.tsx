import { Suspense } from 'react';
import { Sparkles } from '@react-three/drei';
import SceneCanvas from '../three/SceneCanvas';
import GiftBoxDecorative from '../three/GiftBoxDecorative';

interface Props {
  isMobile: boolean;
  reduced: boolean;
}

/**
 * The hero's 3D backdrop, in its own module so it can be `lazy()`-loaded.
 *
 * Splitting this out is what keeps Three.js (by far the heaviest dependency
 * here) out of the entry chunk — the page can paint the headline and the
 * copy, then fill the scenery in behind it, rather than parsing a megabyte
 * of WebGL library before anything at all appears.
 */
export default function HeroScene({ isMobile, reduced }: Props) {
  return (
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

        <Sparkles
          count={isMobile ? 22 : 46}
          scale={9}
          size={2}
          speed={reduced ? 0 : 0.25}
          color="#fff4e8"
          opacity={0.55}
        />
        <Sparkles
          count={isMobile ? 8 : 16}
          scale={6}
          size={4}
          speed={reduced ? 0 : 0.6}
          color="#ffdfa0"
          opacity={0.75}
        />
      </Suspense>
    </SceneCanvas>
  );
}
