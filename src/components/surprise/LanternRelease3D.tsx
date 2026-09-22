import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { DoubleSide, MathUtils, Vector2 } from 'three';
import type { Group, Mesh, MeshStandardMaterial, PerspectiveCamera as PerspectiveCameraType } from 'three';
import { useAppStore } from '../../store/useAppStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIsMobile } from '../../hooks/useIsMobile';

/**
 * A paper sky lantern. Tap it and it goes.
 *
 * The silhouette is a lathe — a profile curve spun around the Y axis — rather
 * than a stack of primitives, because a lantern is defined by its bulge and a
 * cylinder reads as a tin can. It's open at the bottom and `DoubleSide`, so
 * you can see the flame lighting the inside of the far wall through the mouth.
 */
const PROFILE = [
  new Vector2(0.30, -0.55),
  new Vector2(0.42, -0.42),
  new Vector2(0.50, -0.15),
  new Vector2(0.50, 0.15),
  new Vector2(0.42, 0.42),
  new Vector2(0.26, 0.58),
  new Vector2(0.10, 0.64),
];

/** How high it climbs before it stops mattering and just fades. */
const FADE_START = 5;
const FADE_END = 11;

export default function LanternRelease3D() {
  const released = useAppStore((s) => s.lanternReleased);
  const releaseLantern = useAppStore((s) => s.releaseLantern);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const groupRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const bodyMatRef = useRef<MeshStandardMaterial>(null);
  const velocity = useRef(0);
  const elapsed = useRef(0);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Flame flicker. Cheap, and it's most of what sells "there is a fire in
    // there" — a perfectly steady glow reads as a lightbulb.
    if (flameRef.current && !reduced) {
      const f = 1 + Math.sin(state.clock.elapsedTime * 11) * 0.12 + Math.sin(state.clock.elapsedTime * 19) * 0.07;
      flameRef.current.scale.set(f, f * 1.15, f);
    }

    if (released) {
      elapsed.current += delta;
      // Eases up to a drift speed instead of starting at full pace — a lantern
      // that snaps to terminal velocity on frame one looks fired, not let go.
      velocity.current = MathUtils.damp(velocity.current, 1.3, 0.9, delta);
      g.position.y += velocity.current * delta;
      g.position.z -= delta * 0.32;
      if (!reduced) {
        g.position.x = Math.sin(elapsed.current * 0.55) * 0.42;
        g.rotation.y += delta * 0.22;
      }

      if (bodyMatRef.current) {
        const t = MathUtils.inverseLerp(FADE_START, FADE_END, g.position.y);
        bodyMatRef.current.opacity = 0.95 * (1 - MathUtils.clamp(t, 0, 1));
      }
    }

    // The camera tilts up to watch it leave, but only so far — past that it's
    // meant to get small and go, not stay centred in frame forever.
    const cam = camera as PerspectiveCameraType;
    const follow = released ? Math.min(g.position.y * 0.55, 2.1) : 0;
    cam.position.y = MathUtils.damp(cam.position.y, 0.4 + follow, 1.8, delta);
    cam.lookAt(0, follow, 0);
  });

  return (
    <group>
      <DistantLanterns count={isMobile ? 4 : 8} paused={reduced} />

      <Float speed={reduced || released ? 0 : 1.1} rotationIntensity={0.1} floatIntensity={released ? 0 : 0.5}>
        <group
          ref={groupRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!released) releaseLantern();
          }}
        >
          {/* paper body */}
          <mesh>
            <latheGeometry args={[PROFILE, 32]} />
            <meshStandardMaterial
              ref={bodyMatRef}
              color="#ffd9a0"
              emissive="#ff9a4a"
              emissiveIntensity={1.35}
              roughness={0.95}
              metalness={0}
              side={DoubleSide}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* bamboo mouth ring */}
          <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.018, 8, 40]} />
            <meshStandardMaterial color="#b8845a" roughness={0.8} />
          </mesh>

          {/* the flame, and the light it actually casts */}
          <mesh ref={flameRef} position={[0, -0.44, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshBasicMaterial color="#fff0c4" />
          </mesh>
          <pointLight position={[0, -0.3, 0]} color="#ffb45c" intensity={5} distance={6} decay={2} />
        </group>
      </Float>

      {/* Embers trailing off it once it's away. */}
      {released && !reduced && (
        <Sparkles count={26} scale={[1.6, 3.5, 1.6]} size={2.4} speed={0.35} color="#ffc978" position={[0, 0.6, 0]} />
      )}
    </group>
  );
}

/**
 * The ones already up there. Nothing interactive — they exist so the sky she
 * is letting hers go into isn't empty.
 */
function DistantLanterns({ count, paused }: { count: number; paused: boolean }) {
  const ref = useRef<Group>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: MathUtils.randFloatSpread(9),
        y: MathUtils.randFloat(-4, 7),
        z: MathUtils.randFloat(-9, -3),
        speed: MathUtils.randFloat(0.09, 0.22),
        scale: MathUtils.randFloat(0.1, 0.22),
      })),
    [count]
  );

  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    for (const child of ref.current.children) {
      child.position.y += child.userData.speed * delta;
      // Wrap back underneath rather than respawning objects every few seconds.
      if (child.position.y > 8) child.position.y = -5;
    }
  });

  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} scale={s.scale} userData={{ speed: s.speed }}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffc06a" transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}
