import { useEffect, useId, useRef, useState } from 'react';
import Cat, { CAT_PALETTES } from './Cat';
import Mouse from './Mouse';
import { catWorld, type RenderState } from '../../lib/catWorld';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  size?: number;
  /** This cat occasionally notices the cursor nearby and makes a short playful dash to "catch" it. */
  chasesCursor?: boolean;
  startDelay?: number;
}

// A cat that's free to wander anywhere within its section — not pinned to a
// strip along the bottom. All the actual behavior (wandering, pausing to
// sit/nap/lounge/dance/hunt, chasing the cursor) lives in the shared
// catWorld engine; this component just registers an entity on mount, reads
// back its render state, and unregisters on unmount. Works on touch too
// (tap to pounce/pet).
export default function RoamingCat({ palette = 'charcoal', size = 46, chasesCursor = false, startDelay = 2 }: Props) {
  const id = useId();
  const [render, setRender] = useState<RenderState>({ mode: 'idle', flip: false, mousePos: null, visible: false, ready: false });
  const [pounceSignal, setPounceSignal] = useState(0);
  const musicPlaying = useAppStore((s) => s.musicPlaying);

  const containerRef = useRef<HTMLDivElement>(null);
  const catElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    catWorld.registerWander({
      id,
      containerEl: containerRef.current,
      el: catElRef.current,
      chasesCursor,
      startDelayMs: startDelay * 1000,
      cb: {
        onChange: setRender,
        onPounce: () => setPounceSignal((s) => s + 1),
      },
    });
    return () => catWorld.unregister(id);
  }, [id, chasesCursor, startDelay]);

  // While off-screen or still waiting out its entrance delay, skip
  // rendering the (fairly detailed) cat SVG entirely — with several of
  // these on the page, the React cost of their mode-driven re-renders adds
  // up even when nothing is visibly animating.
  const shouldRenderCat = render.ready && render.visible;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {shouldRenderCat && render.mousePos && <Mouse x={render.mousePos.x} y={render.mousePos.y} />}
      <div
        ref={catElRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ opacity: render.ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >
        <div className="pointer-events-auto">
          {shouldRenderCat && (
            <Cat palette={palette} size={size} mode={render.mode} flip={render.flip} pounceSignal={pounceSignal} muted={!musicPlaying} />
          )}
        </div>
      </div>
    </div>
  );
}
