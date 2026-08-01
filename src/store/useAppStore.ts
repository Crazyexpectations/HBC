import { create } from 'zustand';
import { CAKE } from '../content';

export type Phase = 'loading' | 'gate' | 'site';

interface AppState {
  phase: Phase;
  setPhase: (phase: Phase) => void;

  musicPlaying: boolean;
  musicReady: boolean;
  setMusicReady: (ready: boolean) => void;
  toggleMusic: () => void;
  startMusic: () => void;

  candlesLit: boolean[];
  lightCandle: (index: number) => void;
  extinguishAll: () => void;
  cakeCompleted: boolean;
  markCakeCompleted: () => void;

  ringRevealed: boolean;
  revealRing: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  phase: 'loading',
  setPhase: (phase) => set({ phase }),

  musicPlaying: false,
  musicReady: false,
  setMusicReady: (ready) => set({ musicReady: ready }),
  toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
  startMusic: () => set({ musicPlaying: true }),

  candlesLit: Array(CAKE.candleCount).fill(false),
  lightCandle: (index) =>
    set((s) => {
      const next = [...s.candlesLit];
      next[index] = true;
      const allLit = next.every(Boolean);
      return { candlesLit: next, ...(allLit ? {} : {}) };
    }),
  extinguishAll: () => {
    set({ candlesLit: Array(get().candlesLit.length).fill(false) });
  },
  cakeCompleted: false,
  markCakeCompleted: () => set({ cakeCompleted: true }),

  ringRevealed: false,
  revealRing: () => set({ ringRevealed: true }),
}));
