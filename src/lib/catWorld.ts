// A small, self-contained simulation engine for every cat on the site.
//
// Previously each <RoamingCat> ran its own requestAnimationFrame loop, its
// own IntersectionObserver, and (for cursor-chasers) its own pointermove
// listener — seven independent copies of nearly the same code. This module
// is the opposite: ONE simulation world, ONE rAF loop, ONE cursor tracker,
// ONE visibility observer, driving every cat entity in a plain data registry
// that lives outside React entirely. Position is written straight to the DOM
// each frame (no React re-render for movement); React only gets touched when
// something a cat component actually needs to *render* differently changes
// (mode, facing direction, whether a mouse is nearby) — exactly the way a
// game engine separates simulation state from a thin view layer.
//
// React components (RoamingCat, CursorCat) are just "spawners": they mount,
// register an entity with a config + a callback, and unmount by
// unregistering. All the actual behavior — wandering, accelerating,
// deciding to nap or dance or hunt, chasing the cursor, catching it — lives
// here, in one place, so it's easy to reason about and easy to tune.

export type CatMode = 'idle' | 'walking' | 'sleeping' | 'laying' | 'dancing';
type Activity = 'sit' | 'sleep' | 'lay' | 'dance' | 'hunt';
type WanderPhase = 'walk' | 'pause' | 'chase';

export interface RenderState {
  mode: CatMode;
  flip: boolean;
  mousePos: { x: number; y: number } | null;
  visible: boolean;
  ready: boolean;
}

interface Callbacks {
  onChange: (state: RenderState) => void;
  onPounce: () => void;
  onPawPrint?: (x: number, y: number, side: number) => void;
}

interface WanderEntity {
  kind: 'wander';
  id: string;
  containerEl: HTMLElement;
  el: HTMLElement | null;
  chasesCursor: boolean;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  phase: WanderPhase;
  pauseEndAt: number;
  lastChaseAt: number;
  chaseStartedAt: number;
  huntPounces: number;
  huntNextPounceAt: number;
  huntEndAt: number;
  readyAt: number;
  render: RenderState;
  cb: Callbacks;
}

interface FollowEntity {
  kind: 'follow';
  id: string;
  el: HTMLElement | null;
  x: number;
  y: number;
  lastMoveAt: number;
  lastPrintAt: number;
  printSide: number;
  asleep: boolean;
  catching: boolean;
  nextCatchAt: number;
  catchEndAt: number;
  render: RenderState;
  cb: Callbacks;
}

type Entity = WanderEntity | FollowEntity;

// --- tuning constants (ported 1:1 from the previous per-cat implementation) ---
const MAX_WALK_SPEED = 60;
const MAX_CHASE_SPEED = 115;
const ACCEL = 260;
const DECEL_RADIUS = 46;
const ARRIVE_DIST = 5;
const CHASE_GIVE_UP_MS = 4000;
const CHASE_COOLDOWN_MS = 24000;
const CHASE_TRIGGER_RADIUS = 170;
const CHASE_CHECK_MS = 350;

const FOLLOW_OFFSET_X = 10;
const FOLLOW_OFFSET_Y = 16;
const FOLLOW_LERP = 0.16;
const FOLLOW_SLEEP_AFTER_MS = 20000;
const FOLLOW_CATCH_MIN_MS = 16000;
const FOLLOW_CATCH_MAX_MS = 30000;
const FOLLOW_CATCH_DURATION_MS = 700;

const ACTIVITY_WEIGHTS: [Activity, number][] = [
  ['sit', 5],
  ['hunt', 3],
  ['dance', 2],
  ['lay', 2],
  ['sleep', 1],
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickActivity(): Activity {
  const total = ACTIVITY_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [a, w] of ACTIVITY_WEIGHTS) {
    if (r < w) return a;
    r -= w;
  }
  return 'sit';
}

function activityToMode(a: Activity): CatMode {
  if (a === 'sleep') return 'sleeping';
  if (a === 'lay') return 'laying';
  if (a === 'dance') return 'dancing';
  return 'idle';
}

class CatWorld {
  private entities = new Map<string, Entity>();
  private cursor = { x: -9999, y: -9999 };
  private raf = 0;
  private lastTime = 0;
  private lastChaseCheck = 0;
  private cursorListenerAttached = false;
  private io: IntersectionObserver | null = null;

  private ensureCursorListener() {
    if (this.cursorListenerAttached || typeof window === 'undefined') return;
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.cursorListenerAttached = true;
  }

  private onPointerMove = (e: PointerEvent) => {
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  };

  private ensureObserver() {
    if (this.io || typeof IntersectionObserver === 'undefined') return;
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.catWorldId;
          const ent = id ? this.entities.get(id) : undefined;
          if (ent) this.setVisible(ent, entry.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
  }

  private setVisible(ent: Entity, visible: boolean) {
    if (ent.render.visible === visible) return;
    ent.render.visible = visible;
    ent.cb.onChange({ ...ent.render });
  }

  private ensureLoop() {
    if (this.raf) return;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  registerWander(config: {
    id: string;
    containerEl: HTMLElement;
    el: HTMLElement | null;
    chasesCursor: boolean;
    startDelayMs: number;
    cb: Callbacks;
  }) {
    this.ensureCursorListener();
    this.ensureObserver();
    const w = config.containerEl.clientWidth || 300;
    const h = config.containerEl.clientHeight || 300;
    const entity: WanderEntity = {
      kind: 'wander',
      id: config.id,
      containerEl: config.containerEl,
      el: config.el,
      chasesCursor: config.chasesCursor,
      x: rand(0, w),
      y: h * 0.75,
      targetX: 0,
      targetY: 0,
      speed: 0,
      readyAt: performance.now() + config.startDelayMs,
      phase: 'pause',
      pauseEndAt: performance.now() + rand(200, 900),
      lastChaseAt: 0,
      chaseStartedAt: 0,
      huntPounces: 0,
      huntNextPounceAt: 0,
      huntEndAt: 0,
      render: { mode: 'idle', flip: false, mousePos: null, visible: false, ready: false },
      cb: config.cb,
    };
    this.pickWaypoint(entity);
    config.containerEl.dataset.catWorldId = config.id;
    this.io?.observe(config.containerEl);
    this.entities.set(entity.id, entity);
    this.ensureLoop();
  }

  registerFollow(config: { id: string; el: HTMLElement | null; cb: Callbacks }) {
    this.ensureCursorListener();
    const entity: FollowEntity = {
      kind: 'follow',
      id: config.id,
      el: config.el,
      x: this.cursor.x,
      y: this.cursor.y,
      lastMoveAt: performance.now(),
      lastPrintAt: 0,
      printSide: 1,
      asleep: false,
      catching: false,
      nextCatchAt: performance.now() + rand(FOLLOW_CATCH_MIN_MS, FOLLOW_CATCH_MAX_MS),
      catchEndAt: 0,
      render: { mode: 'idle', flip: false, mousePos: null, visible: true, ready: true },
      cb: config.cb,
    };
    this.entities.set(entity.id, entity);
    this.ensureLoop();
  }

  unregister(id: string) {
    const ent = this.entities.get(id);
    if (ent?.kind === 'wander') this.io?.unobserve(ent.containerEl);
    this.entities.delete(id);
    if (this.entities.size === 0 && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private pickWaypoint(ent: WanderEntity, awayFrom?: { x: number; y: number }) {
    const w = ent.containerEl.clientWidth || 300;
    const h = ent.containerEl.clientHeight || 300;
    let x = rand(w * 0.06, w * 0.94);
    const y = rand(h * 0.35, h * 0.94);
    if (awayFrom) {
      x = awayFrom.x < w / 2 ? rand(w * 0.55, w * 0.94) : rand(w * 0.06, w * 0.45);
    }
    ent.targetX = x;
    ent.targetY = y;
    ent.speed = 0;
  }

  private startPause(ent: WanderEntity, now: number) {
    ent.phase = 'pause';
    const activity = pickActivity();
    if (activity === 'hunt') {
      const mx = Math.max(14, ent.x + rand(-55, 55));
      const my = Math.max(14, ent.y + rand(-35, 35));
      this.setMode(ent, 'idle');
      this.setMousePos(ent, { x: mx, y: my });
      ent.huntPounces = 0;
      ent.huntNextPounceAt = now + 1100;
      ent.huntEndAt = now + 2600;
      ent.pauseEndAt = ent.huntEndAt;
    } else {
      this.setMode(ent, activityToMode(activity));
      ent.pauseEndAt = now + 2200 + Math.random() * 4200;
    }
  }

  private setMode(ent: Entity, mode: CatMode) {
    if (ent.render.mode === mode) return;
    ent.render.mode = mode;
    ent.cb.onChange({ ...ent.render });
  }
  private setFlip(ent: Entity, flip: boolean) {
    if (ent.render.flip === flip) return;
    ent.render.flip = flip;
    ent.cb.onChange({ ...ent.render });
  }
  private setMousePos(ent: Entity, pos: { x: number; y: number } | null) {
    ent.render.mousePos = pos;
    ent.cb.onChange({ ...ent.render });
  }

  private stepWander(ent: WanderEntity, dt: number, now: number) {
    if (!ent.render.visible) return; // fully paused off-screen — no work at all

    if (!ent.render.ready) {
      if (now < ent.readyAt) return; // still waiting out its staggered entrance
      ent.render.ready = true;
      ent.cb.onChange({ ...ent.render });
    }

    // hunting: fire scheduled pounces at the mouse target
    if (ent.huntEndAt && now < ent.huntEndAt) {
      if (ent.huntPounces < 2 && now >= ent.huntNextPounceAt) {
        ent.huntPounces += 1;
        ent.huntNextPounceAt = now + 1100;
        ent.cb.onPounce();
      }
    } else if (ent.huntEndAt && now >= ent.huntEndAt) {
      ent.huntEndAt = 0;
      this.setMousePos(ent, null);
      this.pickWaypoint(ent);
      ent.phase = 'walk';
    }

    // throttled check: should this cat start chasing the cursor?
    if (ent.chasesCursor && ent.phase !== 'chase' && now - this.lastChaseCheck > CHASE_CHECK_MS) {
      if (now - ent.lastChaseAt > CHASE_COOLDOWN_MS) {
        const rect = ent.containerEl.getBoundingClientRect();
        const dist = Math.hypot(this.cursor.x - (rect.left + ent.x), this.cursor.y - (rect.top + ent.y));
        if (dist < CHASE_TRIGGER_RADIUS && Math.random() < 0.35) {
          ent.phase = 'chase';
          ent.chaseStartedAt = now;
          ent.lastChaseAt = now;
          ent.speed = 0;
          this.setMode(ent, 'walking');
        }
      }
    }

    if (ent.phase === 'chase') {
      const rect = ent.containerEl.getBoundingClientRect();
      ent.targetX = this.cursor.x - rect.left;
      ent.targetY = this.cursor.y - rect.top;
      if (now - ent.chaseStartedAt > CHASE_GIVE_UP_MS) {
        ent.phase = 'walk';
        this.pickWaypoint(ent, { x: ent.x, y: ent.y });
      }
    }

    if (ent.phase === 'walk' || ent.phase === 'chase') {
      const dx = ent.targetX - ent.x;
      const dy = ent.targetY - ent.y;
      const dist = Math.hypot(dx, dy);
      const topSpeed = ent.phase === 'chase' ? MAX_CHASE_SPEED : MAX_WALK_SPEED;

      if (dist < ARRIVE_DIST) {
        if (ent.phase === 'chase') {
          ent.cb.onPounce();
          ent.phase = 'walk';
          this.pickWaypoint(ent);
        } else {
          this.startPause(ent, now);
        }
      } else {
        const desired = dist < DECEL_RADIUS ? topSpeed * Math.max(0.22, dist / DECEL_RADIUS) : topSpeed;
        ent.speed = ent.speed < desired ? Math.min(desired, ent.speed + ACCEL * dt) : Math.max(desired, ent.speed - ACCEL * 1.6 * dt);
        ent.x += (dx / dist) * ent.speed * dt;
        ent.y += (dy / dist) * ent.speed * dt;
        if (Math.abs(dx) > 2) this.setFlip(ent, dx < 0);
        this.setMode(ent, 'walking');
      }
    } else if (ent.phase === 'pause' && now >= ent.pauseEndAt && !ent.huntEndAt) {
      this.pickWaypoint(ent);
      ent.phase = 'walk';
    }

    if (ent.el) ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px)`;
  }

  private stepFollow(ent: FollowEntity, now: number) {
    const targetOffsetX = ent.catching ? 0 : FOLLOW_OFFSET_X;
    const targetOffsetY = ent.catching ? -6 : FOLLOW_OFFSET_Y;
    const tx = this.cursor.x - targetOffsetX;
    const ty = this.cursor.y + targetOffsetY;

    const dx = tx - ent.x;
    const dy = ty - ent.y;
    const dist = Math.hypot(dx, dy);
    ent.x += dx * FOLLOW_LERP;
    ent.y += dy * FOLLOW_LERP;

    if (dist > 4) {
      ent.lastMoveAt = now;
      if (ent.asleep) {
        ent.asleep = false;
      }
      if (Math.abs(dx) > 3) this.setFlip(ent, dx < 0);
      if (ent.cb.onPawPrint && now - ent.lastPrintAt > 260) {
        ent.lastPrintAt = now;
        ent.printSide = -ent.printSide;
        ent.cb.onPawPrint(ent.x, ent.y + 18, ent.printSide);
      }
    }

    if (!ent.asleep && now - ent.lastMoveAt > FOLLOW_SLEEP_AFTER_MS) {
      ent.asleep = true;
    }
    this.setMode(ent, ent.asleep ? 'sleeping' : dist > 4 || ent.catching ? 'walking' : 'idle');

    if (!ent.asleep && !ent.catching && now >= ent.nextCatchAt) {
      ent.catching = true;
      ent.catchEndAt = now + FOLLOW_CATCH_DURATION_MS;
    }
    if (ent.catching && now >= ent.catchEndAt) {
      ent.catching = false;
      ent.cb.onPounce();
      ent.nextCatchAt = now + rand(FOLLOW_CATCH_MIN_MS, FOLLOW_CATCH_MAX_MS);
    }

    if (ent.el) ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px)`;
  }

  private tick = (now: number) => {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    for (const ent of this.entities.values()) {
      if (ent.kind === 'wander') this.stepWander(ent, dt, now);
      else this.stepFollow(ent, now);
    }
    if (now - this.lastChaseCheck > CHASE_CHECK_MS) this.lastChaseCheck = now;

    this.raf = this.entities.size > 0 ? requestAnimationFrame(this.tick) : 0;
  };
}

// One world for the whole page, one tick loop, one of everything.
export const catWorld = new CatWorld();
