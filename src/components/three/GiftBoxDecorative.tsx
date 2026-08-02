import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { Group } from 'three';

interface Props {
  color?: string;
  ribbonColor?: string;
  position?: [number, number, number];
  scale?: number;
}

// A purely decorative low-poly gift box that slowly spins and bobs — used to
// dress the hero scene. The interactive "open me" box lives in the Surprise
// section as its own component with its own lid-opening animation.
export default function GiftBoxDecorative({
  color = '#a3243f',
  ribbonColor = '#c9a15a',
  position = [0, 0, 0],
  scale = 1,
}: Props) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={group} position={position} scale={scale}>
        {/* box body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 1.1, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
        </mesh>
        {/* lid */}
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[1.5, 0.22, 1.5]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.5} metalness={0.1} emissive={ribbonColor} emissiveIntensity={0.15} />
        </mesh>
        {/* ribbon vertical */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 1.14, 1.42]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.5} metalness={0.1} emissive={ribbonColor} emissiveIntensity={0.15} />
        </mesh>
        {/* ribbon horizontal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.42, 1.14, 0.22]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.5} metalness={0.1} emissive={ribbonColor} emissiveIntensity={0.15} />
        </mesh>
        {/* bow */}
        <group position={[0, 0.8, 0]}>
          <mesh rotation={[0, 0, Math.PI / 5]}>
            <torusGeometry args={[0.22, 0.08, 12, 24]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.4} metalness={0.15} emissive={ribbonColor} emissiveIntensity={0.15} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 5]}>
            <torusGeometry args={[0.22, 0.08, 12, 24]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.4} metalness={0.15} emissive={ribbonColor} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.4} metalness={0.15} emissive={ribbonColor} emissiveIntensity={0.15} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
