import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import type { Group, Mesh, PerspectiveCamera as PerspectiveCameraType } from 'three';
import { MathUtils } from 'three';
import { useAppStore } from '../../store/useAppStore';

export default function RingReveal3D() {
  const revealed = useAppStore((s) => s.ringRevealed);
  const revealRing = useAppStore((s) => s.revealRing);

  const lidRef = useRef<Group>(null);
  const ringGroupRef = useRef<Group>(null);
  const gemRef = useRef<Mesh>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    // lid: pops up and away rather than hinge-swinging — a swinging flat
    // panel this close to the camera reads as a giant slab blocking the
    // shot mid-rotation, so it just lifts off, shrinks, and spins away.
    if (lidRef.current) {
      const targetY = revealed ? 2.7 : 0.62;
      const targetZ = revealed ? -1.7 : 0;
      const targetScale = revealed ? 0.35 : 1;
      lidRef.current.position.y = MathUtils.damp(lidRef.current.position.y, targetY, 3, delta);
      lidRef.current.position.z = MathUtils.damp(lidRef.current.position.z, targetZ, 3, delta);
      const s = MathUtils.damp(lidRef.current.scale.x, targetScale, 3, delta);
      lidRef.current.scale.setScalar(s);
      if (revealed) lidRef.current.rotation.y += delta * 1.8;
    }

    // ring: rises out of the box and settles
    if (ringGroupRef.current) {
      const targetY = revealed ? 0.95 : 0.1;
      const targetScale = revealed ? 1 : 0.001;
      ringGroupRef.current.position.y = MathUtils.damp(ringGroupRef.current.position.y, targetY, 3.2, delta);
      const s = MathUtils.damp(ringGroupRef.current.scale.x, targetScale, 3.5, delta);
      ringGroupRef.current.scale.setScalar(s);
      ringGroupRef.current.rotation.y += delta * 0.6;
    }

    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 1.2;
    }

    // camera zoom-in toward the box/ring once revealed
    const cam = camera as PerspectiveCameraType;
    const targetZ = revealed ? 3.4 : 5.2;
    const targetY = revealed ? 0.9 : 0.4;
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, 2.4, delta);
    cam.position.y = MathUtils.damp(cam.position.y, targetY, 2.4, delta);
    cam.lookAt(0, 0.6, 0);
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={revealed ? 0.3 : 0.7}>
        <group
          onClick={(e) => {
            e.stopPropagation();
            if (!revealed) revealRing();
          }}
        >
          {/* box body */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.85, 1.3]} />
            <meshStandardMaterial color="#c9184a" roughness={0.35} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.2, 0.87, 1.32]} />
            <meshStandardMaterial color="#f6c453" roughness={0.25} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.32, 0.87, 0.2]} />
            <meshStandardMaterial color="#f6c453" roughness={0.25} metalness={0.35} />
          </mesh>

          {/* lid */}
          <group ref={lidRef} position={[0, 0.62, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.22, 1.4]} />
              <meshStandardMaterial color="#f6c453" roughness={0.3} metalness={0.3} />
            </mesh>
          </group>
        </group>
      </Float>

      {/* ring rising from inside the box */}
      <group ref={ringGroupRef} position={[0, 0.1, 0]} scale={0.001}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.045, 24, 64]} />
          <meshStandardMaterial color="#f6c453" roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh ref={gemRef} position={[0, 0.26, 0]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color="#ffe3ec" roughness={0.05} metalness={0.1} emissive="#ff5c8a" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {revealed && <Sparkles count={80} scale={2.4} size={3} speed={0.5} color="#ffe3a3" position={[0, 0.9, 0]} />}
    </group>
  );
}
