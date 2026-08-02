import { useEffect, useId, useRef, useState } from 'react';
import Cat from './Cat';
import { catWorld, type RenderState } from '../../lib/catWorld';
import { useAppStore } from '../../store/useAppStore';

let printId = 0;

// A little cat that follows your cursor around like a pet — chases it when
// you move, sits and blinks when you stop, naps if you leave it alone long
// enough (move the mouse again to wake it), and every so often makes a
// genuine playful lunge to "catch" the cursor tip before settling back down.
// All the behavior lives in the shared catWorld engine (the same one that
// drives every roaming cat); this component just registers itself as a
// "follow" entity and renders whatever it reports back. Desktop only (no
// persistent pointer to chase on touch).
export default function CursorCat() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [render, setRender] = useState<RenderState>({ mode: 'idle', flip: false, mousePos: null, visible: true, ready: true });
  const [pounceSignal, setPounceSignal] = useState(0);
  const [prints, setPrints] = useState<{ id: number; x: number; y: number; side: number }[]>([]);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    catWorld.registerFollow({
      id,
      el: elRef.current,
      cb: {
        onChange: setRender,
        onPounce: () => setPounceSignal((s) => s + 1),
        onPawPrint: (x, y, side) => {
          printId += 1;
          const pid = printId;
          setPrints((p) => [...p, { id: pid, x, y, side }]);
          window.setTimeout(() => setPrints((p) => p.filter((pr) => pr.id !== pid)), 1800);
        },
      },
    });
    return () => catWorld.unregister(id);
  }, [id, enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[5]">
        {prints.map((pr) => (
          <span
            key={pr.id}
            className="paw-print absolute text-[10px]"
            style={{ left: pr.x + pr.side * 10, top: pr.y }}
            aria-hidden
          >
            🐾
          </span>
        ))}
      </div>
      {/* Deliberately a LOW z-index (below the z-10 convention every real
          button/card on this site uses) so the companion cat never steals
          clicks from actual UI — it's a decorative layer, not chrome. */}
      <div ref={elRef} className="pointer-events-none fixed left-0 top-0 z-[6] -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-auto">
          <Cat palette="ginger" size={52} mode={render.mode} flip={render.flip} pounceSignal={pounceSignal} muted={!musicPlaying} />
        </div>
      </div>
    </>
  );
}
