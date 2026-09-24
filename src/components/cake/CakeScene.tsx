import { Suspense } from 'react';
import { Sparkles } from '@react-three/drei';
import SceneCanvas from '../three/SceneCanvas';
import Cake3D from './Cake3D';

interface Props {
  isMobile: boolean;
  reduced: boolean;
}

/** The cake scene, split out so it's `lazy()`-loaded and its WebGL context
 *  isn't created until she's actually scrolled near the cake. */
export default function CakeScene({ isMobile, reduced }: Props) {
  return (
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
  );
}
