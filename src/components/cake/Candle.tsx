import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, PointLight } from 'three';

interface Props {
  position: [number, number, number];
  lit: boolean;
  onClick: () => void;
  color: string;
}

export default function Candle({ position, lit, onClick, color }: Props) {
  const flameRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (!lit) return;
    const t = state.clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 18 + position[0] * 10) * 0.12 + Math.sin(t * 7) * 0.06;
    if (flameRef.current) flameRef.current.scale.setScalar(flicker);
    if (lightRef.current) lightRef.current.intensity = 1.1 * flicker;
  });

  return (
    <group position={position}>
      {/* invisible, generously-sized hit target — the visible stick is only
          ~7% of a world unit wide, far too thin to reliably click/tap */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (!lit) onClick();
        }}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.9, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* stick */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {lit && (
        <>
          <mesh ref={flameRef} position={[0, 0.32, 0]}>
            <coneGeometry args={[0.06, 0.18, 10]} />
            <meshStandardMaterial color="#ffb347" emissive="#ff8a00" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          <pointLight ref={lightRef} position={[0, 0.34, 0]} color="#ffb347" intensity={1.1} distance={2.2} />
        </>
      )}

      {!lit && (
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      )}
    </group>
  );
}
