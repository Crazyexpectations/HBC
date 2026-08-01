import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { LenisProvider } from './lib/LenisProvider';
import CustomCursor from './components/cursor/CustomCursor';
import MusicPlayer from './components/audio/MusicPlayer';
import LoadingScreen from './components/loader/LoadingScreen';
import GateScreen from './components/gate/GateScreen';
import MainSite from './MainSite';
import CursorCat from './components/cats/CursorCat';

export default function App() {
  const phase = useAppStore((s) => s.phase);

  return (
    <LenisProvider active={phase === 'site'}>
      <CustomCursor />
      <MusicPlayer />
      {phase === 'site' && <CursorCat />}
      <AnimatePresence mode="wait">
        {phase === 'loading' && <LoadingScreen key="loading" />}
        {phase === 'gate' && <GateScreen key="gate" />}
      </AnimatePresence>
      {phase === 'site' && <MainSite />}
    </LenisProvider>
  );
}
