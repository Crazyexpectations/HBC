import { Suspense } from 'react';
import SceneCanvas from '../three/SceneCanvas';
import LanternRelease3D from './LanternRelease3D';

/** The lantern scene, split out so it's `lazy()`-loaded and its WebGL context
 *  isn't created until she's actually scrolled near it. */
export default function LanternScene() {
  return (
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
  );
}
