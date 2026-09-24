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

  /**
   * Reasons the song is currently ducked, by name. While this is non-empty
   * the player fades out and pauses, keeping its position, and fades back in
   * when the last hold is released.
   *
   * It's a list rather than a boolean because two things duck the song for
   * different reasons and can overlap: the video (she can't hear two audio
   * tracks at once) and the cake's mic (the song coming out of her phone's
   * speaker feeds straight back into the blow detector, which reads low
   * frequencies — exactly where the music sits). A boolean would let
   * whichever finished first turn the song back on over the other.
   */
  audioHolds: string[];
  holdAudio: (reason: string) => void;
  releaseAudio: (reason: string) => void;

  candlesLit: boolean[];
  lightCandle: (index: number) => void;
  extinguishAll: () => void;
  cakeCompleted: boolean;
  markCakeCompleted: () => void;

  lanternReleased: boolean;
  releaseLantern: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  phase: 'loading',
  setPhase: (phase) => set({ phase }),

  musicPlaying: false,
  musicReady: false,
  setMusicReady: (ready) => set({ musicReady: ready }),
  toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
  startMusic: () => set({ musicPlaying: true }),

  audioHolds: [],
  holdAudio: (reason) =>
    set((s) => (s.audioHolds.includes(reason) ? s : { audioHolds: [...s.audioHolds, reason] })),
  releaseAudio: (reason) =>
    set((s) =>
      s.audioHolds.includes(reason) ? { audioHolds: s.audioHolds.filter((r) => r !== reason) } : s
    ),

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

  lanternReleased: false,
  releaseLantern: () => set({ lanternReleased: true }),
}));
