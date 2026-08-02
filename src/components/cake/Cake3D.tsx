import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import Candle from './Candle';
import { useAppStore } from '../../store/useAppStore';
import { CAKE } from '../../content';

const CANDLE_COLORS = ['#e0355c', '#f0b854', '#f5a8b8', '#9c1f3f', '#ffdb94'];

export default function Cake3D() {
  const group = useRef<Group>(null);
  const candlesLit = useAppStore((s) => s.candlesLit);
  const lightCandle = useAppStore((s) => s.lightCandle);

  const candlePositions = useMemo(() => {
    const radius = 0.75;
    return Array.from({ length: CAKE.candleCount }, (_, i) => {
      const angle = (i / CAKE.candleCount) * Math.PI * 2;
      return [Math.cos(angle) * radius, 0.95, Math.sin(angle) * radius] as [number, number, number];
    });
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      {/* plate */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.05, 48]} />
        <meshStandardMaterial color="#fff3e6" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* bottom tier */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.4, 0.7, 48]} />
        <meshStandardMaterial color="#f2e2d2" roughness={0.55} />
      </mesh>

      {/* top tier */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.0, 0.55, 48]} />
        <meshStandardMaterial color="#f0d9d0" roughness={0.55} />
      </mesh>

      {/* frosting drip ring — rotated flat so it wraps around the tier like a band, not facing the camera */}
      <mesh position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.06, 12, 48]} />
        <meshStandardMaterial color="#e0355c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.36, 0.05, 12, 48]} />
        <meshStandardMaterial color="#9c1f3f" roughness={0.4} />
      </mesh>

      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} lit={candlesLit[i]} color={CANDLE_COLORS[i % CANDLE_COLORS.length]} onClick={() => lightCandle(i)} />
      ))}
    </group>
  );
}
